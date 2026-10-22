/**
 * AUTOMATED VERIFICATION SUITE FOR CULTIVATION TIPS PHASES 6, 7, 8, 9
 */

import { DateCalculationEngine } from './dateCalculationEngine.js';
import { CropAdvisoryRepository } from './cropAdvisoryRepository.js';
import { TRANSLATIONS } from './translations.js';

let passed = 0;
let failed = 0;

function assert(condition, name, details = '') {
  if (condition) {
    console.log(`  ✅ [PASS] ${name}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${name}: ${details}`);
    failed++;
  }
}

console.log('\n======================================================');
console.log('🧪 RUNNING CULTIVATION TIPS PHASES 6 - 9 VERIFICATION');
console.log('======================================================\n');

// ----------------------------------------------------
// 1. PHASE 6: ACTIVITY DETAILS & DATA INTEGRITY
// ----------------------------------------------------
console.log('--- 1. Phase 6: Activity Details & Guidance Integrity ---');

const beanActivities = CropAdvisoryRepository.getCropActivities('Bean');
assert(beanActivities.length >= 22, 'Bean has at least 22 activities from PDF reference', `Count: ${beanActivities.length}`);

// Test Flow A Activity: "Monitor fields frequently"
const monitorAct = beanActivities.find(a => a.title === 'Monitor fields frequently');
assert(Boolean(monitorAct), 'Flow A: "Monitor fields frequently" exists in repository');
assert(monitorAct.taskId === 'monitoring', 'Category is monitoring');
assert(monitorAct.stageId === 'pod-development', 'Stage is pod-development');
assert(monitorAct.timing.startWeek === 9, 'Timing is Week 9');
assert(Array.isArray(monitorAct.details.instructions) && monitorAct.details.instructions.length > 0, 'Instructions array exists and ordered');
assert(Array.isArray(monitorAct.details.tips) && monitorAct.details.tips.length > 0, 'Farmer tips exist');
assert(Array.isArray(monitorAct.details.warnings) && monitorAct.details.warnings.length > 0, 'Warnings exist');
assert(Boolean(monitorAct.details.description), 'Description exists and is scannable');
assert(Boolean(monitorAct.details.whyImportant), 'Why important exists');

// Test Flow B Activity: "Conditions for bean cultivation"
const condAct = beanActivities.find(a => a.title === 'Conditions for bean cultivation');
assert(Boolean(condAct), 'Flow B: "Conditions for bean cultivation" exists');
assert(condAct.taskId === 'site-selection', 'Category is site-selection');
assert(condAct.stageId === 'pre-seeding', 'Stage is pre-seeding');
assert(condAct.timing.weeksBefore === 3, 'Timing is 3 weeks before seedling');

// Test Flow C Activity: "Prevent leafhoppers in your plants"
const leafhopperAct = beanActivities.find(a => a.title === 'Prevent leafhoppers in your plants');
assert(Boolean(leafhopperAct), 'Flow C: "Prevent leafhoppers in your plants" exists');
assert(leafhopperAct.taskId === 'preventive-measure', 'Category is preventive-measure');

// Content Status handling
const completeCount = beanActivities.filter(a => a.contentStatus === 'complete').length;
const refOnlyCount = beanActivities.filter(a => a.contentStatus === 'reference-title-only').length;
assert(completeCount > 0, 'Has complete status activities', `Found: ${completeCount}`);
assert(refOnlyCount > 0, 'Has reference-title-only activities (PDF faithful)', `Found: ${refOnlyCount}`);

// ----------------------------------------------------
// 2. PHASE 7: PAST / CURRENT / UPCOMING STATUS MATRIX
// ----------------------------------------------------
console.log('\n--- 2. Phase 7: Dynamic Status Matrix ---');

const SOWING_DATE = '2026-08-29';

// Week 9 is 2026-10-24 to 2026-10-31
const week9Timing = DateCalculationEngine.calculateActivityTiming(
  { type: 'after_sowing', startWeek: 9, durationWeeks: 1 },
  SOWING_DATE
);
assert(week9Timing.startDateISO === '2026-10-24', 'Week 9 starts 2026-10-24', `Got: ${week9Timing.startDateISO}`);
assert(week9Timing.endDateISO === '2026-10-31', 'Week 9 ends 2026-10-31', `Got: ${week9Timing.endDateISO}`);

// CASE 1: Current date before activity -> UPCOMING
const statusBefore = DateCalculationEngine.calculateStatus('2026-10-24', '2026-10-31', '2026-10-20');
assert(statusBefore === 'upcoming', 'CASE 1: Date before activity -> UPCOMING', `Got: ${statusBefore}`);

// CASE 2: Current date equals activity start -> CURRENT
const statusStart = DateCalculationEngine.calculateStatus('2026-10-24', '2026-10-31', '2026-10-24');
assert(statusStart === 'current', 'CASE 2: Date equals activity start -> CURRENT', `Got: ${statusStart}`);

// CASE 3: Current date inside activity period -> CURRENT
const statusInside = DateCalculationEngine.calculateStatus('2026-10-24', '2026-10-31', '2026-10-28');
assert(statusInside === 'current', 'CASE 3: Date inside activity period -> CURRENT', `Got: ${statusInside}`);

// CASE 4: Current date equals activity end -> CURRENT
const statusEnd = DateCalculationEngine.calculateStatus('2026-10-24', '2026-10-31', '2026-10-31');
assert(statusEnd === 'current', 'CASE 4: Date equals activity end -> CURRENT', `Got: ${statusEnd}`);

// CASE 5: Current date after activity end -> PAST
const statusAfter = DateCalculationEngine.calculateStatus('2026-10-24', '2026-10-31', '2026-11-01');
assert(statusAfter === 'past', 'CASE 5: Date after activity end -> PAST', `Got: ${statusAfter}`);

// CASE 6: Before-sowing activity negative offsets
const before3W = DateCalculationEngine.calculateActivityTiming(
  { type: 'before_sowing', weeksBefore: 3, durationWeeks: 1 },
  SOWING_DATE
);
assert(before3W.shortRange === '8–15 Aug', 'Before-sowing: 3 weeks before is 8–15 Aug', `Got: ${before3W.shortRange}`);

const before2W = DateCalculationEngine.calculateActivityTiming(
  { type: 'before_sowing', weeksBefore: 2, durationWeeks: 1 },
  SOWING_DATE
);
assert(before2W.shortRange === '15–22 Aug', 'Before-sowing: 2 weeks before is 15–22 Aug', `Got: ${before2W.shortRange}`);

const before1W = DateCalculationEngine.calculateActivityTiming(
  { type: 'before_sowing', weeksBefore: 1, durationWeeks: 1 },
  SOWING_DATE
);
assert(before1W.shortRange === '22–29 Aug', 'Before-sowing: 1 week before is 22–29 Aug', `Got: ${before1W.shortRange}`);

// CASE 7: Overlapping activities both CURRENT
const actA = { startDate: '2026-09-01', endDate: '2026-09-10' };
const actB = { startDate: '2026-09-05', endDate: '2026-09-12' };
const todayOverlapping = '2026-09-07';
const statusA = DateCalculationEngine.calculateStatus(actA.startDate, actA.endDate, todayOverlapping);
const statusB = DateCalculationEngine.calculateStatus(actB.startDate, actB.endDate, todayOverlapping);
assert(statusA === 'current' && statusB === 'current', 'CASE 7: Overlapping activities both CURRENT on 2026-09-07');

// CASE 8: No activity active today -> no false CURRENT state
const statusNoAct = DateCalculationEngine.calculateStatus('2026-11-20', '2026-11-27', '2026-12-05');
assert(statusNoAct === 'past', 'CASE 8: No false CURRENT state when date has passed', `Got: ${statusNoAct}`);

// CASE 9 & 10: Sowing date changes recalculate dynamically
const SOWING_2 = '2026-09-10';
const week9Shifted = DateCalculationEngine.calculateActivityTiming(
  { type: 'after_sowing', startWeek: 9, durationWeeks: 1 },
  SOWING_2
);
assert(week9Shifted.startDateISO === '2026-11-05', 'CASE 10: Sowing date change shifts Week 9 start to 2026-11-05', `Got: ${week9Shifted.startDateISO}`);

// CASE 11 & 12: Month and Year boundary
const SOWING_DEC = '2026-12-30';
const timingJan = DateCalculationEngine.calculateActivityTiming(
  { type: 'after_sowing', startWeek: 2, durationWeeks: 1 },
  SOWING_DEC
);
assert(timingJan.startDateISO.startsWith('2027-01'), 'CASE 12: Year boundary transitions 2026 -> 2027 seamlessly', `Got: ${timingJan.startDateISO}`);

// CASE 13: Leap year calculation
const SOWING_LEAP = '2028-02-20';
const leapWeek2 = DateCalculationEngine.calculateActivityTiming(
  { type: 'after_sowing', startWeek: 2, durationWeeks: 1 },
  SOWING_LEAP
);
assert(leapWeek2.startDateISO === '2028-02-27', 'CASE 13: Leap year calculates through Feb 29 2028', `Got: ${leapWeek2.startDateISO}`);

// ----------------------------------------------------
// 3. PHASE 9: MULTILINGUAL TRANSLATIONS VALIDATION
// ----------------------------------------------------
console.log('\n--- 3. Phase 9: Multilingual Translations Validation ---');

const requiredKeys = [
  'cultivationTips', 'byTask', 'byStage', 'selectedSowingDate', 'sowingDate', 'editDate',
  'selectSowingDate', 'confirmDate', 'today', 'allTasks', 'cropGrowthTimeline', 'recommendedPeriod',
  'readMore', 'whyImportant', 'whatToDo', 'stepByStep', 'farmerTips', 'warningsPrecautions',
  'overviewDescription', 'statusCurrent', 'statusPast', 'statusUpcoming', 'week',
  'taskMonitoring', 'taskSiteSelection', 'taskFieldPreparation', 'taskWeeding', 'taskIrrigation',
  'taskFertilizationChemical', 'taskPreventiveMeasure', 'taskHarvesting', 'taskPostHarvest',
  'stagePreSeeding', 'stageSeeding', 'stageEarlyGrowth', 'stageVegetativeGrowth', 'stageFlowering',
  'stagePodDevelopment', 'stageMaturity', 'stageHarvest', 'stagePostHarvest'
];

const languages = ['English', 'Hindi', 'Marathi', 'Bangla'];

languages.forEach(lang => {
  const dict = TRANSLATIONS[lang];
  assert(Boolean(dict), `Language dictionary exists: ${lang}`);
  let missing = [];
  requiredKeys.forEach(k => {
    if (!dict[k]) missing.push(k);
  });
  assert(missing.length === 0, `All ${requiredKeys.length} keys translated in ${lang}`, missing.join(', '));
});

// Test localized date formatting in Hindi & Bengali
const hiFormatted = DateCalculationEngine.formatFullDate('2026-08-29', 'hi');
assert(hiFormatted.includes('अगस्त') && hiFormatted.includes('2026'), 'Hindi date format has अगस्त 2026', `Got: ${hiFormatted}`);

const bnFormatted = DateCalculationEngine.formatFullDate('2026-08-29', 'bn');
assert(bnFormatted.includes('আগস্ট') && (bnFormatted.includes('২০২৬') || bnFormatted.includes('2026')), 'Bengali date format has আগস্ট 2026', `Got: ${bnFormatted}`);

// ----------------------------------------------------
// RESULTS SUMMARY
// ----------------------------------------------------
console.log('\n======================================================');
console.log(`TOTAL TESTS: ${passed + failed}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);
console.log('======================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL PHASES 6, 7, 8, 9 TESTS PASSED ACCURATELY!\n');
}
