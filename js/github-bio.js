const GITHUB_USERNAME = 'abelbermudezm';

export async function initGithubBio() {
    // Elements to update
    const avatarEl = document.getElementById('bio-avatar');
    const nameEl = document.getElementById('bio-name');
    const bioTextEl = document.getElementById('bio-text');
    const locationEl = document.getElementById('bio-location');
    const reposEl = document.getElementById('bio-repos');
    
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        
        if (!response.ok) {
            console.warn('GitHub API request failed, falling back to static content.', response.status);
            return;
        }
        
        const data = await response.json();
        
        // Update DOM elements if they exist
        if (avatarEl && data.avatar_url) avatarEl.src = data.avatar_url;
        if (nameEl && data.name) nameEl.textContent = data.name;
        
        // The bio typically might be short, so we'll prepend it or append it to existing text if needed
        // Or we just overwrite if it exists
        if (bioTextEl && data.bio) {
            bioTextEl.innerHTML = `<span class="text-cyber-cyan font-semibold">GitHub Bio:</span> ${data.bio}<br><br>${bioTextEl.innerHTML}`;
        }
        
        if (locationEl && data.location) locationEl.textContent = data.location;
        if (reposEl && data.public_repos !== undefined) reposEl.textContent = data.public_repos;
        
    } catch (error) {
        console.error('Error fetching GitHub bio:', error);
        // Silently use static fallback already in the HTML
    }
}
