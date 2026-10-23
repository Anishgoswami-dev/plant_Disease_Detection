/**
 * AUTOMATED TEST SUITE FOR CULTIVATION TIPS ENGINE & REPOSITORY
 * Validates all 20 Phase 2 test cases and Phase 3 data integrity requirements.
 */

import { DateCalculationEngine } from './dateCalculationEngine.js';
import { CropAdvisoryRepository } from './cropAdvisoryRepository.js';

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${testName}: ${details}`);
    failed++;
  }
}

console.log('\n======================================================');
console.log('🌱 RUNNING CULTIVATION TIPS ENGINE & REPOSITORY TESTS');
console.log('======================================================\n');

const SOWING_DATE = '2026-08-29'; // 29 August 2026

// Test 1: Sowing date 29 Aug 2026 -> Verify Week 1
const t1 = DateCalculationEngine.calculateActivityTiming({ type: 'after_sowing', startWeek: 1 }, SOWING_DATE);
assert(
  t1.formattedLongRange === '29 August – 5 September 2026',
  'Test 1: Sowing 29 August 2026 -> Verify Week 1 (29 August – 5 September 2026)',
  `Got: ${t1.formattedLongRange}`
);

// Test 2: Verify Week 4
const t2 = DateCalculationEngine.calculateActivityTiming({ type: 'after_sowing', startWeek: 4 }, SOWING_DATE);
assert(
  t2.formattedLongRange === '19 September – 26 September 2026',
  'Test 2: Verify Week 4 (19 September – 26 September 2026)',
  `Got: ${t2.formattedLongRange}`
);

// Test 3: Verify Week 7
const t3 = DateCalculationEngine.calculateActivityTiming({ type: 'after_sowing', startWeek: 7 }, SOWING_DATE);
assert(
  t3.formattedLongRange === '10 October – 17 October 2026',
  'Test 3: Verify Week 7 (10 October – 17 October 2026)',
  `Got: ${t3.formattedLongRange}`
);

// Test 4: Verify Week 9 (Monitor fields frequently)
const t4 = DateCalculationEngine.calculateActivityTiming({ type: 'after_sowing', startWeek: 9 }, SOWING_DATE);
assert(
  t4.formattedLongRange === '24 October – 31 October 2026',
  'Test 4: Verify Week 9 (24 October – 31 October 2026)',
  `Got: ${t4.formattedLongRange}`
);

// Test 5: Verify Week 11 (Bean harvest timing)
const t5 = DateCalculationEngine.calculateActivityTiming({ type: 'after_sowing', startWeek: 11 }, SOWING_DATE);
assert(
  t5.formattedLongRange === '7 November – 14 November 2026',
  'Test 5: Verify Week 11 (7 November – 14 November 2026)',
  `Got: ${t5.formattedLongRange}`
);

// Test 6: Verify Week 12
const t6 = DateCalculationEngine.calculateActivityTiming({ type: 'after_sowing', startWeek: 12 }, SOWING_DATE);
assert(
  t6.formattedLongRange === '14 November – 21 November 2026',
  'Test 6: Verify Week 12 (14 November – 21 November 2026)',
  `Got: ${t6.formattedLongRange}`
);

// Test 7: Verify Week 13
const t7 = DateCalculationEngine.calculateActivityTiming({ type: 'after_sowing', startWeek: 13 }, SOWING_DATE);
assert(
  t7.formattedLongRange === '21 November – 28 November 2026',
  'Test 7: Verify Week 13 (21 November – 28 November 2026)',
  `Got: ${t7.formattedLongRange}`
);

// Test 8: Verify 3 weeks before sowing
const t8 = DateCalculationEngine.calculateActivityTiming({ type: 'before_sowing', weeksBefore: 3 }, SOWING_DATE);
assert(
  t8.formattedLongRange === '8 August – 15 August 2026',
  'Test 8: Verify 3 weeks before sowing (8 August – 15 August 2026)',
  `Got: ${t8.formattedLongRange}`
);

// Test 9: Verify 2 weeks before sowing
const t9 = DateCalculationEngine.calculateActivityTiming({ type: 'before_sowing', weeksBefore: 2 }, SOWING_DATE);
assert(
  t9.formattedLongRange === '15 August – 22 August 2026',
  'Test 9: Verify 2 weeks before sowing (15 August – 22 August 2026)',
  `Got: ${t9.formattedLongRange}`
);

// Test 10: Verify 1 week before sowing
const t10 = DateCalculationEngine.calculateActivityTiming({ type: 'before_sowing', weeksBefore: 1 }, SOWING_DATE);
assert(
  t10.formattedLongRange === '22 August – 29 August 2026',
  'Test 10: Verify 1 week before sowing (22 August – 29 August 2026)',
  `Got: ${t10.formattedLongRange}`
);

// Test 11: Change sowing date to 10 September 2026 and verify recalculation
const NEW_SOWING = '2026-09-10';
const t11_w1 = DateCalculationEngine.calculateActivityTiming({ type: 'after_sowing', startWeek: 1 }, NEW_SOWING);
const t11_w9 = DateCalculationEngine.calculateActivityTiming({ type: 'after_sowing', startWeek: 9 }, NEW_SOWING);
assert(
  t11_w1.formattedLongRange === '10 September – 17 September 2026' &&
  t11_w9.formattedLongRange === '5 November – 12 November 2026',
  'Test 11: Change sowing date to 10 September 2026 and verify recalculation',
  `Got W1: ${t11_w1.formattedLongRange}, W9: ${t11_w9.formattedLongRange}`
);

// Test 12: Month boundary (e.g. 28 Feb 2026 non-leap year -> Week 1 crosses into March)
const t12 = DateCalculationEngine.calculateActivityTiming({ type: 'after_sowing', startWeek: 1 }, '2026-02-28');
assert(
  t12.formattedLongRange === '28 February – 7 March 2026',
  'Test 12: Month boundary handling (28 February – 7 March 2026)',
  `Got: ${t12.formattedLongRange}`
);

// Test 13: Year boundary (25 Dec 2026 -> Week 2 crosses into Jan 2027)
const t13 = DateCalculationEngine.calculateActivityTiming({ type: 'after_sowing', startWeek: 2 }, '2026-12-25');
assert(
  t13.formattedLongRange === '1 January – 8 January 2027',
  'Test 13: Year boundary crossing (1 January – 8 January 2027)',
  `Got: ${t13.formattedLongRange}`
);

// Test 14: Leap year handling (2028 is a leap year; 28 Feb + 7 days = 6 March)
const t14 = DateCalculationEngine.calculateActivityTiming({ type: 'after_sowing', startWeek: 1 }, '2028-02-28');
assert(
  t14.formattedLongRange === '28 February – 6 March 2028',
  'Test 14: Leap year handling (28 February – 6 March 2028 in 2028)',
  `Got: ${t14.formattedLongRange}`
);

// Test 15: Past status
// For activity range 24–31 October 2026, if today is 1 November 2026 -> PAST
const statusPast = DateCalculationEngine.calculateStatus('2026-10-24', '2026-10-31', '2026-11-01');
assert(
  statusPast === 'past',
  'Test 15: Status is PAST when reference date is after activity end date',
  `Got: ${statusPast}`
);

// Test 16: Current status
// If today is 27 October 2026, status inside 24–31 October 2026 -> CURRENT
const statusCurrent = DateCalculationEngine.calculateStatus('2026-10-24', '2026-10-31', '2026-10-27');
assert(
  statusCurrent === 'current',
  'Test 16: Status is CURRENT when reference date falls inside activity date range',
  `Got: ${statusCurrent}`
);

// Test 17: Upcoming status
// If today is 20 October 2026, status for 24–31 October 2026 -> UPCOMING
const statusUpcoming = DateCalculationEngine.calculateStatus('2026-10-24', '2026-10-31', '2026-10-20');
assert(
  statusUpcoming === 'upcoming',
  'Test 17: Status is UPCOMING when reference date is before activity start date',
  `Got: ${statusUpcoming}`
);

// Test 18: Multiple activities in same week receive identical date ranges
const actAphids = DateCalculationEngine.calculateActivityTiming({ type: 'after_sowing', startWeek: 2 }, SOWING_DATE);
const actLeafMiners = DateCalculationEngine.calculateActivityTiming({ type: 'after_sowing', startWeek: 2 }, SOWING_DATE);
assert(
  actAphids.formattedLongRange === actLeafMiners.formattedLongRange &&
  actAphids.formattedLongRange === '5 September – 12 September 2026',
  'Test 18: Multiple activities in same week receive identical calculated date range',
  `Aphids: ${actAphids.formattedLongRange}, Miners: ${actLeafMiners.formattedLongRange}`
);

// Test 19: Switch Bean -> Rice
const beanActivities = CropAdvisoryRepository.getCropActivities('Bean');
const riceActivities = CropAdvisoryRepository.getCropActivities('Rice');
const beanHasOnlyBean = beanActivities.every((a) => a.cropId === 'Bean');
const riceHasOnlyRice = riceActivities.every((a) => a.cropId === 'Rice');
assert(
  beanHasOnlyBean && riceHasOnlyRice && beanActivities.length > 0 && riceActivities.length > 0,
  'Test 19: Switch Bean -> Rice correctly loads isolated crop datasets',
  `Bean count: ${beanActivities.length}, Rice count: ${riceActivities.length}`
);

// Test 20: Switch Rice -> Wheat
const wheatActivities = CropAdvisoryRepository.getCropActivities('Wheat');
const wheatHasOnlyWheat = wheatActivities.every((a) => a.cropId === 'Wheat');
assert(
  wheatHasOnlyWheat && wheatActivities.length > 0,
  'Test 20: Switch Rice -> Wheat loads distinct crop activities',
  `Wheat count: ${wheatActivities.length}`
);

// Test 21: Cross-View Consistency (Same object reference in By Task and By Stage)
const taskSiteAct = CropAdvisoryRepository.getActivitiesByTask('Bean', 'site-selection').find((a) => a.id === 'bean-site-001');
const stagePreseedAct = CropAdvisoryRepository.getActivitiesByStage('Bean', 'pre-seeding').find((a) => a.id === 'bean-site-001');
assert(
  taskSiteAct === stagePreseedAct && taskSiteAct !== undefined,
  'Test 21: Cross-View Consistency: By Task and By Stage reference identical underlying activity object',
  `Task ref: ${taskSiteAct?.id}, Stage ref: ${stagePreseedAct?.id}`
);

// Test 22: Chronological Sorting preserves repository order for same-period activities
const enrichedBean = DateCalculationEngine.getEnrichedActivities(beanActivities, SOWING_DATE);
const idxAphids = enrichedBean.findIndex((a) => a.id === 'bean-prev-002');
const idxMiners = enrichedBean.findIndex((a) => a.id === 'bean-prev-003');
assert(
  idxAphids !== -1 && idxMiners !== -1 && idxAphids < idxMiners,
  'Test 22: Preserved Chronological Sorting: Same-period activities preserve repository-defined order',
  `Aphids index: ${idxAphids}, Leaf Miners index: ${idxMiners}`
);

// Test 23: Pre-seeding sub-category assignment
const actConditions = CropAdvisoryRepository.getActivity('bean-site-001');
const actBroadBean = CropAdvisoryRepository.getActivity('bean-sel-001');
const actFrenchBean = CropAdvisoryRepository.getActivity('bean-sel-002');
const actBasalFert = CropAdvisoryRepository.getActivity('bean-fert-001');
assert(
  actConditions.categoryName === 'Site Selection' &&
  actBroadBean.categoryName === 'Plant Selection' &&
  actFrenchBean.categoryName === 'Plant Selection' &&
  actBasalFert.categoryName === 'Fertilization Chemical' &&
  actConditions.stageId === 'pre-seeding' &&
  actBroadBean.stageId === 'pre-seeding' &&
  actFrenchBean.stageId === 'pre-seeding' &&
  actBasalFert.stageId === 'pre-seeding',
  'Test 23: Pre-seeding Reference Sub-Categories: Site Selection, Plant Selection & Fertilization Chemical',
  `Conditions: ${actConditions.categoryName}, Broad: ${actBroadBean.categoryName}, Fert: ${actBasalFert.categoryName}`
);

// Test 24: Short date range formatting (farmer-friendly "24–31 Oct")
const timingWeek9 = DateCalculationEngine.calculateActivityTiming({ type: 'after_sowing', startWeek: 9 }, SOWING_DATE);
assert(
  timingWeek9.shortRange === '24–31 Oct',
  'Test 24: Short date range formatting produces "24–31 Oct" without redundant year on mobile',
  `Got: ${timingWeek9.shortRange}`
);

// Additional: Validate Repository Integrity
const repoValidation = CropAdvisoryRepository.validateRepository();
assert(
  repoValidation.valid === true,
  'Test Repository Integrity: All Bean activities have valid IDs, tasks, stages, and timing',
  `Errors: ${JSON.stringify(repoValidation.errors)}`
);

console.log('\n======================================================');
console.log(`🏁 TEST EXECUTION FINISHED: ${passed} Passed, ${failed} Failed`);
console.log('======================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
