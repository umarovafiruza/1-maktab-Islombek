/* ==========================================================================
   MENING MAKTABCHAM - Asosiy JavaScript (main.js)
   Interaktiv elementlar, Mobil menyu, Hisoblagichlar va Tablar
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navbar effekti
  const navbarWrapper = document.querySelector('.navbar-wrapper');
  if (navbarWrapper) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbarWrapper.classList.add('scrolled');
      } else {
        navbarWrapper.classList.remove('scrolled');
      }
    });
  }

  // 2. Mobil Menyu (Hamburger) va Overlay
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  let overlay = document.querySelector('.menu-overlay');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
  }

  function openMenu() {
    if (navMenu) navMenu.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (navMenu) navMenu.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      if (navMenu && navMenu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Oyna kattalashganda mobil menyuni yopish
  window.addEventListener('resize', () => {
    if (window.innerWidth > 991) {
      closeMenu();
      navDropdowns.forEach(item => item.classList.remove('open'));
    }
  });

  // 3. Mobil Dropdown Menyular (Accordion)
  const navDropdowns = document.querySelectorAll('.nav-item.has-dropdown');
  navDropdowns.forEach(item => {
    const link = item.querySelector('.nav-link');
    if (link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 991) {
          e.preventDefault();
          const isOpen = item.classList.contains('open');
          // Boshqa ochiqlarini yopish
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

  // 4. Statistika Raqamlari Hisoblagichi (Counter Animation)
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  function runCounters() {
    statNumbers.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000; // ms
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
    }, { threshold: 0.25 });

    observer.observe(statsSection);
  }

  // 5. Yutuqlar Tablari (Tabs in Achievements)
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

  // 6. Aloqa / Qabul Formasi tekshiruvi va yuborish xabari
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

  // 7. Faol Havolani belgilash (Active Nav Link)
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

  // 8. Silliq Sahifadan-Sahifaga O'tish (Smooth Page Transitions)
  const internalLinks = document.querySelectorAll('a[href]');
  internalLinks.forEach(link => {
    const href = link.getAttribute('href');

    // Faqat ichki sahifalar uchun
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
        // Ctrl, Shift, Cmd (yangi oynada ochish) bosilganda o'tishni to'xtatmaslik
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

  // Brauzer "Orqaga / Oldinga" tugmalari bosilganda sahifani qayta tiklash
  window.addEventListener('pageshow', () => {
    document.body.classList.remove('page-exit');
  });
});
