import styles from './Footer.module.css';

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
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} Wishify Inc.
        </p>
      </div>
    </footer>
  );
}
