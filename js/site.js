/*
 * Site behaviour: theme toggle, header state, mobile menu, active nav
 * link, scroll reveal and copy-to-clipboard. No dependencies.
 */
(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const announcer = document.querySelector('[data-announcer]');

    const announce = (message) => {
        if (announcer) announcer.textContent = message;
    };

    /* ---------------------------------------------------------- Theme */

    const themeToggle = document.querySelector('[data-theme-toggle]');
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (theme) => {
        root.dataset.theme = theme;
        if (themeMeta) themeMeta.content = theme === 'dark' ? '#0E1113' : '#F3F1EC';
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
        }
    };

    const saveTheme = (theme) => {
        try {
            localStorage.setItem('theme', theme);
        } catch (e) { /* storage unavailable */ }
    };

    const hasSavedTheme = () => {
        try {
            return Boolean(localStorage.getItem('theme'));
        } catch (e) {
            return false;
        }
    };

    applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');

    themeToggle?.addEventListener('click', () => {
        const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
        saveTheme(next);

        // Circular reveal from the toggle where View Transitions are supported
        if (!document.startViewTransition || reducedMotion.matches) {
            applyTheme(next);
            announce(`${next} theme on`);
            return;
        }

        const rect = themeToggle.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

        document.startViewTransition(() => applyTheme(next)).ready.then(() => {
            root.animate(
                { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
                { duration: 550, easing: 'cubic-bezier(.22, 1, .36, 1)', pseudoElement: '::view-transition-new(root)' }
            );
        });
        announce(`${next} theme on`);
    });

    // Follow the OS setting until the visitor makes an explicit choice
    systemDark.addEventListener('change', (event) => {
        if (!hasSavedTheme()) applyTheme(event.matches ? 'dark' : 'light');
    });

    /* ---------------------------------------------------------- Header */

    const header = document.querySelector('[data-header]');
    const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    /* ---------------------------------------------------------- Mobile menu */

    const menuToggle = document.querySelector('[data-menu-toggle]');
    const nav = document.querySelector('#site-nav');

    const setMenu = (open) => {
        menuToggle?.setAttribute('aria-expanded', String(open));
        menuToggle?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        nav?.classList.toggle('is-open', open);
        header?.classList.toggle('is-menu-open', open);
    };

    menuToggle?.addEventListener('click', () => {
        setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
    });

    nav?.addEventListener('click', (event) => {
        if (event.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && nav?.classList.contains('is-open')) {
            setMenu(false);
            menuToggle?.focus();
        }
    });

    window.matchMedia('(min-width: 861px)').addEventListener('change', (event) => {
        if (event.matches) setMenu(false);
    });

    /* ---------------------------------------------------------- Active nav link */

    const navLinks = [...document.querySelectorAll('[data-nav-link]')];
    const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                navLinks.forEach((link) => {
                    const active = link.getAttribute('href') === `#${entry.target.id}`;
                    link.classList.toggle('is-active', active);
                    if (active) link.setAttribute('aria-current', 'true');
                    else link.removeAttribute('aria-current');
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });

        sections.forEach((section) => sectionObserver.observe(section));
    }

    /* ---------------------------------------------------------- Scroll reveal */

    document.querySelectorAll('[data-reveal-stagger]').forEach((group) => {
        [...group.children].forEach((child, index) => child.style.setProperty('--reveal-i', index));
    });

    const revealItems = document.querySelectorAll('[data-reveal]');

    if ('IntersectionObserver' in window && !reducedMotion.matches) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

        revealItems.forEach((item) => revealObserver.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add('is-visible'));
    }

    /* ---------------------------------------------------------- Copy email */

    document.querySelectorAll('[data-copy]').forEach((button) => {
        const label = button.querySelector('[data-copy-label]');

        button.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(button.dataset.copy);
                button.classList.add('is-copied');
                if (label) label.textContent = 'Copied';
                announce('Email address copied');
                setTimeout(() => {
                    button.classList.remove('is-copied');
                    if (label) label.textContent = 'Copy';
                }, 2000);
            } catch (e) {
                window.location.href = `mailto:${button.dataset.copy}`;
            }
        });
    });

    /* ---------------------------------------------------------- Footer year */

    const year = document.querySelector('[data-year]');
    if (year) year.textContent = new Date().getFullYear();
})();
