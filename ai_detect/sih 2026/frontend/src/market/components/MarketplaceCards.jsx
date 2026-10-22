import React from 'react'
import { ExternalLink, ShieldCheck } from 'lucide-react'
import { TRUSTED_MARKETPLACES } from '../data/marketData.js'

export function MarketplaceCards({ language = 'English', notify }) {
  const getSectionTitle = () => {
    if (language === 'Hindi') return 'विश्वसनीय कृषि ई-कॉमर्स भागीदार'
    if (language === 'Bangla') return 'বিশ্বস্ত কৃষি ই-কমার্স অংশীদার'
    if (language === 'Marathi') return 'विश्वासू कृषी ई-कॉमर्स भागीदार'
    return 'Trusted Agriculture Marketplaces'
  }

  const handleVisit = (marketplace, e) => {
    if (notify) {
      notify(`Opening official ${marketplace.name} store in a secure tab... 🛒`)
    }
  }

  return (
    <section className="fd-market-partners-section" aria-label="Official Marketplace Partners">
      <div className="fd-market-section-title-row">
        <h3 className="fd-market-section-heading">
          <ShieldCheck size={18} color="#16a34a" />
          <span>{getSectionTitle()}</span>
        </h3>
      </div>

      <div className="fd-marketplace-partners-row">
        {TRUSTED_MARKETPLACES.map((partner) => (
          <div key={partner.id} className="fd-partner-card">
            <div className="fd-partner-top">
              <span className="fd-partner-name" style={{ color: partner.color }}>
                {partner.name}
              </span>
              <span
                className="fd-partner-badge"
                style={{ background: partner.bgColor, color: partner.color }}
              >
                {partner.badge}
              </span>
            </div>

            <p className="fd-partner-desc">
              {partner.description}
            </p>

            <a
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="fd-partner-link"
              style={{ color: partner.color }}
              onClick={(e) => handleVisit(partner, e)}
            >
              <span>Visit Official Store</span>
              <ExternalLink size={12} />
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}

export default MarketplaceCards
