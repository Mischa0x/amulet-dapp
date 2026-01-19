import { useParams, Link, Navigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { getPostBySlug, formatDate, CATEGORY_COLORS } from '../../data/blogPosts';
import SubscribeBlock from '../../components/blog/SubscribeBlock';
import styles from './BlogPostPage.module.css';

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  // 404 for unknown slugs
  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className={styles.page}>
      <article className={styles.article}>
        <div className={styles.container}>
          {/* Back link */}
          <Link to="/blog" className={styles.backLink}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Blog
          </Link>

          {/* Header */}
          <header className={styles.header}>
            <div className={styles.categories}>
              {post.categories.map(category => (
                <Link
                  key={category}
                  to={`/blog?category=${category}`}
                  className={styles.categoryBadge}
                  style={{
                    backgroundColor: CATEGORY_COLORS[category]?.bg || '#f3f4f6',
                    color: CATEGORY_COLORS[category]?.text || '#374151',
                    borderColor: CATEGORY_COLORS[category]?.border || '#d1d5db',
                  }}
                >
                  {category}
                </Link>
              ))}
            </div>

            <h1 className={styles.title}>{post.title}</h1>

            <div className={styles.meta}>
              {post.author && (
                <>
                  <span className={styles.author}>{post.author}</span>
                  <span className={styles.separator}>·</span>
                </>
              )}
              <time dateTime={post.publishedAt} className={styles.date}>
                {formatDate(post.publishedAt)}
              </time>
              {post.readingTime && (
                <>
                  <span className={styles.separator}>·</span>
                  <span className={styles.readingTime}>{post.readingTime}</span>
                </>
              )}
            </div>
          </header>

          {/* Hero Image */}
          <div className={styles.heroWrapper}>
            <img
              src={post.heroImage}
              alt=""
              className={styles.heroImage}
            />
          </div>

          {/* Content - sanitized to prevent XSS */}
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />

          {/* Share section */}
          <div className={styles.shareSection}>
            <span className={styles.shareLabel}>Share this article</span>
            <div className={styles.shareButtons}>
              <button
                type="button"
                className={styles.shareButton}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
                aria-label="Copy link"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.33333 10.8333C8.69119 11.3118 9.14779 11.7077 9.67221 11.9942C10.1966 12.2807 10.7764 12.4509 11.3722 12.4936C11.9681 12.5363 12.566 12.4503 13.1252 12.2415C13.6845 12.0327 14.1917 11.706 14.6125 11.2833L17.1125 8.78333C17.8726 7.99749 18.2924 6.94499 18.2836 5.85249C18.2747 4.75999 17.8379 3.71449 17.0652 2.94178C16.2925 2.16907 15.247 1.73228 14.1545 1.72343C13.062 1.71458 12.0095 2.13441 11.2236 2.89458L9.79167 4.31666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11.6667 9.16665C11.3088 8.68821 10.8522 8.29227 10.3278 8.00578C9.80339 7.71929 9.22358 7.54905 8.62775 7.50637C8.03191 7.46369 7.43399 7.54969 6.87476 7.75849C6.31552 7.9673 5.80834 8.29398 5.3875 8.71665L2.8875 11.2166C2.12733 12.0025 1.70751 13.055 1.71636 14.1475C1.72521 15.24 2.162 16.2855 2.93471 17.0582C3.70742 17.8309 4.75292 18.2677 5.84542 18.2765C6.93792 18.2854 7.99041 17.8656 8.77625 17.1054L10.2 15.6833" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Copy link
              </button>
            </div>
          </div>
        </div>

        {/* Subscribe */}
        <div className={styles.subscribeWrapper}>
          <SubscribeBlock />
        </div>
      </article>
    </div>
  );
}
