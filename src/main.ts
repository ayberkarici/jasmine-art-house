// Main TS entry: initialize per-page features

function initCommon(): void {
  // Navbar scroll background
  const navbar = document.querySelector<HTMLElement>('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    });
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

  // Lazy show gallery items
  const revealElements = document.querySelectorAll<HTMLElement>('.gallery-item, .collection-item');
  if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    revealElements.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      revealObserver.observe(el);
    });
  }
}

function initIndex(): void {
  // Enhanced lazy-loading for images
  const images = document.querySelectorAll<HTMLImageElement>('.artwork-img');
  if (!images.length) return;
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.classList.add('loaded');
        img.style.opacity = '1';
        const container = img.closest('.artwork-image') as HTMLElement | null;
        if (container) container.classList.remove('loading');
        obs.unobserve(img);
      }
    });
  }, { threshold: 0.1, rootMargin: '50px 0px' });

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
}

function initGallery(): void {
  const filterButtons = document.querySelectorAll<HTMLButtonElement>('.filter-btn');
  const items = document.querySelectorAll<HTMLElement>('.gallery-item-extended');
  if (!filterButtons.length || !items.length) return;
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      items.forEach((item) => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
          item.style.animation = 'fadeInUp 0.6s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
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
  if (path.endsWith('/contact.html')) initContact();
  if (path.endsWith('/artwork-detail.html')) initArtworkDetail();
});


