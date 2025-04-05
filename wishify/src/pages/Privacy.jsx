import React, { useState, useEffect } from "react";
import { FaGithub, FaGoogleDrive, FaArrowDown } from "react-icons/fa";
import { SiJira } from "react-icons/si";
import "../terms-tos.css";

const Privacy = () => {

  return (
    <section>
      <h1>Privacy Policy</h1>
      <p><strong>Effective Date:</strong> April 5th 2025</p>

      <p>
        Wishify ("we", "our", or "us") is committed to protecting your privacy. This
        Privacy Policy explains how we collect, use, and protect your personal
        information when you use our website and services.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li><strong>Email Address:</strong> Collected during account registration and used only for sending registration confirmation and password reset emails.</li>
        <li><strong>Wishlist Data:</strong> Includes item names, descriptions, quantities, prices, and links voluntarily provided by users.</li>
        <li><strong>Usage Logs:</strong> Basic technical logs (e.g. IP, time of access) may be collected for debugging or performance monitoring.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide and operate the Wishify platform</li>
        <li>Send essential emails (account registration and password recovery)</li>
        <li>Monitor and improve our service performance</li>
      </ul>
      <p>
        We may analyze anonymized wishlist data to gain insights about common trends or improve our service. This data is never linked to personally identifiable information.
      </p>

      <h2>3. Data Sharing</h2>
      <p>
        We do <strong>not</strong> sell, rent, or share your personal information with third parties for marketing purposes. Data may be shared only if:
      </p>
      <ul>
        <li>Required by law or legal process</li>
        <li>Necessary to protect the safety or rights of our users</li>
        <li>Handled by service providers who assist us in operating the site (e.g., email services)</li>
      </ul>

      <h2>4. Data Retention</h2>
      <p>
        We retain your data as long as your account is active or as needed to provide services. You may request deletion of your account at any time.
      </p>

      <h2>5. Security</h2>
      <p>
        We implement reasonable security measures to protect your data, including encryption in transit and secure password storage.
      </p>

      <h2>6. Your Rights</h2>
      <p>
        You may update, correct, or delete your personal data by logging into your account or contacting us directly at <a href="mailto:support@wishify.ca">support@wishify.ca</a>.
      </p>


      <h2>7. Third-Party Services</h2>
      <p>
        We may use third-party services providers to help us deliver essential services, such as email delivery or hosting providers.
        These services may process some limited user data on our behalf, under strict confidentiality and data protection agreements.
      </p>

      <h2>8. Cookies</h2>
      <p>
        Wishify may use cookies or similar technologies to enhance user experience, such as remembering your login session.
        You can control cookie behavior in your browser settings.
      </p>


      <h2>9. Affiliate Links</h2>
      <p>
        Wishify may include affiliate links to third-party retailers. If you click on one of these links and make a purchase, we may earn a small commission. These links do not affect your experience or the price you pay, and no personally identifiable information is shared with the retailers.
      </p>


      <h2>10. Children's Privacy</h2>
      <p>
        Wishify is not intended for children under the age of 13. We do not knowingly collect personal information from anyone under 13. If we become aware that we have collected such information, we will delete it promptly.
      </p>


      <h2>11. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. If we make significant changes, we will notify users via email or a notice on our website.
      </p>

      <h2>12. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@wishify.ca">support@wishify.ca</a>.
      </p>
    </section>

  );
};

export default Privacy;