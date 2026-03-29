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
