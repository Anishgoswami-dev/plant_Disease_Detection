import React from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'

export function MarketHero({ language = 'English', onExploreClick }) {
  const getHeroTitle = () => {
    if (language === 'Hindi') return 'Farm smarter. Buy better.'
    if (language === 'Bangla') return 'Farm smarter. Buy better.'
    if (language === 'Marathi') return 'Farm smarter. Buy better.'
    return 'Farm smarter. Buy better.'
  }

  const getHeroSub = () => {
    if (language === 'Hindi') return 'गुणवत्तापूर्ण कृषि इनपुट्स। प्रामाणिक ब्रांड। भरपूर पैदावार।'
    if (language === 'Bangla') return 'উন্নত কৃষি উপাদান। বিশ্বস্ত ব্র্যান্ড। সমৃদ্ধ ফলন।'
    if (language === 'Marathi') return 'दर्जेदार कृषी निविष्ठा। विश्वासू ब्रँड्स। निरोगी उत्पादन.'
    return 'Quality inputs. Trusted brands. Healthier harvests.'
  }

  const getCtaLabel = () => {
    if (language === 'Hindi') return 'Explore Products'
    if (language === 'Bangla') return 'Explore Products'
    if (language === 'Marathi') return 'Explore Products'
    return 'Explore Products'
  }

  return (
    <section className="fd-market-hero" aria-label="Market Highlights">
      <div className="fd-market-hero-inner">
        <div className="fd-market-hero-content">
          <h2 className="fd-market-hero-title">
            {getHeroTitle()}
          </h2>
          <p className="fd-market-hero-text">
            {getHeroSub()}
          </p>
          <button
            type="button"
            className="fd-market-hero-cta"
            onClick={onExploreClick}
          >
            <span>{getCtaLabel()}</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="fd-market-hero-avatar-wrap" aria-hidden="true">
          <div className="fd-hero-farmer-circle">
            👨‍🌾
          </div>
        </div>
      </div>

      {/* Carousel dots indicator matching target reference */}
      <div className="fd-market-hero-dots">
        <span className="fd-hero-dot active" />
        <span className="fd-hero-dot" />
        <span className="fd-hero-dot" />
        <span className="fd-hero-dot" />
      </div>
    </section>
  )
}

export default MarketHero
