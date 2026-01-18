#!/usr/bin/env node

/**
 * Blog Post Processor
 *
 * Reads markdown files from /content/blog/ and generates src/data/blogPosts.js
 *
 * Usage: node scripts/process-blog-posts.js
 *
 * Markdown format:
 * ---
 * title: Post Title
 * publishedAt: 2026-01-15
 * heroImage: /blog/image.svg
 * categories:
 *   - AI
 *   - Longevity
 * readingTime: 8 min read
 * author: Author Name
 * ---
 *
 * Your markdown content here...
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CONTENT_DIR = join(__dirname, '..', 'content', 'blog');
const OUTPUT_FILE = join(__dirname, '..', 'src', 'data', 'blogPosts.js');

// Parse YAML-like frontmatter
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    throw new Error('Invalid frontmatter format');
  }

  const [, frontmatter, body] = match;
  const meta = {};

  let currentKey = null;
  let inArray = false;

  for (const line of frontmatter.split('\n')) {
    // Array item
    if (line.match(/^\s+-\s+(.+)$/)) {
      const value = line.match(/^\s+-\s+(.+)$/)[1].trim();
      if (currentKey && Array.isArray(meta[currentKey])) {
        meta[currentKey].push(value);
      }
      continue;
    }

    // Key-value pair
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      const [, key, value] = kvMatch;
      currentKey = key;

      if (value.trim() === '') {
        // Start of array
        meta[key] = [];
      } else {
        meta[key] = value.trim();
      }
    }
  }

  return { meta, body: body.trim() };
}

// Convert markdown to HTML
function markdownToHtml(markdown) {
  let html = markdown;

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Markdown links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  // Bare URLs - auto-link (but not ones already in href="...")
  html = html.replace(/(?<!href=["'])(?<!>)(https?:\/\/[^\s<>"]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');

  // Blockquotes
  html = html.replace(/^>\s*(.+)$/gm, '<blockquote>$1</blockquote>');

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // Paragraphs - wrap non-tag lines
  const lines = html.split('\n\n');
  html = lines.map(block => {
    block = block.trim();
    if (!block) return '';
    if (block.startsWith('<h') || block.startsWith('<ul') || block.startsWith('<ol')) {
      return block;
    }
    return `<p>${block}</p>`;
  }).filter(Boolean).join('\n\n');

  // Clean up any double-wrapped paragraphs
  html = html.replace(/<p><p>/g, '<p>');
  html = html.replace(/<\/p><\/p>/g, '</p>');

  return html;
}

// Generate slug from filename
function generateSlug(filename) {
  return basename(filename, '.md');
}

// Generate excerpt from content
function generateExcerpt(body, maxLength = 200) {
  // Get first paragraph
  const firstPara = body.split('\n\n')[0];
  // Remove markdown formatting
  let excerpt = firstPara
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  if (excerpt.length > maxLength) {
    excerpt = excerpt.substring(0, maxLength).trim() + '...';
  }

  return excerpt;
}

async function processBlogs() {
  console.log('Processing blog posts...\n');

  const files = await readdir(CONTENT_DIR);
  const mdFiles = files.filter(f => f.endsWith('.md'));

  if (mdFiles.length === 0) {
    console.log('No markdown files found in content/blog/');
    return;
  }

  const posts = [];

  for (const file of mdFiles) {
    const filepath = join(CONTENT_DIR, file);
    const content = await readFile(filepath, 'utf-8');

    try {
      const { meta, body } = parseFrontmatter(content);
      const slug = generateSlug(file);
      const htmlContent = markdownToHtml(body);
      const excerpt = meta.excerpt || generateExcerpt(body);

      posts.push({
        title: meta.title,
        slug,
        publishedAt: meta.publishedAt,
        heroImage: meta.heroImage || '/blog/placeholder-1.svg',
        excerpt,
        categories: meta.categories || [],
        readingTime: meta.readingTime || '5 min read',
        author: meta.author || 'Amulet Team',
        content: htmlContent,
      });

      console.log(`  ✓ ${file}`);
    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`);
    }
  }

  // Sort by date (newest first)
  posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  // Generate output file
  const output = `// Blog posts data
// Auto-generated by scripts/process-blog-posts.js
// To update, edit markdown files in /content/blog/ and run: npm run blog:process

export const CATEGORIES = ['AI', 'Longevity', 'Treatments', 'Supplements', 'Tokens'];

export const CATEGORY_COLORS = {
  AI: {
    bg: 'var(--brand-neon-cards-surface-light-blue)',
    text: 'var(--brand-blue-dark)',
    border: 'var(--brand-blue-default)',
  },
  Longevity: {
    bg: 'var(--brand-neon-cards-surface-light-green)',
    text: 'var(--brand-green-dark)',
    border: 'var(--brand-green-default)',
  },
  Treatments: {
    bg: 'var(--brand-neon-cards-surface-light-purple, #f3e8ff)',
    text: 'var(--brand-purple-dark, #7c3aed)',
    border: 'var(--brand-purple-default, #a78bfa)',
  },
  Supplements: {
    bg: '#fef3c7',
    text: '#92400e',
    border: '#f59e0b',
  },
  Tokens: {
    bg: '#fff7ed',
    text: '#9a3412',
    border: '#f97316',
  },
};

export const blogPosts = ${JSON.stringify(posts, null, 2)};

// Helper function to get post by slug
export function getPostBySlug(slug) {
  return blogPosts.find(post => post.slug === slug);
}

// Helper function to filter posts by category
export function getPostsByCategory(category) {
  if (!category || category === 'All') {
    return blogPosts;
  }
  return blogPosts.filter(post => post.categories.includes(category));
}

// Helper function to format date
export function formatDate(dateString) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
}
`;

  await writeFile(OUTPUT_FILE, output);

  console.log(`\n✓ Generated ${OUTPUT_FILE}`);
  console.log(`  ${posts.length} posts processed`);
}

processBlogs().catch(console.error);
