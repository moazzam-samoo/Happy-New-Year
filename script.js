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

    // Butterfly scroll reaction
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

// Scene 5: Simple Heart Particle System & Romantic Messages
const btn = document.getElementById("send-love-btn");
if (btn) {
    // UPDATED: Romantic Messages List
    const messages = [
        "My heart is always yours ❤️",
        "You have all of me 💖",
        "Forever & Always ♾️",
        "Caught it! Now keeping it 🌹",
        "I love you endlessly 💕"
    ];
    let clickCount = 0;

    btn.addEventListener("click", (e) => {
        // 1. Create Hearts
        for (let i = 0; i < 15; i++) {
            createHeart(e.clientX, e.clientY);
        }

        // 2. Trigger Fireworks
        triggerFireworks();

        // 3. Show Sequential Message
        const msgIndex = clickCount % messages.length;
        createFloatingText(messages[msgIndex], e.clientX, e.clientY);

        clickCount++; // Increment for next click

        // Button Feedback Animation
        gsap.to(btn, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });
    });
}

function createFloatingText(text, x, y) {
    const el = document.createElement("div");
    el.classList.add("floating-text");
    el.innerHTML = text;
    document.body.appendChild(el);

    // Initial State - Fixed positioning
    el.style.position = 'fixed';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.zIndex = "100000";

    gsap.set(el, {
        xPercent: -50,
        yPercent: -50,
        scale: 0.5,
        opacity: 0
    });

    // Animate Up and Fade Out
    gsap.to(el, {
        y: -150, // Move up relative to starting position
        scale: 1.2,
        opacity: 1,
        duration: 2,
        ease: "power2.out",
        onComplete: () => {
            // Fade out after holding
            gsap.to(el, {
                opacity: 0,
                y: y - 350,
                duration: 1.5,
                delay: 1,
                onComplete: () => el.remove()
            });
        }
    });
}

function createHeart(x, y) {
    const heart = document.createElement("i");
    heart.classList.add("fa-solid", "fa-heart", "floating-heart");
    document.body.appendChild(heart);

    // Set initial position
    gsap.set(heart, {
        x: x,
        y: y,
        opacity: 1,
        scale: 0.5
    });

    // Animate
    gsap.to(heart, {
        x: x + (Math.random() - 0.5) * 200, // Random X spread
        y: y - 300 - Math.random() * 200, // Random Upward distance
        rotation: (Math.random() - 0.5) * 90,
        opacity: 0,
        scale: 1.5,
        duration: 2 + Math.random(),
        ease: "power1.out",
        onComplete: () => heart.remove()
    });
}

// Scene 4: Mystery Wishes Reveal (Flip Cards)
function setupWishes() {
    gsap.utils.toArray(".flip-card-container").forEach((container, i) => {
        ScrollTrigger.create({
            trigger: container,
            start: "top 80%",
            onEnter: () => {
                const card = container.querySelector(".flip-card");
                card.classList.add("flipped");
            },
            onLeaveBack: () => {
                const card = container.querySelector(".flip-card");
                card.classList.remove("flipped");
            }
        });
    });
}

// Scene 2: Interactive Envelope Reveal
function setupEnvelope() {
    const envelope = document.querySelector(".envelope-wrapper");
    const card1 = document.querySelector(".card-1");
    const card2 = document.querySelector(".card-2");
    const card3 = document.querySelector(".card-3");

    // Timeline to Open Envelope
    const openTl = gsap.timeline({
        paused: true
    });
    openTl.to(".envelope-flap", {
        rotateX: 180,
        duration: 1,
        ease: "power2.inOut"
    })
        .to(".card-1", {
            y: -200,
            scale: 1.1,
            height: "auto",
            maxHeight: "350px",
            overflow: "auto",
            zIndex: 20,
            duration: 1,
            ease: "power3.out"
        }, "-=0.5");

    let step = 0;

    if (envelope) {
        envelope.addEventListener("click", () => {
            // Prepare Audio/Video on interaction
            const allVideos = document.querySelectorAll("#memories-section video");
            allVideos.forEach(v => {
                v.muted = false;
                v.load();
                v.play().then(() => {
                    v.pause();
                    v.currentTime = 0;
                }).catch(e => console.log("Audio prime failed", e));
            });

            if (step === 0) {
                openTl.play();
                step = 1;
                envelope.style.cursor = "pointer";
            } else if (step === 1) {
                gsap.to(card1, {
                    x: -300,
                    rotation: -10,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.in"
                });
                gsap.to(card2, {
                    y: -200,
                    scale: 1.1,
                    height: "auto",
                    maxHeight: "350px",
                    overflow: "auto",
                    zIndex: 21,
                    duration: 1,
                    delay: 0.2,
                    ease: "power3.out"
                });
                step = 2;
            } else if (step === 2) {
                gsap.to(card2, {
                    x: 300,
                    rotation: 10,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.in"
                });
                gsap.to(card3, {
                    y: -200,
                    scale: 1.1,
                    height: "auto",
                    maxHeight: "350px",
                    overflow: "auto",
                    zIndex: 22,
                    duration: 1,
                    delay: 0.2,
                    ease: "power3.out"
                });
                step = 3;
            } else if (step === 3) {
                const resetTl = gsap.timeline({
                    onComplete: () => {
                        step = 0;
                    }
                });

                resetTl.to(card3, {
                    y: 0,
                    scale: 1,
                    height: 150,
                    maxHeight: 150,
                    overflow: "hidden",
                    opacity: 1,
                    zIndex: 3,
                    duration: 0.5,
                    ease: "power2.in"
                })
                    .set([card1, card2], {
                        x: 0,
                        y: 0,
                        rotation: 0,
                        scale: 1,
                        height: 150,
                        maxHeight: 150,
                        overflow: "hidden",
                        opacity: 1,
                        clearProps: "zIndex"
                    })
                    .set(".card-1", {
                        zIndex: 5
                    })
                    .set(".card-2", {
                        zIndex: 4
                    })
                    .set(".card-3", {
                        zIndex: 3
                    })
                    .to(".envelope-flap", {
                        rotateX: 0,
                        duration: 0.8,
                        ease: "power2.inOut"
                    });
            }
        });
        envelope.style.cursor = "pointer";
    }

    ScrollTrigger.create({
        trigger: "#envelope-section",
        start: "top top",
        end: "+=1200",
        pin: true,
    });
}

// Scene 4: Cinematic Video Memories
function setupMemories() {
    console.log("Setting up Memories...");
    const cards = gsap.utils.toArray("#memories-section .memory-card");
    const videos = gsap.utils.toArray("#memories-section video");

    if (cards.length === 0) return;

    gsap.set(cards, {
        opacity: 0,
        visibility: "hidden",
        scale: 0.8,
        y: 100
    });

    let currentIndex = 0;
    let isAnimating = false;

    function showCard(index) {
        if (index >= cards.length) index = 0;
        isAnimating = true;
        currentIndex = index;

        const card = cards[index];
        const video = videos[index];

        gsap.to(card, {
            opacity: 1,
            visibility: "visible",
            scale: 1,
            y: 0,
            duration: 1.5,
            ease: "expo.out",
            onComplete: () => {
                isAnimating = false;
                playVideo(video, index);
            }
        });
    }

    function hideCard(index, nextIndex) {
        const card = cards[index];
        gsap.to(card, {
            opacity: 0,
            scale: 0.9,
            y: -50,
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => {
                showCard(nextIndex);
            }
        });
    }

    function playVideo(video, index) {
        if (!video) return;
        video.currentTime = 0;
        video.volume = 1.0;
        video.muted = false;

        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                console.warn("Autoplay blocked. Falling back to Muted:", err);
                video.muted = true;
                video.play().catch(e => console.error("Play failed", e));
            });
        }

        video.onended = () => {
            if (index < cards.length - 1) {
                hideCard(index, index + 1);
            } else {
                hideCard(index, 0);
            }
        };
    }

    cards.forEach((card, index) => {
        card.style.cursor = "pointer";
        card.addEventListener("click", () => {
            const v = videos[index];
            if (v) {
                v.muted = false;
                v.volume = 1.0;
            }
        });
    });

    ScrollTrigger.create({
        trigger: "#memories-section",
        start: "top top",
        end: "+=1500",
        pin: true,
        onEnter: () => {
            if (currentIndex === 0 && !isAnimating) {
                showCard(0);
            }
        }
    });
}

function setupFinale() {
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

    // Heart Particle Effect on Button Click
    const btn = document.getElementById("send-love-btn");

    if (btn) {
        btn.addEventListener("click", (e) => {
            // 1. Button Feedback
            btn.innerHTML = `Love Sent! <i class="fa-solid fa-heart"></i>`;
            btn.style.background = "#e91e63";
            btn.style.color = "white";

            gsap.to(btn, { scale: 0.95, yoyo: true, repeat: 1, duration: 0.1 });

            // 2. Spawn Particles
            createHeartExplosion(e.clientX, e.clientY);
        });
    }

    function createHeartExplosion(x, y) {
        for (let i = 0; i < 30; i++) {
            const heart = document.createElement("div");
            heart.classList.add("heart-particle");
            heart.innerHTML = '<i class="fa-solid fa-heart"></i>';
            document.body.appendChild(heart);

            const size = Math.random() * 20 + 10;
            const destinationX = (Math.random() - 0.5) * 300;
            const destinationY = (Math.random() - 1) * 300 - 100; // Move Upwards
            const rotation = Math.random() * 360;

            gsap.set(heart, {
                x: x,
                y: y,
                scale: 0,
                opacity: 1,
                position: "fixed",
                zIndex: 9999,
                color: Math.random() > 0.5 ? "#e91e63" : "#ff4081", // Variations of Pink
                fontSize: size + "px",
                pointerEvents: "none" // Pass through clicks
            });

            gsap.to(heart, {
                x: `+=${destinationX}`,
                y: `+=${destinationY}`,
                rotation: rotation,
                scale: 1,
                opacity: 0,
                duration: 1 + Math.random(),
                ease: "power3.out",
                onComplete: () => heart.remove()
            });
        }
    }
}

// Final Initialization
document.addEventListener("DOMContentLoaded", () => {
    // 1. Trigger Setup Functions if they exist
    if (typeof setupEnvelope === "function") setupEnvelope();
    if (typeof setupMemories === "function") setupMemories();
    if (typeof setupFinale === "function") setupFinale();

    // 2. Trigger Fireworks
    console.log("Triggering Fireworks...");
    triggerFireworks();
});

function triggerFireworks() {
    if (typeof confetti !== "function") {
        console.error("Canvas Confetti not loaded!");
        return;
    }
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 99999
    };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: {
                x: randomInRange(0.1, 0.3),
                y: Math.random() - 0.2
            }
        }));
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: {
                x: randomInRange(0.7, 0.9),
                y: Math.random() - 0.2
            }
        }));
    }, 250);
}
