import React, { useState, useEffect } from "react";
import { FaGithub, FaGoogleDrive, FaArrowDown } from "react-icons/fa";
import { SiJira } from "react-icons/si";
import styles from "../terms-tos.module.css";

const Privacy = () => {

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>Privacy Policy</h1>
      <p className={styles.paragraph}><strong>Effective Date:</strong> April 5th 2025</p>

      <p className={styles.paragraph}>
        Wishify ("we", "our", or "us") is committed to protecting your privacy. This
        Privacy Policy explains how we collect, use, and protect your personal
        information when you use our website and services.
      </p>

      <h2 className={styles.subheading}>1. Information We Collect</h2>
      <ul className={styles.list}>
        <li className={styles.listItem}><strong>Email Address:</strong> Collected during account registration and used only for sending registration confirmation and password reset emails.</li>
        <li className={styles.listItem}><strong>Wishlist Data:</strong> Includes item names, descriptions, quantities, prices, and links voluntarily provided by users.</li>
        <li className={styles.listItem}><strong>Usage Logs:</strong> Basic technical logs (e.g. IP, time of access) may be collected for debugging or performance monitoring.</li>
      </ul>

      <h2 className={styles.subheading}>2. How We Use Your Information</h2>
      <p className={styles.paragraph}>We use the information we collect to:</p>
      <ul className={styles.list}>
        <li className={styles.listItem}>Provide and operate the Wishify platform</li>
        <li className={styles.listItem}>Send essential emails (account registration and password recovery)</li>
        <li className={styles.listItem}>Monitor and improve our service performance</li>
      </ul>
      <p className={styles.paragraph}>
        We may analyze anonymized wishlist data to gain insights about common trends or improve our service. This data is never linked to personally identifiable information.
      </p>

      <h2 className={styles.subheading}>3. Data Sharing</h2>
      <p className={styles.paragraph}>
        We do <strong>not</strong> sell, rent, or share your personal information with third parties for marketing purposes. Data may be shared only if:
      </p>
      <ul className={styles.list}>
        <li className={styles.listItem}>Required by law or legal process</li>
        <li className={styles.listItem}>Necessary to protect the safety or rights of our users</li>
        <li className={styles.listItem}>Handled by service providers who assist us in operating the site (e.g., email services)</li>
      </ul>

      <h2 className={styles.subheading}>4. Data Retention</h2>
      <p className={styles.paragraph}>
        We retain your data as long as your account is active or as needed to provide services. You may request deletion of your account at any time.
      </p>

      <h2 className={styles.subheading}>5. Security</h2>
      <p className={styles.paragraph}>
        We implement reasonable security measures to protect your data, including encryption in transit and secure password storage.
      </p>

      <h2 className={styles.subheading}>6. Your Rights</h2>
      <p className={styles.paragraph}>
        You may update, correct, or delete your personal data by logging into your account or contacting us directly at <a className={styles.link} href="mailto:support@wishify.ca">support@wishify.ca</a>.
      </p>


      <h2 className={styles.subheading}>7. Third-Party Services</h2>
      <p className={styles.paragraph}>
        We may use third-party services providers to help us deliver essential services, such as email delivery or hosting providers.
        These services may process some limited user data on our behalf, under strict confidentiality and data protection agreements.
      </p>

      <h2 className={styles.subheading}>8. Cookies</h2>
      <p className={styles.paragraph}>
        Wishify may use cookies or similar technologies to enhance user experience, such as remembering your login session.
        You can control cookie behavior in your browser settings.
      </p>


      <h2 className={styles.subheading}>9. Affiliate Links</h2>
      <p className={styles.paragraph}>
        Wishify may include affiliate links to third-party retailers. If you click on one of these links and make a purchase, we may earn a small commission. These links do not affect your experience or the price you pay, and no personally identifiable information is shared with the retailers.
      </p>


      <h2 className={styles.subheading}>10. Children's Privacy</h2>
      <p className={styles.paragraph}>
        Wishify is not intended for children under the age of 13. We do not knowingly collect personal information from anyone under 13. If we become aware that we have collected such information, we will delete it promptly.
      </p>


      <h2 className={styles.subheading}>11. Changes to This Policy</h2>
      <p className={styles.paragraph}>
        We may update this Privacy Policy from time to time. If we make significant changes, we will notify users via email or a notice on our website.
      </p>

      <h2 className={styles.subheading}>12. Contact Us</h2>
      <p className={styles.paragraph}>
        If you have any questions about this Privacy Policy, please contact us at <a className={styles.link} href="mailto:support@wishify.ca">support@wishify.ca</a>.
      </p>
    </section>

  );
};

export default Privacy;