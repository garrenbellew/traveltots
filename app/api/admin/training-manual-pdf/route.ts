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
    
    // Launch browser and generate PDF
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
      ],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm',
        },
        printBackground: true,
      });

      await browser.close();

      if (!pdfBuffer || pdfBuffer.length === 0) {
        console.error('PDF generation returned empty buffer');
        return NextResponse.json(
          { error: 'Failed to generate PDF - empty buffer' },
          { status: 500 }
        );
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
      await browser.close();
      throw puppeteerError;
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Error details:', { errorMessage, errorStack });
    
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



