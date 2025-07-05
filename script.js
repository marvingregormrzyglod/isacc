// --- Universal Menu Logic ---
const menuToggle = document.querySelector('.menu-toggle');
const fullscreenMenu = document.getElementById('fullscreen-menu');

if (menuToggle && fullscreenMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        fullscreenMenu.classList.toggle('visible');
        document.body.classList.toggle('menu-open');
    });
}

// --- Draggable Carousel Logic ---
const carousel = document.querySelector('.carousel');

if (carousel) {
    const slidesContainer = carousel;
    const slides = Array.from(slidesContainer.children);
    const nextButton = document.querySelector('.next');
    const prevButton = document.querySelector('.prev');
    let slideWidth = slides.length > 0 ? slides[0].getBoundingClientRect().width : 0;

    // The setSlidePosition function was causing the drag issue and is not needed with flexbox.
    // It has been removed.

    let isDragging = false,
        startPos = 0,
        currentTranslate = 0,
        prevTranslate = 0,
        animationID,
        currentIndex = 0;

    carousel.addEventListener('mousedown', dragStart);
    carousel.addEventListener('touchstart', dragStart, { passive: true }); // passive for better scroll performance

    carousel.addEventListener('mouseup', dragEnd);
    carousel.addEventListener('mouseleave', dragEnd);
    carousel.addEventListener('touchend', dragEnd);

    carousel.addEventListener('mousemove', drag);
    carousel.addEventListener('touchmove', drag, { passive: true }); // passive for better scroll performance
    
    nextButton.addEventListener('click', () => moveToSlide(currentIndex + 1));
    prevButton.addEventListener('click', () => moveToSlide(currentIndex - 1));

    function dragStart(event) {
        if (event.target.classList.contains('carousel-button')) return;
        // Do not prevent default for touchstart to allow vertical scrolling
        if (event.type === 'mousedown') {
            event.preventDefault();
        }
        startPos = getPositionX(event);
        isDragging = true;
        animationID = requestAnimationFrame(animation);
        slidesContainer.classList.add('dragging');
    }

    function drag(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + currentPosition - startPos;
        }
    }

    function dragEnd(event) {
        if (!isDragging) return;
        isDragging = false;
        cancelAnimationFrame(animationID);

        const movedBy = currentTranslate - prevTranslate;

        // Move to next/prev slide if moved more than 100px
        if (movedBy < -100 && currentIndex < slides.length - 1) {
            currentIndex += 1;
        }

        if (movedBy > 100 && currentIndex > 0) {
            currentIndex -= 1;
        }

        moveToSlide(currentIndex);

        slidesContainer.classList.remove('dragging');
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
    }

    function setSliderPosition() {
        slidesContainer.style.transform = `translateX(${currentTranslate}px)`;
    }

    function moveToSlide(slideIndex) {
        // Recalculate slideWidth on each move to ensure it's correct for the current viewport
        slideWidth = slides.length > 0 ? slides[0].getBoundingClientRect().width : 0;
        if (slideWidth === 0) return; // Don't do anything if width is 0

        if (slideIndex < 0) slideIndex = 0;
        if (slideIndex > slides.length - 1) slideIndex = slides.length - 1;
        
        const targetTranslate = slideIndex * -slideWidth;
        slidesContainer.style.transition = 'transform 0.4s ease-out';
        slidesContainer.style.transform = `translateX(${targetTranslate}px)`;

        currentTranslate = targetTranslate;
        prevTranslate = targetTranslate;
        currentIndex = slideIndex;

        // Remove transition after it ends to allow smooth dragging again
        slidesContainer.addEventListener('transitionend', () => {
            slidesContainer.style.transition = 'none';
        }, { once: true });
    }
}


// --- Google Sheet Form Submission Logic ---
const form = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
if(form) {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbw2Fze7nz9TYAFh60JGrmdaojYyHTLizgudU7ftUa1xodapUk3CP4GQs3K2fEkVGXaumA/exec';

    form.addEventListener('submit', e => {
        e.preventDefault();
        formMessage.textContent = 'Submitting...';
        fetch(scriptURL, { method: 'POST', body: new FormData(form)})
            .then(response => {
                formMessage.textContent = 'Thank you! We will be in touch soon.';
                form.reset();
                setTimeout(() => { formMessage.textContent = ''; }, 5000);
            })
            .catch(error => {
                formMessage.textContent = 'Error! Could not send message. Please try again.';
            });
    });
}
