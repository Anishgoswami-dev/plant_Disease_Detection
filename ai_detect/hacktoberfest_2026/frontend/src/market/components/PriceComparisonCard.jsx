import React from 'react'
import { ExternalLink, Check, Sparkles } from 'lucide-react'

export function PriceComparisonCard({
  comparisons = [],
  mrp = 0,
  productName = '',
  language = 'English',
  onBuyOutbound
}) {
  if (!comparisons || comparisons.length === 0) return null

  // Sort comparisons by price ascending
  const sorted = [...comparisons].sort((a, b) => a.price - b.price)
  const lowestPrice = sorted[0]?.price

  const getTitle = () => {
    if (language === 'Hindi') return 'विभिन्न कृषि बाज़ारों में कीमतों की तुलना'
    if (language === 'Bangla') return 'বিভিন্ন কৃষি মার্কেটপ্লেসে মূল্য তুলনা'
    if (language === 'Marathi') return 'विविध कृषी बाजारांमधील किंमत तुलना'
    return 'Compare Verified Marketplace Prices'
  }

  return (
    <div className="fd-price-compare-card">
      <div className="fd-price-compare-title">
        <Sparkles size={14} color="#d97706" />
        <span>{getTitle()}</span>
      </div>

      <div className="fd-compare-list">
        {sorted.map((item, index) => {
          const isBest = item.price === lowestPrice
          return (
            <div
              key={item.marketplace}
              className={`fd-compare-row ${isBest ? 'best-price' : ''}`}
            >
              <div className="fd-compare-store-info">
                <div className="fd-compare-store-name">
                  <span>{item.marketplace}</span>
                  {isBest && (
                    <span className="fd-best-price-badge">
                      <Check size={9} /> Best Price
                    </span>
                  )}
                </div>
                {item.verified && (
                  <span style={{ fontSize: '10px', color: '#64748b' }}>
                    ✓ Verified store
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="fd-compare-price-val">
                  ₹{item.price.toLocaleString('en-IN')}
                </span>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`fd-compare-btn ${isBest ? 'best' : ''}`}
                  onClick={(e) => {
                    if (onBuyOutbound) {
                      e.preventDefault()
                      onBuyOutbound({
                        name: productName,
                        marketplace: item.marketplace,
                        productUrl: item.url
                      })
                    }
                  }}
                >
                  <span>Buy</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PriceComparisonCard
