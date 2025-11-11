import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { marked } from 'marked';
import puppeteer from 'puppeteer';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Always read fresh - no caching
    const filePath = join(process.cwd(), 'ADMIN_TRAINING_MANUAL.md');
    
    // Check if file exists
    if (!existsSync(filePath)) {
      console.error('Training manual file not found at:', filePath);
      return NextResponse.json(
        { error: 'Training manual file not found' },
        { status: 404 }
      );
    }

    // Read the markdown file fresh every time
    console.log('Reading training manual from:', filePath);
    const markdownContent = await readFile(filePath, 'utf-8');

    if (!markdownContent || markdownContent.trim().length === 0) {
      console.error('Training manual file is empty');
      return NextResponse.json(
        { error: 'Training manual file is empty' },
        { status: 500 }
      );
    }

    console.log('Converting markdown to HTML...');
    
    // Convert markdown to HTML
    const htmlContent = await marked(markdownContent);
    
    // Read stylesheet if it exists
    const stylesheetPath = join(process.cwd(), 'public', 'pdf-styles.css');
    let stylesheetContent = '';
    if (existsSync(stylesheetPath)) {
      stylesheetContent = await readFile(stylesheetPath, 'utf-8');
    }
    
    // Create full HTML document
    const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    ${stylesheetContent}
  </style>
</head>
<body class="markdown-body">
  ${htmlContent}
</body>
</html>
    `.trim();

    console.log('Generating PDF with Puppeteer...');
    
    let browser: any = null;
    
    try {
      // Launch browser with timeout and better error handling
      // Try to use installed Chromium first, fallback to system Chrome
      const launchOptions: any = {
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu',
          '--disable-software-rasterizer',
          '--disable-extensions',
          '--disable-background-networking',
          '--disable-background-timer-throttling',
          '--disable-renderer-backgrounding',
          '--disable-backgrounding-occluded-windows',
        ],
        timeout: 30000, // 30 second timeout
      };

      // Try to use installed Chromium if available
      try {
        const puppeteerCore = require('puppeteer-core');
        const { executablePath } = puppeteerCore;
        if (executablePath && typeof executablePath === 'function') {
          const chromePath = executablePath();
          if (chromePath) {
            launchOptions.executablePath = chromePath;
            console.log('Using Puppeteer-installed Chromium:', chromePath);
          }
        }
      } catch (e) {
        // Fallback to system Chrome or default
        console.log('Using default Chrome/Chromium path');
      }

      const launchPromise = puppeteer.launch(launchOptions);

      // Add timeout wrapper
      browser = await Promise.race([
        launchPromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Puppeteer launch timeout')), 30000)
        )
      ]) as any;

      const page = await browser.newPage();
      
      // Set content with timeout
      await Promise.race([
        page.setContent(fullHtml, { waitUntil: 'networkidle0', timeout: 30000 }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Page content load timeout')), 30000)
        )
      ]);
      
      // Generate PDF with timeout
      const pdfBuffer = await Promise.race([
        page.pdf({
          format: 'A4',
          margin: {
            top: '20mm',
            right: '15mm',
            bottom: '20mm',
            left: '15mm',
          },
          printBackground: true,
          timeout: 30000,
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('PDF generation timeout')), 30000)
        )
      ]) as Buffer;

      if (!pdfBuffer || pdfBuffer.length === 0) {
        console.error('PDF generation returned empty buffer');
        throw new Error('PDF buffer is empty');
      }

      console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes');

      // Return the PDF as a download
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="Travel-Tots-Admin-Training-Manual.pdf"',
          'Content-Length': pdfBuffer.length.toString(),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    } catch (puppeteerError) {
      console.error('Puppeteer error:', puppeteerError);
      if (browser) {
        try {
          await browser.close();
        } catch (closeError) {
          console.error('Error closing browser:', closeError);
        }
      }
      throw puppeteerError;
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Error details:', { 
      errorMessage, 
      errorStack,
      errorName: error instanceof Error ? error.name : undefined,
    });
    
    // Check for specific Puppeteer errors
    if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
      return NextResponse.json(
        { 
          error: 'PDF generation timed out. The server may be under heavy load. Please try again.',
          details: errorMessage,
        },
        { status: 504 }
      );
    }
    
    if (errorMessage.includes('Could not find Chrome') || errorMessage.includes('executable')) {
      return NextResponse.json(
        { 
          error: 'PDF generation service unavailable. Chrome/Chromium is not installed on the server.',
          details: errorMessage,
          hint: 'Please contact the administrator to install Chromium dependencies.'
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF', 
        details: errorMessage,
        hint: 'This may be due to serverless environment limitations. Check server logs for more details.'
      },
      { status: 500 }
    );
  }
}



