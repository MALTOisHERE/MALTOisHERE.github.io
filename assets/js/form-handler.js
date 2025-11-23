document.getElementById('myForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const statusElement = document.querySelector('.form-status');
  const messageElement = statusElement.querySelector('.status-message');
  const closeButton = statusElement.querySelector('.form-status-close');

  closeButton.onclick = () => {
    statusElement.classList.remove('active');
  };

  const captchaResponse = grecaptcha.getResponse();
  if (!captchaResponse) {
    messageElement.textContent = 'Please complete the CAPTCHA.';
    statusElement.style.color = 'var(--bittersweet-shimmer)';
    statusElement.classList.add('active');
    setTimeout(() => statusElement.classList.remove('active'), 5000);
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
      messageElement.textContent = 'Message sent successfully!';
      statusElement.style.color = '#61cf5a';
      statusElement.classList.add('active');
      form.reset();
      grecaptcha.reset();

      setTimeout(() => {
        statusElement.classList.remove('active');
      }, 5000);
    } else {
      throw new Error('Failed to send message');
    }
  } catch (error) {
    messageElement.textContent = `Error: ${error.message}`;
    statusElement.style.color = 'var(--bittersweet-shimmer)';
    statusElement.classList.add('active');

    setTimeout(() => {
      statusElement.classList.remove('active');
    }, 5000);
  }
});
