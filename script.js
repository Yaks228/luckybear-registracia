// Main JavaScript file for Lucky Bear Casino website

class LuckyBearApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupScrollEffects();
        this.setupAnimations();
        this.setupFormHandlers();
        this.setupCopyButtons();
    }

    setupMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (toggle && mobileMenu) {
            toggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target) && !toggle.contains(e.target)) {
                    mobileMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });

            // Close menu when clicking on links
            const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                });
            });
        }
    }

    setupScrollEffects() {
        // Header background on scroll
        const header = document.querySelector('.header');
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    header.style.background = 'rgba(26, 26, 26, 0.98)';
                } else {
                    header.style.background = 'rgba(26, 26, 26, 0.95)';
                }
            });
        }

        // Smooth scroll for navigation links
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    setupAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.method-card, .game-category, .support-method, .bonus-row:not(.header)');
        animatedElements.forEach(el => observer.observe(el));
    }

    setupFormHandlers() {
        // Registration method selection
        const methodCards = document.querySelectorAll('.method-card');
        methodCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove active class from all cards
                methodCards.forEach(c => c.classList.remove('active'));
                // Add active class to clicked card
                card.classList.add('active');
                
                // Add visual feedback
                card.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 200);
            });
        });

        // Bonus table row hover effects
        const bonusRows = document.querySelectorAll('.bonus-row:not(.header)');
        bonusRows.forEach(row => {
            row.addEventListener('mouseenter', () => {
                row.style.background = 'rgba(59, 130, 246, 0.1)';
            });
            row.addEventListener('mouseleave', () => {
                row.style.background = '';
            });
        });
    }

    setupCopyButtons() {
        const promoButton = document.getElementById('copy-promo-button');

        if (promoButton) {
            promoButton.addEventListener('click', () => {
                const promoCode = 'CARTEL7';

                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(promoCode).then(() => {
                        this.handleCopySuccess(promoCode, promoButton);
                    }).catch(() => {
                        this.fallbackCopy(promoCode, promoButton);
                    });
                } else {
                    this.fallbackCopy(promoCode, promoButton);
                }
            });
        }
    }

    fallbackCopy(text, button) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.top = '-9999px';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.handleCopySuccess(text, button);
            } else {
                this.handleCopyError();
            }
        } catch (err) {
            this.handleCopyError();
        }

        document.body.removeChild(textArea);
    }

    handleCopySuccess(copiedText, button) {
        this.showNotification(`Промокод "${copiedText}" скопирован!`, 'success');
        if (button) {
            const mainText = button.querySelector('.promo-text-main');
            const originalText = mainText.textContent;
            mainText.textContent = 'Скопировано!';
            button.classList.add('copied');
            button.disabled = true;

            setTimeout(() => {
                mainText.textContent = originalText;
                button.classList.remove('copied');
                button.disabled = false;
            }, 2000);
        }
    }

    // Helper to show error UI
    handleCopyError() {
        this.showNotification('Не удалось скопировать промокод', 'error');
        console.warn('Failed to copy promo code using all available methods.');
    }

    // Utility method to show notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        // Set background color based on type
        const colors = {
            info: '#3b82f6',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444'
        };
        notification.style.background = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LuckyBearApp();
});

// Add some utility functions
const Utils = {
    // Format currency
    formatCurrency(amount, currency = 'RUB') {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0
        }).format(amount);
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .method-card.active {
        border-color: var(--color-accent-light) !important;
        box-shadow: var(--shadow-glow) !important;
    }
    
    .notification {
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }
    
    .notification:hover {
        transform: translateX(0) scale(1.02) !important;
    }
`;
document.head.appendChild(style);

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LuckyBearApp, Utils };
}