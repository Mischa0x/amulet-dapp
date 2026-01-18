import { useSearchParams, Link } from 'react-router-dom';
import { blogPosts, getPostsByCategory } from '../../data/blogPosts';
import CategoryPills from '../../components/blog/CategoryPills';
import BlogGrid from '../../components/blog/BlogGrid';
import SubscribeBlock from '../../components/blog/SubscribeBlock';
import styles from './BlogPage.module.css';

export default function BlogPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'All';
  const filteredPosts = getPostsByCategory(category);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <Link to="/" className={styles.backLink}>
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
            Home
          </Link>
          <h1 className={styles.title}>Blog</h1>
          <p className={styles.subtitle}>
            Research, product updates, and experiments across AI + longevity.
          </p>
        </header>

        {/* Category Filter */}
        <CategoryPills />

        {/* Results count */}
        <div className={styles.resultsInfo}>
          <span className={styles.resultsCount}>
            {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
            {category !== 'All' && ` in ${category}`}
          </span>
        </div>

        {/* Blog Grid */}
        <BlogGrid posts={filteredPosts} />

        {/* Subscribe Block */}
        <SubscribeBlock />
      </div>
    </div>
  );
}
