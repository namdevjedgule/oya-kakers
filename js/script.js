document.addEventListener("DOMContentLoaded", () => {

    Promise.all([
        fetch("navbar.html").then(res => res.text()),
        fetch("footer.html").then(res => res.text())
    ])
        .then(([navData, footerData]) => {

            const navContainer = document.getElementById("navbar");
            const footerContainer = document.getElementById("footer");

            if (navContainer) navContainer.innerHTML = navData;
            if (footerContainer) footerContainer.innerHTML = footerData;

            initNavbar();

        })
        .catch(err => console.error("Load error:", err));

    let ticking = false;

    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const navbar = document.querySelector(".navbar");
                if (!navbar) return;

                navbar.classList.toggle("scrolled", window.scrollY > 5);
                ticking = false;
            });
            ticking = true;
        }
    });

    window.addEventListener("load", initSlider);

});

function initNavbar() {

    if (typeof initLoginModal === "function") {
        initLoginModal();
    }

    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const icon = hamburger?.querySelector("i");

    if (hamburger && navLinks && icon) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");

            icon.classList.toggle("fa-bars");
            icon.classList.toggle("fa-xmark");

            document.body.classList.toggle("menu-open");
        });

        document.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

                document.body.classList.remove("menu-open");
            });
        });
    }

    const currentPath = window.location.pathname.toLowerCase();

    document.querySelectorAll(".nav-links a").forEach(link => {
        let linkHref = link.getAttribute("href").toLowerCase();

        linkHref = linkHref.split("?")[0].split("#")[0];

        if (
            currentPath.endsWith(linkHref) ||
            (currentPath === "/" && linkHref === "index.html")
        ) {
            link.classList.add("active");
        }
    });
}

function initSlider() {

    let index = 0;
    const slides = document.querySelectorAll(".slide");
    const slider = document.querySelector(".hero-slider");
    const dotsContainer = document.querySelector(".dots");

    if (!slides.length || !slider || !dotsContainer) return;

    slides.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.addEventListener("click", () => showSlide(i));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll(".dots span");

    function showSlide(i) {
        index = i;
        slider.style.transform = `translateX(-${index * 100}%)`;

        dots.forEach(dot => dot.classList.remove("active"));
        dots[index].classList.add("active");
    }

    function autoSlide() {
        index = (index + 1) % slides.length;
        showSlide(index);
    }

    setInterval(autoSlide, 4000);
    showSlide(0);
}

function calculateProfit() {
    let orders = parseFloat(document.getElementById("orders")?.value) || 0;
    let price = parseFloat(document.getElementById("price")?.value) || 0;

    let monthly = orders * price * 30;

    document.getElementById("result").innerText =
        "Estimated Monthly Revenue: ₹" + monthly.toLocaleString();
}

function toggleMenu() {
    const fab = document.querySelector(".fab-container");
    const icon = document.getElementById("fabIcon");

    fab.classList.toggle("active");

    if (fab.classList.contains("active")) {
        icon.classList.remove("fa-comment-dots");
        icon.classList.add("fa-times");
    } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-comment-dots");
    }
}

function initCarousel() {
    const track = document.getElementById("track");
    const IMAGES = Array.from(track.children).map(c => c.querySelector("img").src);
    const CLONES = 3;
    const total = IMAGES.length;
    let current = 0, busy = false;
    let CARD_W, GAP, VISIBLE;

    // ── Build looped track ────────────────────────────────────
    const looped = [
        ...IMAGES.slice(-CLONES),
        ...IMAGES,
        ...IMAGES.slice(0, CLONES)
    ];
    track.innerHTML = "";
    looped.forEach(src => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `<img src="${src}">`;
        track.appendChild(card);
    });
    const cards = Array.from(track.children);
    const viewport = document.querySelector(".carousel");

    // ── Build dots ────────────────────────────────────────────
    const dotsContainer = document.getElementById("carouselDots");
    dotsContainer.innerHTML = "";
    IMAGES.forEach((_, i) => {
        const dot = document.createElement("span");
        if (i === 0) dot.classList.add("on");
        dot.addEventListener("click", () => jumpTo(i));
        dotsContainer.appendChild(dot);
    });
    const dots = Array.from(dotsContainer.children);

    // ── Responsive config — recalculates on every resize ──────
    function getConfig() {
        const vpW = viewport.offsetWidth;

        if (vpW >= 900) {
            // Desktop: 5 cards
            GAP = 20;
            CARD_W = Math.floor((vpW - GAP * 4) / 5);
            VISIBLE = 5;
        } else if (vpW >= 540) {
            // Tablet: 3 cards
            GAP = 16;
            CARD_W = Math.floor((vpW - GAP * 2) / 3);
            VISIBLE = 3;
        } else {
            // Mobile: 1 card
            GAP = 12;
            CARD_W = Math.floor(vpW * 0.72);
            VISIBLE = 1;
        }

        // Apply computed width directly to each card
        cards.forEach(c => {
            c.style.width = CARD_W + "px";
            c.style.marginRight = GAP + "px";
        });
        track.style.gap = "0"; // gap handled by marginRight
    }

    // ── Offset: always perfectly centered ─────────────────────
    function getOffset(idx) {
        const vpW = viewport.offsetWidth;
        const cardLeft = (CLONES + idx) * (CARD_W + GAP);
        return cardLeft - (vpW / 2) + (CARD_W / 2);
    }

    // ── Classes change based on how many cards are visible ────
    function applyClasses(idx) {
        const center = CLONES + idx;
        cards.forEach((card, i) => {
            const d = Math.abs(i - center);
            card.className = "card";
            if (d === 0) card.classList.add("active");
            else if (d === 1 && VISIBLE >= 3) card.classList.add("level-1");
            else if (d === 2 && VISIBLE >= 5) card.classList.add("level-2");
        });
    }

    function updateDots(idx) {
        const real = ((idx % total) + total) % total;
        dots.forEach((d, i) => d.classList.toggle("on", i === real));
    }

    function goTo(idx, animate) {
        track.style.transition = animate ? "transform 0.6s ease" : "none";
        track.style.transform = `translateX(-${getOffset(idx)}px)`;
        applyClasses(idx);
        updateDots(idx);
    }

    // ── Step (arrow + auto) ───────────────────────────────────
    function celStep(dir) {
        if (busy) return;
        busy = true;
        clearInterval(autoTimer);
        const next = current + dir;
        goTo(next, true);
        setTimeout(() => {
            const real = ((next % total) + total) % total;
            if (next < 0 || next >= total) {
                current = real;
                goTo(real, false);
                requestAnimationFrame(() =>
                    requestAnimationFrame(() => { busy = false; startAuto(); })
                );
            } else {
                current = real;
                busy = false;
                startAuto();
            }
        }, 610);
    }

    function jumpTo(idx) {
        if (busy) return;
        clearInterval(autoTimer);
        current = idx;
        goTo(idx, true);
        setTimeout(() => { busy = false; startAuto(); }, 610);
    }

    let autoTimer;
    function startAuto() {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => celStep(1), 2500);
    }

    // ── Arrows ────────────────────────────────────────────────
    document.getElementById("celPrev").onclick = () => celStep(-1);
    document.getElementById("celNext").onclick = () => celStep(1);

    // ── Lightbox ──────────────────────────────────────────────
    const lightbox = document.getElementById("lightbox");
    const lbImg = document.getElementById("lbImg");
    const lbCounter = document.getElementById("lbCounter");
    let lbIndex = 0;

    function openLightbox(idx) {
        lbIndex = ((idx % total) + total) % total;
        lbImg.src = IMAGES[lbIndex];
        lbCounter.textContent = `${lbIndex + 1} / ${total}`;
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
    }
    function closeLightbox() {
        lightbox.classList.remove("open");
        document.body.style.overflow = "";
    }
    function lbStep(dir) {
        lbIndex = ((lbIndex + dir) + total) % total;
        lbImg.src = IMAGES[lbIndex];
        lbCounter.textContent = `${lbIndex + 1} / ${total}`;
    }

    cards.forEach((card, i) => {
        card.style.cursor = "pointer";
        card.addEventListener("click", () => {
            const realIdx = ((i - CLONES) % total + total) % total;
            openLightbox(realIdx);
        });
    });

    document.getElementById("lbClose").onclick = closeLightbox;
    document.getElementById("lbPrev").onclick = () => lbStep(-1);
    document.getElementById("lbNext").onclick = () => lbStep(1);
    lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", e => {
        if (!lightbox.classList.contains("open")) return;
        if (e.key === "ArrowLeft") lbStep(-1);
        if (e.key === "ArrowRight") lbStep(1);
        if (e.key === "Escape") closeLightbox();
    });

    // ── Resize handler ────────────────────────────────────────
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            getConfig();
            goTo(current, false); // reposition silently
        }, 120);
    });

    // ── Init ──────────────────────────────────────────────────
    getConfig();
    goTo(0, false);
    requestAnimationFrame(() => {
        track.style.transition = "transform 0.6s ease";
    });
    startAuto();
}

window.addEventListener("load", initCarousel);