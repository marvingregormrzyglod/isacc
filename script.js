// --- START: Universal Menu Logic ---
// 5. This script now correctly handles the menu on all pages.
const menuToggle = document.querySelector('.menu-toggle');
const fullscreenMenu = document.getElementById('fullscreen-menu');

if (menuToggle && fullscreenMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        fullscreenMenu.classList.toggle('visible');
        document.body.classList.toggle('menu-open');
    });
}
// --- END: Universal Menu Logic ---


// --- START: Draggable Carousel Logic ---
// 3. This new logic adds click-and-drag functionality to the carousel.
const carousel = document.querySelector('.carousel');

if (carousel) {
    const slides = Array.from(carousel.children);
    const nextButton = document.querySelector('.next');
    const prevButton = document.querySelector('.prev');

    let isDragging = false,
        startPos = 0,
        currentTranslate = 0,
        prevTranslate = 0,
        animationID,
        currentIndex = 0;

    // Set initial positions for slides
    slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${index * 100}%)`;
    });

    // Event Listeners
    slides.forEach((slide, index) => {
        // Touch events
        slide.addEventListener('touchstart', touchStart(index));
        slide.addEventListener('touchend', touchEnd);
        slide.addEventListener('touchmove', touchMove);

        // Mouse events
        slide.addEventListener('mousedown', touchStart(index));
        slide.addEventListener('mouseup', touchEnd);
        slide.addEventListener('mouseleave', touchEnd);
        slide.addEventListener('mousemove', touchMove);
    });

    // Arrow button listeners
    nextButton.addEventListener('click', () => moveToSlide(currentIndex + 1));
    prevButton.addEventListener('click', () => moveToSlide(currentIndex - 1));

    function touchStart(index) {
        return function (event) {
            currentIndex = index;
            startPos = getPositionX(event);
            isDragging = true;
            animationID = requestAnimationFrame(animation);
            carousel.classList.add('dragging');
        }
    }

    function touchEnd() {
        if (!isDragging) return;
        isDragging = false;
        cancelAnimationFrame(animationID);

        const movedBy = currentTranslate - prevTranslate;

        if (movedBy < -100 && currentIndex < slides.length - 1) {
            currentIndex += 1;
        }

        if (movedBy > 100 && currentIndex > 0) {
            currentIndex -= 1;
        }

        moveToSlide(currentIndex);

        carousel.classList.remove('dragging');
    }

    function touchMove(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + currentPosition - startPos;
        }
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
    }

    function setSliderPosition() {
        carousel.style.transform = `translateX(${currentTranslate}px)`;
    }

    function moveToSlide(slideIndex) {
        if(slideIndex < 0) slideIndex = 0;
        if(slideIndex >= slides.length) slideIndex = slides.length - 1;

        const slideWidth = slides[0].getBoundingClientRect().width;
        currentTranslate = slideIndex * -slideWidth;
        prevTranslate = currentTranslate;
        
        carousel.style.transition = 'transform 0.4s ease-out';
        setSliderPosition();
        
        currentIndex = slideIndex;

        // Remove transition after it's done to allow for smooth dragging
        carousel.ontransitionend = () => {
            carousel.style.transition = 'none';
        };
    }
}
// --- END: Draggable Carousel Logic ---



// --- START: Google Sheet Form Submission Logic ---
const form = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
if(form) {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbw2Fze7nz9TYAFh60JGrmdaojYyHTLizgudU7ftUa1xodapUk3CP4GQs3K2fEkVGXaumA/exec'; //

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
// --- END: Google Sheet Form Submission Logic ---
