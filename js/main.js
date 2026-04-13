/**
 * JS File: Main UI logic, navigation, modal control
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Preloader Logic ---
    const preloader = document.querySelector('.preloader');
    
    // Wait for initial animations to run then hide preloader
    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflowY = 'auto'; // Re-enable scrolling
        
        // Trigger hero animations via custom event
        window.dispatchEvent(new Event('preloaderFinished'));
    }, 2000);

    // --- Navigation Logic ---
    const nav = document.querySelector('.nav');
    const menuBtn = document.querySelector('.nav-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    let isMenuOpen = false;

    // Handle scroll changes for nav bar appearance
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.add('scrolled'); // keep solid background since hero has canvas, ensures contrast. Or conditional based on bg color.
             // Actually, let's keep it dynamic, we'll set background to transparent when at top if we want the hero to shine through, but let's stick to the CSS rules for now.
             if (window.scrollY < 50) {
                 nav.classList.remove('scrolled');
             }
        }
    });

    // Mobile menu toggle
    menuBtn.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileNav.classList.add('open');
            document.body.style.overflow = 'hidden';
            // animate lines into an X
            menuBtn.children[0].style.transform = 'translateY(7.5px) rotate(45deg)';
            menuBtn.children[1].style.transform = 'translateY(-7.5px) rotate(-45deg)';
        } else {
            mobileNav.classList.remove('open');
            document.body.style.overflow = '';
            // reset lines
            menuBtn.children[0].style.transform = 'translateY(0) rotate(0)';
            menuBtn.children[1].style.transform = 'translateY(0) rotate(0)';
        }
    });

    // Close mobile menu on link click
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if(isMenuOpen) menuBtn.click();
        });
    });

    // --- Project Modal Logic ---
    const projectModal = document.getElementById('project-modal');
    const projectIframe = document.getElementById('project-iframe');
    const modalCloseBtn = document.getElementById('modal-close');

    // Make function available globally
    window.openProjectModal = function(url) {
        // Load iframe before showing
        projectIframe.src = url;
        
        // Show modal after slight delay to allow iframe to start loading
        setTimeout(() => {
            projectModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 100);
    };

    modalCloseBtn.addEventListener('click', () => {
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear iframe to stop playback/processes after fade out
        setTimeout(() => {
            projectIframe.src = '';
        }, 500);
    });

    // --- Hero Canvas Particle Effect ---
    // A subtle floating metallic particle effect
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        
        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        
        window.addEventListener('resize', resize);
        resize();
        
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                
                // Silver/Platinum hues with varied opacities
                const shades = ['rgba(255,255,255,', 'rgba(168,162,158,', 'rgba(212,208,203,'];
                const colorBase = shades[Math.floor(Math.random() * shades.length)];
                this.color = `${colorBase}${Math.random() * 0.5 + 0.1})`;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.x > width) this.x = 0;
                if (this.x < 0) this.x = width;
                if (this.y > height) this.y = 0;
                if (this.y < 0) this.y = height;
            }
            
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        const initParticles = () => {
            particles = [];
            // Create particles relative to screen size
            const count = Math.min(Math.floor((width * height) / 10000), 100);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        };
        initParticles();
        
        const animateParticles = () => {
            ctx.clearRect(0, 0, width, height);
            
            // Draw subtle lines between close particles
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if (dist < 100) {
                        const opacity = 1 - (dist/100);
                        ctx.strokeStyle = `rgba(168,162,158,${opacity * 0.15})`;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        };
        
        animateParticles();
    }
});
