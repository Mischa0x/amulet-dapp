import { useState } from 'react';
import styles from './SubscribeBlock.module.css';

export default function SubscribeBlock() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('submitting');

    // Simulate API call - replace with actual subscription logic
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      // Reset after a few seconds
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <section className={styles.container} aria-labelledby="subscribe-heading">
      <div className={styles.content}>
        <div className={styles.text}>
          <h2 id="subscribe-heading" className={styles.heading}>
            Get updates
          </h2>
          <p className={styles.subtext}>
            Monthly notes on AI x longevity and product releases.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              aria-label="Email address"
              disabled={status === 'submitting'}
              required
            />
            <button
              type="submit"
              className={styles.button}
              disabled={status === 'submitting' || !email}
            >
              {status === 'submitting' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>

          {status === 'success' && (
            <p className={styles.successMessage} role="status">
              Thanks for subscribing! Check your email for confirmation.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
