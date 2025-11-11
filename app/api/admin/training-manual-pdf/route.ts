import { NextRequest, NextResponse } from 'next/server';
import { mdToPdf } from 'md-to-pdf';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    // Read the markdown file
    const filePath = join(process.cwd(), 'ADMIN_TRAINING_MANUAL.md');
    const markdownContent = await readFile(filePath, 'utf-8');

    // Convert markdown to PDF
    const pdf = await mdToPdf(
      { content: markdownContent },
      {
        pdf_options: {
          format: 'A4',
          margin: {
            top: '20mm',
            right: '15mm',
            bottom: '20mm',
            left: '15mm',
          },
          printBackground: true,
        },
        stylesheet: `
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          h1 {
            color: #2563eb;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 10px;
            margin-top: 30px;
          }
          h2 {
            color: #1e40af;
            margin-top: 25px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 5px;
          }
          h3 {
            color: #3b82f6;
            margin-top: 20px;
          }
          code {
            background-color: #f3f4f6;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
          }
          pre {
            background-color: #f3f4f6;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
          }
          blockquote {
            border-left: 4px solid #2563eb;
            padding-left: 15px;
            margin-left: 0;
            color: #6b7280;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 15px 0;
          }
          th, td {
            border: 1px solid #e5e7eb;
            padding: 8px 12px;
            text-align: left;
          }
          th {
            background-color: #f9fafb;
            font-weight: 600;
          }
          ul, ol {
            margin: 10px 0;
            padding-left: 25px;
          }
          li {
            margin: 5px 0;
          }
          strong {
            color: #1e40af;
          }
          hr {
            border: none;
            border-top: 2px solid #e5e7eb;
            margin: 30px 0;
          }
          a {
            color: #2563eb;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        `,
      }
    );

    if (!pdf) {
      return NextResponse.json(
        { error: 'Failed to generate PDF' },
        { status: 500 }
      );
    }

    // Return the PDF as a download
    return new NextResponse(pdf.content, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Travel-Tots-Admin-Training-Manual.pdf"',
        'Content-Length': pdf.content.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}



