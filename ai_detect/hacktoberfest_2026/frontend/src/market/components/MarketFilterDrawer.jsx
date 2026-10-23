import React, { useState } from 'react'
import { X, RotateCcw, Check, Star, Search } from 'lucide-react'
import { MARKET_CATEGORIES } from '../data/marketData.js'

export function MarketFilterDrawer({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
  language = 'English',
  totalMatches = 36
}) {
  const [localCategory, setLocalCategory] = useState(filters.category || 'all')
  const [localMarketplace, setLocalMarketplace] = useState(filters.marketplace || 'all')
  const [localPriceRange, setLocalPriceRange] = useState(filters.priceRange || 'all')
  const [localMinRating, setLocalMinRating] = useState(filters.minRating || 0)
  const [localPriceStatus, setLocalPriceStatus] = useState(filters.priceStatus || 'all')
  const [brandSearch, setBrandSearch] = useState('')
  const [selectedBrands, setSelectedBrands] = useState([])

  if (!isOpen) return null

  const brandsList = [
    'Seminis',
    'Syngenta',
    'US Agriseeds',
    'Nunhems',
    'KisanKraft',
    'Godrej Agro',
    'Jain Irrigation',
    'AgriSense'
  ]

  const filteredBrands = brandSearch
    ? brandsList.filter((b) => b.toLowerCase().includes(brandSearch.toLowerCase()))
    : brandsList

  const toggleBrand = (b) => {
    setSelectedBrands((prev) =>
      prev.includes(b) ? prev.filter((item) => item !== b) : [...prev, b]
    )
  }

  const handleApply = () => {
    let minPrice = null
    let maxPrice = null

    if (localPriceRange === 'under500') {
      maxPrice = 500
    } else if (localPriceRange === '500to1000') {
      minPrice = 500
      maxPrice = 1000
    } else if (localPriceRange === '1000to5000') {
      minPrice = 1000
      maxPrice = 5000
    } else if (localPriceRange === 'above5000') {
      minPrice = 5000
    }

    onApplyFilters({
      category: localCategory,
      marketplace: localMarketplace,
      priceRange: localPriceRange,
      minPrice,
      maxPrice,
      minRating: localMinRating,
      priceStatus: localPriceStatus,
      selectedBrands
    })
    onClose()
  }

  const handleReset = () => {
    setLocalCategory('all')
    setLocalMarketplace('all')
    setLocalPriceRange('all')
    setLocalMinRating(0)
    setLocalPriceStatus('all')
    setSelectedBrands([])
    setBrandSearch('')
    onResetFilters()
    onClose()
  }

  const priceBands = [
    { id: 'all', label: 'All' },
    { id: 'under500', label: '₹0 - 500' },
    { id: '500to1000', label: '₹500 - 1,000' },
    { id: '1000to5000', label: '₹1,000 - 5,000' },
    { id: 'above5000', label: '₹5,000+' }
  ]

  const marketplaceOptions = ['AgroStar', 'DeHaat', 'BigHaat']

  return (
    <div className="fd-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="fd-filter-drawer" role="dialog" aria-modal="true" aria-label="Filter Products">
        {/* Header (Screen 3: ✕ Filters on left, Reset link on right) */}
        <div className="fd-filter-drawer-header">
          <div className="fd-filter-header-left">
            <button
              type="button"
              className="fd-modal-close-btn"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <h3 className="fd-filter-title">Filters</h3>
          </div>

          <button
            type="button"
            className="fd-filter-reset-link"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>

        {/* Scrollable Filter Form Body */}
        <div className="fd-filter-scroll-body">
          {/* 1. Category Pills */}
          <div className="fd-filter-group">
            <label className="fd-filter-label">Category</label>
            <div className="fd-filter-chips-wrap">
              {MARKET_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`fd-filter-pill-chip ${localCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setLocalCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Price Range */}
          <div className="fd-filter-group">
            <div className="fd-filter-group-row">
              <label className="fd-filter-label">Price Range</label>
              <span className="fd-filter-range-val">₹0 – ₹15,000+</span>
            </div>
            <div className="fd-filter-chips-wrap">
              {priceBands.map((pb) => (
                <button
                  key={pb.id}
                  type="button"
                  className={`fd-filter-pill-chip ${localPriceRange === pb.id ? 'active' : ''}`}
                  onClick={() => setLocalPriceRange(pb.id)}
                >
                  {pb.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Brand Search & Checkboxes */}
          <div className="fd-filter-group">
            <label className="fd-filter-label">Brand</label>
            <div className="fd-filter-search-box">
              <Search size={14} color="#64748b" />
              <input
                type="text"
                className="fd-filter-search-input"
                placeholder="Search brand..."
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
              />
            </div>
            <div className="fd-filter-checkbox-grid">
              {filteredBrands.map((b) => {
                const isChecked = selectedBrands.includes(b)
                return (
                  <label key={b} className="fd-checkbox-row">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleBrand(b)}
                    />
                    <span className="fd-custom-checkbox">
                      {isChecked && <Check size={12} color="#ffffff" strokeWidth={3} />}
                    </span>
                    <span className="fd-checkbox-text">{b}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* 4. Source / Marketplace */}
          <div className="fd-filter-group">
            <label className="fd-filter-label">Source / Marketplace</label>
            <div className="fd-filter-checkbox-grid">
              {marketplaceOptions.map((mp) => {
                const isChecked = localMarketplace === 'all' || localMarketplace === mp
                return (
                  <label key={mp} className="fd-checkbox-row">
                    <input
                      type="checkbox"
                      checked={localMarketplace === mp}
                      onChange={() => setLocalMarketplace(localMarketplace === mp ? 'all' : mp)}
                    />
                    <span className="fd-custom-checkbox">
                      {localMarketplace === mp && <Check size={12} color="#ffffff" strokeWidth={3} />}
                    </span>
                    <span className="fd-checkbox-text">{mp}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* 5. Rating */}
          <div className="fd-filter-group">
            <label className="fd-filter-label">Rating</label>
            <div className="fd-filter-chips-wrap">
              {[
                { min: 4, label: '4★ +' },
                { min: 3, label: '3★ +' },
                { min: 2, label: '2★ +' }
              ].map((r) => (
                <button
                  key={r.min}
                  type="button"
                  className={`fd-filter-pill-chip ${localMinRating === r.min ? 'active' : ''}`}
                  onClick={() => setLocalMinRating(localMinRating === r.min ? 0 : r.min)}
                >
                  <Star size={11} fill="currentColor" />
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 6. Availability */}
          <div className="fd-filter-group">
            <label className="fd-filter-label">Availability</label>
            <div className="fd-filter-checkbox-list">
              <label className="fd-checkbox-row">
                <input
                  type="checkbox"
                  checked={localPriceStatus === 'in_stock'}
                  onChange={() => setLocalPriceStatus(localPriceStatus === 'in_stock' ? 'all' : 'in_stock')}
                />
                <span className="fd-custom-checkbox">
                  {localPriceStatus === 'in_stock' && <Check size={12} color="#ffffff" strokeWidth={3} />}
                </span>
                <span className="fd-checkbox-text">In stock</span>
              </label>

              <label className="fd-checkbox-row">
                <input
                  type="checkbox"
                  checked={localPriceStatus === 'verified'}
                  onChange={() => setLocalPriceStatus(localPriceStatus === 'verified' ? 'all' : 'verified')}
                />
                <span className="fd-custom-checkbox">
                  {localPriceStatus === 'verified' && <Check size={12} color="#ffffff" strokeWidth={3} />}
                </span>
                <span className="fd-checkbox-text">Show only verified prices</span>
              </label>
            </div>
          </div>
        </div>

        {/* 7. Bottom CTA Button */}
        <div className="fd-filter-drawer-bottom">
          <button
            type="button"
            className="fd-btn-apply-filters"
            onClick={handleApply}
          >
            Apply Filters ({totalMatches} products)
          </button>
        </div>
      </div>
    </div>
  )
}

export default MarketFilterDrawer
