document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Get form data
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  // Google Form URL (Your existing one)
  const googleFormURL = 'https://docs.google.com/forms/d/e/1FAIpQLSdhNg9y9HwvpJ4A1TtJsceXiQ715-AH15RvEoCtRT4Ht5A4ww/formResponse';

  // Google Form field IDs
  const formData = new FormData();
  formData.append('entry.115989335', name);
  formData.append('entry.575908722', email);
  formData.append('entry.622912', message);

  // Submit to Google Forms
  fetch(googleFormURL, {
    method: 'POST',
    body: formData,
    mode: 'no-cors'
  })
  .then(() => {
    // Show success message
    const responseMsg = document.getElementById('responseMessage');
    responseMsg.textContent = 'Thank you! Your message has been sent.';
    responseMsg.style.color = 'var(--gold)';
    document.getElementById('contactForm').reset();
  })
  .catch(() => {
    // Show error message
    const responseMsg = document.getElementById('responseMessage');
    responseMsg.textContent = 'Oops! Something went wrong. Please try again.';
    responseMsg.style.color = '#FF4444';
  });
});