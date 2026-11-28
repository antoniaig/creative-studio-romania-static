const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const header = document.querySelector(".site-header");
const searchToggle = document.querySelector("[data-search-toggle]");
const searchPanel = document.querySelector("#site-search");
const searchInput = document.querySelector("#site-search-input");
const videoDialog = document.querySelector("#video-dialog");
const studioVideo = videoDialog?.querySelector("video");
const heroPreviewVideo = document.querySelector(".hero-preview__film");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const cursorAccent = document.querySelector(".cursor-accent");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const preloader = document.querySelector(".preloader");

const searchResults = document.querySelector("[data-search-results]");
if (searchResults) {
    const items = Array.isArray(window.STUDIO_ITEMS) ? window.STUDIO_ITEMS : [];
    const query = new URLSearchParams(window.location.search).get("q")?.trim() ?? "";
    const normalizedQuery = query.toLowerCase();
    const matches = normalizedQuery
        ? items.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(normalizedQuery))
        : items;
    const rootPrefix = document.body.dataset.rootPrefix || "./";
    const title = document.querySelector("[data-search-title]");
    const eyebrow = document.querySelector("[data-search-eyebrow]");
    const queryLabel = document.querySelector("[data-search-query]");
    const summary = document.querySelector("[data-search-summary]");
    const emptyMessage = document.querySelector("[data-search-empty]");

    if (title) title.textContent = query ? "Search results" : "Explore the studio";
    if (eyebrow) eyebrow.textContent = query ? "SEARCH RESULTS" : "SEARCH THE STUDIO";
    if (queryLabel) {
        queryLabel.textContent = query ? `For “${query}”` : "";
        queryLabel.hidden = !query;
    }
    if (summary) {
        summary.textContent = query
            ? `${matches.length} ${matches.length === 1 ? "result" : "results"} found.`
            : "Explore photography chapters and creative collections.";
    }
    if (emptyMessage) emptyMessage.hidden = matches.length > 0;

    matches.forEach((item) => {
        const link = document.createElement("a");
        link.className = "listing-tile";
        link.href = `${rootPrefix}${item.path}`;

        const imageFrame = document.createElement("span");
        imageFrame.className = "listing-tile__image";
        const image = document.createElement("img");
        image.src = `${rootPrefix}images/brand/${item.assetFolder}/${item.image || item.slug}.jpg`;
        image.alt = `${item.title} editorial cover`;
        image.loading = "lazy";
        imageFrame.append(image);

        const number = document.createElement("span");
        number.className = "listing-tile__number";
        number.textContent = item.number;
        const itemTitle = document.createElement("span");
        itemTitle.className = "listing-tile__title";
        itemTitle.textContent = item.title;
        const description = document.createElement("span");
        description.className = "listing-tile__description";
        description.textContent = item.description;
        const arrow = document.createElement("span");
        arrow.className = "listing-tile__arrow";
        arrow.setAttribute("aria-hidden", "true");
        arrow.innerHTML = '<svg class="arrow-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M4.5 12h15"/><path d="m13.5 6 6 6-6 6"/></svg>';

        link.append(imageFrame, number, itemTitle, description, arrow);
        searchResults.append(link);
    });

    if (searchInput) searchInput.value = query;
}

if (preloader && !reducedMotion.matches) {
    preloader.hidden = false;
    preloader.addEventListener("animationend", (event) => {
        if (event.target === preloader) preloader.remove();
    });
    window.setTimeout(() => preloader.remove(), 2000);
}

document.addEventListener("pointermove", (event) => {
    if (!cursorAccent || event.pointerType !== "mouse" || !finePointer.matches || reducedMotion.matches) return;
    cursorAccent.style.transform = `translate3d(${event.clientX - 16}px, ${event.clientY - 16}px, 0)`;
    cursorAccent.classList.toggle("is-interactive", event.target instanceof Element && Boolean(event.target.closest("a, button, summary, input")));
    cursorAccent.classList.toggle("is-image", event.target instanceof Element && Boolean(event.target.closest(".world-panel, .chapter-tile, .listing-tile")));
    if (!cursorAccent.classList.contains("is-visible")) {
        cursorAccent.getBoundingClientRect();
        cursorAccent.classList.add("is-visible");
    }
}, { passive: true });

document.addEventListener("pointerout", (event) => {
    if (!event.relatedTarget) cursorAccent?.classList.remove("is-visible");
});
window.addEventListener("blur", () => cursorAccent?.classList.remove("is-visible"));

document.querySelectorAll(".button").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "mouse" || !finePointer.matches || reducedMotion.matches) return;
        const bounds = button.getBoundingClientRect();
        const x = (event.clientX - (bounds.left + bounds.width / 2)) * .08;
        const y = (event.clientY - (bounds.top + bounds.height / 2)) * .08;
        button.style.transform = `translate(${Math.max(-8, Math.min(8, x))}px, ${Math.max(-5, Math.min(5, y))}px)`;
    });
    button.addEventListener("pointerleave", () => {
        button.style.transform = "";
    });
});

reducedMotion.addEventListener("change", (event) => {
    if (!event.matches) return;
    heroPreviewVideo?.pause();
    cursorAccent?.classList.remove("is-visible");
    preloader?.remove();
    document.querySelectorAll(".button").forEach((button) => { button.style.transform = ""; });
    document.querySelectorAll(".image-trail").forEach((image) => image.remove());
});

function updateHeader() {
    header?.classList.toggle("is-scrolled", window.scrollY > 32);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

function closeNavigation() {
    navMenu?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open navigation");
}

function closeSearch(restoreFocus = false) {
    if (!searchPanel || !searchToggle) return;
    searchPanel.hidden = true;
    searchToggle.setAttribute("aria-expanded", "false");
    searchToggle.setAttribute("aria-label", "Open search");
    if (restoreFocus) searchToggle.focus();
}

navToggle?.addEventListener("click", () => {
    const isOpen = navMenu?.classList.toggle("is-open") ?? false;
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

navMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNavigation);
});

searchToggle?.addEventListener("click", () => {
    if (!searchPanel) return;
    const isOpening = searchPanel.hidden;
    searchPanel.hidden = !isOpening;
    searchToggle.setAttribute("aria-expanded", String(isOpening));
    searchToggle.setAttribute("aria-label", isOpening ? "Close search" : "Open search");
    if (isOpening) searchInput?.focus();
});

document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (searchPanel && !searchPanel.hidden) closeSearch(true);
    if (navMenu?.classList.contains("is-open")) {
        closeNavigation();
        navToggle?.focus();
    }
});

document.addEventListener("click", (event) => {
    navMenu?.querySelectorAll(".nav-dropdown[open]").forEach((dropdown) => {
        if (!dropdown.contains(event.target)) dropdown.removeAttribute("open");
    });
    if (searchPanel && !searchPanel.hidden
        && !searchPanel.contains(event.target)
        && !searchToggle?.contains(event.target)) {
        closeSearch();
    }
});

function playHeroPreview() {
    if (!heroPreviewVideo || document.hidden || reducedMotion.matches) return;
    heroPreviewVideo.muted = true;
    heroPreviewVideo.play().catch(() => {
        heroPreviewVideo.closest(".hero-preview")?.removeAttribute("data-video-playing");
    });
}

if (heroPreviewVideo) {
    const preview = heroPreviewVideo.closest(".hero-preview");
    const previewObserver = "IntersectionObserver" in window
        ? new IntersectionObserver((entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;
            playHeroPreview();
            if (!heroPreviewVideo.paused) previewObserver.disconnect();
        }, { threshold: 0.1 })
        : null;

    heroPreviewVideo.addEventListener("playing", () => {
        preview?.setAttribute("data-video-playing", "");
        previewObserver?.disconnect();
    });
    heroPreviewVideo.addEventListener("pause", () => preview?.removeAttribute("data-video-playing"));
    previewObserver?.observe(preview ?? heroPreviewVideo);
    document.addEventListener("visibilitychange", playHeroPreview);
    playHeroPreview();
}

document.querySelector("[data-video-open]")?.addEventListener("click", () => {
    if (videoDialog instanceof HTMLDialogElement && !videoDialog.open) {
        heroPreviewVideo?.pause();
        videoDialog.showModal();
        studioVideo?.play().catch(() => {});
    }
});

videoDialog?.querySelector("[data-video-close]")?.addEventListener("click", () => videoDialog.close());
videoDialog?.addEventListener("click", (event) => {
    if (event.target === videoDialog) videoDialog.close();
});
videoDialog?.addEventListener("close", () => {
    studioVideo?.pause();
    playHeroPreview();
});

document.querySelectorAll(".christmas-catalog, .film-catalog").forEach((catalog) => {
    catalog.addEventListener("play", (event) => {
        catalog.querySelectorAll(".christmas-gallery__video").forEach((video) => {
            if (video !== event.target && !video.paused) video.pause();
        });
    }, true);
});

document.querySelectorAll(".christmas-gallery__player").forEach((player) => {
    const video = player.querySelector("video");
    const play = player.querySelector("[data-gallery-play]");
    const sound = player.querySelector("[data-gallery-sound]");
    const title = video.getAttribute("aria-label");
    const autoplay = player.hasAttribute("data-gallery-autoplay");
    let previewing = false;
    let mutedOnPlay = false;

    function updatePlayback() {
        const playing = !video.paused && !video.ended;
        player.toggleAttribute("data-playing", playing);
        play.setAttribute("aria-label", `${playing ? "Pauză" : "Redă"} ${title}`);
        if (!playing && document.activeElement === sound) play.focus({ preventScroll: true });
        sound.hidden = !playing;
    }

    for (const event of ["play", "pause", "ended"]) {
        video.addEventListener(event, updatePlayback);
    }
    video.addEventListener("volumechange", () => {
        sound.setAttribute("aria-pressed", String(!video.muted));
    });

    player.addEventListener("click", (event) => {
        const touchPlayback = !autoplay && (event.pointerType === "touch" || !finePointer.matches);
        if (event.target !== play && !(touchPlayback && event.target === video)) return;

        previewing = false;
        if (video.paused || video.ended) {
            video.muted = mutedOnPlay;
            video.play().catch(() => {});
        } else {
            video.pause();
        }
    });
    sound.addEventListener("click", () => {
        previewing = false;
        video.muted = !video.muted;
        mutedOnPlay = video.muted;
    });

    player.addEventListener("pointerenter", (event) => {
        if (event.pointerType !== "mouse" || reducedMotion.matches || !video.paused) return;
        previewing = true;
        video.muted = true;
        video.play().catch(() => {});
    });
    player.addEventListener("pointerleave", (event) => {
        if (event.pointerType !== "mouse" || !previewing) return;
        previewing = false;
        video.pause();
    });

    video.controls = false;
    play.hidden = false;

    if (autoplay && !reducedMotion.matches) {
        video.muted = false;
        video.play().catch((error) => {
            if (error.name !== "NotAllowedError" || !video.paused) return;
            video.muted = true;
            video.play().catch(() => {});
        });
    }
});

if (!reducedMotion.matches && "IntersectionObserver" in window) {
    document.body.classList.add("motion-ready");
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12 });
    document.querySelectorAll(".world-panel, .chapter-tile, .collection-tile")
        .forEach((item) => {
            item.classList.add("reveal");
            revealObserver.observe(item);
        });
}

const hero = document.querySelector(".home-hero");
if (hero) {
    let animationFrame = 0;
    let lastTrailTime = 0;
    let lastTrailPosition = null;
    let trailIndex = 0;
    const trailImages = Array.from(document.querySelectorAll(".chapters .chapter-tile img"), (image) => image.src);
    hero.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "mouse" || !finePointer.matches || reducedMotion.matches) return;
        if (animationFrame) window.cancelAnimationFrame(animationFrame);
        animationFrame = window.requestAnimationFrame(() => {
            animationFrame = 0;
            const bounds = hero.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;
            hero.style.setProperty("--parallax-x", `${x * -7}px`);
            hero.style.setProperty("--parallax-y", `${y * -5}px`);
        });
        if (!trailImages.length || !(event.target instanceof Element)
            || event.target.closest(".hero-copy, .hero-index, .hero-preview")) return;
        const now = performance.now();
        if (lastTrailPosition && Math.hypot(event.clientX - lastTrailPosition.x, event.clientY - lastTrailPosition.y) < 85) return;
        if (now - lastTrailTime < 180) return;
        lastTrailTime = now;
        lastTrailPosition = { x: event.clientX, y: event.clientY };
        const bounds = hero.getBoundingClientRect();
        const image = document.createElement("img");
        image.className = "image-trail";
        image.src = trailImages[trailIndex++ % trailImages.length];
        image.alt = "";
        image.setAttribute("aria-hidden", "true");
        image.style.left = `${Math.max(36, Math.min(bounds.width - 36, event.clientX - bounds.left))}px`;
        image.style.top = `${Math.max(45, Math.min(bounds.height - 45, event.clientY - bounds.top))}px`;
        const previousImages = hero.querySelectorAll(".image-trail");
        if (previousImages.length >= 4) previousImages[0].remove();
        hero.append(image);
        image.addEventListener("animationend", () => image.remove(), { once: true });
        window.setTimeout(() => image.remove(), 1300);
    });
    hero.addEventListener("pointerleave", () => {
        hero.style.setProperty("--parallax-x", "0");
        hero.style.setProperty("--parallax-y", "0");
        lastTrailPosition = null;
    });
}
