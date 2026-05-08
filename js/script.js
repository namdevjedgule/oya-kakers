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
                if (navbar) {
                    navbar.classList.toggle("scrolled", window.scrollY > 5);
                }
                ticking = false;
            });
            ticking = true;
        }
    });

});

window.addEventListener("load", () => {

    const loader = document.getElementById("pageLoader");

    if (loader) {
        loader.style.display = "none";
    }

});

window.addEventListener("load", () => {

    if (typeof initSlider === "function") {
        setTimeout(initSlider, 200);
    }

    if (typeof initCarousel === "function") {
        setTimeout(initCarousel, 600);
    }

});

function initNavbar() {

    if (typeof initLoginModal === "function") {
        initLoginModal();
    }

    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const icon = hamburger?.querySelector("i");

    // ── Only move nav-links to body on mobile ──
    function handleNavPosition() {
        if (window.innerWidth <= 992) {
            if (navLinks && navLinks.parentElement !== document.body) {
                document.body.appendChild(navLinks);
            }
        } else {
            const navbar = document.querySelector(".navbar");
            if (navLinks && navbar && navLinks.parentElement !== navbar) {
                navbar.appendChild(navLinks);
            }
        }
    }

    handleNavPosition();
    window.addEventListener("resize", handleNavPosition);

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
    const viewport = document.querySelector(".carousel");
    const dotsContainer = document.getElementById("carouselDots");

    if (!track || !viewport || !dotsContainer) {
        return;
    }

    const IMAGES = Array.from(track.children)
        .map(c => c.querySelector("img")?.src)
        .filter(Boolean);
    const CLONES = 3;
    const total = IMAGES.length;
    let current = 0, busy = false;
    let CARD_W, GAP, VISIBLE;

    const looped = [
        ...IMAGES.slice(-CLONES),
        ...IMAGES,
        ...IMAGES.slice(0, CLONES)
    ];
    track.innerHTML = "";
    looped.forEach(src => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `<img src="${src}" loading="lazy">`;
        track.appendChild(card);
    });
    const cards = Array.from(track.children);

    dotsContainer.innerHTML = "";
    IMAGES.forEach((_, i) => {
        const dot = document.createElement("span");
        if (i === 0) dot.classList.add("on");
        dot.addEventListener("click", () => jumpTo(i));
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

        cards.forEach(c => {
            c.style.width = CARD_W + "px";
            c.style.marginRight = GAP + "px";
        });
        track.style.gap = "0";
    }

    function getOffset(idx) {
        const vpW = viewport.offsetWidth;
        const cardLeft = (CLONES + idx) * (CARD_W + GAP);
        return cardLeft - (vpW / 2) + (CARD_W / 2);
    }

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
        autoTimer = setInterval(() => celStep(1), 1500);
    }

    const prevBtn = document.getElementById("celPrev");
    const nextBtn = document.getElementById("celNext");

    if (prevBtn) {
        prevBtn.onclick = () => celStep(-1);
    }

    if (nextBtn) {
        nextBtn.onclick = () => celStep(1);
    }

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

    const lbClose = document.getElementById("lbClose");
    const lbPrev = document.getElementById("lbPrev");
    const lbNext = document.getElementById("lbNext");

    if (lbClose) lbClose.onclick = closeLightbox;
    if (lbPrev) lbPrev.onclick = () => lbStep(-1);
    if (lbNext) lbNext.onclick = () => lbStep(1);

    if (lightbox) {

        lightbox.addEventListener("click", e => {

            if (e.target === lightbox) {
                closeLightbox();
            }

        });

    }

    document.addEventListener("keydown", e => {

        if (!lightbox) return;

        if (!lightbox.classList.contains("open")) {
            return;
        }

        if (e.key === "ArrowLeft") lbStep(-1);

        if (e.key === "ArrowRight") lbStep(1);

        if (e.key === "Escape") closeLightbox();

    });

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            getConfig();
            goTo(current, false);
        }, 120);
    });

    getConfig();
    goTo(0, false);
    requestAnimationFrame(() => {
        track.style.transition = "transform 0.6s ease";
    });
    startAuto();
}

const popup = document.getElementById("franchisePopup");
const openBtn = document.getElementById("openFranchisePopup");
const closeBtn = document.getElementById("closeFranchisePopup");

if (openBtn && popup) {
    openBtn.addEventListener("click", (e) => {
        e.preventDefault();
        popup.classList.add("active");
        document.body.style.overflow = "hidden";
    });
}

if (closeBtn && popup) {
    closeBtn.addEventListener("click", () => {
        popup.classList.remove("active");
        document.body.style.overflow = "auto";
    });
}

/* CLOSE WHEN CLICK OUTSIDE */

if (popup) {
    popup.addEventListener("click", (e) => {
        if (e.target === popup) {
            popup.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    });
}

/* ESC KEY CLOSE */

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup) {
        popup.classList.remove("active");
        document.body.style.overflow = "auto";
    }
});

document.addEventListener("DOMContentLoaded", function () {

    const forms = document.querySelectorAll("#franchiseForm");

    forms.forEach((form) => {

        form.addEventListener("submit", function (e) {
            e.preventDefault();

            let fullName = form.querySelector("#fullname").value.trim();
            let city = form.querySelector("#city").value.trim();
            let phone = form.querySelector("#phone").value.trim();
            let email = form.querySelector("#email").value.trim();
            let investment = form.querySelector("#investment").value.trim();
            let message = form.querySelector("#message").value.trim();

            if (!fullName || !city || !phone || !email || !investment) {
                alert("Please fill all required fields.");
                return;
            }

            let whatsappNumber = "919545456309";

            let whatsappMessage =
                `🍰 *New Franchise Enquiry - OYA KEKARS*

👤 *Full Name:* ${fullName}

🏙️ *City:* ${city}

📞 *Phone:* ${phone}

📧 *Email:* ${email}

💰 *Investment Range:* ${investment}

📝 *Message:* ${message}`;

            let encodedMessage = encodeURIComponent(whatsappMessage);

            let whatsappURL =
                `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            /* SUCCESS MESSAGE */

            const success =
                form.parentElement.querySelector("#formSuccess");

            form.style.display = "none";

            if (success) {
                success.style.display = "block";
            }

            setTimeout(() => {
                window.open(whatsappURL, "_blank");
            }, 800);

        });

    });

});

const reviews = [
    { name: "Simran Narula", initials: "SN", color: "#4285F4", bg: "#E8F0FE", date: "2 months ago", text: "One of the best cake outlets in Pune! Cakes with great taste, aesthetically beautiful and appealing, and amazing service every time we order!", rating: 5 },
    { name: "Ravina Deore", initials: "RD", color: "#34A853", bg: "#E6F4EA", date: "1 month ago", text: "The birthday cake was absolutely delicious and beautifully designed. Soft, fresh, and perfectly sweet. All guests loved it. Truly made the celebration special.", rating: 5 },
    { name: "Resham Kharbanda", initials: "RK", color: "#EA4335", bg: "#FDECEA", date: "3 months ago", text: "My experience was awesome. The lady at Hadapsar branch — her service was very quick and she was a very decent lady. Thank you!", rating: 5 },
    { name: "Tejal Tupe", initials: "TT", color: "#FBBC05", bg: "#FEF7E0", date: "1 month ago", text: "The cake was delicious and yummy, children and everyone enjoyed it. The flavour of crackers and the chocolate — too yum!", rating: 5 },
    { name: "Aprup Kakar", initials: "AK", color: "#9C27B0", bg: "#F3E5F5", date: "2 months ago", text: "This cake was a complete standout. The European design made it feel elegant, and the soft pink finish looked beautiful in every detail.", rating: 5 },
    { name: "Pooja Thakrar", initials: "PT", color: "#00897B", bg: "#E0F2F1", date: "3 weeks ago", text: "The cake was incredibly fresh and tasted delicious! Good and quick service too.", rating: 5 },
    { name: "Ajinkya Jadhav", initials: "AJ", color: "#F4511E", bg: "#FBE9E7", date: "1 month ago", text: "Absolutely loved the cake! Perfect taste, beautiful design, and delivered in such a short time.", rating: 5 },
    { name: "Vishal Jagtap", initials: "VJ", color: "#1976D2", bg: "#E3F2FD", date: "2 months ago", text: "Oya Kekars did an absolutely fantastic job! The cake was not only beautiful to look at but also incredibly delicious.", rating: 5 },
    { name: "Amar Botre", initials: "AB", color: "#388E3C", bg: "#E8F5E9", date: "6 weeks ago", text: "OYA KEKARS is not only my favourite — everyone says it's an awesome fresh cake.", rating: 5 },
    { name: "Aathira Rajendran", initials: "AR", color: "#E91E63", bg: "#FCE4EC", date: "1 month ago", text: "First time ordered cake, not just me — everyone who ate it loved it. Light, fluffy and perfect sweetness.", rating: 5 },
];

function buildCard(r) {
    return `<div class="ts-card">
    <div class="ts-card-top">
      <div class="ts-avatar" style="background:${r.bg};color:${r.color};">${r.initials}</div>
      <div>
        <div class="ts-name">${r.name}</div>
        <div class="ts-date">${r.date}</div>
      </div>
    </div>
    <div class="ts-card-stars">${'★'.repeat(r.rating)}</div>
    <div class="ts-card-text">${r.text}</div>
    <div class="ts-card-footer">
      <span class="ts-g-logo">Posted on </span>
      <span style="font-size:11px;font-weight:500;"><span style="color:#4285F4">G</span><span style="color:#EA4335">o</span><span style="color:#FBBC05">o</span><span style="color:#34A853">g</span><span style="color:#4285F4">l</span><span style="color:#EA4335">e</span></span>
    </div>
  </div>`;
}

const track = document.getElementById('tsTrack');
const doubled = [...reviews, ...reviews];
track.innerHTML = doubled.map(buildCard).join('');