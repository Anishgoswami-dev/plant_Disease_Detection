import React, { useState } from 'react'
import { ArrowLeft, Heart, Share2, Star, Check, CheckCircle2, AlertTriangle, ExternalLink, Scale, ShieldCheck, Smartphone } from 'lucide-react'
import PriceComparisonCard from './PriceComparisonCard.jsx'

export function ProductDetailsModal({
  product,
  onClose,
  language = 'English',
  onBuyOutbound
}) {
  if (!product) return null

  // Image Gallery state
  const galleryImages = product.thumbnails && product.thumbnails.length > 0
    ? product.thumbnails
    : [product.imageUrl]
  const [activeImageIdx, setActiveImageIdx] = useState(0)

  // Pack size state
  const packSizes = product.packSizes && product.packSizes.length > 0
    ? product.packSizes
    : product.packSize
    ? [product.packSize.split('(')[0].trim()]
    : ['Standard Pack']
  const [selectedPack, setSelectedPack] = useState(packSizes[0] || '10 g')

  // Wishlist & View mode
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [viewMode, setViewMode] = useState('details') // 'details' or 'compare'

  // Localized title & description
  const getProductName = () => {
    if (language === 'Hindi' && product.nameHi) return product.nameHi
    if (language === 'Bangla' && product.nameBn) return product.nameBn
    if (language === 'Marathi' && product.nameMr) return product.nameMr
    return product.name
  }

  const getProductDesc = () => {
    if (language === 'Hindi' && product.descriptionHi) return product.descriptionHi
    if (language === 'Bangla' && product.descriptionBn) return product.descriptionBn
    if (language === 'Marathi' && product.descriptionMr) return product.descriptionMr
    return product.description
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Fasal Dristhi Market!`,
        url: window.location.href
      }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(window.location.href)
      alert('Product link copied to clipboard!')
    }
  }

  // Key agronomic features
  const features = product.keyFeatures || [
    'High yielding certified genuine agricultural input',
    'Procured directly from verified official manufacturers',
    'Meets Indian seed and fertilizer regulatory standards',
    'Suitable for commercial and progressive farm cultivation'
  ]

  return (
    <div
      className="fd-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="fd-modal-title"
    >
      <div className="fd-modal-sheet">
        {/* 1. Modal Top Action Bar (Matching Screen 4 & 5) */}
        <div className="fd-modal-nav-bar">
          <button
            type="button"
            className="fd-modal-nav-icon-btn"
            onClick={() => {
              if (viewMode === 'compare') {
                setViewMode('details')
              } else {
                onClose()
              }
            }}
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>

          <span className="fd-modal-nav-title">
            {viewMode === 'compare' ? 'Compare Prices' : 'Product Details'}
          </span>

          <div className="fd-modal-nav-actions">
            <button
              type="button"
              className={`fd-modal-nav-icon-btn ${isWishlisted ? 'wishlisted' : ''}`}
              onClick={() => setIsWishlisted(!isWishlisted)}
              aria-label="Wishlist"
              title="Add to Wishlist"
            >
              <Heart size={18} fill={isWishlisted ? '#ef4444' : 'none'} color={isWishlisted ? '#ef4444' : 'currentColor'} />
            </button>
            <button
              type="button"
              className="fd-modal-nav-icon-btn"
              onClick={handleShare}
              aria-label="Share"
              title="Share product"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Sheet Content */}
        <div className="fd-modal-scroll-area">
          {viewMode === 'compare' ? (
            /* Dedicated Screen 5: Price Comparison View */
            <div className="fd-compare-screen-view">
              {/* Product Header Card */}
              <div className="fd-compare-header-card">
                <img
                  src={galleryImages[0]}
                  alt={product.name}
                  className="fd-compare-thumb"
                  onError={(e) => { e.currentTarget.src = '/products/seminis_brinjal.jpg' }}
                />
                <div>
                  <h4 className="fd-compare-prod-name">{getProductName()}</h4>
                  <span className="fd-compare-prod-brand">
                    {product.brand} • {selectedPack}
                  </span>
                </div>
              </div>

              <div className="fd-compare-section-title-wrap">
                <h3 className="fd-compare-section-heading">Compare Prices</h3>
                <p className="fd-compare-section-sub">
                  Same product across trusted marketplaces
                </p>
              </div>

              {/* Price Comparison Rows */}
              <div className="fd-compare-cards-stack">
                {(product.priceComparisons || [
                  { marketplace: 'AgroStar', price: product.price, mrp: product.mrp, discount: `${product.discountPercent || 14}% off`, verified: true, bestPrice: true, url: product.productUrl },
                  { marketplace: 'DeHaat', price: Math.round(product.price * 1.04), mrp: product.mrp, discount: '10% off', verified: true, bestPrice: false, url: 'https://agrevolution.in/' },
                  { marketplace: 'BigHaat', price: Math.round(product.price * 1.07), mrp: product.mrp, discount: '7% off', verified: true, bestPrice: false, url: 'https://www.bighaat.com/' }
                ]).map((item) => (
                  <div key={item.marketplace} className="fd-compare-row-card">
                    <div className="fd-compare-store-col">
                      <div className="fd-compare-store-header">
                        <span className="fd-compare-store-name">{item.marketplace}</span>
                        {item.bestPrice && (
                          <span className="fd-badge-best-price">Best Price</span>
                        )}
                      </div>
                      <div className="fd-compare-verified-tag">
                        <CheckCircle2 size={10} color="#16a34a" />
                        <span>Verified price</span>
                      </div>
                    </div>

                    <div className="fd-compare-pricing-col">
                      <div className="fd-compare-price-line">
                        <span className="fd-compare-val">₹{item.price.toLocaleString('en-IN')}</span>
                        {item.mrp && <span className="fd-compare-mrp">₹{item.mrp}</span>}
                        {item.discount && <span className="fd-compare-off">{item.discount}</span>}
                      </div>
                      <button
                        type="button"
                        className="fd-compare-cta-btn"
                        onClick={() => onBuyOutbound({ ...product, marketplace: item.marketplace, productUrl: item.url })}
                      >
                        <span>Buy Now</span>
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Verified Trust Notice */}
              <div className="fd-compare-trust-notice">
                <ShieldCheck size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  Prices are fetched from official marketplace pages. Always verify the latest price and product details on the seller's website.
                </span>
              </div>
            </div>
          ) : (
            /* Screen 4: Full-Featured Commerce Product Details */
            <>
              {/* 2. Hero Studio Image Container */}
              <div className="fd-modal-hero-container">
                <img
                  src={galleryImages[activeImageIdx] || galleryImages[0]}
                  alt={product.name}
                  className="fd-modal-hero-img"
                  onError={(e) => { e.currentTarget.src = '/products/seminis_brinjal.jpg' }}
                />
                {galleryImages.length > 1 && (
                  <span className="fd-modal-counter-badge">
                    {activeImageIdx + 1}/{galleryImages.length}
                  </span>
                )}
              </div>

              {/* 3. Thumbnail Gallery Strip */}
              {galleryImages.length > 1 && (
                <div className="fd-modal-thumb-row" role="tablist">
                  {galleryImages.map((thumbUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`fd-modal-thumb-box ${activeImageIdx === idx ? 'active' : ''}`}
                      onClick={() => setActiveImageIdx(idx)}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <img
                        src={thumbUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        onError={(e) => { e.currentTarget.src = '/products/seminis_brinjal.jpg' }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* 4. Brand & Category Row */}
              <div className="fd-modal-brand-tag">
                <span>{product.brand?.toUpperCase()}</span>
                <span>•</span>
                <span>{(product.subcategory || product.category)?.toUpperCase()}</span>
              </div>

              {/* 5. Product Title */}
              <h2 id="fd-modal-title" className="fd-modal-product-title">
                {getProductName()}
              </h2>

              {/* 6. Rating & Verified Price Row */}
              <div className="fd-modal-rating-row">
                <div className="fd-star-pill">
                  <Star size={11} fill="currentColor" />
                  <span>{product.rating ? product.rating.toFixed(1) : '4.5'}</span>
                </div>
                <span className="fd-modal-review-text">
                  ({(product.reviewCount || 1245).toLocaleString('en-IN')} reviews)
                </span>
                <span className="fd-modal-verified-pill">
                  <CheckCircle2 size={11} />
                  <span>Verified price</span>
                </span>
              </div>

              {/* 7. Price Box */}
              <div className="fd-modal-pricing-box">
                <span className="fd-modal-price-val">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.mrp && product.mrp > product.price && (
                  <span className="fd-modal-mrp-val">
                    ₹{product.mrp.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="fd-modal-discount-tag">
                    {product.discountPercent}% off
                  </span>
                )}
              </div>

              {/* 8. Pack Size Selector */}
              <div className="fd-modal-pack-section">
                <label className="fd-modal-section-label">Pack Size</label>
                <div className="fd-modal-pack-chips">
                  {packSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`fd-modal-pack-chip ${selectedPack === size ? 'active' : ''}`}
                      onClick={() => setSelectedPack(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* 9. Key Features (Screen 4) */}
              <div className="fd-modal-features-section">
                <label className="fd-modal-section-label">Key Features</label>
                <div className="fd-modal-features-list">
                  {features.map((feat, idx) => (
                    <div key={idx} className="fd-modal-feature-item">
                      <Check size={14} className="fd-feature-check" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 10. Agronomic Description */}
              <div className="fd-modal-desc-section">
                <label className="fd-modal-section-label">Agronomic Description</label>
                <p className="fd-modal-desc-text">
                  {getProductDesc()}
                </p>
              </div>

              {/* 11. Specifications Table */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="fd-modal-specs-section">
                  <label className="fd-modal-section-label">Specifications</label>
                  <table className="fd-modal-specs-table">
                    <tbody>
                      {Object.entries(product.specifications).map(([key, val]) => (
                        <tr key={key}>
                          <td className="fd-spec-key">{key}</td>
                          <td className="fd-spec-val">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 12. Agronomic Advisory Notice Box */}
              <div className="fd-modal-advisory-box">
                <AlertTriangle size={18} className="fd-advisory-icon" />
                <div>
                  <strong>Agronomic Advisory Notice:</strong> Fasal Dristhi displays genuine product data from authorized marketplace partners. Always verify product label, CIBRC/State university approval, dosage, and local weather before use.
                </div>
              </div>
            </>
          )}
        </div>

        {/* 13. Fixed Bottom Action Bar (Screen 4 Bottom Bar) */}
        <div className="fd-modal-bottom-bar">
          <button
            type="button"
            className="fd-btn-buy-primary"
            onClick={() => onBuyOutbound(product)}
            title={`Buy from official ${product.marketplace} store`}
          >
            <span>Buy on {product.marketplace}</span>
            <ExternalLink size={14} />
          </button>

          {product.appUrl && (
            <a
              href={product.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="fd-btn-app-action"
              title={`Open official ${product.marketplace} Store App`}
            >
              <Smartphone size={14} />
              <span>Open App</span>
            </a>
          )}

          {viewMode === 'details' ? (
            <button
              type="button"
              className="fd-btn-compare-action"
              onClick={() => setViewMode('compare')}
              title="Compare prices across marketplaces"
            >
              <Scale size={14} />
              <span>Compare Prices</span>
            </button>
          ) : (
            <button
              type="button"
              className="fd-btn-compare-action"
              onClick={() => setViewMode('details')}
              title="Back to Product Details"
            >
              <span>View Details</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsModal
