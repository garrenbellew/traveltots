import { readFile } from 'fs/promises';
import { join } from 'path';
import { marked } from 'marked';
import AdminNav from '@/components/AdminNav';
import PrintButton from '@/components/PrintButton';
import ManualAnchorHandler from '@/components/ManualAnchorHandler';

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

  // First, extract all heading anchors from the markdown
  const headingAnchors = new Map();
  const headingRegex = /^(#{1,6})\s+(.+?)(?:\s+\{#([^}]+)\})?$/gm;
  let match;
  
  // Normalize text for matching (remove markdown formatting, lowercase, trim)
  function normalizeText(text) {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
      .replace(/\*([^*]+)\*/g, '$1') // Remove italic
      .replace(/`([^`]+)`/g, '$1') // Remove code
      .toLowerCase()
      .trim();
  }
  
  while ((match = headingRegex.exec(manualContent)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const explicitId = match[3];
    
    if (explicitId) {
      // Store both original and normalized versions
      headingAnchors.set(normalizeText(text), explicitId);
      headingAnchors.set(text.toLowerCase().trim(), explicitId);
    }
  }
  
  // Configure marked to generate heading IDs for anchor links
  const renderer = new marked.Renderer();
  
  // Override heading renderer to add IDs
  renderer.heading = function(text, level) {
    let id;
    
    // Ensure text is a string and extract plain text (remove HTML tags if any)
    let textStr = typeof text === 'string' ? text : String(text || '');
    // Remove any HTML tags that might have been added
    textStr = textStr.replace(/<[^>]*>/g, '').trim();
    
    // Try to find matching anchor (try normalized first, then direct match)
    const normalized = normalizeText(textStr);
    if (headingAnchors.has(normalized)) {
      id = headingAnchors.get(normalized);
    } else if (headingAnchors.has(textStr.toLowerCase().trim())) {
      id = headingAnchors.get(textStr.toLowerCase().trim());
    } else {
      // Generate ID from text (lowercase, replace spaces with dashes, remove special chars)
      id = textStr
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with dashes
        .replace(/-+/g, '-') // Replace multiple dashes with single dash
        .trim();
    }
    
    return `<h${level} id="${id}">${text}</h${level}>`;
  };
  
  // Configure marked options
  marked.setOptions({
    renderer: renderer,
    gfm: true, // GitHub Flavored Markdown
    breaks: false,
  });
  
  // Convert markdown to HTML
  const htmlContent = await marked(manualContent);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <ManualAnchorHandler />
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

      <style dangerouslySetInnerHTML={{
        __html: `
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
        /* Smooth scrolling for anchor links */
        html {
          scroll-behavior: smooth;
        }
        /* Add padding to account for fixed header when scrolling */
        .prose h1[id],
        .prose h2[id],
        .prose h3[id] {
          scroll-margin-top: 20px;
        }
        @media print {
          .prose {
            max-width: 100%;
          }
        }
        `
      }} />
    </div>
  );
}

