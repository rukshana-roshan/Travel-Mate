/* ==========================================================================
   TRAVEL MATE — Contact Form Page Logic
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const nameInput = document.getElementById("contactName");
  const emailInput = document.getElementById("contactEmail");
  const subjectInput = document.getElementById("contactSubject");
  const msgInput = document.getElementById("contactMessage");
  const submitBtn = document.getElementById("contactSubmitBtn");
  const successAlert = document.getElementById("contactSuccessAlert");
  const errorAlert = document.getElementById("contactErrorAlert");
  const successMsg = document.getElementById("contactSuccessMsg");
  const errorMsg = document.getElementById("contactErrorMsg");

  // Autofill name/email if user is logged in
  const session = tmGetSession();
  if (session) {
    if (nameInput && !nameInput.value) nameInput.value = session.fullName || "";
    if (emailInput && !emailInput.value) emailInput.value = session.email || "";
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function setFieldState(field, isValid) {
    if (isValid) {
      field.classList.remove("is-invalid");
      field.classList.add("is-valid");
    } else {
      field.classList.remove("is-valid");
      field.classList.add("is-invalid");
    }
  }

  // Live input validation feedback
  nameInput.addEventListener("input", () => {
    setFieldState(nameInput, nameInput.value.trim().length >= 2);
  });

  emailInput.addEventListener("input", () => {
    setFieldState(emailInput, validateEmail(emailInput.value.trim()));
  });

  subjectInput.addEventListener("input", () => {
    setFieldState(subjectInput, subjectInput.value.trim().length >= 3);
  });

  msgInput.addEventListener("input", () => {
    setFieldState(msgInput, msgInput.value.trim().length >= 10);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Hide any previous alerts
    successAlert.classList.add("d-none");
    errorAlert.classList.add("d-none");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = msgInput.value.trim();

    let valid = true;

    if (name.length < 2) {
      setFieldState(nameInput, false);
      valid = false;
    } else {
      setFieldState(nameInput, true);
    }

    if (!validateEmail(email)) {
      setFieldState(emailInput, false);
      valid = false;
    } else {
      setFieldState(emailInput, true);
    }

    if (subject.length < 3) {
      setFieldState(subjectInput, false);
      valid = false;
    } else {
      setFieldState(subjectInput, true);
    }

    if (message.length < 10) {
      setFieldState(msgInput, false);
      valid = false;
    } else {
      setFieldState(msgInput, true);
    }

    if (!valid) {
      errorMsg.textContent = "Please correct the highlighted fields before sending.";
      errorAlert.classList.remove("d-none");
      return;
    }

    // Submit payload
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Submitting message...`;
    submitBtn.disabled = true;

    const dto = { name, email, subject, message };

    try {
      const resp = await TM_API.submitContact(dto);
      successMsg.textContent =
        (resp && resp.message) ||
        "Thank you! Your message has been received and saved securely in our database.";
      successAlert.classList.remove("d-none");

      // Reset form fields
      form.reset();
      [nameInput, emailInput, subjectInput, msgInput].forEach((el) => {
        el.classList.remove("is-valid");
        el.classList.remove("is-invalid");
      });

      tmToast("Message sent successfully!", "success");
      successAlert.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (err) {
      console.error("Contact submission error:", err);
      errorMsg.textContent =
        err.message || "Failed to submit message. Please ensure the backend server is running.";
      errorAlert.classList.remove("d-none");
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
});
