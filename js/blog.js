import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkFrontmatter from 'remark-frontmatter';
import wikiLinkPlugin from 'remark-wiki-link';
import remarkCallout from '@r4ai/remark-callout';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';

// Custom plugin for `==highlight==` and `%%comments%%` and `![[embeds]]`
function remarkObsidianExtensions() {
    return (tree) => {
        const { visit } = window.unistUtilVisit || { visit: () => {} }; // We'll need unist-util-visit
        // Actually, we can use simple regex pre-processing before parsing for things that are complex to AST map
        // but let's try to pass pre-processed text to unified for now to save dependencies.
    };
}

export async function renderMarkdown(markdownText) {
    // 1. Pre-process text block
    // Handle comments: %% comment %% -> remove
    let text = markdownText.replace(/%%[\s\S]*?%%/g, '');
    
    // Handle highlights: ==text== -> <mark>text</mark>
    text = text.replace(/==([^=]+)==/g, '<mark>$1</mark>');
    
    // Handle embeds: ![[image.png]] -> ![image.png](image.png) for standard parsing
    text = text.replace(/!\[\[(.*?)\]\]/g, (match, p1) => {
        const parts = p1.split('|');
        const file = parts[0];
        const size = parts.length > 1 ? parts[1] : '';
        // If it looks like an image
        if (/\.(png|jpe?g|gif|webp|svg)$/i.test(file)) {
            // we can pass size as title to be handled by CSS or render raw HTML
            return `<img src="/Darknet-DialektoSupra/assets/${file}" alt="${file}" ${size ? `width="${size.split('x')[0]}"` : ''} class="obsidian-embed">`;
        }
        return `[Embedded: ${file}](#/post/${file.replace('.md', '')})`;
    });

    const file = await unified()
        .use(remarkParse)
        .use(remarkFrontmatter, ['yaml'])
        .use(remarkGfm)
        .use(remarkMath)
        // .use(wikiLinkPlugin) // requires extra setup 
        .use(remarkCallout)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeHighlight)
        .use(rehypeKatex)
        .use(rehypeStringify)
        .process(text);
        
    return String(file);
}

export async function initBlog() {
    const listContainer = document.getElementById('blog-list');
    if (!listContainer) return;
    
    try {
        const res = await fetch('posts/index.json');
        if (!res.ok) throw new Error('Could not fetch index.json');
        const data = await res.json();
        
        renderPostList(data.posts);
        
        // Setup hash router
        window.addEventListener('hashchange', () => handleRoute(data.posts));
        handleRoute(data.posts); // Handle initial load
        
    } catch(err) {
        console.error(err);
        listContainer.innerHTML = '<p class="text-gray-500">Failed to load intel database.</p>';
    }
}

function handleRoute(posts) {
    const hash = window.location.hash;
    const listView = document.getElementById('blog-list-view');
    const postView = document.getElementById('blog-post-view');
    
    if (hash.startsWith('#/post/')) {
        const slug = hash.replace('#/post/', '');
        const post = posts.find(p => p.slug === slug);
        if (post) {
            loadPost(post);
            if(listView) listView.classList.add('hidden');
            if(postView) postView.classList.remove('hidden');
            
            // Scroll to blog area
            document.getElementById('intelligence').scrollIntoView();
        }
    } else {
        // Show list
        if(listView) listView.classList.remove('hidden');
        if(postView) postView.classList.add('hidden');
    }
}

async function loadPost(postMetadata) {
    const contentEl = document.getElementById('blog-content');
    const titleEl = document.getElementById('post-title');
    const metaEl = document.getElementById('post-meta');
    
    contentEl.innerHTML = '<div class="text-cyber-cyan animate-pulse">Loading decrypted payload...</div>';
    
    try {
        const res = await fetch(`posts/${postMetadata.file}`);
        if (!res.ok) throw new Error('Failed to load markdown');
        const markdown = await res.text();
        
        const html = await renderMarkdown(markdown);
        
        titleEl.textContent = postMetadata.title || 'UNTITLED_INTEL';
        metaEl.innerHTML = `
            <span>${postMetadata.date || 'UNKNOWN_DATE'}</span>
            <span>//</span>
            <span class="text-cyber-cyan">${postMetadata.readTime || '?_MIN_READ'}</span>
        `;
        
        contentEl.innerHTML = html;
        
    } catch(err) {
        contentEl.innerHTML = `<p class="text-cyber-magenta">Error decrypting file: ${err.message}</p>`;
    }
}

function renderPostList(posts) {
    const container = document.getElementById('blog-list');
    container.innerHTML = '';
    
    posts.forEach(post => {
        const el = document.createElement('article');
        el.className = 'glass rounded-xl overflow-hidden border border-cyber-cyan/10 hover:border-cyber-cyan/30 transition-all group cursor-pointer glass-hover scanline p-6';
        el.onclick = () => window.location.hash = `/post/${post.slug}`;
        
        const tagsHtml = (post.tags || []).map(t => `<span class="px-2 py-1 rounded bg-cyber-cyan/10 text-cyber-cyan text-xs font-mono border border-cyber-cyan/20">[${t.toUpperCase()}]</span>`).join(' ');
        
        el.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <div class="flex gap-2">${tagsHtml}</div>
                <span class="text-xs text-gray-500 font-mono">${post.readTime} MIN</span>
            </div>
            <h4 class="text-lg font-bold text-white mb-2 group-hover:text-cyber-cyan transition-colors">${post.title}</h4>
            <p class="text-sm text-gray-400 line-clamp-2">${post.description}</p>
        `;
        container.appendChild(el);
    });
}
