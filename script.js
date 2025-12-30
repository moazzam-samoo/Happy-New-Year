// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Check if we can use a smooth scroll library (Optional/Future implementation)
// For now, we rely on native scroll for mobile performance, considering adding Lenis later if requested.

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
