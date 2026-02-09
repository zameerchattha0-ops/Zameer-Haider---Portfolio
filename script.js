// Improved script.js

// Function to download CV
function downloadCV() {
    const link = document.createElement('a');
    link.href = 'path/to/your/cv.pdf'; // Update with correct path
    link.download = 'CV_Zameer_Haider.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Typing effect enhancements
const textArray = [
    'Welcome to my portfolio!',
    'I am Zameer Haider.',
    'I create awesome web experiences.',
];

let textIndex = 0;
let charIndex = 0;

function typeText() {
    if (charIndex < textArray[textIndex].length) {
        document.getElementById('typing-effect').textContent += textArray[textIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeText, 100);
    } else {
        setTimeout(removeText, 2000);
    }
}

function removeText() {
    if (charIndex > 0) {
        document.getElementById('typing-effect').textContent = textArray[textIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(removeText, 100);
    } else {
        textIndex = (textIndex + 1) % textArray.length;
        setTimeout(typeText, 500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    typeText();
});

// Improved form handling
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Validate inputs
    if (name && email && subject && message) {
        // Send the data or handle it as needed
        console.log('Form submitted', { name, email, subject, message });
        // Optionally clear form
        this.reset();
    } else {
        alert('Please fill in all fields!');
    }
});

// Enhanced particle animations
particlesJS.load('particles-js', 'path/to/particles.json', function() {
    console.log('callback - particles.js config loaded');
});
