/**
 * form.js — Contact Form Logic, Validation, Submit States
 * Apdevlab — Premium Agency Website
 */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     1. CHIP TOGGLES
     ========================================================= */
  document.querySelectorAll('.chip-toggle').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      chip.setAttribute('aria-pressed', String(chip.classList.contains('active')));
    });
  });

  /* =========================================================
     2. FORM VALIDATION
     ========================================================= */
  function validateForm(formData) {
    const errors = {};

    const name    = (formData.get('name')    || '').trim();
    const email   = (formData.get('email')   || '').trim();
    const message = (formData.get('message') || '').trim();

    if (!name || name.length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!message || message.length < 20) {
      errors.message = 'Message must be at least 20 characters.';
    }

    return { valid: Object.keys(errors).length === 0, errors };
  }

  /* =========================================================
     3. INLINE ERROR DISPLAY
     ========================================================= */
  function clearErrors() {
    document.querySelectorAll('.form-line.error').forEach(el => {
      el.classList.remove('error');
      const errSpan = el.querySelector('.error-msg');
      if (errSpan) errSpan.remove();
    });
  }

  function showInlineErrors(errors) {
    let firstField = null;

    for (const [field, msg] of Object.entries(errors)) {
      const input = document.querySelector(`[name="${field}"]`);
      if (!input) continue;

      const formLine = input.closest('.form-line');
      if (formLine) {
        formLine.classList.add('error');

        if (!formLine.querySelector('.error-msg')) {
          const errSpan = document.createElement('span');
          errSpan.className = 'error-msg';
          errSpan.setAttribute('role', 'alert');
          errSpan.textContent = `// Error: ${msg}`;
          formLine.appendChild(errSpan);
        }
      }

      if (!firstField) firstField = input;
    }

    if (firstField) firstField.focus();
  }

  /* =========================================================
     4. SUBMIT HANDLER
     ========================================================= */
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn  = document.getElementById('submit-btn');
    const successMsg = document.getElementById('form-success');

    // Clear previous state
    clearErrors();
    if (successMsg) {
      successMsg.classList.add('hidden');
    }

    // Validate
    const formData = new FormData(e.target);
    const result   = validateForm(formData);

    if (!result.valid) {
      showInlineErrors(result.errors);
      return;
    }

    // --- State 1: Compiling ---
    submitBtn.textContent = '// compiling...';
    submitBtn.disabled    = true;
    submitBtn.classList.add('compiling');

    // Simulate 1.2s processing
    await new Promise(r => setTimeout(r, 1200));

    // --- State 2: Sent ---
    submitBtn.textContent = '✓ Message compiled & sent';
    submitBtn.classList.remove('compiling');
    submitBtn.classList.add('sent');
    submitBtn.disabled = false;

    // Show success message
    if (successMsg) {
      successMsg.classList.remove('hidden');
      // Trigger transition
      requestAnimationFrame(() => {
        successMsg.style.opacity = '1';
      });
    }

    // Reset form after a bit
    setTimeout(() => {
      e.target.reset();
      document.querySelectorAll('.chip-toggle.active').forEach(ch => {
        ch.classList.remove('active');
        ch.setAttribute('aria-pressed', 'false');
      });
    }, 1000);
  });
});
