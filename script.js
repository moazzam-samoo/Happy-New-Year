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

// Scene 2: Interactive Envelope Reveal (Click to Open)
function setupEnvelope() {
    const envelopeSection = document.querySelector("#envelope-section");
    const envelope = document.querySelector(".envelope-wrapper");

    // Create the timeline but PAUSE it initially
    const tl = gsap.timeline({ paused: true });

    tl.to(".envelope-flap", {
        rotateX: 180,
        duration: 1.2, /* Slower */
        ease: "power2.inOut"
    })
        .to(".letter-card", {
            y: -180,
            scale: 1.2,
            zIndex: 20,
            duration: 1.5,
            ease: "power3.out" /* Smoother rise */
        }, "-=0.6")
        .from(".letter-card p", {
            opacity: 0,
            y: 10,
            stagger: 0.1,
            duration: 0.5
        }, "-=0.5");

    // Click Interaction
    let isOpen = false;
    if (envelope) {
        envelope.addEventListener("click", () => {
            if (!isOpen) {
                tl.play();
                isOpen = true;

                // Optional: Add a pointer cursor hint or remove it after click
                envelope.style.cursor = "default";
            } else {
                // Optional: Click to close? For now, let's keep it open to read.
                // tl.reverse(); 
                // isOpen = false;
            }
        });

        // Add cursor pointer to indicate clickability
        envelope.style.cursor = "pointer";
    }

    // Pinning Logic (Keep user focused on the envelope until they scroll past)
    // We remove the scrub animation but keep the pin so it stays in view
    ScrollTrigger.create({
        trigger: "#envelope-section",
        start: "top top",
        end: "+=800", // Shorter pin since we don't need deep scrub
        pin: true,
        // No animation linked here, just pinning
    });

}
