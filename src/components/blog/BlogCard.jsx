import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORY_COLORS, formatDate } from '../../data/blogPosts';
import styles from './BlogCard.module.css';

// Memoized category badge to avoid recalculating styles
const CategoryBadge = memo(function CategoryBadge({ category }) {
  const style = useMemo(() => ({
    backgroundColor: CATEGORY_COLORS[category]?.bg || '#f3f4f6',
    color: CATEGORY_COLORS[category]?.text || '#374151',
    borderColor: CATEGORY_COLORS[category]?.border || '#d1d5db',
  }), [category]);

  return (
    <span className={styles.categoryBadge} style={style}>
      {category}
    </span>
  );
});

function BlogCard({ post, featured = false }) {
  return (
    <article className={`${styles.card} ${featured ? styles.featured : ''}`}>
      <Link to={`/blog/${post.slug}`} className={styles.imageLink}>
        <div className={styles.imageWrapper}>
          <img
            src={post.heroImage}
            alt=""
            className={styles.image}
            loading="lazy"
          />
        </div>
      </Link>

      <div className={styles.content}>
        <div className={styles.categories}>
          {post.categories.map(category => (
            <CategoryBadge key={category} category={category} />
          ))}
        </div>

        <Link to={`/blog/${post.slug}`} className={styles.titleLink}>
          <h2 className={styles.title}>{post.title}</h2>
        </Link>

        <div className={styles.meta}>
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

        <p className={styles.excerpt}>{post.excerpt}</p>

        <Link to={`/blog/${post.slug}`} className={styles.readLink}>
          Read article
          <svg
            className={styles.arrow}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 12L10 8L6 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
}

// Export with memo to prevent re-renders when post data hasn't changed
export default memo(BlogCard);
