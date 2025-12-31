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
    // Initialize Lenis for Smooth Scroll (Only if library is loaded)
    if (typeof Lenis !== 'undefined') {
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
    } else {
        console.warn("Lenis not loaded, falling back to native scroll.");
    }

    setupIntro();
    setupEnvelope();
    // Playlist Removed
    setupMemories();
    setupFinale();
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
        btn.textContent = "My heart is always yours";
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
        .to(".card-1", {
            y: -200,
            scale: 1.1,
            height: "auto", // Expand to full content height
            maxHeight: "350px", // Allow growth
            overflow: "auto", // Enable scroll
            zIndex: 20,
            duration: 1,
            ease: "power3.out"
        }, "-=0.5");

    let step = 0; // 0: Closed, 1: Open(Card1), 2: Card2, 3: Card3

    // Unified Click Interaction (Click anywhere on envelope/cards to progress)
    if (envelope) {
        envelope.addEventListener("click", () => {
            // Step 0: Open Envelope -> Show Card 1
            if (step === 0) {
                openTl.play();
                step = 1;
                envelope.style.cursor = "pointer";
            }
            // Step 1: Card 1 -> Show Card 2
            else if (step === 1) {
                gsap.to(card1, { x: -300, rotation: -10, opacity: 0, duration: 0.8, ease: "power2.in" });
                gsap.to(card2, {
                    y: -200,
                    scale: 1.1,
                    height: "auto", /* Expand */
                    maxHeight: "350px",
                    overflow: "auto",
                    zIndex: 21,
                    duration: 1,
                    delay: 0.2,
                    ease: "power3.out"
                });
                step = 2;
            }
            // Step 2: Card 2 -> Show Card 3
            else if (step === 2) {
                gsap.to(card2, { x: 300, rotation: 10, opacity: 0, duration: 0.8, ease: "power2.in" });
                gsap.to(card3, {
                    y: -200,
                    scale: 1.1,
                    height: "auto", /* Expand */
                    maxHeight: "350px",
                    overflow: "auto",
                    zIndex: 22,
                    duration: 1,
                    delay: 0.2,
                    ease: "power3.out"
                });
                step = 3;
            }
            // Step 3: Card 3 -> Reset All
            else if (step === 3) {
                const resetTl = gsap.timeline({
                    onComplete: () => {
                        step = 0; // Reset state
                    }
                });

                // 1. Drop active card (Card 3) back in (and shrink)
                resetTl.to(card3, {
                    y: 0,
                    scale: 1,
                    height: 150, /* Shrink back */
                    maxHeight: 150,
                    overflow: "hidden",
                    opacity: 1,
                    zIndex: 3,
                    duration: 0.5,
                    ease: "power2.in"
                })
                    // 2. Put hidden cards (1 & 2) back in original places (instant/fast)
                    .set([card1, card2], {
                        x: 0, y: 0,
                        rotation: 0,
                        scale: 1,
                        height: 150, /* Reset height */
                        maxHeight: 150,
                        overflow: "hidden",
                        opacity: 1,
                        clearProps: "zIndex"
                    })
                    .set(".card-1", { zIndex: 5 })
                    .set(".card-2", { zIndex: 4 })
                    .set(".card-3", { zIndex: 3 })
                    // Close flap
                    .to(".envelope-flap", { rotateX: 0, duration: 0.8, ease: "power2.inOut" });
            }
        });

        // Ensure cursor remains pointer
        envelope.style.cursor = "pointer";
    }

    // Pinning Logic
    ScrollTrigger.create({
        trigger: "#envelope-section",
        start: "top top",
        end: "+=1200",
        pin: true,
    });
}

// Scene 4: Cinematic Video Memories (Auto-Play Sequencer)
// Scene 4: Cinematic Video Memories (Infinite Loop & Sound)
function setupMemories() {
    console.log("Setting up Memories...");
    const cards = gsap.utils.toArray("#memories-section .memory-card");
    const videos = gsap.utils.toArray("#memories-section video");

    if (cards.length === 0) return;

    // Initial State: Hide all cards
    gsap.set(cards, { opacity: 0, visibility: "hidden", scale: 0.8, y: 100 });

    let currentIndex = 0;
    let isAnimating = false;

    // Transition Function: Cinematic & Smooth
    function showCard(index) {
        // Loop safety (though logic handles it)
        if (index >= cards.length) index = 0;

        isAnimating = true;
        currentIndex = index;

        const card = cards[index];
        const video = videos[index];

        // Animate In (Slower, Elegant Ease)
        gsap.to(card, {
            opacity: 1,
            visibility: "visible",
            scale: 1,
            y: 0,
            duration: 1.5, // Slower
            ease: "expo.out", // Smooth cinematic feel
            onComplete: () => {
                isAnimating = false;
                playVideo(video, index);
            }
        });
    }

    function hideCard(index, nextIndex) {
        const card = cards[index];
        // Animate Out
        gsap.to(card, {
            opacity: 0,
            scale: 0.9,
            y: -50,
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => {
                showCard(nextIndex); // Chain next card
            }
        });
    }

    // Video Playback Helper
    function playVideo(video, index) {
        if (!video) return;

        video.currentTime = 0;
        video.volume = 1.0; // Ensure max volume
        video.muted = false; // Try sound

        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                console.warn("Autoplay blocked, muting:", err);
                // Fallback: Mute BUT keep trying to unmute if user interacts ?
                video.muted = true;
                video.play();
            });
        }

        // INFINITE LOOP LOGIC: When video ends, go next (or back to start)
        video.onended = () => {
            console.log(`Video ${index} ended. Next...`);
            if (index < cards.length - 1) {
                hideCard(index, index + 1);
            } else {
                // LAST VIDEO -> LOOP TO START (0)
                console.log("Sequence complete. Looping back to start...");
                hideCard(index, 0);
            }
        };
    }

    // Click to Restart / Unmute Logic
    cards.forEach((card, index) => {
        card.style.cursor = "pointer";
        card.addEventListener("click", () => {
            const v = videos[index];
            if (v) {
                v.muted = false; // Ensure click unmutes
                v.volume = 1.0;
            }
        });
    });

    // ScrollTrigger Just to PIN and START the sequence
    ScrollTrigger.create({
        trigger: "#memories-section",
        start: "top top",
        end: "+=1500", // Reduced significantly so user can scroll away easily
        pin: true,
        onEnter: () => {
            if (currentIndex === 0 && !isAnimating) {
                showCard(0);
            }
        }
    });
}

function setupFinale() {
    // Basic Finale Animations
    gsap.from("#finale-section .finale-content", {
        scrollTrigger: {
            trigger: "#finale-section",
            start: "top 70%"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    });
}
