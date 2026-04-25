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
        icon.classList.add("fa-times"); // cross icon
    } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-comment-dots");
    }
}