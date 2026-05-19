document.addEventListener("DOMContentLoaded", () => {

    loadPartials();
    initNavbar();
    initBranchModal();
    initFranchisePopup();
    initFranchiseForm();
    initReviews();

    initScrollEffect();

});

window.addEventListener("load", () => {

    const loader = document.getElementById("pageLoader");

    if (loader) {
        loader.style.display = "none";
    }

    if (typeof initSlider === "function") {
        setTimeout(initSlider, 200);
    }

    if (typeof initCarousel === "function") {
        setTimeout(initCarousel, 400);
    }

});

/* =========================
   LOAD NAVBAR + FOOTER
========================= */

async function loadPartials() {

    try {

        const [navData, footerData] = await Promise.all([
            fetch("navbar.html").then(res => res.text()),
            fetch("footer.html").then(res => res.text())
        ]);

        const navContainer = document.getElementById("navbar");
        const footerContainer = document.getElementById("footer");

        if (navContainer) navContainer.innerHTML = navData;
        if (footerContainer) footerContainer.innerHTML = footerData;

        initNavbar();

    } catch (err) {

        console.error("Load error:", err);

    }

}

/* =========================
   NAVBAR SCROLL EFFECT
========================= */

function initScrollEffect() {

    const navbar = document.querySelector(".navbar");

    if (!navbar) return;

    let ticking = false;

    window.addEventListener("scroll", () => {

        if (!ticking) {

            requestAnimationFrame(() => {

                navbar.classList.toggle("scrolled", window.scrollY > 5);

                ticking = false;

            });

            ticking = true;

        }

    }, { passive: true });

}

/* =========================
   NAVBAR
========================= */

function initNavbar() {

    if (typeof initLoginModal === "function") {
        initLoginModal();
    }

    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const navbar = document.querySelector(".navbar");

    if (!hamburger || !navLinks || !navbar) return;

    const icon = hamburger.querySelector("i");

    function handleNavPosition() {

        if (window.innerWidth <= 992) {

            if (navLinks.parentElement !== document.body) {
                document.body.appendChild(navLinks);
            }

        } else {

            if (navLinks.parentElement !== navbar) {
                navbar.appendChild(navLinks);
            }

        }

    }

    handleNavPosition();

    window.addEventListener("resize", handleNavPosition);

    hamburger.addEventListener("click", () => {

        navLinks.classList.toggle("active");

        document.body.classList.toggle("menu-open");

        if (icon) {

            icon.classList.toggle("fa-bars");
            icon.classList.toggle("fa-xmark");

        }

    });

    navLinks.addEventListener("click", (e) => {

        if (e.target.tagName === "A") {

            navLinks.classList.remove("active");

            document.body.classList.remove("menu-open");

            if (icon) {

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

            }

        }

    });

    const currentPath = window.location.pathname.toLowerCase();

    navLinks.querySelectorAll("a").forEach(link => {

        let href = link.getAttribute("href");

        if (!href) return;

        href = href.toLowerCase().split("?")[0].split("#")[0];

        if (
            currentPath.endsWith(href) ||
            (currentPath === "/" && href === "index.html")
        ) {
            link.classList.add("active");
        }

    });

}

/* =========================
   BRANCH MODAL
========================= */

function initBranchModal() {

    const modal = document.getElementById("branchModal");
    const box = document.getElementById("branchBox");
    const closeBtn = document.getElementById("closeModal");

    if (!modal || !box || !closeBtn) return;

    document.addEventListener("click", (e) => {

        const orderBtn = e.target.closest(".order-btn");

        if (orderBtn) {

            e.preventDefault();

            modal.style.display = "flex";

            document.body.style.overflow = "hidden";

        }

        const branchItem = e.target.closest(".branch-item");

        if (branchItem) {

            const phone = branchItem.getAttribute("data-phone");

            const msg =
                "Hi OYA Kekars, I would like to order a cake. Please share details.";

            window.open(
                `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
                "_blank"
            );

        }

    });

    closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {

        if (!box.contains(e.target)) {
            closeModal();
        }

    });

    document.addEventListener("keydown", (e) => {

        if (e.key === "Escape") {
            closeModal();
        }

    });

    function closeModal() {

        modal.style.display = "none";

        document.body.style.overflow = "";

    }

}

/* =========================
   FAB MENU
========================= */

function toggleMenu() {

    const fab = document.querySelector(".fab-container");
    const icon = document.getElementById("fabIcon");

    if (!fab || !icon) return;

    fab.classList.toggle("active");

    if (fab.classList.contains("active")) {

        icon.classList.remove("fa-comment-dots");
        icon.classList.add("fa-times");

    } else {

        icon.classList.remove("fa-times");
        icon.classList.add("fa-comment-dots");

    }

}

/* =========================
   CAROUSEL
========================= */

function initCarousel() {

    const track = document.getElementById("track");
    const viewport = document.querySelector(".carousel");
    const dotsContainer = document.getElementById("carouselDots");

    if (!track || !viewport || !dotsContainer) return;

    const IMAGES = Array.from(track.querySelectorAll("img"))
        .map(img => img.src)
        .filter(Boolean);

    const CLONES = 2;
    const total = IMAGES.length;

    let current = 0;
    let busy = false;

    let CARD_W;
    let GAP;
    let VISIBLE;

    const looped = [
        ...IMAGES.slice(-CLONES),
        ...IMAGES,
        ...IMAGES.slice(0, CLONES)
    ];

    track.innerHTML = "";

    looped.forEach(src => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <img src="${src}" loading="lazy" alt="Cake Image">
        `;

        track.appendChild(card);

    });

    const cards = Array.from(track.children);

    dotsContainer.innerHTML = "";

    IMAGES.forEach((_, i) => {

        const dot = document.createElement("span");

        if (i === 0) {
            dot.classList.add("on");
        }

        dot.dataset.index = i;

        dotsContainer.appendChild(dot);

    });

    const dots = Array.from(dotsContainer.children);

    function getConfig() {

        const vpW = viewport.offsetWidth;

        if (vpW >= 900) {

            GAP = 20;
            CARD_W = Math.floor((vpW - GAP * 4) / 5);
            VISIBLE = 5;

        } else if (vpW >= 540) {

            GAP = 16;
            CARD_W = Math.floor((vpW - GAP * 2) / 3);
            VISIBLE = 3;

        } else {

            GAP = 12;
            CARD_W = Math.floor(vpW * 0.72);
            VISIBLE = 1;

        }

        cards.forEach(card => {

            card.style.width = CARD_W + "px";
            card.style.marginRight = GAP + "px";

        });

    }

    function getOffset(idx) {

        const vpW = viewport.offsetWidth;

        const cardLeft = (CLONES + idx) * (CARD_W + GAP);

        return cardLeft - (vpW / 2) + (CARD_W / 2);

    }

    function applyClasses(idx) {

        const center = CLONES + idx;

        cards.forEach((card, i) => {

            card.classList.remove("active", "level-1", "level-2");

            const d = Math.abs(i - center);

            if (d === 0) {
                card.classList.add("active");
            } else if (d === 1 && VISIBLE >= 3) {
                card.classList.add("level-1");
            } else if (d === 2 && VISIBLE >= 5) {
                card.classList.add("level-2");
            }

        });

    }

    function updateDots(idx) {

        const real = ((idx % total) + total) % total;

        dots.forEach((dot, i) => {

            dot.classList.toggle("on", i === real);

        });

    }

    function goTo(idx, animate = true) {

        track.style.transition = animate
            ? "transform 0.6s ease"
            : "none";

        track.style.transform =
            `translateX(-${getOffset(idx)}px)`;

        applyClasses(idx);

        updateDots(idx);

    }

    function step(dir) {

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

            } else {

                current = real;

            }

            busy = false;

            startAuto();

        }, 610);

    }

    function jumpTo(idx) {

        if (busy) return;

        current = idx;

        goTo(idx);

    }

    /* BUTTONS */

    const prevBtn = document.getElementById("celPrev");
    const nextBtn = document.getElementById("celNext");

    if (prevBtn) {
        prevBtn.addEventListener("click", () => step(-1));
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => step(1));
    }

    /* DOTS */

    dotsContainer.addEventListener("click", (e) => {

        const dot = e.target.closest("span");

        if (!dot) return;

        jumpTo(Number(dot.dataset.index));

    });

    /* AUTOPLAY */

    let autoTimer;

    function startAuto() {

        clearInterval(autoTimer);

        autoTimer = setInterval(() => {

            step(1);

        }, 3500);

    }

    /* RESIZE */

    let resizeTimer;

    window.addEventListener("resize", () => {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {

            getConfig();

            goTo(current, false);

        }, 120);

    });

    /* LIGHTBOX */

    const lightbox = document.getElementById("lightbox");
    const lbImg = document.getElementById("lbImg");
    const lbCounter = document.getElementById("lbCounter");

    let lbIndex = 0;

    function openLightbox(idx) {

        if (!lightbox || !lbImg || !lbCounter) return;

        lbIndex = idx;

        lbImg.src = IMAGES[lbIndex];

        lbCounter.textContent =
            `${lbIndex + 1} / ${total}`;

        lightbox.classList.add("open");

        document.body.style.overflow = "hidden";

    }

    function closeLightbox() {

        if (!lightbox) return;

        lightbox.classList.remove("open");

        document.body.style.overflow = "";

    }

    function lbStep(dir) {

        lbIndex = ((lbIndex + dir) + total) % total;

        lbImg.src = IMAGES[lbIndex];

        lbCounter.textContent =
            `${lbIndex + 1} / ${total}`;

    }

    track.addEventListener("click", (e) => {

        const card = e.target.closest(".card");

        if (!card) return;

        const index = cards.indexOf(card);

        const realIdx =
            ((index - CLONES) % total + total) % total;

        openLightbox(realIdx);

    });

    const lbClose = document.getElementById("lbClose");
    const lbPrev = document.getElementById("lbPrev");
    const lbNext = document.getElementById("lbNext");

    if (lbClose) {
        lbClose.addEventListener("click", closeLightbox);
    }

    if (lbPrev) {
        lbPrev.addEventListener("click", () => lbStep(-1));
    }

    if (lbNext) {
        lbNext.addEventListener("click", () => lbStep(1));
    }

    if (lightbox) {

        lightbox.addEventListener("click", (e) => {

            if (e.target === lightbox) {
                closeLightbox();
            }

        });

    }

    document.addEventListener("keydown", (e) => {

        if (!lightbox?.classList.contains("open")) return;

        if (e.key === "ArrowLeft") {
            lbStep(-1);
        }

        if (e.key === "ArrowRight") {
            lbStep(1);
        }

        if (e.key === "Escape") {
            closeLightbox();
        }

    });

    getConfig();

    goTo(0, false);

    startAuto();

}

/* =========================
   FRANCHISE POPUP
========================= */

function initFranchisePopup() {

    const popup = document.getElementById("franchisePopup");
    const openBtn = document.getElementById("openFranchisePopup");
    const closeBtn = document.getElementById("closeFranchisePopup");

    if (!popup) return;

    setTimeout(() => {

        popup.classList.add("active");

    }, 10000);

    if (openBtn) {

        openBtn.addEventListener("click", (e) => {

            e.preventDefault();

            popup.classList.add("active");

            document.body.style.overflow = "hidden";

        });

    }

    if (closeBtn) {

        closeBtn.addEventListener("click", closePopup);

    }

    popup.addEventListener("click", (e) => {

        if (e.target === popup) {
            closePopup();
        }

    });

    document.addEventListener("keydown", (e) => {

        if (e.key === "Escape") {
            closePopup();
        }

    });

    function closePopup() {

        popup.classList.remove("active");

        document.body.style.overflow = "";

    }

}

/* =========================
   FRANCHISE FORM
========================= */

function initFranchiseForm() {

    const forms = document.querySelectorAll("#franchiseForm");

    forms.forEach(form => {

        form.addEventListener("submit", (e) => {

            e.preventDefault();

            const fullName = form.querySelector("#fullname")?.value.trim();
            const city = form.querySelector("#city")?.value.trim();
            const phone = form.querySelector("#phone")?.value.trim();
            const email = form.querySelector("#email")?.value.trim();
            const investment = form.querySelector("#investment")?.value.trim();
            const message = form.querySelector("#message")?.value.trim();

            if (!fullName || !city || !phone || !email || !investment) {

                alert("Please fill all required fields.");

                return;

            }

            const whatsappNumber = "919545456309";

            const whatsappMessage = `
🍰 *New Franchise Enquiry - OYA KEKARS*

👤 *Full Name:* ${fullName}

🏙️ *City:* ${city}

📞 *Phone:* ${phone}

📧 *Email:* ${email}

💰 *Investment Range:* ${investment}

📝 *Message:* ${message}
`;

            const url =
                `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

            const success =
                form.parentElement.querySelector("#formSuccess");

            form.style.display = "none";

            if (success) {
                success.style.display = "block";
            }

            setTimeout(() => {

                window.open(url, "_blank");

            }, 700);

        });

    });

}

const reviews = [
    { name: "Sanjivani Kumbhar", initials: "SK", color: "#388E3C", bg: "#E8F5E9", date: "5 days ago", text: "Oya bakers is best and unique taste. Best service and very helping for selection and suggestions. Taste 100% as said and no chemicals mix, original taste and flavours.", rating: 5 },
    { name: "Sidz Jadhav", initials: "SJ", color: "#E91E63", bg: "#FCE4EC", date: "5 days ago", text: "There is a unique and epic taste in cakes, unseen flavours and oderable shapes and fresh and ready cake served and delivery the same as same as shop.", rating: 5 },
    { name: "Simran Narula", initials: "SN", color: "#4285F4", bg: "#E8F0FE", date: "2 months ago", text: "One of the best cake outlets in Pune! Cakes with great taste, aesthetically beautiful and appealing, and amazing service every time we order!", rating: 5 },
    { name: "Ravina Deore", initials: "RD", color: "#34A853", bg: "#E6F4EA", date: "1 month ago", text: "The birthday cake was absolutely delicious and beautifully designed. Soft, fresh, and perfectly sweet. All guests loved it. Truly made the celebration special.", rating: 5 },
    { name: "Resham Kharbanda", initials: "RK", color: "#EA4335", bg: "#FDECEA", date: "3 months ago", text: "My experience was awesome. The lady at Hadapsar branch — her service was very quick and she was a very decent lady. Thank you!", rating: 5 },
    { name: "Tejal Tupe", initials: "TT", color: "#FBBC05", bg: "#FEF7E0", date: "1 month ago", text: "The cake was delicious and yummy, children and everyone enjoyed it. The flavour of crackers and the chocolate — too yum!", rating: 5 },
    { name: "Aprup Kakar", initials: "AK", color: "#9C27B0", bg: "#F3E5F5", date: "2 months ago", text: "This cake was a complete standout. The European design made it feel elegant, and the soft pink finish looked beautiful in every detail.", rating: 5 },
    { name: "Pooja Thakrar", initials: "PT", color: "#00897B", bg: "#E0F2F1", date: "3 weeks ago", text: "The cake was incredibly fresh and tasted delicious! Good and quick service too.", rating: 5 },
    { name: "Ajinkya Jadhav", initials: "AJ", color: "#F4511E", bg: "#FBE9E7", date: "1 month ago", text: "Absolutely loved the cake! Perfect taste, beautiful design, and delivered in such a short time.", rating: 5 },
    { name: "Vishal Jagtap", initials: "VJ", color: "#1976D2", bg: "#E3F2FD", date: "2 months ago", text: "Oya Kekars did an absolutely fantastic job! The cake was not only beautiful to look at but also incredibly delicious.", rating: 5 },

];

function buildCard(r) {

    return `
    
    <div class="ts-card">

        <div class="ts-card-top">

            <div class="ts-avatar"
                 style="background:${r.bg};color:${r.color};">
                 ${r.initials}
            </div>

            <div>
                <div class="ts-name">${r.name}</div>
                <div class="ts-date">${r.date}</div>
            </div>

        </div>

        <div class="ts-card-stars">
            ${"★".repeat(r.rating)}
        </div>

        <div class="ts-card-text">
            ${r.text}
        </div>

    </div>

    `;

}

function initReviews() {

    const tsTrack = document.getElementById("tsTrack");

    if (!tsTrack) return;

    const doubled = [...reviews, ...reviews];

    tsTrack.innerHTML =
        doubled.map(buildCard).join("");

}