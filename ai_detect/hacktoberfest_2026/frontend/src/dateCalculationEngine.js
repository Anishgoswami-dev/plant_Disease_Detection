/**
 * DATE CALCULATION ENGINE (Cultivation Tips Phases 6-9)
 * Timezone-safe, relative-timing crop calendar scheduler.
 * Converts relative agricultural timings (e.g. Week 9, 3 weeks before sowing)
 * into calendar date ranges, stage dates, and Past / Current / Upcoming status.
 * Fully supports localization for English, Hindi, Bengali, and Marathi.
 */

const LOCALIZED_MONTHS = {
  en: {
    short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    long: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  },
  hi: {
    short: ['जन', 'फर', 'मार्च', 'अप्रै', 'मई', 'जून', 'जुला', 'अग', 'सितं', 'अक्टू', 'नव', 'दिसं'],
    long: ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर']
  },
  bn: {
    short: ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'],
    long: ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর']
  },
  mr: {
    short: ['जाने', 'फेब्रु', 'मार्च', 'एप्रि', 'मे', 'जून', 'जुलै', 'ऑग', 'सप्टें', 'ऑक्टो', 'नोव्हें', 'डिसें'],
    long: ['जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून', 'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर']
  }
};

export const DateCalculationEngine = {
  /**
   * Helper to normalize language code ('en', 'hi', 'bn', 'mr' or 'English', 'Hindi', etc.)
   */
  normalizeLang(lang) {
    if (!lang) return 'en';
    const l = String(lang).toLowerCase().trim();
    if (l === 'hindi' || l.startsWith('hi')) return 'hi';
    if (l === 'bengali' || l === 'bangla' || l.startsWith('bn')) return 'bn';
    if (l === 'marathi' || l.startsWith('mr')) return 'mr';
    return 'en';
  },

  /**
   * Parse a date string or Date into a normalized local Date object at midnight 00:00:00.
   * Completely avoids UTC timezone shifting.
   */
  parseLocalDate(dateInput) {
    if (!dateInput) {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    }

    if (dateInput instanceof Date) {
      return new Date(dateInput.getFullYear(), dateInput.getMonth(), dateInput.getDate(), 0, 0, 0, 0);
    }

    if (typeof dateInput === 'string') {
      // Handle "YYYY-MM-DD"
      const matchIso = dateInput.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (matchIso) {
        const year = parseInt(matchIso[1], 10);
        const month = parseInt(matchIso[2], 10) - 1;
        const day = parseInt(matchIso[3], 10);
        return new Date(year, month, day, 0, 0, 0, 0);
      }

      // Handle "29 August 2026" or similar
      const parsed = new Date(dateInput);
      if (!isNaN(parsed.getTime())) {
        return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), 0, 0, 0, 0);
      }
    }

    const fallback = new Date();
    return new Date(fallback.getFullYear(), fallback.getMonth(), fallback.getDate(), 0, 0, 0, 0);
  },

  /**
   * Format date into "YYYY-MM-DD" string
   */
  formatToISODate(date) {
    const d = this.parseLocalDate(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  },

  /**
   * Format date into "29 August 2026" (Localized)
   */
  formatFullDate(date, lang = 'en') {
    const d = this.parseLocalDate(date);
    const code = this.normalizeLang(lang);
    const months = LOCALIZED_MONTHS[code]?.long || LOCALIZED_MONTHS.en.long;
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  },

  /**
   * Format date into "29 Aug 2026" (Localized)
   */
  formatShortDate(date, lang = 'en') {
    const d = this.parseLocalDate(date);
    const code = this.normalizeLang(lang);
    const months = LOCALIZED_MONTHS[code]?.short || LOCALIZED_MONTHS.en.short;
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  },

  /**
   * Format a date range into a farmer-friendly label
   * Example: "24–31 Oct" (without year) or "24 Oct – 31 Oct 2026" (with year)
   */
  formatDateRange(startDate, endDate, showYear = true, lang = 'en') {
    const s = this.parseLocalDate(startDate);
    const e = this.parseLocalDate(endDate);
    const code = this.normalizeLang(lang);
    const months = LOCALIZED_MONTHS[code]?.short || LOCALIZED_MONTHS.en.short;

    const sDay = s.getDate();
    const eDay = e.getDate();
    const sMonth = months[s.getMonth()];
    const eMonth = months[e.getMonth()];
    const sYear = s.getFullYear();
    const eYear = e.getFullYear();

    if (!showYear) {
      if (s.getMonth() === e.getMonth()) {
        return `${sDay}–${eDay} ${sMonth}`;
      }
      return `${sDay} ${sMonth}–${eDay} ${eMonth}`;
    }

    if (sYear === eYear) {
      if (s.getMonth() === e.getMonth()) {
        return `${sDay} – ${eDay} ${sMonth} ${sYear}`;
      }
      return `${sDay} ${sMonth} – ${eDay} ${eMonth} ${sYear}`;
    }

    return `${sDay} ${sMonth} ${sYear} – ${eDay} ${eMonth} ${eYear}`;
  },

  /**
   * Format full month name range: "24 October – 31 October 2026"
   */
  formatLongDateRange(startDate, endDate, lang = 'en') {
    const s = this.parseLocalDate(startDate);
    const e = this.parseLocalDate(endDate);
    const code = this.normalizeLang(lang);
    const months = LOCALIZED_MONTHS[code]?.long || LOCALIZED_MONTHS.en.long;

    const sDay = s.getDate();
    const eDay = e.getDate();
    const sMonth = months[s.getMonth()];
    const eMonth = months[e.getMonth()];
    const sYear = s.getFullYear();
    const eYear = e.getFullYear();

    if (sYear === eYear) {
      return `${sDay} ${sMonth} – ${eDay} ${eMonth} ${sYear}`;
    }

    return `${sDay} ${sMonth} ${sYear} – ${eDay} ${eMonth} ${eYear}`;
  },

  /**
   * Add / subtract days safely
   */
  addDays(date, days) {
    const d = this.parseLocalDate(date);
    d.setDate(d.getDate() + days);
    return d;
  },

  /**
   * Generate localized relative timing label (e.g. Week 9, 3 weeks before seedling)
   */
  formatRelativeLabel(timing, lang = 'en') {
    const code = this.normalizeLang(lang);

    if (timing.type === 'before_sowing') {
      const weeksBefore = timing.weeksBefore || 1;
      if (code === 'hi') {
        return `बुवाई से ${weeksBefore} सप्ताह पहले`;
      }
      if (code === 'bn') {
        return `বপনের ${weeksBefore} সপ্তাহ আগে`;
      }
      if (code === 'mr') {
        return `पेरणीपूर्वी ${weeksBefore} आठवडे`;
      }
      return timing.label || `${weeksBefore} ${weeksBefore === 1 ? 'week' : 'weeks'} before seedling`;
    }

    const startWeek = timing.startWeek || 1;
    if (code === 'hi') {
      return `सप्ताह ${startWeek}`;
    }
    if (code === 'bn') {
      return `সপ্তাহ ${startWeek}`;
    }
    if (code === 'mr') {
      return `आठवडा ${startWeek}`;
    }
    return timing.label || `Week ${startWeek}`;
  },

  /**
   * Calculate activity timing range and label based on sowing date
   */
  calculateActivityTiming(timing, sowingDate, lang = 'en') {
    const sDate = this.parseLocalDate(sowingDate);

    let startDate;
    let endDate;
    let relativeLabel = '';

    if (timing.type === 'before_sowing') {
      const weeksBefore = timing.weeksBefore || 1;
      const durationWeeks = timing.durationWeeks || 1;

      const startOffset = - (weeksBefore * 7);
      const endOffset = startOffset + (durationWeeks * 7);

      startDate = this.addDays(sDate, startOffset);
      endDate = this.addDays(sDate, endOffset);
      relativeLabel = this.formatRelativeLabel(timing, lang);
    } else {
      // after_sowing
      const startWeek = timing.startWeek || 1;
      const durationWeeks = timing.durationWeeks || 1;

      const startOffset = (startWeek - 1) * 7;
      const endOffset = startOffset + (durationWeeks * 7);

      startDate = this.addDays(sDate, startOffset);
      endDate = this.addDays(sDate, endOffset);
      relativeLabel = this.formatRelativeLabel(timing, lang);
    }

    return {
      startDate,
      endDate,
      startDateISO: this.formatToISODate(startDate),
      endDateISO: this.formatToISODate(endDate),
      relativeLabel,
      formattedRange: this.formatDateRange(startDate, endDate, true, lang),
      shortRange: this.formatDateRange(startDate, endDate, false, lang),
      formattedShortRange: this.formatDateRange(startDate, endDate, false, lang),
      formattedLongRange: this.formatLongDateRange(startDate, endDate, lang)
    };
  },

  /**
   * Compute status: 'past' | 'current' | 'upcoming'
   * Boundary rule:
   * today < start => upcoming
   * today >= start && today <= end => current
   * today > end => past
   */
  calculateStatus(startDate, endDate, referenceDate = null) {
    const today = this.parseLocalDate(referenceDate || new Date());
    const start = this.parseLocalDate(startDate);
    const end = this.parseLocalDate(endDate);

    if (today.getTime() > end.getTime()) {
      return 'past';
    }
    if (today.getTime() >= start.getTime() && today.getTime() <= end.getTime()) {
      return 'current';
    }
    return 'upcoming';
  },

  /**
   * Centralized helper to get status of an activity
   */
  getActivityStatus(activity, sowingDate, referenceDate = null) {
    const timingInfo = this.calculateActivityTiming(activity.timing, sowingDate);
    return this.calculateStatus(timingInfo.startDate, timingInfo.endDate, referenceDate);
  },

  /**
   * Centralized helper to get status of a stage
   */
  getStageStatus(stage, sowingDate, referenceDate = null) {
    const sDate = this.parseLocalDate(sowingDate);
    const startDate = this.addDays(sDate, stage.startOffsetDays);
    const endDate = this.addDays(sDate, stage.endOffsetDays);
    return this.calculateStatus(startDate, endDate, referenceDate);
  },

  /**
   * Enrich an activity object with calculated dates and status
   */
  enrichActivity(activity, sowingDate, referenceDate = null, lang = 'en') {
    const timingInfo = this.calculateActivityTiming(activity.timing, sowingDate, lang);
    const status = this.calculateStatus(timingInfo.startDate, timingInfo.endDate, referenceDate);

    return {
      ...activity,
      calculated: {
        startDate: timingInfo.startDate,
        endDate: timingInfo.endDate,
        relativeLabel: timingInfo.relativeLabel,
        dateRange: timingInfo.formattedRange,
        shortRange: timingInfo.shortRange,
        longDateRange: timingInfo.formattedLongRange,
        status // 'past' | 'current' | 'upcoming'
      }
    };
  },

  /**
   * Enrich all activities for a crop and sort deterministically
   */
  getEnrichedActivities(activities, sowingDate, referenceDate = null, lang = 'en') {
    const enriched = activities.map((act, idx) => ({
      ...this.enrichActivity(act, sowingDate, referenceDate, lang),
      _originalIndex: idx
    }));

    // Sort chronologically by startDate, then preserve repository order
    return enriched.sort((a, b) => {
      const timeDiff = a.calculated.startDate.getTime() - b.calculated.startDate.getTime();
      if (timeDiff !== 0) return timeDiff;
      return a._originalIndex - b._originalIndex;
    });
  },

  /**
   * Enrich crop stages with calculated date spans and completion status
   */
  getEnrichedStages(stages, sowingDate, referenceDate = null, lang = 'en') {
    const sDate = this.parseLocalDate(sowingDate);
    const today = this.parseLocalDate(referenceDate || new Date());

    return stages.map((stage) => {
      const startDate = this.addDays(sDate, stage.startOffsetDays);
      const endDate = this.addDays(sDate, stage.endOffsetDays);
      const status = this.calculateStatus(startDate, endDate, today);

      return {
        ...stage,
        calculated: {
          startDate,
          endDate,
          shortRange: this.formatDateRange(startDate, endDate, false, lang),
          dateRange: this.formatDateRange(startDate, endDate, true, lang),
          longDateRange: this.formatLongDateRange(startDate, endDate, lang),
          status // 'past' | 'current' | 'upcoming'
        }
      };
    });
  }
};
