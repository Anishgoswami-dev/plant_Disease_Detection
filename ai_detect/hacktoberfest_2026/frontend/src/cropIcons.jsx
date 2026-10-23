import React, { useState } from 'react'

// Real High-Resolution Photographic Images for the 30 crops
export const CROP_REAL_IMAGES = {
  'soybean': 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=200&auto=format&fit=crop&q=80',
  'rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&auto=format&fit=crop&q=80',
  'paddy': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&auto=format&fit=crop&q=80',
  'jowar': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&auto=format&fit=crop&q=80',
  'sorghum': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&auto=format&fit=crop&q=80',
  'cotton': 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=200&auto=format&fit=crop&q=80',
  'sugarcane': 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=200&auto=format&fit=crop&q=80',
  'maize': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=200&auto=format&fit=crop&q=80',
  'corn': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=200&auto=format&fit=crop&q=80',
  'wheat': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&auto=format&fit=crop&q=80',
  'tur': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=200&auto=format&fit=crop&q=80',
  'arhar': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=200&auto=format&fit=crop&q=80',
  'pigeon pea': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=200&auto=format&fit=crop&q=80',
  'gram': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&auto=format&fit=crop&q=80',
  'chana': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&auto=format&fit=crop&q=80',
  'groundnut': 'https://images.unsplash.com/photo-1528751014936-863e6e7a319c?w=200&auto=format&fit=crop&q=80',
  'peanut': 'https://images.unsplash.com/photo-1528751014936-863e6e7a319c?w=200&auto=format&fit=crop&q=80',
  'bajra': 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=200&auto=format&fit=crop&q=80',
  'pearl millet': 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=200&auto=format&fit=crop&q=80',
  'millet': 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=200&auto=format&fit=crop&q=80',
  'urad': 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=200&auto=format&fit=crop&q=80',
  'black gram': 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=200&auto=format&fit=crop&q=80',
  'moong': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&auto=format&fit=crop&q=80',
  'green gram': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&auto=format&fit=crop&q=80',
  'sunflower': 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=200&auto=format&fit=crop&q=80',
  'safflower': 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=200&auto=format&fit=crop&q=80',
  'kardai': 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=200&auto=format&fit=crop&q=80',
  'onion': 'https://images.unsplash.com/photo-1508747703725-719777637510?w=200&auto=format&fit=crop&q=80',
  'grapes': 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=200&auto=format&fit=crop&q=80',
  'grape': 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=200&auto=format&fit=crop&q=80',
  'orange': 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=200&auto=format&fit=crop&q=80',
  'pomegranate': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=200&auto=format&fit=crop&q=80',
  'banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&auto=format&fit=crop&q=80',
  'mango': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=200&auto=format&fit=crop&q=80',
  'tomato': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&auto=format&fit=crop&q=80',
  'potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&auto=format&fit=crop&q=80',
  'chilli': 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=200&auto=format&fit=crop&q=80',
  'chili': 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=200&auto=format&fit=crop&q=80',
  'capsicum': 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=200&auto=format&fit=crop&q=80',
  'cabbage': 'https://images.unsplash.com/photo-1551893478-d726eaf0442c?w=200&auto=format&fit=crop&q=80',
  'cauliflower': 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=200&auto=format&fit=crop&q=80',
  'brinjal': 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=200&auto=format&fit=crop&q=80',
  'eggplant': 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=200&auto=format&fit=crop&q=80',
  'okra': 'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=200&auto=format&fit=crop&q=80',
  'bhindi': 'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=200&auto=format&fit=crop&q=80',
  'guava': 'https://images.unsplash.com/photo-1543083477-4f785aeafaa9?w=200&auto=format&fit=crop&q=80',
  'papaya': 'https://images.unsplash.com/photo-1617112848923-cc2234396a8d?w=200&auto=format&fit=crop&q=80'
}

// Function to find the real photo for a crop name
export function getCropRealImageUrl(name) {
  if (!name) return null
  const n = name.toLowerCase().trim()
  
  // Direct match
  if (CROP_REAL_IMAGES[n]) return CROP_REAL_IMAGES[n]
  
  // Keyword containment match
  const keys = Object.keys(CROP_REAL_IMAGES)
  for (const k of keys) {
    if (n.includes(k)) return CROP_REAL_IMAGES[k]
  }
  return null
}

export const CropIcon = ({ name, size = 44, className = '' }) => {
  const [hasError, setHasError] = useState(false)
  const imgUrl = getCropRealImageUrl(name)

  if (imgUrl && !hasError) {
    return (
      <img
        src={imgUrl}
        alt={name || 'crop'}
        className={`crop-real-photo-img ${className}`}
        loading="lazy"
        onError={() => setHasError(true)}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          objectFit: 'cover',
          display: 'block',
          border: '1px solid rgba(0,0,0,0.06)'
        }}
      />
    )
  }

  // Graceful Fallback if image fails to load
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ecfdf5',
        fontSize: `${Math.round(size * 0.55)}px`
      }}
      className={className}
    >
      🌱
    </div>
  )
}
