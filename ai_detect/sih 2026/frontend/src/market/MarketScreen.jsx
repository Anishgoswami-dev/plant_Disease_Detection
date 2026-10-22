import React, { useState, useEffect, useMemo } from 'react'
import { Search, X, SlidersHorizontal, ArrowUpDown, ChevronRight, Mic, Sparkles, RefreshCw } from 'lucide-react'
import marketService from './services/marketService.js'
import MarketHeader from './components/MarketHeader.jsx'
import MarketHero from './components/MarketHero.jsx'
import CategoryCarousel from './components/CategoryCarousel.jsx'
import ProductCard from './components/ProductCard.jsx'
import ProductDetailsModal from './components/ProductDetailsModal.jsx'
import MarketplaceCards from './components/MarketplaceCards.jsx'
import MarketFilterDrawer from './components/MarketFilterDrawer.jsx'
import MarketSkeletonGrid from './components/MarketSkeletonGrid.jsx'
import './marketStyles.css'

export function MarketScreen({
  t = {},
  language = 'English',
  selectedCrop = 'Tomato',
  weatherData = null,
  notify = () => {},
  exactLocation = '',
  profile = null,
  onOpenLocation = null
}) {
  // Main catalog state
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('recommended')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Advanced Filter state
  const [filters, setFilters] = useState({
    category: 'all',
    marketplace: 'all',
    priceRange: 'all',
    minPrice: null,
    maxPrice: null,
    minRating: 0,
    priceStatus: 'all',
    selectedBrands: []
  })

  // Dynamic farm location resolution
  const resolvedLocation = useMemo(() => {
    if (exactLocation && exactLocation.trim()) return exactLocation
    if (weatherData?.city) {
      return weatherData.region ? `${weatherData.city}, ${weatherData.region}` : weatherData.city
    }
    if (profile?.village) {
      return profile.state ? `${profile.village}, ${profile.state}` : profile.village
    }
    return 'Karimpur, South 24 Parganas'
  }, [exactLocation, weatherData, profile])

  // Count active non-default filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.marketplace !== 'all') count++
    if (filters.priceRange !== 'all') count++
    if (filters.minRating > 0) count++
    if (filters.priceStatus !== 'all') count++
    return count
  }, [filters])

  // Ensure Market always opens scrolled to the very top
  useEffect(() => {
    const parentScroll = document.querySelector('.app-scroll-body')
    if (parentScroll) {
      parentScroll.scrollTop = 0
    }
  }, [])

  // Query catalog
  const loadProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const cat = selectedCategory !== 'all' ? selectedCategory : filters.category
      let data = await marketService.getProducts({
        category: cat,
        search: searchQuery,
        sort: sortBy,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minRating: filters.minRating,
        marketplace: filters.marketplace,
        crop: selectedCrop
      })

      // Filter by brands if selected
      if (filters.selectedBrands && filters.selectedBrands.length > 0) {
        data = data.filter((p) =>
          filters.selectedBrands.some(
            (b) => p.brand?.toLowerCase().includes(b.toLowerCase())
          )
        )
      }

      setProducts(data)
    } catch (err) {
      console.error('Market catalog fetch error:', err)
      setError('Market data could not be loaded.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [selectedCategory, searchQuery, sortBy, filters, selectedCrop])

  // Outbound safe marketplace routing
  const handleBuyOutbound = (product) => {
    const targetUrl = product.productUrl || product.marketplaceUrl || 'https://www.agrostar.in/'
    const storeName = product.marketplace || 'Partner'
    const prodTitle = (language === 'Hindi' && product.nameHi) || (language === 'Bangla' && product.nameBn) || (language === 'Marathi' && product.nameMr) || product.name || 'Product'

    if (notify) {
      if (language === 'Hindi') {
        notify(`आधिकारिक ${storeName} स्टोर खोला जा रहा है: ${prodTitle.slice(0, 26)}... 🛒`)
      } else if (language === 'Bangla') {
        notify(`অফিসিয়াল ${storeName} স্টোর খোলা হচ্ছে: ${prodTitle.slice(0, 26)}... 🛒`)
      } else if (language === 'Marathi') {
        notify(`अधिकृत ${storeName} स्टोअर उघडत आहे: ${prodTitle.slice(0, 26)}... 🛒`)
      } else {
        notify(`Opening official ${storeName} store for ${prodTitle.slice(0, 26)}... 🛒`)
      }
    }

    try {
      const win = window.open(targetUrl, '_blank', 'noopener,noreferrer')
      if (!win) {
        window.location.assign(targetUrl)
      }
    } catch (e) {
      window.location.assign(targetUrl)
    }
  }

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters)
    if (newFilters.category && newFilters.category !== 'all') {
      setSelectedCategory(newFilters.category)
    }
  }

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      marketplace: 'all',
      priceRange: 'all',
      minPrice: null,
      maxPrice: null,
      minRating: 0,
      priceStatus: 'all',
      selectedBrands: []
    })
    setSelectedCategory('all')
    setSearchQuery('')
    setSortBy('recommended')
  }

  // Quick suggestions under search
  const quickSuggestions = [
    'Tomato Seeds',
    'Battery Sprayer',
    'Drip Irrigation',
    'Soil Sensor',
    'Farm Tools'
  ]

  // Crop shortcut cards for "Recommended for Your Farm" (Screen 1)
  const cropShortcuts = [
    { title: `${selectedCrop || 'Tomato'} Seeds`, img: '/products/us_agriseeds_tomato.jpg', query: 'Seeds', cat: 'seeds' },
    { title: 'Irrigation', img: '/products/drip_irrigation_kit.jpg', query: 'Irrigation', cat: 'irrigation' },
    { title: 'Sprayers', img: '/products/battery_sprayer.jpg', query: 'Sprayer', cat: 'tools' },
    { title: 'Crop Care', img: '/products/neem_cake.jpg', query: 'Care', cat: 'crop_care' }
  ]

  return (
    <div className="fd-market-container">
      {/* 1. Header with Location & Category Back navigation */}
      <MarketHeader
        t={t}
        language={language}
        locationName={resolvedLocation}
        onOpenLocation={onOpenLocation}
        onOpenFilter={() => setIsFilterOpen(true)}
        activeFilterCount={activeFilterCount}
        selectedCategory={selectedCategory}
        onResetCategory={() => setSelectedCategory('all')}
      />

      {/* 2. Normal Document Flow: Search Bar (Fixed scroll behavior!) */}
      <div className="fd-market-search-section">
        <form
          className="fd-market-search-bar"
          onSubmit={(e) => { e.preventDefault(); loadProducts() }}
        >
          <Search size={18} className="fd-search-icon" />
          <input
            type="text"
            className="fd-search-input"
            placeholder="Search seeds, tools, equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery ? (
            <button
              type="button"
              className="fd-search-clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          ) : (
            <button
              type="button"
              className="fd-search-mic-btn"
              onClick={() => notify('Voice search activated... speak now 🎙️')}
              aria-label="Voice search"
            >
              <Mic size={16} />
            </button>
          )}
        </form>

        {/* Quick Search Suggestions Pills */}
        <div className="fd-search-pills-row">
          {quickSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className={`fd-search-pill ${searchQuery.toLowerCase() === suggestion.toLowerCase() ? 'active' : ''}`}
              onClick={() => {
                if (searchQuery === suggestion) {
                  setSearchQuery('')
                } else {
                  setSearchQuery(suggestion)
                }
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Hero Area (Shown when in general browse mode) */}
      {!searchQuery && selectedCategory === 'all' && (
        <MarketHero
          language={language}
          onExploreClick={() => {
            const el = document.getElementById('fd-product-catalog-anchor')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          }}
        />
      )}

      {/* 4. Shop by Category (Screen 1) */}
      {!searchQuery && (
        <CategoryCarousel
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => {
            setSelectedCategory(catId)
            if (filters.category !== catId) {
              setFilters((prev) => ({ ...prev, category: catId }))
            }
          }}
          language={language}
        />
      )}

      {/* 5. Recommended for Your Farm (Screen 1) */}
      {!searchQuery && selectedCategory === 'all' && (
        <section className="fd-farm-rec-section" aria-label="Recommended for Your Farm">
          <div className="fd-farm-rec-header">
            <div>
              <h3 className="fd-farm-rec-title">Recommended for Your Farm</h3>
              <p className="fd-farm-rec-sub">
                Based on your selected crop: <strong>{selectedCrop || 'Brinjal'}</strong>
              </p>
            </div>
            <button
              type="button"
              className="fd-farm-rec-arrow-btn"
              onClick={() => setSelectedCategory('seeds')}
              aria-label="View all recommendations"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="fd-farm-rec-grid">
            {cropShortcuts.map((item, idx) => (
              <div
                key={idx}
                className="fd-farm-rec-card"
                onClick={() => {
                  setSelectedCategory(item.cat)
                }}
                role="button"
                tabIndex={0}
              >
                <div className="fd-farm-rec-img-wrap">
                  <img
                    src={item.img}
                    alt={item.title}
                    onError={(e) => { e.currentTarget.src = '/products/seminis_brinjal.jpg' }}
                  />
                </div>
                <span className="fd-farm-rec-card-title">{item.title}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Filter & Sort Bar (Equal-width buttons on mobile, Screen 2) */}
      <div id="fd-product-catalog-anchor" className="fd-filter-sort-bar">
        <button
          type="button"
          className="fd-bar-filter-btn"
          onClick={() => setIsFilterOpen(true)}
        >
          <SlidersHorizontal size={15} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="fd-filter-count-badge">{activeFilterCount}</span>
          )}
        </button>

        <div className="fd-bar-sort-wrap">
          <select
            className="fd-bar-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort products"
          >
            <option value="recommended">✨ Recommended</option>
            <option value="price_asc">🏷️ Price: Low to High</option>
            <option value="price_desc">💎 Price: High to Low</option>
            <option value="rating">⭐ Highest Rated</option>
            <option value="newest">🕒 New Arrivals</option>
          </select>
        </div>
      </div>

      {/* 7. Catalog Heading & Count */}
      <div className="fd-catalog-heading-row">
        <h3 className="fd-catalog-title">
          {selectedCategory !== 'all'
            ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace('_', ' ')}`
            : searchQuery
            ? `Results for "${searchQuery}"`
            : 'All Products'}
        </h3>
        <span className="fd-catalog-count">
          {products.length} {products.length === 1 ? 'product' : 'products'}
        </span>
      </div>

      {/* 8. Main Product Grid: STRICT 2 COLUMNS ON MOBILE */}
      {loading ? (
        <MarketSkeletonGrid count={6} />
      ) : error ? (
        <div className="fd-market-empty-state" role="alert">
          <div className="fd-empty-icon">⚠️</div>
          <h4 className="fd-empty-title">Market catalog could not be loaded</h4>
          <p className="fd-empty-text">Please check your connection and retry.</p>
          <button
            type="button"
            className="fd-btn-retry"
            onClick={loadProducts}
          >
            <RefreshCw size={14} style={{ display: 'inline', marginRight: '6px' }} />
            Retry
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="fd-market-empty-state">
          <div className="fd-empty-icon">🌱</div>
          <h4 className="fd-empty-title">No products found</h4>
          <p className="fd-empty-text">
            Try adjusting your search terms or clearing active filters.
          </p>
          <button
            type="button"
            className="fd-btn-retry"
            onClick={handleResetFilters}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="fd-market-products-grid">
          {products.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              language={language}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onBuyOutbound={handleBuyOutbound}
            />
          ))}
        </div>
      )}

      {/* 9. Trusted Marketplaces (Screen 6) */}
      <MarketplaceCards language={language} notify={notify} />

      {/* 10. Filter Drawer (Screen 3) */}
      <MarketFilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        language={language}
        totalMatches={products.length}
      />

      {/* 11. Product Details & Price Comparison (Screen 4 & 5) */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          language={language}
          onBuyOutbound={handleBuyOutbound}
        />
      )}
    </div>
  )
}

export default MarketScreen
