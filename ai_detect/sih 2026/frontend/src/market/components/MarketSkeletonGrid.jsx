import React from 'react'

export function MarketSkeletonGrid({ count = 6 }) {
  return (
    <div className="fd-market-products-grid" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="fd-skeleton-card">
          <div className="fd-skeleton fd-skeleton-img" />
          <div className="fd-skeleton fd-skeleton-line" style={{ width: '40%' }} />
          <div className="fd-skeleton fd-skeleton-line full" />
          <div className="fd-skeleton fd-skeleton-line" style={{ width: '80%' }} />
          <div className="fd-skeleton fd-skeleton-line" style={{ width: '50%', height: '18px', marginTop: '4px' }} />
          <div className="fd-skeleton fd-skeleton-btn" />
        </div>
      ))}
    </div>
  )
}

export default MarketSkeletonGrid
