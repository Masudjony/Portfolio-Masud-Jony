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
    const closeBtn = document.querySelector('.close-modal');

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
});
