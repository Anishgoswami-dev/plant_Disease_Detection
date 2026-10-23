import React, { useState } from 'react'
import { ExternalLink, Check, Star, Heart } from 'lucide-react'

export function ProductCard({
  product,
  language = 'English',
  onSelectProduct,
  onBuyOutbound
}) {
  const [imgSrc, setImgSrc] = useState(product.imageUrl)
  const [hasError, setHasError] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Clean fallback image handler
  const handleImageError = () => {
    if (!hasError && product.fallbackUrl) {
      setImgSrc(product.fallbackUrl)
      setHasError(true)
    } else {
      // Clean neutral agriculture seed / tool fallback
      setImgSrc('/products/seminis_brinjal.jpg')
    }
  }

  // Localized product name
  const getProductName = () => {
    if (language === 'Hindi' && product.nameHi) return product.nameHi
    if (language === 'Bangla' && product.nameBn) return product.nameBn
    if (language === 'Marathi' && product.nameMr) return product.nameMr
    return product.name
  }

  // Formatting reviews
  const formatReviewCount = (count) => {
    if (!count) return '100+'
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count
  }

  // Extract clean pack size display (e.g. "10 g" or "16L")
  const displayPack = product.packSize ? product.packSize.split('(')[0].trim() : ''

  return (
    <article
      className="fd-product-card"
      onClick={() => onSelectProduct(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelectProduct(product)}
      aria-label={`View details for ${product.name}`}
    >
      {/* 1. Image Area with Studio Presentation */}
      <div className="fd-product-card-img-wrap">
        <img
          src={imgSrc}
          alt={product.name}
          className="fd-product-card-img"
          loading="lazy"
          onError={handleImageError}
        />

        {/* Top-Left Status Pill (Bestseller, Popular, or % OFF) */}
        {product.badge ? (
          <span className={`fd-badge-status ${product.badge.toLowerCase()}`}>
            {product.badge}
          </span>
        ) : product.discountPercent > 0 ? (
          <span className="fd-badge-status discount">
            {product.discountPercent}% OFF
          </span>
        ) : null}

        {/* Top-Right Interactive Wishlist Heart */}
        <button
          type="button"
          className={`fd-card-wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            setIsWishlisted((prev) => !prev)
          }}
          aria-label="Save to wishlist"
          title={isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={15} fill={isWishlisted ? '#ef4444' : 'none'} color={isWishlisted ? '#ef4444' : '#64748b'} />
        </button>
      </div>

      {/* 2. Structured Card Information Body */}
      <div className="fd-product-card-body">
        {/* Product Title (Strict 2 lines, legible and robust) */}
        <h4 className="fd-product-card-name" title={product.name}>
          {getProductName()}
        </h4>

        {/* Brand & Pack Size Row */}
        <div className="fd-product-card-meta-row">
          <span className="fd-product-card-brand">{product.brand}</span>
          {displayPack && (
            <>
              <span className="fd-meta-dot">•</span>
              <span className="fd-product-card-pack">{displayPack}</span>
            </>
          )}
        </div>

        {/* Rating & Review Count */}
        <div className="fd-product-card-rating-row">
          <span className="fd-star-pill">
            <Star size={11} fill="currentColor" />
            <span>{product.rating ? product.rating.toFixed(1) : '4.6'}</span>
          </span>
          <span className="fd-rev-count">
            ({formatReviewCount(product.reviewCount)})
          </span>
        </div>

        {/* Pricing Architecture */}
        <div className="fd-product-card-pricing">
          <div className="fd-price-main-row">
            <span className="fd-product-price">₹{product.price.toLocaleString('en-IN')}</span>
            {product.mrp && product.mrp > product.price && (
              <span className="fd-product-mrp">₹{product.mrp.toLocaleString('en-IN')}</span>
            )}
            {product.discountPercent > 0 && (
              <span className="fd-product-discount-tag">
                {product.discountPercent}% off
              </span>
            )}
          </div>

          {/* Source & Verified Label */}
          <div className="fd-available-source-row">
            <Check size={11} className="fd-check-icon" />
            <span>Available on {product.marketplace}</span>
          </div>
        </div>

        {/* 3. Primary Full-Width CTA Button (No squeezed icons) */}
        <div className="fd-product-card-actions" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="fd-btn-buy-full"
            onClick={() => onBuyOutbound(product)}
            title={`Buy from official ${product.marketplace} store`}
          >
            <span>Buy Now</span>
            <ExternalLink size={13} />
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
