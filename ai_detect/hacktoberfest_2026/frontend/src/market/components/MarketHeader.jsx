import React from 'react'
import { MapPin, ChevronRight, SlidersHorizontal, ArrowLeft, Bell, ShoppingBag } from 'lucide-react'

export function MarketHeader({
  t = {},
  language = 'English',
  locationName = '',
  onOpenLocation,
  onOpenFilter,
  activeFilterCount = 0,
  selectedCategory = 'all',
  onResetCategory
}) {
  const getSubtitle = () => {
    if (language === 'Hindi') return 'Everything you need for smarter farming'
    if (language === 'Bangla') return 'Everything you need for smarter farming'
    if (language === 'Marathi') return 'Everything you need for smarter farming'
    return 'Everything you need for smarter farming'
  }

  const displayLocation = locationName || 'Karimpur, South 24 Parganas'

  return (
    <header className="fd-market-header">
      <div className="fd-market-header-top">
        <div className="fd-market-title-area">
          {selectedCategory !== 'all' ? (
            <button
              type="button"
              className="fd-market-back-cat-btn"
              onClick={onResetCategory}
              aria-label="Back to all products"
            >
              <ArrowLeft size={20} />
            </button>
          ) : null}

          <div>
            <h1 className="fd-market-main-title">
              {selectedCategory !== 'all'
                ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace('_', ' ')
                : (t.market || 'Market')}
            </h1>
            <p className="fd-market-subtitle">
              {getSubtitle()}
            </p>
          </div>
        </div>

        <div className="fd-market-header-icons">
          <button
            type="button"
            className="fd-header-circle-btn"
            onClick={onOpenFilter}
            title="Filters"
            aria-label="Filter"
          >
            <SlidersHorizontal size={17} />
            {activeFilterCount > 0 && (
              <span className="fd-header-notif-dot">{activeFilterCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Farm Location Pill (Target Reference Screen 1) */}
      <button
        type="button"
        className="fd-market-location-bar"
        onClick={onOpenLocation}
        title="Tap to change farm location"
      >
        <MapPin size={13} className="fd-location-icon" />
        <span className="fd-location-text">{displayLocation}</span>
        <ChevronRight size={13} className="fd-location-arrow" />
      </button>
    </header>
  )
}

export default MarketHeader
