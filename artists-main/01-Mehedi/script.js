/**
 * MEHEDI ISLAM RAFI - PORTFOLIO INTERACTIVITY
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Navigation Toggle & Dropdowns
    const navToggleBtn = document.getElementById('nav-toggle-btn');
    const navLinks = document.getElementById('nav-links');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    
    if (navToggleBtn && navLinks) {
        navToggleBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = navToggleBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        // Close menu on link click (direct links)
        navLinks.querySelectorAll('a:not(.dropdown-item)').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                document.querySelectorAll('.nav-item-dropdown').forEach(d => d.classList.remove('open'));
                const icon = navToggleBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            });
        });
    }

    // Dropdown toggle click logic (works for touch/mobile and keyboard)
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const parent = toggle.closest('.nav-item-dropdown');
            const isOpen = parent.classList.contains('open');
            
            // Close all other dropdowns
            document.querySelectorAll('.nav-item-dropdown').forEach(d => {
                if (d !== parent) {
                    d.classList.remove('open');
                    d.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
                }
            });

            parent.classList.toggle('open', !isOpen);
            toggle.setAttribute('aria-expanded', !isOpen);
        });
    });

    // Close dropdown on dropdown item click
    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.nav-item-dropdown').forEach(d => {
                d.classList.remove('open');
                d.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
            });
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = navToggleBtn?.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-item-dropdown')) {
            document.querySelectorAll('.nav-item-dropdown').forEach(d => {
                d.classList.remove('open');
                d.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
            });
        }
    });

    // 2. Active Section Highlighting on Scroll
    const sections = document.querySelectorAll('section[id]');
    const allNavAnchors = document.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item');

    function highlightNavOnScroll() {
        const scrollY = window.scrollY;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                // Clear active states
                allNavAnchors.forEach(item => item.classList.remove('active'));
                document.querySelectorAll('.dropdown-toggle').forEach(btn => btn.classList.remove('active'));

                // Find matching anchor
                allNavAnchors.forEach(item => {
                    const href = item.getAttribute('href') || '';
                    if (href === `#${sectionId}` || href.endsWith(`#${sectionId}`)) {
                        item.classList.add('active');
                        // If item is inside a dropdown, highlight parent toggle too
                        const parentDropdown = item.closest('.nav-item-dropdown');
                        if (parentDropdown) {
                            parentDropdown.querySelector('.dropdown-toggle')?.classList.add('active');
                        }
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll);

    // 3. Portfolio Gallery Filter Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryCards = document.querySelectorAll('.gallery-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 3.1 Memories Section Filter Logic
    const memoryFilterBtns = document.querySelectorAll('.memory-filter-btn');
    const memoryCards = document.querySelectorAll('.memory-card');

    memoryFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            memoryFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            memoryCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 4. Interactive Lightbox Modal (Supports Artwork Gallery, Memories & Certificates)
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxYear = document.getElementById('lightbox-year');
    const lightboxMedium = document.getElementById('lightbox-medium');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentMode = 'gallery'; // 'gallery' | 'memory' | 'certificate'
    let currentItemIndex = 0;

    const visibleGalleryCards = () => Array.from(document.querySelectorAll('.gallery-card')).filter(card => card.style.display !== 'none');
    const visibleMemoryCards = () => Array.from(document.querySelectorAll('.memory-card')).filter(card => card.style.display !== 'none');
    const visibleCertCards = () => Array.from(document.querySelectorAll('.cert-card')).filter(card => card.style.display !== 'none');

    const getActiveCards = () => {
        if (currentMode === 'memory') return visibleMemoryCards();
        if (currentMode === 'certificate') return visibleCertCards();
        return visibleGalleryCards();
    };

    function openLightbox(mode, cardIndex) {
        currentMode = mode;
        const cards = getActiveCards();
        if (cardIndex < 0 || cardIndex >= cards.length) return;

        currentItemIndex = cardIndex;
        const targetCard = cards[cardIndex];

        const img = targetCard.querySelector('img');
        
        let title = '';
        let year = '';
        let medium = '';
        let desc = '';

        if (mode === 'memory') {
            title = targetCard.querySelector('.memory-title')?.textContent || '';
            const yr = targetCard.querySelector('.memory-year')?.textContent || '';
            const tag = targetCard.querySelector('.memory-pill-tag')?.textContent || '';
            year = tag ? `${yr} · ${tag.trim()}` : yr;
            medium = targetCard.querySelector('.memory-subtitle')?.textContent || '';
            desc = targetCard.querySelector('.memory-desc')?.textContent || '';
        } else if (mode === 'certificate') {
            title = targetCard.querySelector('.cert-title')?.textContent || '';
            const yr = targetCard.querySelector('.cert-year')?.textContent || '';
            const tag = targetCard.querySelector('.cert-tag')?.textContent || '';
            year = tag ? `${yr} · ${tag.trim()}` : yr;
            medium = targetCard.querySelector('.cert-issuer')?.textContent?.trim() || '';
            desc = targetCard.querySelector('.cert-desc')?.textContent || '';
        } else {
            title = targetCard.querySelector('.work-title')?.textContent || '';
            year = targetCard.querySelector('.work-year')?.textContent || '';
            medium = targetCard.querySelector('.work-medium')?.textContent || '';
            desc = targetCard.querySelector('.work-desc')?.textContent || '';
        }

        lightboxImg.src = img.src;
        lightboxImg.alt = title;
        lightboxTitle.textContent = title;
        lightboxYear.textContent = year;
        lightboxMedium.textContent = medium;
        lightboxDesc.textContent = desc;

        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Attach Gallery Card events
    galleryCards.forEach((card) => {
        const zoomBtn = card.querySelector('.zoom-btn');
        const imgWrapper = card.querySelector('.card-image-wrapper');

        const triggerOpen = (e) => {
            e.stopPropagation();
            const cards = visibleGalleryCards();
            const idx = cards.indexOf(card);
            openLightbox('gallery', idx >= 0 ? idx : 0);
        };

        if (zoomBtn) zoomBtn.addEventListener('click', triggerOpen);
        if (imgWrapper) imgWrapper.addEventListener('click', triggerOpen);
    });

    // Attach Memory Card events
    memoryCards.forEach((card) => {
        const zoomBtn = card.querySelector('.memory-zoom-btn');
        const imgWrapper = card.querySelector('.memory-image-wrapper');

        const triggerOpen = (e) => {
            e.stopPropagation();
            const cards = visibleMemoryCards();
            const idx = cards.indexOf(card);
            openLightbox('memory', idx >= 0 ? idx : 0);
        };

        if (zoomBtn) zoomBtn.addEventListener('click', triggerOpen);
        if (imgWrapper) imgWrapper.addEventListener('click', triggerOpen);
        card.addEventListener('click', triggerOpen);
    });

    // Attach Certificate Card events
    const certCards = document.querySelectorAll('.cert-card');
    certCards.forEach((card) => {
        const zoomBtn = card.querySelector('.cert-zoom-btn');
        const imgWrapper = card.querySelector('.cert-image-wrapper');

        const triggerOpen = (e) => {
            e.stopPropagation();
            const cards = visibleCertCards();
            const idx = cards.indexOf(card);
            openLightbox('certificate', idx >= 0 ? idx : 0);
        };

        if (zoomBtn) zoomBtn.addEventListener('click', triggerOpen);
        if (imgWrapper) imgWrapper.addEventListener('click', triggerOpen);
        card.addEventListener('click', triggerOpen);
    });

    // Spotlight trigger button
    const spotlightTrigger = document.getElementById('spotlight-zoom-trigger');
    if (spotlightTrigger) {
        spotlightTrigger.addEventListener('click', () => {
            openLightbox('memory', 0);
        });
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => {
            const cards = getActiveCards();
            if (cards.length === 0) return;
            currentItemIndex = (currentItemIndex - 1 + cards.length) % cards.length;
            openLightbox(currentMode, currentItemIndex);
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => {
            const cards = getActiveCards();
            if (cards.length === 0) return;
            currentItemIndex = (currentItemIndex + 1) % cards.length;
            openLightbox(currentMode, currentItemIndex);
        });
    }

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
        if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
    });
});
