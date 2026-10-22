/**
 * Fasal Dristhi — Market Service Layer
 * 
 * Provides robust product querying, multi-field search, multi-criteria filtering,
 * price comparison abstraction, crop-aware recommendations, and future live API hooks.
 */

import { MARKET_PRODUCTS, MARKET_CATEGORIES, TRUSTED_MARKETPLACES } from '../data/marketData.js'

export const marketService = {
  /**
   * Retrieves all product categories
   */
  getCategories() {
    return MARKET_CATEGORIES
  },

  /**
   * Retrieves trusted marketplace partners (AgroStar, DeHaat, BigHaat)
   */
  getMarketplaces() {
    return TRUSTED_MARKETPLACES
  },

  /**
   * Filters and sorts the catalog based on farmer criteria
   */
  async getProducts({
    category = 'all',
    search = '',
    minPrice = null,
    maxPrice = null,
    minRating = null,
    marketplace = 'all',
    sort = 'recommended',
    crop = null,
    availability = 'all'
  } = {}) {
    // Artificial small micro-delay to simulate fast API response & demonstrate clean skeleton state
    await new Promise((resolve) => setTimeout(resolve, 80))

    let list = [...MARKET_PRODUCTS]

    // 1. Category filter
    if (category && category !== 'all') {
      list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase())
    }

    // 2. Search query across name, local names, brand, category, crop tags, specifications
    if (search && search.trim()) {
      const q = search.toLowerCase().trim()
      list = list.filter((p) => {
        const matchName = p.name?.toLowerCase().includes(q)
        const matchHi = p.nameHi?.toLowerCase().includes(q)
        const matchBn = p.nameBn?.toLowerCase().includes(q)
        const matchMr = p.nameMr?.toLowerCase().includes(q)
        const matchBrand = p.brand?.toLowerCase().includes(q)
        const matchCat = p.category?.toLowerCase().includes(q)
        const matchSub = p.subcategory?.toLowerCase().includes(q)
        const matchCrop = p.cropTags?.some((c) => c.toLowerCase().includes(q))
        const matchDesc = p.description?.toLowerCase().includes(q)
        const matchSpecs = p.specifications && Object.values(p.specifications).some((val) => String(val).toLowerCase().includes(q))
        return matchName || matchHi || matchBn || matchMr || matchBrand || matchCat || matchSub || matchCrop || matchDesc || matchSpecs
      })
    }

    // 3. Price range filtering
    if (minPrice !== null && minPrice !== undefined && minPrice !== '') {
      list = list.filter((p) => p.price >= Number(minPrice))
    }
    if (maxPrice !== null && maxPrice !== undefined && maxPrice !== '') {
      list = list.filter((p) => p.price <= Number(maxPrice))
    }

    // 4. Rating filter
    if (minRating) {
      list = list.filter((p) => (p.rating || 0) >= Number(minRating))
    }

    // 5. Marketplace filter (AgroStar, DeHaat, BigHaat)
    if (marketplace && marketplace !== 'all') {
      list = list.filter((p) => p.marketplace.toLowerCase() === marketplace.toLowerCase())
    }

    // 6. Availability filter
    if (availability && availability !== 'all') {
      list = list.filter((p) => p.availability.toLowerCase().includes(availability.toLowerCase()))
    }

    // 7. Crop-specific filter
    if (crop && crop !== 'All' && crop !== 'General') {
      const cropQuery = crop.toLowerCase()
      list = list.filter((p) =>
        p.cropTags?.some((c) => c.toLowerCase() === cropQuery || c.toLowerCase() === 'general') ||
        p.category === 'tools' ||
        p.category === 'machinery' ||
        p.category === 'irrigation' ||
        p.category === 'smart_farming' ||
        p.category === 'accessories'
      )
    }

    // 8. Sorting
    if (sort === 'price_asc') {
      list.sort((a, b) => a.price - b.price)
    } else if (sort === 'price_desc') {
      list.sort((a, b) => b.price - a.price)
    } else if (sort === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (sort === 'newest') {
      list.sort((a, b) => (b.verifiedAt || '').localeCompare(a.verifiedAt || ''))
    } else {
      // 'recommended' or 'featured': prioritize verified seed varieties matching target reference
      list.sort((a, b) => {
        const aSeed = a.category === 'seeds' ? 1 : 0
        const bSeed = b.category === 'seeds' ? 1 : 0
        if (aSeed !== bSeed) return bSeed - aSeed

        if (a.isFeatured && !b.isFeatured) return -1
        if (!a.isFeatured && b.isFeatured) return 1
        if (a.isBestSeller && !b.isBestSeller) return -1
        if (!a.isBestSeller && b.isBestSeller) return 1
        return (b.rating || 0) - (a.rating || 0)
      })
    }

    return list
  },

  /**
   * Retrieves single product by ID
   */
  getProductById(id) {
    return MARKET_PRODUCTS.find((p) => p.id === id) || null
  },

  /**
   * Retrieves recommendations specifically tailored to farmer's active crop
   */
  getRecommendationsByCrop(cropName = 'Tomato') {
    if (!cropName) cropName = 'Tomato'
    const target = cropName.toLowerCase()

    // Find products tagging this crop or general agronomy essentials
    const matched = MARKET_PRODUCTS.filter((p) =>
      p.cropTags?.some((c) => c.toLowerCase() === target)
    )

    // Complement with high-rated farm tools, irrigation, or nutrition essentials
    const essentials = MARKET_PRODUCTS.filter((p) =>
      (p.category === 'nutrition' || p.category === 'tools' || p.category === 'irrigation') &&
      !matched.some((m) => m.id === p.id)
    )

    return [...matched, ...essentials].slice(0, 8)
  },

  /**
   * Retrieves featured highlight products for the hero banner
   */
  getFeaturedProducts() {
    return MARKET_PRODUCTS.filter((p) => p.isFeatured).slice(0, 6)
  },

  /**
   * Provides instant search suggestions
   */
  getSearchSuggestions(query = '') {
    const defaultChips = [
      'Tomato Seeds',
      'Battery Sprayer',
      'Drip Irrigation Kit',
      '19:19:19 NPK Fertilizer',
      'Neem Oil 10,000 PPM',
      'Soil NPK Sensor',
      'Mini Power Tiller',
      'Mulching Film'
    ]

    if (!query || !query.trim()) return defaultChips

    const q = query.toLowerCase().trim()
    const matches = new Set()

    MARKET_PRODUCTS.forEach((p) => {
      if (p.name.toLowerCase().includes(q)) matches.add(p.name)
      if (p.brand.toLowerCase().includes(q)) matches.add(p.brand)
      p.cropTags?.forEach((c) => {
        if (c.toLowerCase().includes(q)) matches.add(`${c} inputs`)
      })
    })

    return Array.from(matches).slice(0, 6)
  },

  /**
   * Compare verified prices across official marketplaces for a given product
   */
  compareProductPrices(productId) {
    const product = this.getProductById(productId)
    if (!product || !product.priceComparisons || product.priceComparisons.length === 0) {
      return null
    }

    const comparisons = product.priceComparisons.map((c) => ({
      ...c,
      savings: product.mrp ? product.mrp - c.price : 0
    }))

    // Sort by price ascending
    comparisons.sort((a, b) => a.price - b.price)

    const lowestPrice = comparisons[0]?.price
    const lowestMarketplace = comparisons[0]?.marketplace

    return {
      productId: product.id,
      productName: product.name,
      mrp: product.mrp,
      lowestPrice,
      lowestMarketplace,
      comparisons
    }
  }
}

export default marketService
