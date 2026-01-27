// Link Manager - Loads links from link.json and applies them to data-link attributes
class LinkManager {
    constructor() {
        this.links = {};
        this.init();
    }

    async init() {
        try {
            const response = await fetch('link.json');
            this.links = await response.json();
            this.applyLinks();
        } catch (error) {
            console.warn('LinkManager: Could not load link.json, using default behavior');
        }
    }

    applyLinks() {
        const elements = document.querySelectorAll('[data-link]');
        elements.forEach(element => {
            const linkKey = element.getAttribute('data-link');
            if (this.links[linkKey]) {
                if (element.tagName === 'A') {
                    element.href = this.links[linkKey];
                } else {
                    element.addEventListener('click', (e) => {
                        e.preventDefault();
                        window.location.href = this.links[linkKey];
                    });
                }
            }
        });
    }
}

// Initialize LinkManager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LinkManager();
});