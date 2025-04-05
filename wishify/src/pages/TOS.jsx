import React, { useState, useEffect } from "react";
import { FaGithub, FaGoogleDrive, FaArrowDown } from "react-icons/fa";
import { SiJira } from "react-icons/si";
import "../terms-tos.css";

const TOS = () => {

  return (
    <section>
      <h1>Terms of Service</h1>
      <p><strong>Effective Date:</strong> April 5th 2025</p>

      <p>
        These Terms of Service ("Terms") govern your use of Wishify ("we", "us", or
        "our"). By accessing or using our website, you agree to be bound by these
        Terms.
      </p>

      <h2>1. Service Overview</h2>
      <p>
        Wishify helps users create and share wishlists for gifts or group events. It
        aims to reduce duplicate purchases and simplify coordination.
      </p>

      <h2>2. Account Registration</h2>
      <p>
        You must register an account to use key features. You agree to provide
        accurate information and keep your account credentials secure.
      </p>

      <h2>3. Email Usage</h2>
      <p>
        We only use your email to send essential communication related to:
      </p>
      <ul>
        <li>Account creation</li>
        <li>Password reset</li>
      </ul>
      <p>No marketing emails will be sent.</p>

      <h2>4. User Responsibilities</h2>
      <ul>
        <li>Use Wishify lawfully and respectfully</li>
        <li>Do not abuse or attempt unauthorized access</li>
        <li>Ensure wishlist content is appropriate</li>
      </ul>

      <h2>5. Features and Usage</h2>
      <p>Features include:</p>
      <ul>
        <li>Wishlist creation and sharing</li>
        <li>Marking items as purchased</li>
        <li>Managing item quantities</li>
        <li>Blind wishlist participation and notifications</li>
      </ul>

      <h2>6. User Content</h2>
      <p>
        You agree not to upload, share, or create content that is unlawful, offensive, abusive, or infringes on the intellectual property rights of others. We reserve the right to remove such content and suspend offending accounts.
      </p>


      <h2>7. Content Ownership</h2>
      <p>
        You retain rights to content you create (e.g., wishlists). You grant us
        permission to display and store this content to provide the service.
      </p>

      <h2>8. Termination</h2>
      <p>
        You may delete your account anytime. We reserve the right to suspend or
        terminate accounts for violations of these Terms.
      </p>

      <h2>9. Disclaimer</h2>
      <p>
        Wishify is provided "as is". We are not liable for errors in item listings,
        duplicate purchases, or issues from third-party links.
      </p>

      <h2>10. Limitation of Liability</h2>
      <p>
        To the extent permitted by law, we are not liable for indirect, incidental,
        or consequential damages arising from use of the platform.
      </p>

      <h2>11. Use of Anonymized Data</h2>
      <p>
        Wishify may use anonymized wishlist data to analyze trends and improve our services. This information is used in aggregate form and is never associated with individual users.
      </p>


      <h2>12. Third-Party Links</h2>
      <p>
        Wishify wishlists may contain links to third-party websites. We are not responsible for the content, availability, or practices of these external sites. Use them at your own discretion.
      </p>


      <h2>13. Affiliate Disclosure</h2>
      <p>
        Some of the links to products on Wishify may be affiliate links. This means that if you click a link and make a purchase, Wishify may receive a small commission at no extra cost to you. These commissions help support the ongoing development and maintenance of the platform.
      </p>


      <h2>14. Changes to These Terms</h2>
      <p>
        We may update these Terms. Significant changes will be communicated to
        users.
      </p>


      <h2>15. Governing Law</h2>
      <p>
        These Terms are governed by and construed in accordance with the laws of Canada, without regard to its conflict of law provisions.
      </p>


      <h2>16. Contact Us</h2>
      <p>
        If you have questions about these Terms, contact us at <a href="mailto:support@wishify.ca">support@wishify.ca</a>.
      </p>
    </section>
  );
};

export default TOS;