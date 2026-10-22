import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { TRANSLATIONS } from '../translations.js'

export const STORAGE_KEY_LANGUAGE = 'fasalDristhi_language'
export const STORAGE_KEY_ONBOARDED = 'CropSentinel_lang_selected'

// Canonical supported languages (ISO 639-1)
export const SUPPORTED_LANGUAGES = [
  {
    code: 'en',
    id: 'English',
    title: 'English',
    subtitle: 'Continue in English',
    flag: '🇮🇳'
  },
  {
    code: 'hi',
    id: 'Hindi',
    title: 'हिन्दी',
    subtitle: 'हिन्दी में जारी रखें',
    flag: '🇮🇳'
  },
  {
    code: 'mr',
    id: 'Marathi',
    title: 'मराठी',
    subtitle: 'मराठी मध्ये सुरू ठेवा',
    flag: '🇮🇳'
  },
  {
    code: 'bn',
    id: 'Bangla',
    title: 'বাংলা',
    subtitle: 'বাংলা ভাষায় চালিয়ে যান',
    flag: '🇮🇳'
  }
]

/**
 * Normalizes any incoming language identifier to standard ISO code: 'en' | 'hi' | 'mr' | 'bn'
 */
export function normalizeLanguage(lang) {
  if (!lang || typeof lang !== 'string') return 'en'
  const lower = lang.toLowerCase().trim()
  if (lower === 'hi' || lower === 'hindi') return 'hi'
  if (lower === 'mr' || lower === 'marathi') return 'mr'
  if (lower === 'bn' || lower === 'bangla' || lower === 'bengali') return 'bn'
  return 'en'
}

/**
 * Converts ISO code back to legacy display string ('English' | 'Hindi' | 'Marathi' | 'Bangla')
 */
export function getLegacyLanguageName(code) {
  const norm = normalizeLanguage(code)
  if (norm === 'hi') return 'Hindi'
  if (norm === 'mr') return 'Marathi'
  if (norm === 'bn') return 'Bangla'
  return 'English'
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguageInternal] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_LANGUAGE) || localStorage.getItem('CropSentinel_lang')
      return normalizeLanguage(stored)
    } catch {
      return 'en'
    }
  })

  // Synchronize with localStorage
  const setLanguage = useCallback((newLang) => {
    const normalized = normalizeLanguage(newLang)
    setLanguageInternal(normalized)
    try {
      localStorage.setItem(STORAGE_KEY_LANGUAGE, normalized)
      // Maintain backwards compatibility with legacy key
      localStorage.setItem('CropSentinel_lang', getLegacyLanguageName(normalized))
    } catch (e) {
      console.warn('Unable to persist language to localStorage', e)
    }
  }, [])

  // Safe translation helper: selected -> fallback English -> fallback key
  const t = useCallback((key) => {
    if (!key) return ''
    const currentDict = TRANSLATIONS[language] || TRANSLATIONS.English || {}
    const englishDict = TRANSLATIONS.English || {}
    return currentDict[key] ?? englishDict[key] ?? key
  }, [language])

  // Backward-compatible dictionary object (e.g. tDict.appName)
  const tDict = useMemo(() => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.English || {}
    const enDict = TRANSLATIONS.English || {}
    // Use Proxy so missing keys fall back gracefully to English or key itself
    return new Proxy(dict, {
      get(target, prop) {
        if (typeof prop === 'string') {
          return target[prop] ?? enDict[prop] ?? prop
        }
        return target[prop]
      }
    })
  }, [language])

  const legacyName = useMemo(() => getLegacyLanguageName(language), [language])

  const value = useMemo(() => ({
    language,                     // 'en' | 'hi' | 'mr' | 'bn'
    languageCode: language,
    legacyName,                   // 'English' | 'Hindi' | 'Marathi' | 'Bangla'
    setLanguage,                  // sets global state & saves to localStorage
    t,                            // safe function: t('key')
    tDict,                        // object access: tDict.appName
    supportedLanguages: SUPPORTED_LANGUAGES,
    isLanguageSupported: (code) => ['en', 'hi', 'mr', 'bn'].includes(normalizeLanguage(code))
  }), [language, legacyName, setLanguage, t, tDict])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return ctx
}
