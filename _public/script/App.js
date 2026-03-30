// Back to top
(function () {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  const show = () => {
    btn.classList.add("is-visible");
    btn.setAttribute("aria-hidden", "false");
    btn.removeAttribute("tabindex");
  };

  const hide = () => {
    btn.classList.remove("is-visible");
    btn.setAttribute("aria-hidden", "true");
    btn.setAttribute("tabindex", "-1");
  };

  const hero = document.querySelector(".hero");

  if (hero) {
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? hide() : show()),
      { threshold: 0 }
    );
    observer.observe(hero);
  } else {
    const onScroll = () =>
      window.scrollY > window.innerHeight ? show() : hide();
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const firstFocusable = document.querySelector(
      "#main-header a, #main-header button, h1"
    );
    if (firstFocusable) firstFocusable.focus({ preventScroll: true });
  });
})();

// Page Loader
(function () {
  const loader = document.getElementById("page-loader");
  if (!loader) return;
  window.addEventListener("load", () => {
    loader.classList.add("is-hidden");
    loader.addEventListener("transitionend", () => loader.remove(), { once: true });
  });
})();

// Galerie Lightbox
(function () {
  const BREAKPOINT = 968;
  const lightbox = document.getElementById("galerie-lightbox");
  if (!lightbox) return;

  const triggers = [
    ...document.querySelectorAll(".galerie-grid .lightbox-trigger"),
  ];
  const lightboxImg = lightbox.querySelector(".lightbox-img");
  const prevBtn = lightbox.querySelector(".lightbox-prev");
  const nextBtn = lightbox.querySelector(".lightbox-next");
  const closeBtn = lightbox.querySelector(".lightbox-close");
  const currentSpan = lightbox.querySelector(".lightbox-current");
  const totalSpan = lightbox.querySelector(".lightbox-total");

  if (!triggers.length || !lightboxImg) return;

  // Build image list from trigger buttons
  const gallery = triggers.map((btn) => ({
    src: btn.querySelector("img").src,
    alt: btn.querySelector("img").alt,
  }));

  let currentIndex = 0;
  let lastFocused = null;

  if (totalSpan) totalSpan.textContent = gallery.length;

  const updateContent = () => {
    const item = gallery[currentIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    if (currentSpan) currentSpan.textContent = currentIndex + 1;
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === gallery.length - 1;
    if (prevBtn) {
      prevBtn.setAttribute("aria-disabled", isFirst ? "true" : "false");
    }
    if (nextBtn) {
      nextBtn.setAttribute("aria-disabled", isLast ? "true" : "false");
    }
  };

  const openLightbox = (index) => {
    if (window.innerWidth <= BREAKPOINT) return;
    currentIndex = index;
    updateContent();
    lastFocused = document.activeElement;
    lightbox.showModal();
    closeBtn?.focus();
  };

  const closeLightbox = () => {
    lightbox.close();
    lightboxImg.src = "";
    lightboxImg.alt = "";
    lastFocused?.focus();
  };

  const goNext = () => {
    if (currentIndex < gallery.length - 1) {
      currentIndex++;
      updateContent();
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateContent();
    }
  };

  // Open on trigger click
  triggers.forEach((btn, i) => {
    btn.addEventListener("click", () => openLightbox(i));
  });

  // Controls
  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      if (prevBtn.getAttribute("aria-disabled") !== "true") goPrev();
    });
  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      if (nextBtn.getAttribute("aria-disabled") !== "true") goNext();
    });

  // Keyboard navigation
  lightbox.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
  });

  // Close on backdrop click (click on dialog itself, not its children)
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Close when resized below breakpoint
  window.addEventListener("resize", () => {
    if (lightbox.open && window.innerWidth <= BREAKPOINT) {
      closeLightbox();
    }
  });
})();
