/**
 * JAGDISH CATERERS · LUXURY HOSPITALITY PORTAL
 * Interactive Engine: Video Showreel, Theatres, Lightbox & Concierge
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. STICKY HEADER MORPH
  const header = document.getElementById('mainHeader');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. MOBILE MENU DRAWER
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const openDrawer = () => mobileDrawer.classList.add('open');
  const closeDrawer = () => mobileDrawer.classList.remove('open');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', openDrawer);
    drawerCloseBtn.addEventListener('click', closeDrawer);
    drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));
  }

  // 3. HERO BANNER VIDEO CONTROLLER (PURE VIDEO, ZERO TEXT OVERLAY)
  const heroVideo = document.getElementById('heroVideo');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const soundBtn = document.getElementById('soundBtn');
  const soundLabel = document.getElementById('soundLabel');

  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;

    // Resilient Autoplay with fallback on first user interaction
    const startPlayback = () => {
      heroVideo.muted = true;
      const playPromise = heroVideo.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          if (playIcon) playIcon.classList.add('hidden');
          if (pauseIcon) pauseIcon.classList.remove('hidden');
        }).catch(err => {
          console.warn("Autoplay deferred by browser policy. Will play on first interaction.", err);
          const resumeOnInteraction = () => {
            heroVideo.play().catch(() => {});
            window.removeEventListener('click', resumeOnInteraction);
            window.removeEventListener('touchstart', resumeOnInteraction);
            window.removeEventListener('scroll', resumeOnInteraction);
          };
          window.addEventListener('click', resumeOnInteraction, { once: true });
          window.addEventListener('touchstart', resumeOnInteraction, { once: true });
          window.addEventListener('scroll', resumeOnInteraction, { once: true });
        });
      }
    };

    // Synchronize UI icons with actual video state
    heroVideo.addEventListener('play', () => {
      if (playIcon) playIcon.classList.add('hidden');
      if (pauseIcon) pauseIcon.classList.remove('hidden');
    });

    heroVideo.addEventListener('pause', () => {
      if (playIcon) playIcon.classList.remove('hidden');
      if (pauseIcon) pauseIcon.classList.add('hidden');
    });

    heroVideo.addEventListener('playing', () => {
      heroVideo.style.opacity = '1';
    });

    // Start playback immediately
    startPlayback();

    // Sound Management (Royal Sitar Ambient Soundtrack & Video Audio)
    let isSoundActive = false;
    let ambientAudio = null;

    try {
      ambientAudio = new Audio('assets/audio/royal_sitar_ambient.mp3');
      ambientAudio.loop = true;
      ambientAudio.volume = 0.65;
    } catch (e) {
      console.warn("Ambient audio setup:", e);
    }

    // Reel switching logic
    const switchReel = (btn, videoSrc) => {
      if (!btn || !videoSrc) return;
      document.querySelectorAll('.reel-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      heroVideo.style.opacity = '0.35';

      setTimeout(() => {
        heroVideo.src = videoSrc;
        heroVideo.load();
        heroVideo.muted = !isSoundActive;
        heroVideo.volume = 0.85;

        const onReady = () => {
          heroVideo.style.opacity = '1';
          heroVideo.removeEventListener('canplay', onReady);
        };
        heroVideo.addEventListener('canplay', onReady);

        heroVideo.play().then(() => {
          heroVideo.muted = !isSoundActive;
          heroVideo.volume = 0.85;
          if (isSoundActive && ambientAudio && ambientAudio.paused) {
            ambientAudio.play().catch(() => {});
          }
        }).catch(err => {
          console.warn("Video playback requires interaction:", err);
          heroVideo.style.opacity = '1';
        });
      }, 150);
    };

    const reelBtns = document.querySelectorAll('.reel-btn');
    reelBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        switchReel(btn, btn.getAttribute('data-src'));
      });
    });

    // Play / Pause toggle
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => {
        if (heroVideo.paused) {
          heroVideo.play();
          if (isSoundActive && ambientAudio) ambientAudio.play().catch(() => {});
        } else {
          heroVideo.pause();
          if (ambientAudio) ambientAudio.pause();
        }
      });
    }

    // Sound Toggle (Mute / Unmute)
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        if (heroVideo.muted || !isSoundActive) {
          isSoundActive = true;
          heroVideo.muted = false;
          heroVideo.volume = 0.85;
          soundBtn.classList.add('playing-audio');
          if (soundLabel) soundLabel.textContent = 'Sound On';

          if (ambientAudio) {
            ambientAudio.currentTime = ambientAudio.currentTime || 0;
            ambientAudio.play().catch(e => console.warn("Audio play:", e));
          }
        } else {
          isSoundActive = false;
          heroVideo.muted = true;
          soundBtn.classList.remove('playing-audio');
          if (soundLabel) soundLabel.textContent = 'Sound Off';

          if (ambientAudio) {
            ambientAudio.pause();
          }
        }
      });
    }
  }

  // 4. CULINARY THEATRES TAB SWITCHER
  const theatreTabs = document.querySelectorAll('.theatre-tab');
  const theatrePanels = document.querySelectorAll('.theatre-panel');

  theatreTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');

      theatreTabs.forEach(t => t.classList.remove('active'));
      theatrePanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(`tab-${targetTab}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // 5. VISUAL ANTHOLOGY FILTERING
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 6. LIGHTBOX MODAL
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightboxModal) {
    galleryCards.forEach(card => {
      card.addEventListener('click', () => {
        const img = card.querySelector('img');
        const caption = card.getAttribute('data-caption');
        if (img && lightboxImg) {
          lightboxImg.src = img.src;
          if (lightboxCaption) lightboxCaption.textContent = caption || '';
          lightboxModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // 8. GUEST COUNT SLIDER DISPLAY
  const guestSlider = document.getElementById('guestSlider');
  const guestDisplay = document.getElementById('guestDisplay');

  if (guestSlider && guestDisplay) {
    guestSlider.addEventListener('input', () => {
      const val = parseInt(guestSlider.value, 10);
      if (val >= 5000) {
        guestDisplay.textContent = '5,000+ Grand Guests';
      } else {
        guestDisplay.textContent = `${val.toLocaleString()} Guests`;
      }
    });
  }

  // 9. CONCIERGE EVENT PLANNER & WHATSAPP GENERATOR
  const plannerForm = document.getElementById('plannerForm');
  const formStatusMsg = document.getElementById('formStatusMsg');
  const whatsappDirectBtn = document.getElementById('whatsappDirectBtn');

  const buildWhatsAppMessage = () => {
    const fullName = document.getElementById('fullName')?.value || 'Guest';
    const eventType = document.getElementById('eventType')?.value || 'Bespoke Celebration';
    const destination = document.getElementById('destinationLocation')?.value || 'Destination TBD';
    const guests = guestSlider ? guestSlider.value : '500';
    
    const checkedCuisines = [];
    document.querySelectorAll('input[name="cuisine"]:checked').forEach(c => {
      checkedCuisines.push(c.value);
    });
    const cuisinesText = checkedCuisines.length > 0 ? checkedCuisines.join(', ') : 'Custom Haute Cuisine';
    const notes = document.getElementById('specialNotes')?.value || 'No additional notes provided.';

    const message = `*JAGDISH CATERERS · ROYAL INDIAN HOSPITALITY*
━━━━━━━━━━━━━━━━━━━━
*Host / Patron:* ${fullName}
*Event Type:* ${eventType}
*Destination / City (India):* ${destination}
*Anticipated Guests:* ${guests} Guests
*Culinary Themes:* ${cuisinesText}
*Special Inquiries:* ${notes}
━━━━━━━━━━━━━━━━━━━━
_Requesting availability and private chef tasting consultation._`;

    return encodeURIComponent(message);
  };

  if (whatsappDirectBtn) {
    whatsappDirectBtn.addEventListener('click', () => {
      const encodedMsg = buildWhatsAppMessage();
      window.open(`https://wa.me/919825627698?text=${encodedMsg}`, '_blank');
    });
  }

  if (plannerForm) {
    plannerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName')?.value;
      const email = document.getElementById('contactEmail')?.value;

      if (formStatusMsg) {
        formStatusMsg.className = 'form-status-msg success';
        formStatusMsg.innerHTML = `
          <strong>Thank you, ${fullName}.</strong> Your bespoke event brief has been commissioned. Our Senior Culinary Director will contact you at <em>${email}</em> within 24 hours to schedule your private tasting session.
        `;
        formStatusMsg.style.display = 'block';
        formStatusMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Optionally offer WhatsApp direct handover
      setTimeout(() => {
        if (confirm("Would you like to open this enquiry directly in WhatsApp with our VIP Concierge?")) {
          const encodedMsg = buildWhatsAppMessage();
          window.open(`https://wa.me/919825627698?text=${encodedMsg}`, '_blank');
        }
      }, 700);
    });
  }

  // 10. VIDEO TESTIMONIALS PLAYER & DYNAMIC UPLOADER ENGINE
  const videoPlayerModal = document.getElementById('videoPlayerModal');
  const videoPlayerBackdrop = document.getElementById('videoPlayerBackdrop');
  const closeVideoPlayerBtn = document.getElementById('closeVideoPlayerBtn');
  const testimonialActiveVideo = document.getElementById('testimonialActiveVideo');
  const videoPlayerTitle = document.getElementById('videoPlayerTitle');
  const videoPlayerDetail = document.getElementById('videoPlayerDetail');
  const videoPlayerQuote = document.getElementById('videoPlayerQuote');
  const videoPlayerBadge = document.getElementById('videoPlayerBadge');

  // Open Video Player Modal
  const openVideoTestimonial = (card) => {
    if (!card || !videoPlayerModal || !testimonialActiveVideo) return;
    const videoSrc = card.getAttribute('data-video');
    const author = card.getAttribute('data-author') || 'Patron Testimonial';
    const detail = card.getAttribute('data-detail') || 'Jagdish Caterers Celebration';
    const quote = card.getAttribute('data-quote') || '';
    const tag = card.getAttribute('data-tag') || 'Royal Nuptials';

    if (videoPlayerTitle) videoPlayerTitle.textContent = author;
    if (videoPlayerDetail) videoPlayerDetail.textContent = detail;
    if (videoPlayerQuote) videoPlayerQuote.textContent = quote ? `“${quote}”` : '';
    if (videoPlayerBadge) videoPlayerBadge.textContent = tag;

    testimonialActiveVideo.src = videoSrc;
    testimonialActiveVideo.load();
    testimonialActiveVideo.muted = false;
    testimonialActiveVideo.volume = 1.0;

    videoPlayerModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Auto-play the testimonial video with audio
    testimonialActiveVideo.play().catch(err => {
      console.warn("Video playback policy note:", err);
    });
  };

  // Close Video Player Modal
  const closeVideoTestimonial = () => {
    if (!videoPlayerModal) return;
    videoPlayerModal.classList.remove('active');
    document.body.style.overflow = '';
    if (testimonialActiveVideo) {
      testimonialActiveVideo.pause();
      testimonialActiveVideo.src = '';
    }
  };

  if (closeVideoPlayerBtn) closeVideoPlayerBtn.addEventListener('click', closeVideoTestimonial);
  if (videoPlayerBackdrop) videoPlayerBackdrop.addEventListener('click', closeVideoTestimonial);

  // Attach click listener to existing and future video testimonial cards
  const attachCardListeners = () => {
    document.querySelectorAll('.video-card').forEach(card => {
      if (card.dataset.listenerAttached) return;
      card.dataset.listenerAttached = 'true';
      card.addEventListener('click', () => {
        openVideoTestimonial(card);
      });
    });
  };
  attachCardListeners();

  // Global ESC key listener for video modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (videoPlayerModal?.classList.contains('active')) closeVideoTestimonial();
    }
  });

  // Current year in footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
