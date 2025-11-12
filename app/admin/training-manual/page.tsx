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

  // First, extract all heading anchors from the markdown BEFORE processing
  const headingRegex = /^(#{1,6})\s+(.+?)(?:\s+\{#([^}]+)\})?$/gm;
  let match;
  
  // Store mapping of heading text to anchor IDs
  // We'll store multiple variations to handle different text formats from marked.js
  const headingTextToId = new Map();
  
  while ((match = headingRegex.exec(manualContent)) !== null) {
    const text = match[2].trim();
    const explicitId = match[3];
    
    if (explicitId) {
      // Store the original text
      headingTextToId.set(text, explicitId);
      
      // Store normalized versions (remove markdown formatting)
      const normalized = text
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .trim();
      headingTextToId.set(normalized, explicitId);
      headingTextToId.set(normalized.toLowerCase(), explicitId);
      
      // Also store the generated ID format (what TOC links use)
      const generatedId = normalized
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      // Map the generated ID back to the explicit ID
      headingTextToId.set(`generated:${generatedId}`, explicitId);
      
      // Also map the explicit ID to itself (in case TOC uses explicit ID directly)
      headingTextToId.set(explicitId, explicitId);
    }
  }
  
  // Configure marked to generate heading IDs for anchor links
  const renderer = new marked.Renderer();
  
  // Override heading renderer to add IDs
  renderer.heading = function(text, level) {
    // marked.js v17 passes text as a string (may contain HTML from inline markdown)
    let textStr = String(text || '').trim();
    
    // Remove HTML tags to get plain text
    let plainText = textStr
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .trim();
    
    // Also decode HTML entities that might be in the text
    plainText = plainText
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
    
    // Normalize text for matching (remove markdown formatting, lowercase)
    const normalized = plainText
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .toLowerCase()
      .trim();
    
    // Generate what the ID would be from the text (same as TOC links)
    const generatedId = normalized
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/-+/g, '-') // Replace multiple dashes with single dash
      .trim();
    
    // Try to find explicit anchor ID - check multiple strategies
    let id = null;
    
    // Strategy 1: Direct match with HTML text
    if (headingTextToId.has(textStr)) {
      id = headingTextToId.get(textStr);
    }
    // Strategy 2: Match with plain text (no HTML)
    else if (headingTextToId.has(plainText)) {
      id = headingTextToId.get(plainText);
    }
    // Strategy 3: Match with normalized lowercase
    else if (headingTextToId.has(normalized)) {
      id = headingTextToId.get(normalized);
    }
    // Strategy 4: Check if generated ID has an explicit anchor
    else if (headingTextToId.has(`generated:${generatedId}`)) {
      id = headingTextToId.get(`generated:${generatedId}`);
    }
    // Strategy 5: Check if the generated ID itself is an explicit anchor
    else if (headingTextToId.has(generatedId)) {
      id = headingTextToId.get(generatedId);
    }
    
    // If no explicit anchor found, use generated ID (should match TOC links)
    if (!id) {
      id = generatedId;
    }
    
    // Debug: log first few headings to verify
    if (level === 2 && !globalThis._headingIdsLogged) {
      globalThis._headingIdsLogged = true;
      console.log('Sample heading IDs:', {
        text: plainText.substring(0, 30),
        normalized,
        generatedId,
        finalId: id,
        hasExplicit: headingTextToId.has(normalized) || headingTextToId.has(`generated:${generatedId}`)
      });
    }
    
    // Return heading with ID - text already contains HTML from marked
    return `<h${level} id="${id}">${textStr}</h${level}>`;
  };
  
  // Configure marked with the custom renderer
  marked.use({
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

