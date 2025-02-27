var recaptchaResponses = {};

function verifyCaptcha(token, formId) {
    recaptchaResponses[formId] = token;
    document.getElementById(`${formId}-status`).innerHTML = '';
}

document.addEventListener('DOMContentLoaded', function () {
    const forms = document.querySelectorAll('.contact-form');

    forms.forEach((form) => {
        const formId = form.getAttribute('id');
        const statusElement = document.getElementById(`${formId}-status`);
        const thankYouMessage = document.getElementById(`${formId}-thank-you`);

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            if (!validateForm(form)) return;

            statusElement.innerHTML = "Sending...";
            statusElement.style.display = "block";

            const formData = new FormData(form);
            const formDataObject = {};
            formData.forEach((value, key) => {
                formDataObject[key] = value;
            });

            console.log("Form Data:", formDataObject);

            window.dataLayer = window.dataLayer || [];
            dataLayer.push({ 'event': 'form_submit', 'form_data': formDataObject });

            if (typeof fbq !== "undefined") {
                fbq('track', 'Lead', formDataObject);
            }

            setTimeout(() => {
                statusElement.style.display = "none";
                thankYouMessage.style.display = "block";
                form.reset();
                grecaptcha.reset();
            }, 1000);
        });
    });
});

function validateForm(form) {
    const formId = form.getAttribute('id');
    const statusElement = document.getElementById(`${formId}-status`);

    function setError(message) {
        statusElement.innerHTML = `<span style="color:red;">${message}</span>`;
        return false;
    }

    let name = form.querySelector('.name').value.trim();
    if (!name || name.length < 3 || !/^[a-zA-Z\s]+$/.test(name)) {
        return setError("Enter a valid name (at least 3 characters)!");
    }

    let phone = form.querySelector('.phone-number').value.trim();
    if (!/^\d{10}$/.test(phone)) {
        return setError("Enter a valid 10-digit phone number!");
    }

    let email = form.querySelector('.email').value.trim();
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return setError("Enter a valid email!");
    }

    let city = form.querySelector('.city').value.trim();
    if (!city || city.length < 3 || !/^[a-zA-Z\s]+$/.test(city)) {
        return setError("Enter a valid city name!");
    }

    let hiddenField = form.querySelector(".connects").value;
    if (hiddenField !== "") {
        return setError("Please verify the CAPTCHA!");
    }

    if (!grecaptcha.getResponse()) {
        return setError("Please complete the reCAPTCHA!");
    }

    return true;
}