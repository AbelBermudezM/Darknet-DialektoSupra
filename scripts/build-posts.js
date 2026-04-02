import fs from 'fs';
import path from 'path';

const postsDir = path.join(process.cwd(), 'posts');
const outputFile = path.join(postsDir, 'index.json');

function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return {};
    
    const lines = match[1].split('\n');
    const data = {};
    
    lines.forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) return;
        
        const key = line.slice(0, colonIndex).trim();
        let value = line.slice(colonIndex + 1).trim();
        
        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        
        // Handle arrays format like: tags: [one, two]
        if (value.startsWith('[') && value.endsWith(']')) {
            value = value.slice(1, -1).split(',').map(s => s.trim());
        }
        
        data[key] = value;
    });
    
    return data;
}

function calculateReadTime(text) {
    const wordsPerMinute = 200;
    const noFrontmatter = text.replace(/^---[\s\S]*?---/, '');
    const words = noFrontmatter.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}

function buildIndex() {
    if (!fs.existsSync(postsDir)) {
        fs.mkdirSync(postsDir, { recursive: true });
    }
    
    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
    const posts = [];
    
    files.forEach(file => {
        const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
        const metadata = parseFrontmatter(content);
        const slug = file.replace(/\.md$/, '');
        
        posts.push({
            slug: slug,
            file: file,
            title: metadata.title || slug,
            date: metadata.date || 'Unknown Date',
            description: metadata.description || '',
            tags: metadata.tags || [],
            readTime: calculateReadTime(content)
        });
    });
    
    // Sort by date descending
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const indexData = { posts };
    fs.writeFileSync(outputFile, JSON.stringify(indexData, null, 2));
    console.log(`Successfully built posts index with ${posts.length} entries.`);
}

buildIndex();
