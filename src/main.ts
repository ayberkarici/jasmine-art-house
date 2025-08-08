// Main TS entry: initialize per-page features

function initCommon(): void {
  // Navbar scroll behavior: hide on down, show on up
  const navbar = document.querySelector<HTMLElement>('.navbar');
  if (navbar) {
    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > 100) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
      if (y > lastY && y > 120) navbar.classList.add('hidden');
      else navbar.classList.remove('hidden');
      lastY = y;
    }, { passive: true });
  }

  // Mobile menu toggle
  const mobileToggle = document.querySelector<HTMLElement>('.mobile-menu-toggle');
  const navMenu = document.querySelector<HTMLElement>('.nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    document.addEventListener('click', (e) => {
      const target = e.target as Node;
      if (!mobileToggle.contains(target) && !navMenu.contains(target)) {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        setTimeout(() => {
          mobileToggle.classList.remove('active');
          navMenu.classList.remove('active');
          document.body.style.overflow = '';
        }, 200);
      });
    });
  }

  // Skip reveal logic on gallery page to avoid delayed renders on mobile
  const isGalleryPage = location.pathname.endsWith('/gallery.html');
  if (!isGalleryPage) {
    const revealSelectors = [
      '.gallery-item',
      '.collection-item',
      '.section-title',
      '.section-description',
      '.studio-photo-item',
      '.studio-gallery-item',
      '.about-content',
      '.mission-item',
      '.value-item',
      '.team-member',
    ];
    const revealElements = document.querySelectorAll<HTMLElement>(revealSelectors.join(','));
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });
  }

  // Headline inline animation (split into spans)
  const splitTargets = document.querySelectorAll<HTMLElement>('.hero-title, .section-title');
  const lineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).classList.add('animate');
        lineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  splitTargets.forEach((el) => {
    if (!el.classList.contains('split-lines')) {
      const text = el.textContent || '';
      const words = text.split(/\s+/).filter(Boolean);
      el.innerHTML = words.map((w) => `<span class="line">${w}&nbsp;</span>`).join('');
      el.classList.add('split-lines');
    }
    lineObserver.observe(el);
  });
}

function initIndex(): void {
  // Enhanced lazy-loading for images (broader selector)
  const images = document.querySelectorAll<HTMLImageElement>('img.artwork-img, .gallery img, .studio-gallery img');
  if (!images.length) return;
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const dataSrc = img.getAttribute('data-src');
        if (dataSrc && img.src !== dataSrc) img.src = dataSrc;
        img.classList.add('loaded');
        img.style.opacity = '1';
        const container = img.closest('.artwork-image') as HTMLElement | null;
        if (container) container.classList.remove('loading');
        obs.unobserve(img);
      }
    });
  }, { threshold: 0.1, rootMargin: '100px 0px' });

  images.forEach((img) => {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('loaded');
      img.style.opacity = '1';
      const container = img.closest('.artwork-image') as HTMLElement | null;
      if (container) container.classList.remove('loading');
    } else {
      observer.observe(img);
    }
  });

  // Prevent hero artwork images from interfering on click/touch
  document.querySelectorAll<HTMLImageElement>('.floating-artwork-img').forEach((img) => {
    img.addEventListener('click', (e) => e.preventDefault(), { passive: true });
  });
}

function initGallery(): void {
  // Aggressive loader for mobile to avoid IntersectionObserver issues
  const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('img.artwork-img, .gallery img'));
  if (!imgs.length) return;

  const forceLoad = (image: HTMLImageElement) => {
    const currentSrc = image.getAttribute('src');
    const dataSrc = image.getAttribute('data-src');
    if (dataSrc && currentSrc !== dataSrc) {
      image.src = dataSrc;
    } else if (currentSrc) {
      image.loading = 'eager';
      image.decoding = 'async';
      image.src = currentSrc;
    }
  };

  imgs.forEach((img) => {
    if (!(img.complete && img.naturalWidth > 0)) {
      forceLoad(img);
    }
    img.addEventListener('error', () => setTimeout(() => forceLoad(img), 200), { once: true });
  });
}

function initStudio(): void {
  // Ensure studio images load on all devices
  const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('.studio-gallery img, .studio-photography img, img.artwork-img'));
  if (!imgs.length) return;

  const forceLoad = (image: HTMLImageElement) => {
    const currentSrc = image.getAttribute('src');
    const dataSrc = image.getAttribute('data-src');
    if (dataSrc && currentSrc !== dataSrc) {
      image.src = dataSrc;
    } else if (currentSrc) {
      image.loading = 'eager';
      image.decoding = 'async';
      image.src = currentSrc;
    }
  };

  imgs.forEach((img) => {
    if (!(img.complete && img.naturalWidth > 0)) {
      forceLoad(img);
    }
    img.addEventListener('error', () => setTimeout(() => forceLoad(img), 200), { once: true });
  });
}

function initContact(): void {
  const form = document.getElementById('contactForm') as HTMLFormElement | null;
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get('name') || '');
    const email = String(formData.get('email') || '');
    const subject = String(formData.get('subject') || '');
    const message = String(formData.get('message') || '');
    if (!name || !email || !subject || !message) {
      alert('Lütfen tüm gerekli alanları doldurun.');
      return;
    }
    alert('Mesajınız için teşekkürler! En kısa sürede size geri döneceğiz.');
    form.reset();
  });
}

function initArtworkDetail(): void {
  // Attach small helpers to window for inline handlers if present
  const win = window as unknown as { toggleZoom?: () => void; closeZoom?: () => void };
  const modal = document.getElementById('zoomModal');
  const artworkImage = document.getElementById('artwork-image') as HTMLImageElement | null;
  const modalImage = document.getElementById('modal-image') as HTMLImageElement | null;
  if (modal && artworkImage && modalImage) {
    win.toggleZoom = () => {
      modalImage.src = artworkImage.src;
      (modal as HTMLElement).style.display = 'flex';
    };
    win.closeZoom = () => {
      (modal as HTMLElement).style.display = 'none';
    };
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        (modal as HTMLElement).style.display = 'none';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initCommon();
  const path = location.pathname;
  if (path.endsWith('/index.html') || path === '/' || path.endsWith('/')) initIndex();
  if (path.endsWith('/gallery.html')) initGallery();
  if (path.endsWith('/studio.html')) initStudio();
  if (path.endsWith('/contact.html')) initContact();
  // artwork detail kaldırıldı
});


