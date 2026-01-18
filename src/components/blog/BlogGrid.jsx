import BlogCard from './BlogCard';
import styles from './BlogGrid.module.css';

export default function BlogGrid({ posts }) {
  if (posts.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No posts found in this category.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {posts.map((post, index) => (
        <BlogCard
          key={post.slug}
          post={post}
          featured={index === 0}
        />
      ))}
    </div>
  );
}
