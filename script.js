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

// Scene 2: Interactive Envelope Reveal
function setupEnvelope() {

    // Pin the section so we can scrub the animation
    ScrollTrigger.create({
        trigger: "#envelope-section",
        start: "top top",
        end: "+=1500", // Pin for 1500px of scroll
        pin: true,
        scrub: 1,
        animation: gsap.timeline()
            // 1. Zoom/Fade out hero slightly (optional, handled by next section overlap usually, but let's be safe)

            // 2. Open Flap
            .to(".envelope-flap", {
                rotateX: 180,
                duration: 1,
                ease: "power1.inOut"
            })
            // 3. Pull Letter Out and Scale Up
            .to(".letter-card", {
                y: -150, // Move up out of envelope
                scale: 1.2, // Make it readable
                zIndex: 20, // Bring to front
                duration: 2,
                ease: "power2.out"
            }, "-=0.5") // Overlap slightly

            // 4. Fade Text In cleanly (optional refined touch)
            .from(".letter-card p", {
                opacity: 0,
                y: 10,
                stagger: 0.2,
                duration: 1
            }, "-=1")
    });
}
