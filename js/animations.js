/**
 * GSAP Animations & ScrollTriggers
 */

// Register ScrollTrigger if GSAP is available
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

document.addEventListener('DOMContentLoaded', () => {
    
    // Only initialize animations after preloader finishes
    window.addEventListener('preloaderFinished', () => {
        initHeroAnimations();
        initScrollAnimations();
    });
    
    // Fallback if preloader event doesn't fire (e.g. error)
    setTimeout(() => {
        if (!document.querySelector('.hero-name').style.opacity) {
            initHeroAnimations();
            initScrollAnimations();
        }
    }, 2500);

    function initHeroAnimations() {
        if (typeof gsap === 'undefined') return;

        const tl = gsap.timeline();
        
        tl.to('.hero-greeting', {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out'
        })
        .to('.hero-name', {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power4.out'
        }, "-=0.6")
        .to('.hero-title', {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out'
        }, "-=0.8")
        .to('.hero-scroll-indicator', {
            opacity: 1,
            duration: 1,
            ease: 'power2.out'
        }, "-=0.4");
    }

    function initScrollAnimations() {
        // Fallback to Intersection Observer if GSAP not loaded
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            fallbackIntersectionObserver();
            return;
        }

        // Standard reveal elements
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        
        revealElements.forEach(el => {
            gsap.to(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%", // Trigger when top of element is 85% down viewport
                    toggleActions: "play none none reverse" // Play forward on enter, reverse on leave back
                },
                y: 0,
                x: 0,
                scale: 1,
                opacity: 1,
                duration: 1,
                ease: 'power3.out'
            });
        });

        // Project Cards Stagger
        const projectCards = document.querySelectorAll('.project-card');
        
        // Let's create a subtle parallax effect for projects grid
        gsap.to('.projects-grid', {
            scrollTrigger: {
                trigger: '.projects',
                start: "top bottom",
                end: "bottom top",
                scrub: 1 // smooth scrubbing
            },
            y: -50,
            ease: "none"
        });
        
        // About Section Parallax on avatar
        gsap.to('.about-avatar-wrapper', {
            scrollTrigger: {
                trigger: '.about',
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5
            },
            y: 80,
            ease: "none"
        });
    }

    function fallbackIntersectionObserver() {
        console.warn("GSAP missing, falling back to IntersectionObserver");
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: stop observing once visible if you don't want reverse animation
                    // observer.unobserve(entry.target); 
                } else {
                    // Remove if you want elements to hide again when scrolling up
                    entry.target.classList.remove('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });

        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
            observer.observe(el);
        });
    }
});
