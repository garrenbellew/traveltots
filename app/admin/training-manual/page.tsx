import { readFile } from 'fs/promises';
import { join } from 'path';
import { marked } from 'marked';
import AdminNav from '@/components/AdminNav';
import PrintButton from '@/components/PrintButton';
import ManualAnchorHandler from '@/components/ManualAnchorHandler';
import { sanitizeHtml } from '@/lib/sanitize';

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

  // Configure marked options
  marked.setOptions({
    gfm: true, // GitHub Flavored Markdown
    breaks: false,
  });
  
  // Convert markdown to HTML first
  let htmlContent = await marked.parse(manualContent);
  
  // Post-process HTML to add IDs to headings
  // Extract all headings from markdown with their anchors
  const headingMap = new Map();
  const headingRegex = /^(#{1,6})\s+(.+?)(?:\s+\{#([^}]+)\})?$/gm;
  let match;
  
  while ((match = headingRegex.exec(manualContent)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const explicitId = match[3];
    
    // Normalize text for matching
    const normalized = text
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .toLowerCase()
      .trim();
    
    // Generate ID
    const generatedId = normalized
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    const finalId = explicitId || generatedId;
    
    // Store mapping of heading text to ID
    headingMap.set(normalized, finalId);
    headingMap.set(text.toLowerCase().trim(), finalId);
  }
  
  // Add IDs to headings in HTML using regex
  htmlContent = htmlContent.replace(
    /<h([1-6])>(.*?)<\/h[1-6]>/gi,
    (match, level, content) => {
      // Extract text from HTML content (remove anchor syntax if present)
      let text = content
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/\s*\{#([^}]+)\}/g, '') // Remove {#anchor-id} syntax
        .trim();
      
      const normalized = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      // Find matching ID from our map
      let id = headingMap.get(normalized) || headingMap.get(text.toLowerCase().trim());
      
      if (!id) {
        // Generate ID from text (should match TOC links)
        id = normalized;
      }
      
      // Clean up content to remove {#anchor-id} syntax from display
      const cleanContent = content.replace(/\s*\{#([^}]+)\}/g, '');
      
      return `<h${level} id="${id}">${cleanContent}</h${level}>`;
    }
  );

  // Extract table of contents from markdown
  const tocRegex = /## Table of Contents\n\n([\s\S]*?)\n\n---/;
  const tocMatch = manualContent.match(tocRegex);
  let tocHtml = '';
  
  if (tocMatch && tocMatch[1]) {
    // Convert TOC markdown to HTML
    const tocMarkdown = tocMatch[1];
    tocHtml = await marked.parse(tocMarkdown);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <ManualAnchorHandler />
      <div className="flex gap-8 max-w-7xl mx-auto px-4 py-8">
        {/* Sticky Table of Contents Sidebar */}
        {tocHtml && (
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="card p-4 bg-white shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Table of Contents</h2>
                <div 
                  className="prose prose-sm max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(tocHtml) }}
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  }}
                />
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Admin Training Manual</h1>
            <PrintButton />
          </div>

          <div 
            className="card prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(htmlContent) }}
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            }}
          />
        </div>
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
        /* Sticky TOC sidebar styling */
        aside .prose {
          font-size: 0.875rem;
        }
        aside .prose ol {
          list-style: decimal;
          padding-left: 1.25rem;
        }
        aside .prose li {
          margin: 0.5rem 0;
          line-height: 1.5;
        }
        aside .prose a {
          color: #4b5563;
          text-decoration: none;
          transition: color 0.2s;
        }
        aside .prose a:hover {
          color: #2563eb;
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

