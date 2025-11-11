import { readFile } from 'fs/promises';
import { join } from 'path';
import { marked } from 'marked';
import AdminNav from '@/components/AdminNav';
import PrintButton from '@/components/PrintButton';

export const dynamic = 'force-dynamic';

async function getManualContent() {
  try {
    const filePath = join(process.cwd(), 'ADMIN_TRAINING_MANUAL.md');
    const content = await readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error('Error reading manual:', error);
    return null;
  }
}

export default async function TrainingManualPage() {
  const manualContent = await getManualContent();

  if (!manualContent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="card text-center">
            <h1 className="text-2xl font-bold mb-4">Training Manual</h1>
            <p className="text-red-600">Error: Could not load training manual.</p>
          </div>
        </div>
      </div>
    );
  }

  // Convert markdown to HTML
  const htmlContent = await marked(manualContent);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Admin Training Manual</h1>
          <PrintButton />
        </div>

        <div 
          className="card prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          }}
        />
      </div>

      <style jsx global>{`
        .prose {
          color: #374151;
        }
        .prose h1 {
          color: #2563eb;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 10px;
          margin-top: 30px;
          margin-bottom: 20px;
        }
        .prose h2 {
          color: #1e40af;
          margin-top: 25px;
          margin-bottom: 15px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 5px;
        }
        .prose h3 {
          color: #3b82f6;
          margin-top: 20px;
          margin-bottom: 10px;
        }
        .prose code {
          background-color: #f3f4f6;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }
        .prose pre {
          background-color: #f3f4f6;
          padding: 15px;
          border-radius: 5px;
          overflow-x: auto;
        }
        .prose blockquote {
          border-left: 4px solid #2563eb;
          padding-left: 15px;
          margin-left: 0;
          color: #6b7280;
        }
        .prose table {
          border-collapse: collapse;
          width: 100%;
          margin: 15px 0;
        }
        .prose th, .prose td {
          border: 1px solid #e5e7eb;
          padding: 8px 12px;
          text-align: left;
        }
        .prose th {
          background-color: #f9fafb;
          font-weight: 600;
        }
        .prose ul, .prose ol {
          margin: 10px 0;
          padding-left: 25px;
        }
        .prose li {
          margin: 5px 0;
        }
        .prose strong {
          color: #1e40af;
        }
        .prose hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 30px 0;
        }
        .prose a {
          color: #2563eb;
          text-decoration: none;
        }
        .prose a:hover {
          text-decoration: underline;
        }
        @media print {
          .prose {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

