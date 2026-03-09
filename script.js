document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const navItems = document.querySelectorAll('#horizontal-nav ul li');
    const navLinks = document.querySelectorAll('#horizontal-nav a');
    let currentIndex = 0;
    let isAnimating = false;
    const scrollThreshold = 30;

    function updateNav(index) {
        navItems.forEach(item => item.classList.remove('active'));
        navItems[index].classList.add('active');
    }

    function showSlide(index) {
        if (isAnimating || index < 0 || index >= slides.length || index === currentIndex) return;

        isAnimating = true;
        const forward = index > currentIndex;

        if (forward) {
            // Sliding forward: Mark all slides up to the target as active
            for (let i = currentIndex + 1; i <= index; i++) {
                const s = slides[i];
                s.classList.add('active');
                if (i === index) {
                    s.style.transform = 'translateX(100%)';
                    s.offsetHeight; // force reflow
                    s.style.transform = 'translateX(0)';
                } else {
                    s.style.transform = 'translateX(0)';
                }
            }
        } else {
            // Sliding backward: All slides from current down to index+1 must slide out
            for (let i = currentIndex; i > index; i--) {
                slides[i].style.transform = 'translateX(100%)';
            }

            setTimeout(() => {
                for (let i = currentIndex; i > index; i--) {
                    slides[i].classList.remove('active');
                    slides[i].style.transform = '';
                }
            }, 800);
        }

        currentIndex = index;
        updateNav(currentIndex);

        setTimeout(() => {
            isAnimating = false;
        }, 1000);
    }

    // Wheel Event
    window.addEventListener('wheel', (e) => {
        if (isAnimating) return;
        if (e.deltaY > scrollThreshold) {
            showSlide(currentIndex + 1);
        } else if (e.deltaY < -scrollThreshold) {
            showSlide(currentIndex - 1);
        }
    }, { passive: true });

    // Menu Click Event
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetIndex = parseInt(link.getAttribute('data-index'));
            showSlide(targetIndex);
        });
    });

    // Arrow Icon Click Event (Collaboration to Contact)
    const arrowIcon = document.querySelector('.arrowIcon');
    if (arrowIcon) {
        arrowIcon.addEventListener('click', () => {
            showSlide(7); // Jump to Contact section
        });
    }

    // Touch support
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    window.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                showSlide(currentIndex + 1);
            } else {
                showSlide(currentIndex - 1);
            }
        }
    });

    // Portfolio Modal Logic
    const portfolioModal = document.getElementById('portfolio-modal');
    const viewAllBtn = document.querySelector('.Right_project_inner.project_content button');
    const closeBtn = document.querySelector('#portfolio-modal .close-modal');

    if (viewAllBtn && portfolioModal && closeBtn) {
        viewAllBtn.addEventListener('click', () => {
            portfolioModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });

        closeBtn.addEventListener('click', () => {
            portfolioModal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        });

        window.addEventListener('click', (event) => {
            if (event.target == portfolioModal) {
                portfolioModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }

    // Experience Modal Logic
    const experienceModal = document.getElementById('experience-modal');
    const viewExpBtn = document.querySelector('#experience .viewmoreBTN button');
    const closeExpBtn = document.querySelector('#experience-modal .close-modal');

    if (viewExpBtn && experienceModal && closeExpBtn) {
        viewExpBtn.addEventListener('click', () => {
            experienceModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });

        closeExpBtn.addEventListener('click', () => {
            experienceModal.style.display = 'none';
            document.body.style.overflow = '';
        });

        window.addEventListener('click', (event) => {
            if (event.target == experienceModal) {
                experienceModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
    // Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorFollower = document.querySelector('.cursor-follower');
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Immediately move the dot
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    // Smoothly follow the mouse with easing
    function animateCursor() {
        // Easing constant (0 to 1)
        const easing = 0.15;

        followerX += (mouseX - followerX) * easing;
        followerY += (mouseY - followerY) * easing;

        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover interactions for all interactive elements
    const interactables = document.querySelectorAll('a, button, .close-modal, .arrowIcon');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorFollower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorFollower.classList.remove('hover');
        });
    });
});
