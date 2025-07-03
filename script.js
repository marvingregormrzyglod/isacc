/* Carousel Logic */
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });
}

function moveSlide(n) {
    currentSlide = (currentSlide + n + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

// Initialize the first slide
showSlide(currentSlide);


/* Google Sheet Form Submission Logic */

// !!! --- IMPORTANT SETUP --- !!!
// 1. Create a new Google Sheet.
// 2. Go to Extensions > Apps Script.
// 3. Paste the Google Apps Script code (provided below) into the script editor.
// 4. Click the "Deploy" button -> "New deployment".
// 5. For "Who has access", select "Anyone". Click "Deploy".
// 6. Authorize the script with your Google account.
// 7. Copy the Web app URL it gives you.
// 8. Paste that URL below to replace the 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE' placeholder.

const form = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'; // <-- PASTE YOUR URL HERE

form.addEventListener('submit', e => {
    e.preventDefault();
    formMessage.textContent = 'Submitting...';
    
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => {
            console.log('Success!', response);
            formMessage.textContent = 'Thank you! We will be in touch soon.';
            form.reset();
            setTimeout(() => { formMessage.textContent = ''; }, 5000);
        })
        .catch(error => {
            console.error('Error!', error.message);
            formMessage.textContent = 'Error! Could not send message. Please try again.';
        });
});

/*
--- GOOGLE APPS SCRIPT CODE ---
(Paste this into your Google Apps Script editor as per the instructions above)

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var newRow = sheet.getLastRow() + 1;
  var rowData = [];
  
  // Add a timestamp in the first column
  rowData.push(new Date()); 
  
  // Get form data by parameter name
  rowData.push(e.parameter.name);
  rowData.push(e.parameter.email);
  
  sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
  
  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}

*/


// START: Added Fullscreen Menu Logic
const menuToggle = document.querySelector('.menu-toggle');
const fullscreenMenu = document.getElementById('fullscreen-menu');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    fullscreenMenu.classList.toggle('visible');
    document.body.classList.toggle('menu-open');
});
// END: Added Fullscreen Menu Logic
