// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

console.log("New Year 2026 Experience Initialized");

// Global State
const state = {
    isMobile: window.innerWidth <= 768
};

// Handle Resize
window.addEventListener('resize', () => {
    state.isMobile = window.innerWidth <= 768;
    ScrollTrigger.refresh();
});

// Initial Setup
function init() {
    // Initialize Lenis for Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync ScrollTrigger with Lenis
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000); // Convert to ms
    });
    gsap.ticker.lagSmoothing(0);

    setupIntro();
    setupEnvelope();
    setupGallery();
    setupWishes();
}

// Scene 1: Cinematic Intro Animation
function setupIntro() {
    const tl = gsap.timeline();

    // Initial Load Animation
    tl.to(".hero-content", {
        opacity: 1,
        y: 0,
        duration: 2,
        ease: "power3.out"
    })
        .from(".butterfly", {
            opacity: 0,
            y: 50,
            stagger: 0.3,
            duration: 1.5,
            ease: "sine.out"
        }, "-=1.5");

    // Parallax Effect on Scroll
    gsap.to(".layer-1", {
        yPercent: 50,
        ease: "none",
        scrollTrigger: {
            trigger: "#hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    gsap.to(".layer-2", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
            trigger: "#hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // Butterfly scroll reaction (move faster than scroll)
    gsap.to(".floating-butterflies", {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
            trigger: "#hero-section",
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });
}

// Start
init();

// Scene 5: Simple Heart Particle System
const btn = document.getElementById("send-love-btn");
if (btn) {
    btn.addEventListener("click", (e) => {
        // Create 10 hearts
        for (let i = 0; i < 10; i++) {
            createHeart(e.clientX, e.clientY);
        }

        // Button Feedback
        btn.textContent = "Thank you! ❤️";
        gsap.to(btn, { scale: 1.1, duration: 0.1, yoyo: true, repeat: 1 });
    });
}

function createHeart(x, y) {
    const heart = document.createElement("i");
    heart.classList.add("fa-solid", "fa-heart", "floating-heart");
    document.body.appendChild(heart);

    // Set initial position
    gsap.set(heart, { x: x, y: y, opacity: 1, scale: 0.5 });

    // Animate
    gsap.to(heart, {
        x: x + (Math.random() - 0.5) * 200, // Random X spread
        y: y - 300 - Math.random() * 200,   // Random Upward distance
        rotation: (Math.random() - 0.5) * 90,
        opacity: 0,
        scale: 1.5,
        duration: 2 + Math.random(),
        ease: "power1.out",
        onComplete: () => heart.remove()
    });
}

// Scene 4: Mystery Wishes Reveal
function setupWishes() {
    gsap.utils.toArray(".flip-card-container").forEach((container, i) => {
        ScrollTrigger.create({
            trigger: container,
            start: "top 80%", // Flip when card enters near bottom of screen
            onEnter: () => {
                const card = container.querySelector(".flip-card");
                card.classList.add("flipped");

                // Add particle effect logic here later if needed
            },
            // Optional: Flip back when scrolling up
            onLeaveBack: () => {
                const card = container.querySelector(".flip-card");
                card.classList.remove("flipped");
            }
        });
    });
}

// Scene 3: Horizontal Playlist Scroll
function setupGallery() {

    // We want the cards to move left as we scroll down
    const container = document.querySelector(".cards-container");
    const section = document.querySelector("#playlist-section");

    // Calculate how far to move 
    // (Container Width - Window Width + Left Padding)
    // We use a functional value to handle resizes roughly, 
    // but typically we'd recalculate on refresh.

    // Simple robust calculation:
    const getScrollAmount = () => -(container.scrollWidth - window.innerWidth + 100);

    ScrollTrigger.create({
        trigger: "#playlist-section",
        start: "top top",
        end: () => `+=${container.scrollWidth}`, // Scroll length proportional to width
        pin: true,
        scrub: 1,
        // snap: 1 / (3 - 1), // Optional: Snap to cards
        animation: gsap.to(container, {
            x: getScrollAmount,
            ease: "none"
        })
    });
}

// Scene 2: Interactive Envelope Reveal (Click to Open Sequence)
function setupEnvelope() {
    const envelope = document.querySelector(".envelope-wrapper");
    const card1 = document.querySelector(".card-1");
    const card2 = document.querySelector(".card-2");
    const card3 = document.querySelector(".card-3");

    // Timeline to Open Envelope and Show Card 1
    const openTl = gsap.timeline({ paused: true });
    openTl.to(".envelope-flap", { rotateX: 180, duration: 1, ease: "power2.inOut" })
        .to(".card-1", { y: -200, scale: 1.1, zIndex: 20, duration: 1, ease: "power3.out" }, "-=0.5");

    let step = 0; // 0: Closed, 1: Open(Card1), 2: Card2, 3: Card3

    if (envelope) {
        envelope.addEventListener("click", () => {
            if (step === 0) {
                // Open Envelope
                openTl.play();
                step = 1;
                envelope.style.cursor = "default"; // Change cursor interaction logic if needed
            }
        });
    }

    // Sequence Interaction: specific click handlers for cards
    if (card1) {
        card1.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent bubbling to envelope
            if (step === 1) {
                // Move Card 1 Away, Show Card 2
                gsap.to(card1, { x: -300, rotation: -10, opacity: 0, duration: 0.8, ease: "power2.in" });
                gsap.to(card2, { y: -200, scale: 1.1, zIndex: 21, duration: 1, delay: 0.2, ease: "power3.out" }); // Pop up Card 2
                step = 2;
            }
        });
        card1.style.cursor = "pointer";
    }

    if (card2) {
        card2.addEventListener("click", (e) => {
            e.stopPropagation();
            if (step === 2) {
                // Move Card 2 Away, Show Card 3
                gsap.to(card2, { x: 300, rotation: 10, opacity: 0, duration: 0.8, ease: "power2.in" });
                gsap.to(card3, { y: -200, scale: 1.1, zIndex: 22, duration: 1, delay: 0.2, ease: "power3.out" }); // Pop up Card 3
                step = 3;
            }
        });
        card2.style.cursor = "pointer";
    }

    // Pinning Logic
    ScrollTrigger.create({
        trigger: "#envelope-section",
        start: "top top",
        end: "+=1200", // Increased pin duration for reading time
        pin: true,
    });
}
