# Darknet DialektoSupra — Roadmap

This document outlines the planned trajectory and deferred features for the Darknet DialektoSupra project.

## Version 2.1.x (The Self-Hosted Node Expansion)

*This version marks the transition from a purely static, GitHub-Pages-hosted application to a self-hosted architecture.*

### Structural / Performance
- **Migration to Tailwind CSS 4.0**: Upgrade the CSS/PostCSS build pipeline from v3.4 to v4.0. Will require converting `tailwind.config.js` into CSS `@theme` variables and stripping `@apply` usages per the new standard.
- **Server Deployment**: Move from GitHub Pages static hosting to a fully self-hosted server environment, providing true backend capabilities if necessary.

### Obsidian-Flavored Enhancements
- **Interactive Local Graph View**: Implement a D3.js-powered visual network graph mapping all relationships between blog posts (wikilinks). Requires full-vault indexing at build time or runtime.
- **Backlinks Panel**: Automatically identify and display incoming links at the bottom of each file, simulating Obsidian's full associative capabilities.

## Version 3.x.x (Multimedia Integration)
- **Video Capabilities**: Activate the conditional `[VIDEO]` tabs to host or embed full video content.
- **Community Portal Integration**: Deploy XMPP/Substack tie-ins for real-time listener feedback and discourse.
