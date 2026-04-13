/**
 * Custom Mobile-aware Magnetic Cursor
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if device supports hover (ignores touch devices)
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    if (isTouchDevice) {
        // Leave early, let CSS media queries hide the cursor
        return;
    }

    const cursorOuter = document.querySelector('.cursor-outer');
    const cursorDot = document.querySelector('.cursor-dot');
    
    // Store cursor position
    let clientX = -100;
    let clientY = -100;
    
    // Store rendered cursor position for smooth interpolation (linear interpolation)
    let outerX = -100;
    let outerY = -100;
    
    let isVisible = false;

    // Listen to mouse movement
    document.addEventListener('mousemove', (e) => {
        clientX = e.clientX;
        clientY = e.clientY;
        
        if (!isVisible) {
            cursorOuter.style.opacity = 1;
            cursorDot.style.opacity = 1;
            isVisible = true;
            // Immediate snap on first movement
            outerX = clientX;
            outerY = clientY;
        }
        
        // Dot follows instantly
        cursorDot.style.transform = `translate(${clientX}px, ${clientY}px)`;
    });

    // Handle mouse leaving/entering window
    document.addEventListener('mouseleave', () => {
        cursorOuter.style.opacity = 0;
        cursorDot.style.opacity = 0;
        isVisible = false;
    });

    document.addEventListener('mouseenter', () => {
        cursorOuter.style.opacity = 1;
        cursorDot.style.opacity = 1;
        isVisible = true;
    });

    // Render loop for smooth outer trailing effect
    const render = () => {
        if (isVisible) {
            // Lerp formulation: current = current + (target - current) * speed
            outerX += (clientX - outerX) * 0.15;
            outerY += (clientY - outerY) * 0.15;
            
            cursorOuter.style.transform = `translate(${outerX}px, ${outerY}px)`;
        }
        requestAnimationFrame(render);
    };
    
    requestAnimationFrame(render);

    // Add hover effects for interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .hover-target');
    
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            cursorOuter.classList.add('hover');
        });
        target.addEventListener('mouseleave', () => {
            cursorOuter.classList.remove('hover');
        });
    });

    // Add click down effect
    document.addEventListener('mousedown', () => {
        cursorOuter.classList.add('click');
        cursorDot.style.transform = `translate(${clientX}px, ${clientY}px) scale(0.7)`;
    });
    
    document.addEventListener('mouseup', () => {
        cursorOuter.classList.remove('click');
        cursorDot.style.transform = `translate(${clientX}px, ${clientY}px) scale(1)`;
    });
});
