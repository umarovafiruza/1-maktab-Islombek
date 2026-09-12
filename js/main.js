document.addEventListener('DOMContentLoaded', () => {
  const navbarWrapper = document.querySelector('.navbar-wrapper');
  if (navbarWrapper) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        navbarWrapper.classList.add('scrolled');
      } else {
        navbarWrapper.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  let overlay = document.querySelector('.menu-overlay');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
  }

  if (navMenu && !navMenu.querySelector('.mobile-menu-footer')) {
    const menuFooter = document.createElement('div');
    menuFooter.className = 'mobile-menu-footer';
    menuFooter.innerHTML = `
      <a href="contact.html" class="btn btn-primary mobile-menu-btn">
        <i class="fas fa-paper-plane"></i> Bog‘lanish
      </a>
      <a href="tel:+998909649491" class="mobile-menu-phone">
        <i class="fas fa-phone-alt"></i> +998 90 964-94-91
      </a>
      <div class="mobile-menu-socials">
        <a href="https://t.me" target="_blank" title="Telegram"><i class="fab fa-telegram-plane"></i></a>
        <a href="https://instagram.com" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>
        <a href="https://facebook.com" target="_blank" title="Facebook"><i class="fab fa-facebook-f"></i></a>
        <a href="https://youtube.com" target="_blank" title="YouTube"><i class="fab fa-youtube"></i></a>
      </div>
    `;
    navMenu.appendChild(menuFooter);
  }

  let savedScrollY = 0;

  function openMenu() {
    savedScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    if (navMenu) navMenu.classList.add('active');
    if (overlay) overlay.classList.add('active');
    if (mobileToggle) {
      mobileToggle.classList.add('active');
      mobileToggle.setAttribute('aria-expanded', 'true');
      mobileToggle.setAttribute('aria-label', 'Menyuni yopish');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      }
    }

    // Scroll-lock: orqa tomon umuman scroll bo'lmasligi uchun
    document.documentElement.classList.add('menu-open');
    document.body.classList.add('menu-open');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }

  function closeMenu() {
    if (navMenu) navMenu.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    if (mobileToggle) {
      mobileToggle.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.setAttribute('aria-label', 'Menyuni ochish');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    }

    // Scroll-lockni yechish va foydalanuvchini aynan o'sha joyiga qaytarish
    const topOffset = document.body.style.top;
    const scrollY = topOffset ? Math.abs(parseInt(topOffset, 10)) : savedScrollY;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.documentElement.classList.remove('menu-open');
    document.body.classList.remove('menu-open');
    window.scrollTo(0, scrollY);
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navMenu && navMenu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
    overlay.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });
  }

  // Orqa fon teginish (touch) orqali ham qimirlamasligini ta'minlash
  document.addEventListener('touchmove', (e) => {
    if (document.body.classList.contains('menu-open')) {
      if (!e.target.closest('.nav-menu')) {
        e.preventDefault();
      }
    }
  }, { passive: false });

  document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('active')) {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeMenu();
      }
    }
  });

  const navDropdowns = document.querySelectorAll('.nav-item.has-dropdown');

  if (navMenu) {
    navMenu.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      if (link.classList.contains('nav-link') && link.closest('.has-dropdown')) {
        return;
      }
      if (window.innerWidth <= 991) {
        closeMenu();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 991) {
      closeMenu();
      navDropdowns.forEach(item => item.classList.remove('open'));
    }
  });

  navDropdowns.forEach(item => {
    const link = item.querySelector('.nav-link');
    if (link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 991) {
          e.preventDefault();
          e.stopPropagation();
          const isOpen = item.classList.contains('open');
          navDropdowns.forEach(other => {
            if (other !== item) other.classList.remove('open');
          });
          if (!isOpen) {
            item.classList.add('open');
          } else {
            item.classList.remove('open');
          }
        }
      });
    }
  });

  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  function runCounters() {
    statNumbers.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.innerText = prefix + target.toLocaleString() + suffix;
          clearInterval(timer);
        } else {
          counter.innerText = prefix + Math.floor(current).toLocaleString() + suffix;
        }
      }, stepTime);
    });
  }

  const statsSection = document.querySelector('.stats-banner');
  if (statsSection && statNumbers.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          runCounters();
        }
      });
    }, { threshold: 0.1 });

    observer.observe(statsSection);
  }

  const tabButtons = document.querySelectorAll('.tab-btn');
  const achievementCards = document.querySelectorAll('.achievement-card');

  if (tabButtons.length > 0) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-tab');

        achievementCards.forEach(card => {
          if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  const contactForms = document.querySelectorAll('.ajax-form');
  contactForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Yuborish';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yuborilmoqda...';
      }

      setTimeout(() => {
        alert("Xabaringiz qabul qilindi! Maktab ma'muriyati tez orada siz bilan bog'lanadi.");
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }, 1000);
    });
  });

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      if (link.classList.contains('dropdown-item')) {
        const parentNavItem = link.closest('.nav-item');
        if (parentNavItem) parentNavItem.classList.add('active');
        link.style.color = 'var(--gold-dark)';
        link.style.fontWeight = '700';
      } else {
        link.closest('.nav-item')?.classList.add('active');
      }
    }
  });

  const internalLinks = document.querySelectorAll('a[href]');
  internalLinks.forEach(link => {
    const href = link.getAttribute('href');

    if (
      href &&
      !href.startsWith('http') &&
      !href.startsWith('//') &&
      !href.startsWith('tel:') &&
      !href.startsWith('mailto:') &&
      !href.startsWith('#') &&
      !href.startsWith('javascript:') &&
      !link.getAttribute('target') &&
      !link.hasAttribute('download')
    ) {
      link.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;

        const targetUrl = link.href;
        if (targetUrl && targetUrl !== window.location.href) {
          e.preventDefault();
          document.body.classList.add('page-exit');
          setTimeout(() => {
            window.location.href = targetUrl;
          }, 200);
        }
      });
    }
  });

  window.addEventListener('pageshow', () => {
    document.body.classList.remove('page-exit');
  });

  let backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) {
    backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Sahifa boshiga qaytish');
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(backToTopBtn);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('active');
    } else {
      backToTopBtn.classList.remove('active');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});
