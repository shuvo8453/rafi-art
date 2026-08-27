(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
      nav.classList.toggle('open', !isOpen);
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation');
        nav.classList.remove('open');
      });
    });
  }

  const progressBar = document.querySelector('.scroll-progress span');
  const backToTopBtn = document.querySelector('.back-to-top-btn');
  const backToTopLinks = document.querySelectorAll('a[href="#top"]');

  backToTopLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const updateProgress = () => {
    const doc = document.documentElement;
    const distance = doc.scrollHeight - doc.clientHeight;
    const progress = distance > 0 ? ((doc.scrollTop || window.scrollY) / distance) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
    if (backToTopBtn) {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });

  const reveals = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px' });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  const filters = [...document.querySelectorAll('.filter-btn')];
  const cards = [...document.querySelectorAll('.art-card')];
  filters.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filters.forEach(btn => btn.classList.toggle('active', btn === button));
      cards.forEach(card => {
        const categories = (card.dataset.category || '').split(/\s+/);
        card.classList.toggle('hidden', filter !== 'all' && !categories.includes(filter));
      });
    });
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxMeta = document.getElementById('lightbox-meta');
  const lightboxDescription = document.getElementById('lightbox-description');
  const closeButton = document.querySelector('.lightbox-close');
  const prevButton = document.querySelector('.lightbox-prev');
  const nextButton = document.querySelector('.lightbox-next');
  let currentIndex = 0;
  let lastFocus = null;

  const visibleCards = () => cards.filter(card => !card.classList.contains('hidden'));

  const renderLightbox = (card) => {
    if (!card || !lightbox) return;
    lightboxImage.src = card.dataset.image || '';
    lightboxImage.alt = `${card.dataset.title || 'Artwork'} by Imrooz Shimu`;
    lightboxTitle.textContent = card.dataset.title || '';
    lightboxMeta.textContent = card.dataset.meta || '';
    lightboxDescription.textContent = card.dataset.description || '';
  };

  const openLightbox = (card) => {
    if (!lightbox) return;
    const activeCards = visibleCards();
    currentIndex = Math.max(0, activeCards.indexOf(card));
    lastFocus = document.activeElement;
    renderLightbox(activeCards[currentIndex]);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    closeButton?.focus();
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    lightboxImage.src = '';
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  };

  const stepLightbox = (direction) => {
    const activeCards = visibleCards();
    if (!activeCards.length) return;
    currentIndex = (currentIndex + direction + activeCards.length) % activeCards.length;
    renderLightbox(activeCards[currentIndex]);
  };

  cards.forEach(card => {
    card.addEventListener('click', () => openLightbox(card));
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(card);
      }
    });
  });

  closeButton?.addEventListener('click', closeLightbox);
  prevButton?.addEventListener('click', () => stepLightbox(-1));
  nextButton?.addEventListener('click', () => stepLightbox(1));

  lightbox?.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', event => {
    if (!lightbox?.classList.contains('open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') stepLightbox(-1);
    if (event.key === 'ArrowRight') stepLightbox(1);
  });
})();
