import React from 'react'
import { ArrowRight } from 'lucide-react'
import { MARKET_CATEGORIES } from '../data/marketData.js'

export function CategoryCarousel({
  selectedCategory = 'all',
  onSelectCategory,
  language = 'English'
}) {
  const getSectionTitle = () => {
    if (language === 'Hindi') return 'Shop by Category'
    if (language === 'Bangla') return 'Shop by Category'
    if (language === 'Marathi') return 'Shop by Category'
    return 'Shop by Category'
  }

  const getCategoryLabel = (cat) => {
    if (language === 'Hindi' && cat.labelHi) return cat.labelHi
    if (language === 'Bangla' && cat.labelBn) return cat.labelBn
    if (language === 'Marathi' && cat.labelMr) return cat.labelMr
    return cat.label
  }

  // Visual styling colors for category app icons
  const getCatStyle = (id) => {
    switch (id) {
      case 'seeds':
        return { icon: '🌱', bg: '#dcfce7', color: '#15803d' }
      case 'nutrition':
        return { icon: '🧪', bg: '#ffedd5', color: '#c2410c' }
      case 'crop_care':
        return { icon: '🌾', bg: '#ecfdf5', color: '#047857' }
      case 'tools':
        return { icon: '🛠️', bg: '#e0f2fe', color: '#0369a1' }
      case 'machinery':
        return { icon: '🚜', bg: '#dcfce7', color: '#166534' }
      case 'irrigation':
        return { icon: '💧', bg: '#eff6ff', color: '#1d4ed8' }
      case 'smart_farming':
        return { icon: '📡', bg: '#e0e7ff', color: '#4338ca' }
      case 'organic':
        return { icon: '🌿', bg: '#f0fdf4', color: '#15803d' }
      case 'accessories':
        return { icon: '🧰', bg: '#fef3c7', color: '#b45309' }
      default:
        return { icon: '🌟', bg: '#f1f5f9', color: '#475569' }
    }
  }

  return (
    <section className="fd-market-category-section" aria-label="Product Categories">
      <div className="fd-market-section-title-row">
        <h3 className="fd-market-section-heading">
          {getSectionTitle()}
        </h3>
        <button
          type="button"
          className="fd-market-see-all-btn"
          onClick={() => onSelectCategory('all')}
        >
          <span>See all</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Modern 2-row category grid matching Screen 1 */}
      <div className="fd-category-icon-grid" role="tablist">
        {MARKET_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id
          const style = getCatStyle(cat.id)
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`fd-category-tile ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <div
                className="fd-category-tile-icon"
                style={{ backgroundColor: style.bg, color: style.color }}
              >
                {style.icon}
              </div>
              <span className="fd-category-tile-label">
                {getCategoryLabel(cat)}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default CategoryCarousel
