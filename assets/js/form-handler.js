document.getElementById('myForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const statusElement = document.querySelector('.form-status');
  const messageElement = statusElement.querySelector('.status-message');
  const closeButton = statusElement.querySelector('.form-status-close');

  const hideStatus = () => {
    statusElement.classList.remove('active', 'success', 'error');
  };

  closeButton.onclick = hideStatus;

  const showStatus = (message, isError = false) => {
    messageElement.textContent = message;
    statusElement.classList.add('active');
    statusElement.classList.toggle('success', !isError);
    statusElement.classList.toggle('error', isError);
    setTimeout(hideStatus, 5000);
  };

  const captchaResponse = grecaptcha.getResponse();
  if (!captchaResponse) {
    showStatus('Please complete the CAPTCHA.', true);
    return;
  }

  try {
    const formData = new FormData(form);
    formData.append('g-recaptcha-response', captchaResponse);

    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      showStatus('Message sent successfully!');
      form.reset();
      grecaptcha.reset();
    } else {
      throw new Error('Failed to send message');
    }
  } catch (error) {
    showStatus(`Error: ${error.message}`, true);
  }
});
