import styles from './Footer.module.css';
import { FaGithub, FaGoogleDrive } from "react-icons/fa";
import { SiJira } from "react-icons/si";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.logo}>Wishify</div>
        <ul className={styles.links}>
          <li><a href="/login">Login</a></li>
          <li><a href="/register">Register</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/landing">Landing</a></li>
          <li><a href="/privacy-policy">Privacy</a></li>
          <li><a href="/terms-of-service">Terms</a></li>
          <li><a href="/status">Status</a></li>
          <li><a href="/profile">Profile</a></li>
          <li><a href="/ideas">Ideas</a></li>
          <li><a href="/wishlists">Wishlists</a></li>
          <li><a href="/events">Events</a></li>
          <li><a href="/home">Home</a></li>
          <li><a href="mailto:support@wishify.com">Contact</a></li>
        </ul>
        
        <div className={styles.social}>
          <a href="https://github.com/Nicholas-Parise/4P02-course-project" target="_blank" rel="noopener noreferrer">
            <FaGithub className={styles.icon} />
          </a>
          <a href="https://nicholasparise.atlassian.net/jira/software/projects/COSC/summary" target="_blank" rel="noopener noreferrer">
            <SiJira className={styles.icon} />
          </a>
          <a href="https://drive.google.com/drive/folders/1H5uFw_031SYkvf21KdLdkOzGt67i78vZ" target="_blank" rel="noopener noreferrer">
            <FaGoogleDrive className={styles.icon} />
          </a>
        </div>
        
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} Wishify Inc.
        </p>
      </div>
    </footer>
  );
}