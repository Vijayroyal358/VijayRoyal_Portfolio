document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
  
    // Google Form URL
    const googleFormURL = 'https://docs.google.com/forms/d/e/1FAIpQLSdhNg9y9HwvpJ4A1TtJsceXiQ715-AH15RvEoCtRT4Ht5A4ww/formResponse';
  
    // Google Form field IDs (replace with your form's field IDs)
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
        document.getElementById('responseMessage').textContent = 'Thank you! Your message has been sent.';
        document.getElementById('responseMessage').style.color = '#4CAF50'; // Green color
        document.getElementById('contactForm').reset(); // Clear the form
      })
      .catch(() => {
        // Show error message
        document.getElementById('responseMessage').textContent = 'Oops! Something went wrong. Please try again.';
        document.getElementById('responseMessage').style.color = '#FF0000'; // Red color
      });
  });

  function doPost(e) {
    const data = JSON.parse(e.postData.contents);
    const { name, email, message } = data;
  
    MailApp.sendEmail({
      to: 'vijayroyal358@gmail.com',
      subject: 'New Contact Form Submission',
      body: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    });
  
    return ContentService.createTextOutput('Email sent successfully.');
  }