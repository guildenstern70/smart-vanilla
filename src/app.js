/*

    SmartVanilla
    A template for building single-page applications (SPAs) using vanilla JavaScript.
    MIT License (see LICENSE for details)

 */


document.addEventListener('DOMContentLoaded', () => {
    const app = {
        state: {
            isAuthenticated: false,
            currentPage: 'home'
        },

        init() {
            this.cacheDOM();
            this.bindEvents();
            this.render();
        },

        cacheDOM() {
            this.contentArea = document.getElementById('content-area');
            this.mainNav = document.getElementById('main-nav');
            this.logoutBtn = document.getElementById('logout-btn');
        },

        bindEvents() {
            // Global click listener for data-page navigation
            document.addEventListener('click', (e) => {
                const pageTrigger = e.target.closest('[data-page]');
                if (pageTrigger) {
                    const page = pageTrigger.getAttribute('data-page');
                    this.navigateTo(page);
                }
            });

            this.logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        },

        navigateTo(page) {
            // Basic protection logic
            const protectedPages = ['dashboard', 'projects', 'team', 'settings'];
            
            if (protectedPages.includes(page) && !this.state.isAuthenticated) {
                this.state.currentPage = 'login';
            } else {
                this.state.currentPage = page;
            }
            
            this.render();
        },

        login() {
            this.state.isAuthenticated = true;
            this.state.currentPage = 'dashboard';
            this.render();
        },

        logout() {
            this.state.isAuthenticated = false;
            this.state.currentPage = 'home';
            this.render();
        },

        render() {
            const { currentPage, isAuthenticated } = this.state;

            // Toggle Navigation
            if (isAuthenticated && ['dashboard', 'projects', 'team', 'settings'].includes(currentPage)) {
                this.mainNav.classList.remove('hidden');
                this.updateNavActiveState();
            } else {
                this.mainNav.classList.add('hidden');
            }

            // Render Page Content
            const templateId = `tpl-${currentPage}`;
            const template = document.getElementById(templateId);

            if (template) {
                this.contentArea.innerHTML = '';
                const clone = template.content.cloneNode(true);
                this.contentArea.appendChild(clone);

                // Re-bind form events if on login page
                if (currentPage === 'login') {
                    const loginForm = document.getElementById('login-form');
                    if (loginForm) {
                        loginForm.addEventListener('submit', (e) => {
                            e.preventDefault();
                            this.login();
                        });
                    }
                }
            } else {
                this.contentArea.innerHTML = '<div class="p-10 text-center">Page not found</div>';
            }

            // Scroll to top on navigation
            window.scrollTo(0, 0);
        },

        updateNavActiveState() {
            const navLinks = this.mainNav.querySelectorAll('[data-page]');
            navLinks.forEach(link => {
                if (link.getAttribute('data-page') === this.state.currentPage) {
                    link.classList.add('nav-link-active');
                } else {
                    link.classList.remove('nav-link-active');
                }
            });
        }
    };

    app.init();
});
