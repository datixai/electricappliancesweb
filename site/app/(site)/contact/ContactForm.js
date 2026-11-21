"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

export default function ContactForm() {
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = form.elements;
    const fullName = fields.fullName.value.trim();
    const phone = fields.phone.value.trim();
    const phoneDigits = phone.replace(/\D/g, "").length;
    const message = fields.message.value.trim();

    fields.fullName.setCustomValidity(fullName ? "" : "Please enter your full name.");
    fields.phone.setCustomValidity(
      phoneDigits >= 7 && phoneDigits <= 15 ? "" : "Enter a phone number with 7 to 15 digits."
    );
    fields.message.setCustomValidity(message ? "" : "Please enter a message.");

    if (!form.checkValidity()) {
      const firstInvalid = form.querySelector(":invalid");
      setError(firstInvalid?.validationMessage || "Please complete the required fields.");
      firstInvalid?.focus();
      return;
    }

    setError("");
    const interest = fields.interest.value || "Not specified";
    const product = fields.productName.value.trim() || "Not specified";
    const body = [
      `Full Name: ${fullName}`,
      `Email Address: ${fields.email.value.trim()}`,
      `Phone Number: ${phone}`,
      `What are you interested in?: ${interest}`,
      `Product Name: ${product}`,
      "",
      "Message:",
      message,
    ].join("\n");
    const subject = encodeURIComponent(`Website inquiry: ${interest}`);
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form className="contact-form-card" onSubmit={handleSubmit} noValidate>
      <div className="contact-form-heading">
        <span className="section-kicker">Send a message</span>
        <h2>How can we help?</h2>
        <p>Complete the form and it will open a prefilled email for you to send.</p>
      </div>

      {error && <p className="contact-form-error" role="alert">{error}</p>}

      <div className="contact-form-fields">
        <label className="contact-field">
          <span>Full Name <b aria-hidden="true">*</b></span>
          <input name="fullName" type="text" autoComplete="name" placeholder="Your full name" required maxLength={120} />
        </label>

        <label className="contact-field">
          <span>Email Address <b aria-hidden="true">*</b></span>
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} />
        </label>

        <label className="contact-field">
          <span>Phone Number <b aria-hidden="true">*</b></span>
          <input name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+971 50 123 4567" required maxLength={24} />
        </label>

        <label className="contact-field">
          <span>What are you interested in?</span>
          <select name="interest" defaultValue="">
            <option value="">Select a topic</option>
            <option>Product Inquiry</option>
            <option>Bulk / Wholesale Inquiry</option>
            <option>Warranty &amp; Support</option>
            <option>General Inquiry</option>
          </select>
        </label>

        <label className="contact-field contact-field-wide">
          <span>Product Name <small>(optional)</small></span>
          <input name="productName" type="text" placeholder="Product you are asking about" maxLength={160} />
        </label>

        <label className="contact-field contact-field-wide">
          <span>Message <b aria-hidden="true">*</b></span>
          <textarea name="message" rows={5} placeholder="Tell us how we can help..." required maxLength={3000} />
        </label>
      </div>

      <button className="contact-submit" type="submit">Send Message</button>
    </form>
  );
}
