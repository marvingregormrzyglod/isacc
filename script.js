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
    const slideWidth = slides[0].getBoundingClientRect().width;

    // Arrange slides next to one another
    const setSlidePosition = (slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    };
    slides.forEach(setSlidePosition);

    let isDragging = false,
        startPos = 0,
        currentTranslate = 0,
        prevTranslate = 0,
        animationID,
        currentIndex = 0;

    carousel.addEventListener('mousedown', dragStart);
    carousel.addEventListener('touchstart', dragStart);

    carousel.addEventListener('mouseup', dragEnd);
    carousel.addEventListener('mouseleave', dragEnd);
    carousel.addEventListener('touchend', dragEnd);

    carousel.addEventListener('mousemove', drag);
    carousel.addEventListener('touchmove', drag);
    
    nextButton.addEventListener('click', () => moveToSlide(currentIndex + 1));
    prevButton.addEventListener('click', () => moveToSlide(currentIndex - 1));

    function dragStart(event) {
        if (event.target.classList.contains('carousel-button')) return;
        event.preventDefault();
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
        if (slideIndex < 0) slideIndex = 0;
        if (slideIndex > slides.length - 1) slideIndex = slides.length - 1;
        
        const targetTranslate = slideIndex * -slideWidth;
        slidesContainer.style.transition = 'transform 0.4s ease-out';
        slidesContainer.style.transform = `translateX(${targetTranslate}px)`;

        currentTranslate = targetTranslate;
        prevTranslate = targetTranslate;
        currentIndex = slideIndex;

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
