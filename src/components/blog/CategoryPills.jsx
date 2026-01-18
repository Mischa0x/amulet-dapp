import { useSearchParams } from 'react-router-dom';
import { CATEGORIES } from '../../data/blogPosts';
import styles from './CategoryPills.module.css';

export default function CategoryPills() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';

  const handleCategoryClick = (category) => {
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const handleKeyDown = (e, category) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCategoryClick(category);
    }
  };

  const allCategories = ['All', ...CATEGORIES];

  return (
    <nav className={styles.pillsContainer} aria-label="Filter posts by category">
      <div className={styles.pillsScroll}>
        {allCategories.map(category => {
          const isActive = category === activeCategory;
          return (
            <button
              key={category}
              type="button"
              className={`${styles.pill} ${isActive ? styles.active : ''}`}
              onClick={() => handleCategoryClick(category)}
              onKeyDown={(e) => handleKeyDown(e, category)}
              aria-pressed={isActive}
              aria-label={`Filter by ${category}`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
