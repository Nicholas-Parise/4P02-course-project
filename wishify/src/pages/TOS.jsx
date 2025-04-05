import React, { useState, useEffect } from "react";
import { FaGithub, FaGoogleDrive, FaArrowDown } from "react-icons/fa";
import { SiJira } from "react-icons/si";
import styles from "../terms-tos.module.css";

const TOS = () => {

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>Terms of Service</h1>
      <p className={styles.paragraph}><strong>Effective Date:</strong> April 5th 2025</p>

      <p className={styles.paragraph}>
        These Terms of Service ("Terms") govern your use of Wishify ("we", "us", or
        "our"). By accessing or using our website, you agree to be bound by these
        Terms.
      </p>

      <h2 className={styles.subheading}>1. Service Overview</h2>
      <p className={styles.paragraph}>
        Wishify helps users create and share wishlists for gifts or group events. It
        aims to reduce duplicate purchases and simplify coordination.
      </p>

      <h2 className={styles.subheading}>2. Account Registration</h2>
      <p className={styles.paragraph}>
        You must register an account to use key features. You agree to provide
        accurate information and keep your account credentials secure.
      </p>

      <h2 className={styles.subheading}>3. Email Usage</h2>
      <p className={styles.paragraph}>
        We only use your email to send essential communication related to:
      </p>
      <ul className={styles.list}>
        <li className={styles.listItem}>Account creation</li>
        <li className={styles.listItem}>Password reset</li>
      </ul>
      <p className={styles.paragraph}>No marketing emails will be sent.</p>

      <h2 className={styles.subheading}>4. User Responsibilities</h2>
      <ul className={styles.list}>
        <li className={styles.listItem}>Use Wishify lawfully and respectfully</li>
        <li className={styles.listItem}>Do not abuse or attempt unauthorized access</li>
        <li className={styles.listItem}>Ensure wishlist content is appropriate</li>
      </ul>

      <h2 className={styles.subheading}>5. Features and Usage</h2>
      <p className={styles.paragraph}>Features include:</p>
      <ul className={styles.list}>
        <li className={styles.listItem}>Wishlist creation and sharing</li>
        <li className={styles.listItem}>Marking items as purchased</li>
        <li className={styles.listItem}>Managing item quantities</li>
        <li className={styles.listItem}>Blind wishlist participation and notifications</li>
      </ul>

      <h2 className={styles.subheading}>6. User Content</h2>
      <p className={styles.paragraph}>
        You agree not to upload, share, or create content that is unlawful, offensive, abusive, or infringes on the intellectual property rights of others. We reserve the right to remove such content and suspend offending accounts.
      </p>


      <h2 className={styles.subheading}>7. Content Ownership</h2>
      <p className={styles.paragraph}>
        You retain rights to content you create (e.g., wishlists). You grant us
        permission to display and store this content to provide the service.
      </p>

      <h2 className={styles.subheading}>8. Termination</h2>
      <p className={styles.paragraph}>
        You may delete your account anytime. We reserve the right to suspend or
        terminate accounts for violations of these Terms.
      </p>

      <h2 className={styles.subheading}>9. Disclaimer</h2>
      <p className={styles.paragraph}>
        Wishify is provided "as is". We are not liable for errors in item listings,
        duplicate purchases, or issues from third-party links.
      </p>

      <h2 className={styles.subheading}>10. Limitation of Liability</h2>
      <p className={styles.paragraph}>
        To the extent permitted by law, we are not liable for indirect, incidental,
        or consequential damages arising from use of the platform.
      </p>

      <h2 className={styles.subheading}>11. Use of Anonymized Data</h2>
      <p className={styles.paragraph}>
        Wishify may use anonymized wishlist data to analyze trends and improve our services. This information is used in aggregate form and is never associated with individual users.
      </p>


      <h2 className={styles.subheading}>12. Third-Party Links</h2>
      <p className={styles.paragraph}>
        Wishify wishlists may contain links to third-party websites. We are not responsible for the content, availability, or practices of these external sites. Use them at your own discretion.
      </p>


      <h2 className={styles.subheading}>13. Affiliate Disclosure</h2>
      <p className={styles.paragraph}>
        Some of the links to products on Wishify may be affiliate links. This means that if you click a link and make a purchase, Wishify may receive a small commission at no extra cost to you. These commissions help support the ongoing development and maintenance of the platform.
      </p>


      <h2 className={styles.subheading}>14. Changes to These Terms</h2>
      <p className={styles.paragraph}>
        We may update these Terms. Significant changes will be communicated to
        users.
      </p>


      <h2 className={styles.subheading}>15. Governing Law</h2>
      <p className={styles.paragraph}>
        These Terms are governed by and construed in accordance with the laws of Canada, without regard to its conflict of law provisions.
      </p>


      <h2 className={styles.subheading}>16. Contact Us</h2>
      <p className={styles.paragraph}>
        If you have questions about these Terms, contact us at <a className={styles.link} href="mailto:support@wishify.ca">support@wishify.ca</a>.
      </p>
    </section>
  );
};

export default TOS;