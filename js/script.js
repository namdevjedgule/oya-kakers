document.addEventListener("DOMContentLoaded", () => {

    fetch("navbar.html")
        .then(res => res.text())
        .then(data => {
            const navContainer = document.getElementById("navbar");
            if (!navContainer) return;

            navContainer.innerHTML = data;

            initLoginModal();

            const navbar = document.querySelector(".navbar");
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

            const currentPage = window.location.pathname.split("/").pop();

            document.querySelectorAll(".nav-links a").forEach(link => {
                const linkPage = link.getAttribute("href");

                if (
                    linkPage === currentPage ||
                    (currentPage === "" && linkPage === "index.html")
                ) {
                    link.classList.add("active");
                }
            });

        })
        .catch(err => console.error("Navbar load error:", err));

    let ticking = false;

    window.addEventListener("scroll", function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                const navbar = document.querySelector(".navbar");

                if (!navbar) return;

                if (window.scrollY > 5) {
                    navbar.classList.add("scrolled");
                } else {
                    navbar.classList.remove("scrolled");
                }

                ticking = false;
            });

            ticking = true;
        }
    });

    fetch("footer.html")
        .then(res => res.text())
        .then(data => {
            const footer = document.getElementById("footer");
            if (footer) footer.innerHTML = data;
        })
        .catch(err => console.error("Footer load error:", err));


    let index = 0;
    const slides = document.querySelectorAll(".slide");
    const slider = document.querySelector(".hero-slider");
    const dotsContainer = document.querySelector(".dots");

    if (slides.length && slider && dotsContainer) {

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

});

function calculateProfit() {
    let orders = parseFloat(document.getElementById("orders")?.value) || 0;
    let price = parseFloat(document.getElementById("price")?.value) || 0;

    let monthly = orders * price * 30;

    document.getElementById("result").innerText =
        "Estimated Monthly Revenue: ₹" + monthly.toLocaleString();
}