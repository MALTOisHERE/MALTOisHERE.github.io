document.getElementById('myForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const statusElement = document.querySelector('.form-status');
  const messageElement = statusElement.querySelector('.message');
  const iconElement = statusElement.querySelector('.icon');
  const closeButton = statusElement.querySelector('.form-status-close');

  let notificationTimeout;

  const hideStatus = () => {
    statusElement.classList.remove('active', 'success', 'error');
    clearTimeout(notificationTimeout);
  };

  closeButton.onclick = hideStatus;

  const showStatus = (message, isError = false) => {
    messageElement.textContent = message;

    statusElement.classList.remove('success', 'error');

    if (isError) {
      statusElement.classList.add('error');
      iconElement.className = 'icon fas fa-times-circle';
    } else {
      statusElement.classList.add('success');
      iconElement.className = 'icon fas fa-check-circle';
    }

    statusElement.classList.add('active');

    clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(hideStatus, 5000);
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
