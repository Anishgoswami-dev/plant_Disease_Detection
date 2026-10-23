/**
 * 🌿 30-CROP AGRONOMIC CONFIGURATION & CROP CALENDAR KNOWLEDGE BASE
 * Production-ready agronomic dataset based on ICAR (Indian Council of Agricultural Research)
 * and State Agricultural Universities (SAUs) guidelines.
 * 
 * Supports all 30 crops of Fasal Dristhi:
 * 1. Soybean, 2. Rice (Paddy), 3. Jowar (Sorghum), 4. Cotton, 5. Sugarcane,
 * 6. Maize, 7. Wheat, 8. Tur / Arhar, 9. Gram / Chana, 10. Groundnut,
 * 11. Bajra, 12. Urad, 13. Moong, 14. Sunflower, 15. Safflower (Kardai),
 * 16. Onion, 17. Grapes, 18. Orange, 19. Pomegranate, 20. Banana,
 * 21. Mango, 22. Tomato, 23. Potato, 24. Chilli, 25. Cabbage,
 * 26. Cauliflower, 27. Brinjal, 28. Okra / Bhindi, 29. Guava, 30. Papaya
 */

export const CROPS_CONFIG_30 = {
  'Soybean': {
    id: 'Soybean',
    name: 'Soybean',
    scientificName: 'Glycine max',
    season: 'Kharif',
    totalDurationDays: 95,
    criticalStages: ['Germination', 'Vegetative', 'Flowering', 'Pod Development', 'Maturity'],
    stages: [
      { name: 'Sowing & Germination', startDay: 0, endDay: 10, desc: 'Seedling emergence and initial root nodule formation' },
      { name: 'Vegetative Growth', startDay: 11, endDay: 35, desc: 'Vigorous trifoliate leaf expansion and branch formation' },
      { name: 'Flowering', startDay: 36, endDay: 55, desc: 'Blossom initiation and peak floral bloom; critical moisture period' },
      { name: 'Pod Development & Seed Filling', startDay: 56, endDay: 80, desc: 'Pod elongation, seed swelling; moisture stress drastically reduces yield' },
      { name: 'Maturity & Harvesting', startDay: 81, endDay: 95, desc: 'Leaves yellow and drop; pods turn brown; harvest at 14% moisture' }
    ],
    irrigation: {
      criticalDays: [35, 55, 70],
      sensitivity: 'HIGH_AT_FLOWERING',
      guidance: 'Soybean is susceptible to waterlogging. Irrigate during pod filling if dry spell exceeds 10 days, but avoid irrigation if recent rain occurred.'
    },
    nutrientReminders: [
      { day: 0, title: 'Basal Fertilization', message: 'Apply recommended N:P:K (30:60:40 kg/ha) + Single Super Phosphate for Sulphur at sowing.' },
      { day: 30, title: 'Foliar Nutrient Booster', message: 'Consider foliar spray of 19:19:19 @ 1% or Urea @ 2% before flowering if foliage looks pale.' }
    ],
    weedingReminders: [
      { day: 20, message: 'First manual or mechanical weeding is critical between 18-22 DAS to avoid early crop-weed competition.' },
      { day: 40, message: 'Second light hoeing before flowering canopy closes.' }
    ],
    pestsAndDiseases: ['Stem Fly', 'Spodoptera / Tobacco Caterpillar', 'Yellow Mosaic Virus', 'Rust', 'Anthracnose'],
    weatherSensitivities: { maxTemp: 38, minTemp: 15, heavyRainSensitive: true }
  },

  'Rice (Paddy)': {
    id: 'Rice',
    name: 'Rice (Paddy)',
    scientificName: 'Oryza sativa',
    season: 'Kharif / Rabi',
    totalDurationDays: 120,
    criticalStages: ['Nursery', 'Tillering', 'Panicle Initiation', 'Flowering', 'Grain Filling', 'Harvest'],
    stages: [
      { name: 'Nursery & Emergence', startDay: 0, endDay: 20, desc: 'Wet bed or dry bed seedling development' },
      { name: 'Transplanting & Tillering', startDay: 21, endDay: 50, desc: 'Transplanting 21-day seedlings and active tiller formation' },
      { name: 'Panicle Initiation', startDay: 51, endDay: 75, desc: 'Inflorescence development inside leaf sheath' },
      { name: 'Flowering & Anthesis', startDay: 76, endDay: 90, desc: 'Panicle emergence and pollination' },
      { name: 'Milking & Dough Stage', startDay: 91, endDay: 110, desc: 'Grain ripening and starch accumulation' },
      { name: 'Maturity & Harvest', startDay: 111, endDay: 120, desc: 'Golden yellow panicles; drain field 10 days before harvest' }
    ],
    irrigation: {
      criticalDays: [25, 55, 75, 95],
      sensitivity: 'CONTINUOUS_SATURATION',
      guidance: 'Maintain 2-5 cm standing water during tillering and panicle emergence. Drain field 10 days before planned harvest.'
    },
    nutrientReminders: [
      { day: 22, title: 'Basal NPK & Zinc', message: 'Apply 50% Nitrogen + 100% Phosphorus and Potash + Zinc Sulphate @ 25 kg/ha at transplanting.' },
      { day: 45, title: 'Active Tillering Nitrogen Top-Dress', message: 'Top-dress 25% Nitrogen (Urea) at maximum tillering stage.' },
      { day: 75, title: 'Panicle Initiation Nitrogen Top-Dress', message: 'Top-dress remaining 25% Nitrogen at panicle initiation.' }
    ],
    weedingReminders: [
      { day: 28, message: 'Operate cono-weeder or manual weeding at 25-30 days after transplanting.' },
      { day: 48, message: 'Second weeding to eliminate late grassy weeds.' }
    ],
    pestsAndDiseases: ['Yellow Stem Borer', 'Brown Plant Hopper (BPH)', 'Bacterial Leaf Blight (BLB)', 'Blast', 'Sheath Blight'],
    weatherSensitivities: { maxTemp: 40, minTemp: 14, heavyRainSensitive: false }
  },

  'Jowar (Sorghum)': {
    id: 'Jowar',
    name: 'Jowar (Sorghum)',
    scientificName: 'Sorghum bicolor',
    season: 'Kharif / Rabi',
    totalDurationDays: 105,
    criticalStages: ['Emergence', 'Vegetative', 'Booting', 'Flowering', 'Grain Filling', 'Maturity'],
    stages: [
      { name: 'Emergence & Seedling', startDay: 0, endDay: 15, desc: 'Collar leaf emergence and primary root establishment' },
      { name: 'Vegetative Stem Elongation', startDay: 16, endDay: 45, desc: 'Rapid stem extension and leaf whorl development' },
      { name: 'Booting & Heading', startDay: 46, endDay: 65, desc: 'Flag leaf expansion and head emergence' },
      { name: 'Flowering & Grain Filling', startDay: 66, endDay: 85, desc: 'Pollination and soft-to-hard dough transition' },
      { name: 'Physiological Maturity', startDay: 86, endDay: 105, desc: 'Black layer formation on grain base indicating maturity' }
    ],
    irrigation: {
      criticalDays: [30, 55, 75],
      sensitivity: 'DROUGHT_TOLERANT',
      guidance: 'Drought hardy crop. Requires life-saving irrigation at primordial initiation and grain filling if monsoon fails.'
    },
    nutrientReminders: [
      { day: 0, title: 'Basal Dose', message: 'Apply 50% N + 100% P & K (80:40:40 kg/ha) at sowing.' },
      { day: 35, title: 'Knee-high Top Dressing', message: 'Top-dress remaining 50% Nitrogen during knee-high stage.' }
    ],
    weedingReminders: [
      { day: 25, message: 'Perform hand weeding or inter-cultivation at 20-25 DAS to control weeds.' }
    ],
    pestsAndDiseases: ['Shoot Fly', 'Stem Borer', 'Fall Armyworm', 'Grain Mold', 'Anthracnose'],
    weatherSensitivities: { maxTemp: 42, minTemp: 12, heavyRainSensitive: false }
  },

  'Cotton': {
    id: 'Cotton',
    name: 'Cotton',
    scientificName: 'Gossypium hirsutum',
    season: 'Kharif',
    totalDurationDays: 160,
    criticalStages: ['Emergence', 'Square Formation', 'Flowering', 'Boll Development', 'Boll Bursting', 'Harvest'],
    stages: [
      { name: 'Emergence & Early Vegetative', startDay: 0, endDay: 35, desc: 'Root deepening and monopodial branch development' },
      { name: 'Squaring (Bud Initiation)', startDay: 36, endDay: 60, desc: 'Sympodial fruiting branches and square appearance' },
      { name: 'Peak Flowering', startDay: 61, endDay: 90, desc: 'White to pink flowers; highly sensitive to moisture and pest injury' },
      { name: 'Boll Development', startDay: 91, endDay: 125, desc: 'Rapid boll enlargement and fiber synthesis' },
      { name: 'Boll Bursting & Picking', startDay: 126, endDay: 160, desc: 'Capsules burst exposing fluffy white lint for sequential picking' }
    ],
    irrigation: {
      criticalDays: [45, 75, 100, 120],
      sensitivity: 'HIGH_AT_BOLL_FORMATION',
      guidance: 'Maintain moderate moisture. Avoid heavy irrigation during peak flowering to prevent square and flower shedding.'
    },
    nutrientReminders: [
      { day: 0, title: 'Basal NPK Application', message: 'Apply 20% N + full P2O5 and K2O at sowing.' },
      { day: 45, title: 'Square Initiation Split', message: 'Top-dress 40% N along with Magnesium Sulphate to prevent leaf reddening.' },
      { day: 75, title: 'Peak Flowering Split', message: 'Top-dress remaining 40% N and spray 13:0:45 (Potassium Nitrate 1%) for boll size.' }
    ],
    weedingReminders: [
      { day: 25, message: 'First inter-cultivation and blade harrowing between rows.' },
      { day: 50, message: 'Second hand weeding before canopy closure.' }
    ],
    pestsAndDiseases: ['Pink Bollworm', 'Whitefly', 'Thrips', 'Aphids', 'Bacterial Blight', 'Grey Mildew'],
    weatherSensitivities: { maxTemp: 42, minTemp: 16, heavyRainSensitive: true }
  },

  'Sugarcane': {
    id: 'Sugarcane',
    name: 'Sugarcane',
    scientificName: 'Saccharum officinarum',
    season: 'Annual / Perennial',
    totalDurationDays: 360,
    criticalStages: ['Germination', 'Tillering', 'Grand Growth', 'Maturity'],
    stages: [
      { name: 'Germination & Sprouting', startDay: 0, endDay: 45, desc: 'Eye-bud sprouting and sett root development' },
      { name: 'Tillering Phase', startDay: 46, endDay: 120, desc: 'Shoot multiplication and mother stool establishment' },
      { name: 'Grand Growth Phase', startDay: 121, endDay: 270, desc: 'Rapid internode elongation and cane biomass accumulation' },
      { name: 'Ripening & Maturity', startDay: 271, endDay: 360, desc: 'Sucrose synthesis and storage in stalk internodes' }
    ],
    irrigation: {
      criticalDays: [15, 45, 90, 150, 210, 270],
      sensitivity: 'HIGH_WATER_CONSUMER',
      guidance: 'Requires frequent irrigation every 10-12 days in summer and 15-20 days in winter. Withhold water 15 days before harvest to concentrate sucrose.'
    },
    nutrientReminders: [
      { day: 0, title: 'Basal Set Application', message: 'Apply 33% N + full P2O5 and 50% K2O in furrow bottom.' },
      { day: 45, title: 'Tillering Top-Dress', message: 'Apply second dose of 33% N.' },
      { day: 100, title: 'Earthing-up Split', message: 'Apply final 33% N + remaining K2O followed by deep earthing up.' }
    ],
    weedingReminders: [
      { day: 30, message: 'First intercultural hoeing.' },
      { day: 60, message: 'Second weeding and light earthing up.' }
    ],
    pestsAndDiseases: ['Early Shoot Borer', 'Top Borer', 'Pyrilla', 'Red Rot', 'Smut', 'Grassy Shoot'],
    weatherSensitivities: { maxTemp: 44, minTemp: 10, heavyRainSensitive: false }
  },

  'Maize': {
    id: 'Maize',
    name: 'Maize',
    scientificName: 'Zea mays',
    season: 'Kharif / Rabi / Spring',
    totalDurationDays: 105,
    criticalStages: ['Seedling', 'Knee High', 'Tasseling', 'Silking', 'Grain Filling', 'Maturity'],
    stages: [
      { name: 'Seedling & Emergence', startDay: 0, endDay: 20, desc: 'Coleoptile emergence and early root anchoring' },
      { name: 'Knee High Phase', startDay: 21, endDay: 45, desc: 'Rapid vegetative stem thickness and internode expansion' },
      { name: 'Tasseling & Pollen Shed', startDay: 46, endDay: 60, desc: 'Male tassel emergence; extremely vulnerable to moisture stress' },
      { name: 'Silking & Ear Formation', startDay: 61, endDay: 75, desc: 'Female silk emergence and kernel fertilization' },
      { name: 'Dough Stage & Grain Filling', startDay: 76, endDay: 95, desc: 'Starch deposition in kernels' },
      { name: 'Physiological Maturity', startDay: 96, endDay: 105, desc: 'Black layer on kernel tips and husk browning' }
    ],
    irrigation: {
      criticalDays: [45, 60, 75],
      sensitivity: 'CRITICAL_AT_TASSELING_SILKING',
      guidance: 'Moisture stress during tasseling and silking can cause 50% yield reduction. Irrigate if dry, but ensure furrow drainage.'
    },
    nutrientReminders: [
      { day: 0, title: 'Basal NPK', message: 'Apply 1/3rd N + 100% P and K (120:60:40 kg/ha).' },
      { day: 30, title: 'Knee-high Top-Dress', message: 'Top-dress 1/3rd N (Urea) and earth up.' },
      { day: 55, title: 'Pre-Tasseling Top-Dress', message: 'Top-dress final 1/3rd N just before tassel emergence.' }
    ],
    weedingReminders: [
      { day: 20, message: 'Intercultivation or manual weeding at 15-20 DAS.' }
    ],
    pestsAndDiseases: ['Fall Armyworm (FAW)', 'Stem Borer', 'Maydis Leaf Blight', 'Banded Leaf and Sheath Blight'],
    weatherSensitivities: { maxTemp: 40, minTemp: 12, heavyRainSensitive: true }
  },

  'Wheat': {
    id: 'Wheat',
    name: 'Wheat',
    scientificName: 'Triticum aestivum',
    season: 'Rabi',
    totalDurationDays: 125,
    criticalStages: ['CRI Stage', 'Tillering', 'Jointing', 'Flowering', 'Milk Stage', 'Dough & Maturity'],
    stages: [
      { name: 'Crown Root Initiation (CRI)', startDay: 0, endDay: 25, desc: 'Most critical stage for primary root establishment' },
      { name: 'Tillering', startDay: 26, endDay: 45, desc: 'Secondary tiller formation and shoot multiplication' },
      { name: 'Jointing & Stem Elongation', startDay: 46, endDay: 65, desc: 'First node appearance above soil level' },
      { name: 'Flowering & Anthesis', startDay: 66, endDay: 85, desc: 'Ear emergence and fertilization' },
      { name: 'Milking & Dough Stage', startDay: 86, endDay: 110, desc: 'Grain formation and kernel hardening' },
      { name: 'Harvest & Maturity', startDay: 111, endDay: 125, desc: 'Straw turns golden; grains harden below 12% moisture' }
    ],
    irrigation: {
      criticalDays: [21, 45, 65, 85, 105],
      sensitivity: 'CRITICAL_AT_CRI_STAGE',
      guidance: 'Irrigation at CRI stage (21 DAS) is non-negotiable for root establishment. Subsequent waterings at tillering, flowering, and grain filling.'
    },
    nutrientReminders: [
      { day: 0, title: 'Basal Dose', message: 'Apply 50% N + 100% P & K (120:60:40 kg/ha) at sowing.' },
      { day: 21, title: 'First Irrigation Top-Dress', message: 'Top-dress 25% N immediately after first CRI irrigation.' },
      { day: 45, title: 'Second Irrigation Top-Dress', message: 'Top-dress remaining 25% N at tillering.' }
    ],
    weedingReminders: [
      { day: 30, message: 'Weed management at 30-35 DAS before canopy closes.' }
    ],
    pestsAndDiseases: ['Yellow Rust', 'Brown / Leaf Rust', 'Karnal Bunt', 'Loose Smut', 'Aphids', 'Termites'],
    weatherSensitivities: { maxTemp: 32, minTemp: 4, heavyRainSensitive: false }
  },

  'Tur / Arhar (Pigeon Pea)': {
    id: 'Tur',
    name: 'Tur / Arhar (Pigeon Pea)',
    scientificName: 'Cajanus cajan',
    season: 'Kharif',
    totalDurationDays: 160,
    criticalStages: ['Seedling', 'Branching', 'Flowering', 'Pod Development', 'Maturity'],
    stages: [
      { name: 'Seedling & Establishment', startDay: 0, endDay: 30, desc: 'Deep taproot elongation' },
      { name: 'Branching & Canopy Development', startDay: 31, endDay: 70, desc: 'Dense bushy branch expansion' },
      { name: 'Flower Bud & Blossom', startDay: 71, endDay: 105, desc: 'Abundant yellow-red blossoms' },
      { name: 'Pod Formation & Filling', startDay: 106, endDay: 140, desc: 'Green to striped pod filling' },
      { name: 'Maturity & Harvest', startDay: 141, endDay: 160, desc: '80% pods turn brown; harvest plants' }
    ],
    irrigation: {
      criticalDays: [70, 110],
      sensitivity: 'DEEP_ROOTED_DROUGHT_TOLERANT',
      guidance: 'Drought tolerant deep taproot. Protect against waterlogging; provide protective irrigation only at flowering and pod filling if dry.'
    },
    nutrientReminders: [
      { day: 0, title: 'Basal Fertilizer', message: 'Apply 25:50:25 kg/ha N:P:K + Rhizobium seed treatment.' }
    ],
    weedingReminders: [
      { day: 25, message: 'First weeding at 20-25 DAS.' },
      { day: 50, message: 'Second weeding at 45-50 DAS.' }
    ],
    pestsAndDiseases: ['Pod Borer (Helicoverpa)', 'Pod Fly', 'Fusarium Wilt', 'Sterility Mosaic Disease'],
    weatherSensitivities: { maxTemp: 40, minTemp: 12, heavyRainSensitive: true }
  },

  'Gram / Chana': {
    id: 'Gram',
    name: 'Gram / Chana',
    scientificName: 'Cicer arietinum',
    season: 'Rabi',
    totalDurationDays: 110,
    criticalStages: ['Germination', 'Vegetative', 'Pre-Flowering', 'Pod Filling', 'Maturity'],
    stages: [
      { name: 'Germination & Early Growth', startDay: 0, endDay: 20, desc: 'Hypogeal emergence and branching' },
      { name: 'Vegetative & Nipping', startDay: 21, endDay: 45, desc: 'Nipping terminal buds to encourage lateral branching' },
      { name: 'Flowering Stage', startDay: 46, endDay: 70, desc: 'Pink or white flowers; avoid irrigation during peak flower' },
      { name: 'Pod Formation & Seed Filling', startDay: 71, endDay: 95, desc: 'Pod development and seed maturation' },
      { name: 'Maturity & Desiccation', startDay: 96, endDay: 110, desc: 'Foliage turns straw color; ready for threshing' }
    ],
    irrigation: {
      criticalDays: [45, 75],
      sensitivity: 'MODERATE_WATER_SENSITIVE',
      guidance: 'Never irrigate during peak flowering as it causes flower drop and vegetative overgrowth. One pre-flowering and one pod development irrigation.'
    },
    nutrientReminders: [
      { day: 0, title: 'Basal Dose', message: 'Apply 20:40:20 kg/ha NPK + Single Super Phosphate.' }
    ],
    weedingReminders: [
      { day: 25, message: 'First hand weeding and soil loosening.' }
    ],
    pestsAndDiseases: ['Gram Pod Borer (Helicoverpa)', 'Fusarium Wilt', 'Ascochyta Blight', 'Dry Root Rot'],
    weatherSensitivities: { maxTemp: 35, minTemp: 6, heavyRainSensitive: true }
  },

  'Groundnut': {
    id: 'Groundnut',
    name: 'Groundnut',
    scientificName: 'Arachis hypogaea',
    season: 'Kharif / Summer',
    totalDurationDays: 115,
    criticalStages: ['Emergence', 'Vegetative', 'Flowering', 'Pegging', 'Pod Development', 'Maturity'],
    stages: [
      { name: 'Emergence & Seedling', startDay: 0, endDay: 20, desc: 'Four-leaflet emergence and root anchoring' },
      { name: 'Vegetative & Branching', startDay: 21, endDay: 35, desc: 'Main stem and lateral branch proliferation' },
      { name: 'Flowering & Pollination', startDay: 36, endDay: 50, desc: 'Yellow self-pollinating blossoms' },
      { name: 'Pegging Stage', startDay: 51, endDay: 70, desc: 'Pegs enter soil; friable moist soil is critical' },
      { name: 'Pod Formation & Kernel Filling', startDay: 71, endDay: 100, desc: 'Underground pod expansion and oil synthesis' },
      { name: 'Harvesting & Lifting', startDay: 101, endDay: 115, desc: 'Inner pod shell develops brown netting; lift plants' }
    ],
    irrigation: {
      criticalDays: [40, 55, 75, 90],
      sensitivity: 'CRITICAL_AT_PEGGING',
      guidance: 'Soil moisture at pegging (50-65 DAS) is essential for pegs to penetrate soil. Do not let topsoil bake hard.'
    },
    nutrientReminders: [
      { day: 0, title: 'Basal NPK', message: 'Apply 25:50:50 kg/ha N:P:K.' },
      { day: 40, title: 'Gypsum Application', message: 'Apply Gypsum @ 400 kg/ha around pegging zone to supply Calcium for pod shell hardening.' }
    ],
    weedingReminders: [
      { day: 20, message: 'Hand weeding before flowering.' },
      { day: 45, message: 'No intercultural operations after pegging starts to avoid snapping pegs!' }
    ],
    pestsAndDiseases: ['Tikka Leaf Spot', 'Rust', 'Collar Rot', 'White Grub', 'Spodoptera'],
    weatherSensitivities: { maxTemp: 38, minTemp: 14, heavyRainSensitive: true }
  },

  'Bajra (Pearl Millet)': {
    id: 'Bajra',
    name: 'Bajra (Pearl Millet)',
    scientificName: 'Pennisetum glaucum',
    season: 'Kharif / Summer',
    totalDurationDays: 85,
    criticalStages: ['Seedling', 'Tillering', 'Booting', 'Flowering', 'Grain Filling', 'Maturity'],
    stages: [
      { name: 'Seedling Establishment', startDay: 0, endDay: 15, desc: 'Rapid initial coleoptile growth' },
      { name: 'Tillering Phase', startDay: 16, endDay: 35, desc: 'Basal tiller emergence' },
      { name: 'Booting & Panicle Emergence', startDay: 36, endDay: 50, desc: 'Spike head emerges from flag leaf' },
      { name: 'Flowering & Anthesis', startDay: 51, endDay: 65, desc: 'Protogynous flower bloom' },
      { name: 'Grain Development & Maturity', startDay: 66, endDay: 85, desc: 'Grains harden in earhead' }
    ],
    irrigation: {
      criticalDays: [30, 50],
      sensitivity: 'HIGHLY_DROUGHT_HARDY',
      guidance: 'Remarkably drought-resilient. Requires supplemental irrigation only if drought coincides with boot or grain filling stage.'
    },
    nutrientReminders: [
      { day: 0, title: 'Basal Application', message: 'Apply 40:40:20 kg/ha NPK.' },
      { day: 30, title: 'Top Dressing', message: 'Top-dress 40 kg N/ha after weeding.' }
    ],
    weedingReminders: [{ day: 20, message: 'First inter-cultivation at 15-20 DAS.' }],
    pestsAndDiseases: ['Downy Mildew (Green Ear)', 'Ergot', 'Smut', 'Shoot Fly'],
    weatherSensitivities: { maxTemp: 44, minTemp: 15, heavyRainSensitive: false }
  },

  'Urad (Black Gram)': {
    id: 'Urad',
    name: 'Urad (Black Gram)',
    scientificName: 'Vigna mungo',
    season: 'Kharif / Summer / Rabi',
    totalDurationDays: 75,
    criticalStages: ['Seedling', 'Vegetative', 'Flowering', 'Pod Formation', 'Maturity'],
    stages: [
      { name: 'Seedling Stage', startDay: 0, endDay: 15, desc: 'First trifoliate leaf expansion' },
      { name: 'Vegetative Branching', startDay: 16, endDay: 30, desc: 'Erect to spreading branches' },
      { name: 'Flowering', startDay: 31, endDay: 45, desc: 'Yellow blossoms; avoid water stress' },
      { name: 'Pod Development', startDay: 46, endDay: 65, desc: 'Hairy pods turning blackish' },
      { name: 'Maturity & Picking', startDay: 66, endDay: 75, desc: 'Pods mature; harvest in morning to prevent pod shattering' }
    ],
    irrigation: {
      criticalDays: [30, 50],
      sensitivity: 'MODERATE_DROUGHT_TOLERANT',
      guidance: 'Provide light irrigation at flowering and pod development. Ensure proper field drainage during monsoon.'
    },
    nutrientReminders: [{ day: 0, title: 'Basal Dose', message: 'Apply 20:40:20 kg/ha NPK with Rhizobium seed treatment.' }],
    weedingReminders: [{ day: 20, message: 'One hand weeding at 20 DAS keeps field weed-free.' }],
    pestsAndDiseases: ['Yellow Mosaic Virus', 'Powdery Mildew', 'Whitefly', 'Pod Borer'],
    weatherSensitivities: { maxTemp: 40, minTemp: 14, heavyRainSensitive: true }
  },

  'Moong (Green Gram)': {
    id: 'Moong',
    name: 'Moong (Green Gram)',
    scientificName: 'Vigna radiata',
    season: 'Kharif / Summer',
    totalDurationDays: 65,
    criticalStages: ['Seedling', 'Vegetative', 'Flowering', 'Pod Filling', 'Maturity'],
    stages: [
      { name: 'Seedling & Emergence', startDay: 0, endDay: 12, desc: 'Rapid hypogeal emergence' },
      { name: 'Vegetative Growth', startDay: 13, endDay: 25, desc: 'Bushy trifoliate growth' },
      { name: 'Flowering', startDay: 26, endDay: 40, desc: 'Clustered yellow flowers' },
      { name: 'Pod Filling', startDay: 41, endDay: 55, desc: 'Pod elongation and seed swelling' },
      { name: 'Harvesting', startDay: 56, endDay: 65, desc: 'Harvest when 85% pods turn dark brown/black' }
    ],
    irrigation: {
      criticalDays: [25, 42],
      sensitivity: 'SENSITIVE_AT_FLOWERING',
      guidance: 'Short duration crop. Light irrigation at flowering and early pod stage.'
    },
    nutrientReminders: [{ day: 0, title: 'Basal NPK', message: 'Apply 20:40:20 kg/ha NPK.' }],
    weedingReminders: [{ day: 18, message: 'Weeding between 15-20 DAS.' }],
    pestsAndDiseases: ['Yellow Mosaic Virus (YMV)', 'Cercospora Leaf Spot', 'Thrips', 'Pod Borer'],
    weatherSensitivities: { maxTemp: 40, minTemp: 15, heavyRainSensitive: true }
  },

  'Sunflower': {
    id: 'Sunflower',
    name: 'Sunflower',
    scientificName: 'Helianthus annuus',
    season: 'Kharif / Rabi / Summer',
    totalDurationDays: 95,
    criticalStages: ['Seedling', 'Bud Stage', 'Flowering', 'Seed Development', 'Maturity'],
    stages: [
      { name: 'Seedling', startDay: 0, endDay: 20, desc: 'Cotyledon and early leaf pair stage' },
      { name: 'Button / Star Bud Stage', startDay: 21, endDay: 45, desc: 'Terminal flower bud appears' },
      { name: 'Ray Floret Opening & Flowering', startDay: 46, endDay: 65, desc: 'Heliotropic head bloom and honeybee pollination' },
      { name: 'Seed Development & Achene Filling', startDay: 66, endDay: 85, desc: 'Achene kernel filling and oil accumulation' },
      { name: 'Harvest', startDay: 86, endDay: 95, desc: 'Head back turns lemon yellow; bracts turn brown' }
    ],
    irrigation: {
      criticalDays: [35, 55, 75],
      sensitivity: 'HIGH_AT_BUD_AND_FLOWERING',
      guidance: 'Critical moisture stages are bud development, flowering, and seed filling. Avoid severe water stress.'
    },
    nutrientReminders: [
      { day: 0, title: 'Basal Application', message: 'Apply 50% N + 100% P & K (60:60:40 kg/ha) + Sulphur @ 20 kg/ha.' },
      { day: 35, title: 'Top Dressing & Boron Spray', message: 'Top-dress 50% N and spray Borax @ 0.2% at ray floret stage to improve seed setting.' }
    ],
    weedingReminders: [{ day: 25, message: 'Keep field clean for first 35 days.' }],
    pestsAndDiseases: ['Head Rot (Rhizopus)', 'Alternaria Blight', 'Helicoverpa Head Borer', 'Downy Mildew'],
    weatherSensitivities: { maxTemp: 38, minTemp: 10, heavyRainSensitive: true }
  },

  'Safflower (Kardai)': {
    id: 'Safflower',
    name: 'Safflower (Kardai)',
    scientificName: 'Carthamus tinctorius',
    season: 'Rabi',
    totalDurationDays: 125,
    criticalStages: ['Rosette', 'Elongation', 'Branching', 'Flowering', 'Maturity'],
    stages: [
      { name: 'Rosette Stage', startDay: 0, endDay: 30, desc: 'Slow top growth, deep tap root development' },
      { name: 'Stem Elongation & Branching', startDay: 31, endDay: 60, desc: 'Spiny stem and capitula formation' },
      { name: 'Flowering Stage', startDay: 61, endDay: 90, desc: 'Yellow to orange florets opening' },
      { name: 'Seed Filling', startDay: 91, endDay: 115, desc: 'Achene filling' },
      { name: 'Maturity & Harvest', startDay: 116, endDay: 125, desc: 'Leaves dry; spine tips turn brown; harvest early morning' }
    ],
    irrigation: {
      criticalDays: [45, 75],
      sensitivity: 'DROUGHT_HARDY_DEEP_ROOT',
      guidance: 'Grown largely on conserved soil moisture. Avoid overhead irrigation during flowering to prevent Alternaria.'
    },
    nutrientReminders: [{ day: 0, title: 'Basal Dose', message: 'Apply 50:25:0 kg/ha N:P:K at sowing.' }],
    weedingReminders: [{ day: 30, message: 'Weeding during rosette stage before spines harden.' }],
    pestsAndDiseases: ['Safflower Aphid', 'Alternaria Leaf Blight', 'Fusarium Wilt'],
    weatherSensitivities: { maxTemp: 36, minTemp: 8, heavyRainSensitive: true }
  },

  'Onion': {
    id: 'Onion',
    name: 'Onion',
    scientificName: 'Allium cepa',
    season: 'Kharif / Late Kharif / Rabi',
    totalDurationDays: 130,
    criticalStages: ['Nursery', 'Transplanting', 'Vegetative', 'Bulb Initiation', 'Bulb Development', 'Maturity'],
    stages: [
      { name: 'Nursery Stage', startDay: 0, endDay: 45, desc: 'Seed bed seedling raising' },
      { name: 'Transplanting & Establishment', startDay: 46, endDay: 65, desc: 'Field transplanting at 15x10 cm' },
      { name: 'Vegetative Foliage Flush', startDay: 66, endDay: 90, desc: 'Tubular leaf production' },
      { name: 'Bulb Initiation & Swelling', startDay: 91, endDay: 115, desc: 'Basal swelling; high potassium demand' },
      { name: 'Maturity & Curing', startDay: 116, endDay: 130, desc: '50% neck fall; stop irrigation 15 days before harvest' }
    ],
    irrigation: {
      criticalDays: [65, 80, 95, 110],
      sensitivity: 'SHALLOW_ROOTED_FREQUENT',
      guidance: 'Shallow root system requires frequent light irrigations every 7-10 days. Stop irrigation completely 10-15 days prior to harvest.'
    },
    nutrientReminders: [
      { day: 45, title: 'Basal Fertilizer', message: 'Apply 50% N + 100% P & K (100:50:50 kg/ha) at transplanting.' },
      { day: 75, title: 'First Top-Dress', message: 'Top-dress 25% N at 30 days after transplanting.' },
      { day: 95, title: 'Bulb Swelling Split', message: 'Top-dress final 25% N and apply Sulphur @ 20 kg/ha for pungency.' }
    ],
    weedingReminders: [{ day: 65, message: 'Hand weeding at 20 days after transplanting.' }],
    pestsAndDiseases: ['Thrips', 'Purple Blotch (Alternaria porri)', 'Stemphylium Blight', 'Basal Rot'],
    weatherSensitivities: { maxTemp: 38, minTemp: 10, heavyRainSensitive: true }
  },

  'Grapes': {
    id: 'Grapes',
    name: 'Grapes',
    scientificName: 'Vitis vinifera',
    season: 'Perennial (Pruning cycles)',
    totalDurationDays: 140,
    criticalStages: ['Foundation Pruning', 'Forward Pruning', 'Sprouting', 'Berry Set', 'Berry Softening (Veraison)', 'Harvest'],
    stages: [
      { name: 'Post-Pruning Sprouting', startDay: 0, endDay: 20, desc: 'Bud break and shoot emergence' },
      { name: 'Inflorescence & Flowering', startDay: 21, endDay: 45, desc: 'Cluster development and cap fall' },
      { name: 'Berry Setting & Thinning', startDay: 46, endDay: 75, desc: 'Pea-stage berry sizing and GA3 dipping' },
      { name: 'Veraison (Color & Sugar)', startDay: 76, endDay: 115, desc: 'Berry softening, TSS accumulation, acidity drop' },
      { name: 'Harvesting', startDay: 116, endDay: 140, desc: 'Optimal Brix reading (18-20°); harvest in cool morning' }
    ],
    irrigation: {
      criticalDays: [15, 35, 60, 85, 110],
      sensitivity: 'DRIP_REGULATED_WATER',
      guidance: 'Drip irrigate precisely according to pan evaporation. Reduce water near veraison to enhance sweetness and prevent berry cracking.'
    },
    nutrientReminders: [
      { day: 15, title: 'Sprouting Fertigation', message: 'Fertigate Urea / Ammonium Sulphate for shoot vigor.' },
      { day: 50, title: 'Berry Development Nutrition', message: 'Apply Calcium Nitrate and Potassium Nitrate for berry firmness and size.' }
    ],
    weedingReminders: [{ day: 25, message: 'Clean vine basin and under-trellis weed removal.' }],
    pestsAndDiseases: ['Downy Mildew (Plasmopara)', 'Powdery Mildew (Uncinula)', 'Anthracnose', 'Mealybug', 'Thrips', 'Flea Beetle'],
    weatherSensitivities: { maxTemp: 40, minTemp: 10, heavyRainSensitive: true }
  },

  'Orange': {
    id: 'Orange',
    name: 'Orange',
    scientificName: 'Citrus sinensis / Citrus reticulata (Mandarin)',
    season: 'Perennial (Ambia / Mrig / Hastha Bahar)',
    totalDurationDays: 240,
    criticalStages: ['Water Stress (Bahar)', 'Flowering', 'Fruit Set', 'Fruit Enlargement', 'Color Break & Harvest'],
    stages: [
      { name: 'Flowering & Flush', startDay: 0, endDay: 35, desc: 'Fragrant blossom flush post bahar treatment' },
      { name: 'Fruit Set & Marble Stage', startDay: 36, endDay: 80, desc: 'Marble-sized green fruitlets development' },
      { name: 'Grand Fruit Enlargement', startDay: 81, endDay: 170, desc: 'Juice sac expansion' },
      { name: 'Color Break & Maturity', startDay: 171, endDay: 240, desc: 'Green to golden orange transformation' }
    ],
    irrigation: {
      criticalDays: [35, 70, 110, 150, 190],
      sensitivity: 'AVOID_WATERLOGGING_RING_BASIN',
      guidance: 'Adopt double ring basin or drip. Never let water touch tree trunk directly (prevents Gummosis).'
    },
    nutrientReminders: [
      { day: 10, title: 'Bahar Fertilization', message: 'Apply FYM 50kg + 500g N, 250g P2O5, 250g K2O per bearing tree.' },
      { day: 90, title: 'Fruit Growth Booster', message: 'Foliar spray with Micronutrient Grade IV + Potassium Nitrate (1%).' }
    ],
    weedingReminders: [{ day: 40, message: 'Basin weeding and mulching.' }],
    pestsAndDiseases: ['Citrus Canker', 'Phytophthora Gummosis', 'Citrus Psylla (Greening Vector)', 'Leaf Miner', 'Fruit Sucking Moth'],
    weatherSensitivities: { maxTemp: 42, minTemp: 8, heavyRainSensitive: false }
  },

  'Pomegranate': {
    id: 'Pomegranate',
    name: 'Pomegranate',
    scientificName: 'Punica granatum',
    season: 'Perennial (Ambia / Mrig / Hastha Bahar)',
    totalDurationDays: 165,
    criticalStages: ['Rest Period', 'Flowering', 'Fruit Set', 'Aril Development', 'Harvest'],
    stages: [
      { name: 'Defoliation & Flower Flush', startDay: 0, endDay: 30, desc: 'Pruning and hermaphrodite flower bloom' },
      { name: 'Fruit Set & Calyx Development', startDay: 31, endDay: 65, desc: 'Calyx retention and young fruitlet sizing' },
      { name: 'Aril Development & Rind Color', startDay: 66, endDay: 130, desc: 'Ruby aril filling and rind deepening' },
      { name: 'Maturity & Selective Picking', startDay: 131, endDay: 165, desc: 'Metallic ring sound on tapping; selective clipping' }
    ],
    irrigation: {
      criticalDays: [25, 60, 95, 130],
      sensitivity: 'FLUCTUATIONS_CAUSE_CRACKING',
      guidance: 'Uniform regulated drip irrigation is essential. Irregular soil moisture causes catastrophic fruit cracking!'
    },
    nutrientReminders: [
      { day: 5, title: 'Bahar Basal Nutrients', message: 'Apply FYM + 250:125:125 g NPK per tree.' },
      { day: 75, title: 'Fruit Development Fertigation', message: 'Fertigate 0:52:34 + Calcium Boron spray for rind elasticity.' }
    ],
    weedingReminders: [{ day: 30, message: 'Keep orchard floor clean to avoid harboring bacterial blight bacteria.' }],
    pestsAndDiseases: ['Bacterial Blight (Telya)', 'Anthracnose', 'Fruit Borer (Deudorix isocrates)', 'Thrips', 'Wilt (Ceratocystis)'],
    weatherSensitivities: { maxTemp: 42, minTemp: 10, heavyRainSensitive: true }
  },

  'Banana': {
    id: 'Banana',
    name: 'Banana',
    scientificName: 'Musa acuminata',
    season: 'Perennial / Annual',
    totalDurationDays: 330,
    criticalStages: ['Vegetative Shoot', 'Shooting (Bunch Emergence)', 'Finger Filling', 'Harvest'],
    stages: [
      { name: 'Planting & Early Vegetative', startDay: 0, endDay: 90, desc: 'Sucker/tissue culture plantlet establishment' },
      { name: 'Rapid Pseudostem Growth', startDay: 91, endDay: 200, desc: 'Massive broad leaf production' },
      { name: 'Shooting (Inflorescence Emergence)', startDay: 201, endDay: 250, desc: 'Pendulous bunch emergence and female finger opening' },
      { name: 'Finger Development & Bagging', startDay: 251, endDay: 310, desc: 'Fruit hands filling and bunch sleeve bagging' },
      { name: 'Harvesting', startDay: 311, endDay: 330, desc: 'Ridge disappearance on fingers; 75-80% maturity harvest' }
    ],
    irrigation: {
      criticalDays: [30, 90, 150, 210, 270],
      sensitivity: 'HIGH_WATER_DEMAND',
      guidance: 'High water requirement (15-20 liters/plant/day via drip). Never let soil dry to cracking point.'
    },
    nutrientReminders: [
      { day: 30, title: 'First Fertigation', message: 'Apply 50g N + 50g P2O5 per plant.' },
      { day: 90, title: 'Vegetative Vigor Split', message: 'Apply 75g N + 50g K2O per plant.' },
      { day: 210, title: 'Shooting Potash Dose', message: 'Apply 100g K2O per plant for finger filling.' }
    ],
    weedingReminders: [{ day: 45, message: 'Weeding and desuckering (remove side suckers).' }],
    pestsAndDiseases: ['Sigatoka Leaf Spot', 'Panama Wilt (Fusarium)', 'Banana Bunchy Top Virus (BBTV)', 'Rhizome Weevil'],
    weatherSensitivities: { maxTemp: 40, minTemp: 12, heavyRainSensitive: false }
  },

  'Mango': {
    id: 'Mango',
    name: 'Mango',
    scientificName: 'Mangifera indica',
    season: 'Perennial',
    totalDurationDays: 135,
    criticalStages: ['Flower Panicle Emergence', 'Full Bloom', 'Fruit Set (Mustard to Pea Stage)', 'Fruit Enlargement', 'Maturity'],
    stages: [
      { name: 'Panicle Emergence', startDay: 0, endDay: 25, desc: 'Branched inflorescence appearance' },
      { name: 'Full Bloom & Pollination', startDay: 26, endDay: 50, desc: 'Midge and honeybee pollination; avoid pesticide sprays' },
      { name: 'Pea to Marble Stage', startDay: 51, endDay: 80, desc: 'Fruitlet set and natural drop management' },
      { name: 'Fruit Development', startDay: 81, endDay: 115, desc: 'Shoulder expansion and pulp synthesis' },
      { name: 'Harvesting', startDay: 116, endDay: 135, desc: 'Tapka stage (slight color shift); harvest with 8mm stalk' }
    ],
    irrigation: {
      criticalDays: [50, 75, 100],
      sensitivity: 'STOP_BEFORE_FLOWERING',
      guidance: 'Withhold irrigation 2 months prior to flowering to encourage flower bud differentiation. Irrigate after fruit set at marble stage.'
    },
    nutrientReminders: [
      { day: 0, title: 'Post-Harvest Basal Dose (Previous Season)', message: 'Apply 1 kg N, 500g P2O5, 1 kg K2O per mature tree.' },
      { day: 60, title: 'Marble Stage Spray', message: 'Foliar spray with Potassium Nitrate (13:0:45 @ 1%) to prevent fruit drop.' }
    ],
    weedingReminders: [{ day: 30, message: 'Clear orchard floor and disc harrow between tree rows.' }],
    pestsAndDiseases: ['Mango Hopper', 'Powdery Mildew', 'Anthracnose', 'Fruit Fly', 'Dieback'],
    weatherSensitivities: { maxTemp: 44, minTemp: 8, heavyRainSensitive: false }
  },

  'Tomato': {
    id: 'Tomato',
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    season: 'Kharif / Rabi / Summer',
    totalDurationDays: 120,
    criticalStages: ['Nursery', 'Transplanting', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest'],
    stages: [
      { name: 'Nursery Stage', startDay: 0, endDay: 25, desc: 'Pro-tray nursery seedling raising' },
      { name: 'Transplanting & Staking', startDay: 26, endDay: 45, desc: 'Transplanting on raised beds with silver-black mulch' },
      { name: 'Vegetative Growth & Pruning', startDay: 46, endDay: 65, desc: 'Lateral sucker pruning and trellising' },
      { name: 'Flowering & Fruit Set', startDay: 66, endDay: 85, desc: 'Yellow blossoms; bumblebee / vibration pollination' },
      { name: 'Fruit Enlargement & Breaker Stage', startDay: 86, endDay: 105, desc: 'Green to breaker stage color transition' },
      { name: 'Harvesting', startDay: 106, endDay: 120, desc: 'Multiple pickings every 3-4 days' }
    ],
    irrigation: {
      criticalDays: [30, 50, 70, 90, 105],
      sensitivity: 'HIGH_MOISTURE_SENSITIVITY',
      guidance: 'Maintain consistent soil moisture. Irregular watering leads to Blossom End Rot (Calcium deficit) and fruit cracking.'
    },
    nutrientReminders: [
      { day: 25, title: 'Basal Nutrients', message: 'Apply 50% N + full P & K (100:60:60 kg/ha) at transplanting.' },
      { day: 50, title: 'Vegetative Fertigation', message: 'Fertigate 19:19:19 + Micronutrients.' },
      { day: 75, title: 'Fruit Set Fertigation', message: 'Fertigate 0:52:34 + Calcium Nitrate @ 5 kg/acre.' }
    ],
    weedingReminders: [{ day: 40, message: 'Manual weeding around bed shoulders before trellis ties.' }],
    pestsAndDiseases: ['Early Blight (Alternaria)', 'Late Blight (Phytophthora)', 'Tomato Leaf Curl Virus (ToLCV)', 'Tuta absoluta', 'Fruit Borer'],
    weatherSensitivities: { maxTemp: 38, minTemp: 10, heavyRainSensitive: true }
  },

  'Potato': {
    id: 'Potato',
    name: 'Potato',
    scientificName: 'Solanum tuberosum',
    season: 'Rabi',
    totalDurationDays: 95,
    criticalStages: ['Sprouting', 'Vegetative', 'Tuber Initiation', 'Tuber Bulking', 'Maturity'],
    stages: [
      { name: 'Sprouting & Emergence', startDay: 0, endDay: 20, desc: 'Eye bud sprouting from seed tubers' },
      { name: 'Vegetative & Stolon Formation', startDay: 21, endDay: 40, desc: 'Canopy spread and underground stolon initiation' },
      { name: 'Tuber Initiation', startDay: 41, endDay: 55, desc: 'Stolon tips swell into tubers; earthing-up mandatory' },
      { name: 'Tuber Bulking', startDay: 56, endDay: 80, desc: 'Rapid starch accumulation and tuber enlargement' },
      { name: 'Haulm Cutting & Maturity', startDay: 81, endDay: 95, desc: 'Cut haulms 10 days before harvest to harden tuber skins' }
    ],
    irrigation: {
      criticalDays: [25, 45, 65, 80],
      sensitivity: 'CRITICAL_AT_TUBER_BULKING',
      guidance: 'Never allow soil moisture to drop below 60% during tuber initiation and bulking. Stop irrigation 10 days before harvest.'
    },
    nutrientReminders: [
      { day: 0, title: 'Basal Application', message: 'Apply 50% N + 100% P & K (120:100:100 kg/ha) at planting.' },
      { day: 35, title: 'Earthing-Up Nitrogen Top-Dress', message: 'Top-dress remaining 50% N and earth up ridges to prevent greening of tubers.' }
    ],
    weedingReminders: [{ day: 25, message: 'Weed and earth up at 25-30 DAS.' }],
    pestsAndDiseases: ['Late Blight (Phytophthora infestans)', 'Early Blight', 'Potato Tuber Moth', 'Aphids (Virus vectors)'],
    weatherSensitivities: { maxTemp: 30, minTemp: 4, heavyRainSensitive: true }
  },

  'Chilli': {
    id: 'Chilli',
    name: 'Chilli',
    scientificName: 'Capsicum annuum',
    season: 'Kharif / Rabi / Summer',
    totalDurationDays: 140,
    criticalStages: ['Nursery', 'Transplanting', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest'],
    stages: [
      { name: 'Nursery Raising', startDay: 0, endDay: 30, desc: 'Seed germination in nursery beds' },
      { name: 'Transplanting & Establishment', startDay: 31, endDay: 50, desc: 'Field establishment at 60x45 cm' },
      { name: 'Vegetative Branching', startDay: 51, endDay: 75, desc: 'Active lateral branching and leaf flush' },
      { name: 'Flowering & Fruit Set', startDay: 76, endDay: 100, desc: 'White solitary blossoms' },
      { name: 'Pod Enlargement & Ripening', startDay: 101, endDay: 140, desc: 'Green to deep crimson red ripening' }
    ],
    irrigation: {
      criticalDays: [40, 65, 90, 115],
      sensitivity: 'SENSITIVE_TO_WATERLOGGING',
      guidance: 'Extremely susceptible to root rot and collar rot from stagnant water. Maintain furrow or drip irrigation.'
    },
    nutrientReminders: [
      { day: 30, title: 'Basal NPK', message: 'Apply 50% N + 100% P & K (100:50:50 kg/ha).' },
      { day: 65, title: 'Flowering Split', message: 'Top-dress 25% N.' },
      { day: 95, title: 'Fruiting Split', message: 'Top-dress remaining 25% N.' }
    ],
    weedingReminders: [{ day: 45, message: 'First hand weeding 2 weeks after transplanting.' }],
    pestsAndDiseases: ['Chilli Thrips (Scirtothrips dorsalis)', 'Mites (Polyphagotarsonemus)', 'Anthracnose / Fruit Rot', 'Leaf Curl Virus'],
    weatherSensitivities: { maxTemp: 38, minTemp: 12, heavyRainSensitive: true }
  },

  'Cabbage': {
    id: 'Cabbage',
    name: 'Cabbage',
    scientificName: 'Brassica oleracea var. capitata',
    season: 'Rabi / Cool Season',
    totalDurationDays: 90,
    criticalStages: ['Nursery', 'Transplanting', 'Vegetative Flush', 'Head Formation', 'Harvest'],
    stages: [
      { name: 'Nursery Raising', startDay: 0, endDay: 25, desc: 'Seedbed raising of tender cabbage seedlings' },
      { name: 'Transplanting & Rosette', startDay: 26, endDay: 45, desc: 'Rosette leaf spread' },
      { name: 'Cupping & Head Initiation', startDay: 46, endDay: 65, desc: 'Inner leaves fold inward to initiate tight head' },
      { name: 'Head Enlargement & Firming', startDay: 66, endDay: 80, desc: 'Dense leaf compaction inside head' },
      { name: 'Harvest', startDay: 81, endDay: 90, desc: 'Heads firm and solid on hand pressure; cut with wrapper leaves' }
    ],
    irrigation: {
      criticalDays: [35, 55, 70],
      sensitivity: 'UNIFORM_MOISTURE_HEAD_FORMATION',
      guidance: 'Moisture fluctuation during head formation causes head bursting and splitting. Maintain uniform moisture.'
    },
    nutrientReminders: [
      { day: 25, title: 'Basal Dose', message: 'Apply 50% N + 100% P & K (120:60:60 kg/ha) at transplanting.' },
      { day: 50, title: 'Head Initiation Top-Dress', message: 'Top-dress remaining 50% N.' }
    ],
    weedingReminders: [{ day: 40, message: 'One hand weeding and shallow hoeing.' }],
    pestsAndDiseases: ['Diamondback Moth (DBM)', 'Cabbage Aphids', 'Black Rot (Xanthomonas)', 'Clubroot'],
    weatherSensitivities: { maxTemp: 30, minTemp: 5, heavyRainSensitive: false }
  },

  'Cauliflower': {
    id: 'Cauliflower',
    name: 'Cauliflower',
    scientificName: 'Brassica oleracea var. botrytis',
    season: 'Rabi / Early & Late types',
    totalDurationDays: 95,
    criticalStages: ['Nursery', 'Transplanting', 'Vegetative', 'Curd Initiation', 'Curd Development & Blanching', 'Harvest'],
    stages: [
      { name: 'Nursery', startDay: 0, endDay: 25, desc: 'Pro-tray / nursery raising' },
      { name: 'Transplanting & Vegetative', startDay: 26, endDay: 50, desc: 'Erect vegetative frame expansion' },
      { name: 'Curd Initiation', startDay: 51, endDay: 70, desc: 'Shoot apex transitions to floral curd' },
      { name: 'Curd Development & Blanching', startDay: 71, endDay: 85, desc: 'Tie outer leaves over curd (blanching) to maintain snowy white color' },
      { name: 'Harvesting', startDay: 86, endDay: 95, desc: 'Compact snowy curds harvested before riciness begins' }
    ],
    irrigation: {
      criticalDays: [35, 60, 75],
      sensitivity: 'CRITICAL_AT_CURD_FORMATION',
      guidance: 'Water stress causes buttoning (tiny premature curds) and riciness. Irrigate regularly every 6-8 days.'
    },
    nutrientReminders: [
      { day: 25, title: 'Basal Dose', message: 'Apply 50% N + 100% P & K + Borax @ 10 kg/ha to prevent browning.' },
      { day: 55, title: 'Curd Initiation Split', message: 'Top-dress 50% N and spray Sodium Molybdate (0.05%) to prevent whiptail.' }
    ],
    weedingReminders: [{ day: 40, message: 'Weed and earth up around stem.' }],
    pestsAndDiseases: ['Diamondback Moth', 'Tobacco Caterpillar', 'Black Rot', 'Downy Mildew', 'Browning (Boron deficiency)'],
    weatherSensitivities: { maxTemp: 30, minTemp: 6, heavyRainSensitive: false }
  },

  'Brinjal (Eggplant)': {
    id: 'Brinjal',
    name: 'Brinjal (Eggplant)',
    scientificName: 'Solanum melongena',
    season: 'Kharif / Rabi / Summer',
    totalDurationDays: 135,
    criticalStages: ['Nursery', 'Transplanting', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest'],
    stages: [
      { name: 'Nursery Stage', startDay: 0, endDay: 30, desc: 'Seedling development in nursery' },
      { name: 'Transplanting & Early Growth', startDay: 31, endDay: 50, desc: 'Field establishment at 75x60 cm' },
      { name: 'Vegetative Branching', startDay: 51, endDay: 75, desc: 'Bushy stem proliferation' },
      { name: 'Flowering & Fruit Set', startDay: 76, endDay: 95, desc: 'Purple blossoms; long styled flowers yield highest' },
      { name: 'Fruit Development & Harvest', startDay: 96, endDay: 135, desc: 'Glossy tender fruits picked weekly' }
    ],
    irrigation: {
      criticalDays: [40, 65, 90, 115],
      sensitivity: 'MODERATE_WATER_SENSITIVE',
      guidance: 'Irrigate every 6-8 days in summer and 10-12 days in winter. Do not allow plants to wilt during flowering.'
    },
    nutrientReminders: [
      { day: 30, title: 'Basal NPK', message: 'Apply 50% N + full P & K (100:50:50 kg/ha).' },
      { day: 65, title: 'Flowering Top-Dress', message: 'Top-dress 25% N.' },
      { day: 95, title: 'Fruiting Top-Dress', message: 'Top-dress remaining 25% N.' }
    ],
    weedingReminders: [{ day: 45, message: 'Shallow hoeing and weeding.' }],
    pestsAndDiseases: ['Shoot and Fruit Borer (Leucinodes orbonalis)', 'Phomopsis Blight', 'Bacterial Wilt', 'Little Leaf of Brinjal'],
    weatherSensitivities: { maxTemp: 38, minTemp: 12, heavyRainSensitive: true }
  },

  'Okra / Bhindi': {
    id: 'Okra',
    name: 'Okra / Bhindi',
    scientificName: 'Abelmoschus esculentus',
    season: 'Kharif / Summer',
    totalDurationDays: 85,
    criticalStages: ['Emergence', 'Vegetative', 'Flowering', 'Pod Development', 'Harvest'],
    stages: [
      { name: 'Emergence & Early Growth', startDay: 0, endDay: 15, desc: 'Direct seeding emergence' },
      { name: 'Vegetative Stem Growth', startDay: 16, endDay: 35, desc: 'Lobed leaf expansion and node development' },
      { name: 'Flowering Stage', startDay: 36, endDay: 50, desc: 'Solitary yellow flowers with crimson center' },
      { name: 'Pod Elongation & Sizing', startDay: 51, endDay: 65, desc: 'Tender green pod formation' },
      { name: 'Harvesting', startDay: 66, endDay: 85, desc: 'Pick tender 8-10 cm pods every alternate day' }
    ],
    irrigation: {
      criticalDays: [25, 45, 60],
      sensitivity: 'REGULAR_SHORT_INTERVAL',
      guidance: 'Summer crop requires irrigation every 4-5 days; Kharif crop requires proper furrow drainage.'
    },
    nutrientReminders: [
      { day: 0, title: 'Basal Dose', message: 'Apply 50% N + 100% P & K (100:50:50 kg/ha).' },
      { day: 30, title: 'Flowering Top-Dress', message: 'Top-dress remaining 50% N.' }
    ],
    weedingReminders: [{ day: 20, message: 'First weeding at 20 DAS.' }],
    pestsAndDiseases: ['Yellow Vein Mosaic Virus (YVMV)', 'Shoot & Fruit Borer (Earias)', 'Jassids', 'Powdery Mildew'],
    weatherSensitivities: { maxTemp: 42, minTemp: 15, heavyRainSensitive: true }
  },

  'Guava': {
    id: 'Guava',
    name: 'Guava',
    scientificName: 'Psidium guajava',
    season: 'Perennial (Mridu / Hastha / Ambia Bahar)',
    totalDurationDays: 140,
    criticalStages: ['Root Pruning / Water Stress', 'Flower Flush', 'Fruit Set', 'Fruit Sizing', 'Harvest'],
    stages: [
      { name: 'Flower Bud Induction', startDay: 0, endDay: 30, desc: 'New shoot flush and flower blossom' },
      { name: 'Fruit Set & Marble Size', startDay: 31, endDay: 60, desc: 'Fruitlet set and calyx formation' },
      { name: 'Fruit Expansion', startDay: 61, endDay: 110, desc: 'Rapid weight gain and crisp pulp formation' },
      { name: 'Maturity & Harvesting', startDay: 111, endDay: 140, desc: 'Skin color changes from dark green to greenish yellow' }
    ],
    irrigation: {
      criticalDays: [35, 65, 95],
      sensitivity: 'TOLERANT_MODERATE_WATER',
      guidance: 'Withhold water before desired bahar to induce flowering. Irrigate during fruit enlargement for fruit size.'
    },
    nutrientReminders: [
      { day: 10, title: 'Bahar Manuring', message: 'Apply FYM 30kg + 500:250:250 g NPK per tree.' },
      { day: 70, title: 'Micronutrient Spray', message: 'Foliar spray Zinc Sulphate (0.3%) and Boric acid (0.2%) for fruit sweetness.' }
    ],
    weedingReminders: [{ day: 30, message: 'Clean basin weeding.' }],
    pestsAndDiseases: ['Guava Wilt (Fusarium)', 'Fruit Fly (Bactrocera)', 'Anthracnose', 'Mealybug'],
    weatherSensitivities: { maxTemp: 44, minTemp: 8, heavyRainSensitive: false }
  },

  'Papaya': {
    id: 'Papaya',
    name: 'Papaya',
    scientificName: 'Carica papaya',
    season: 'Perennial / Semi-annual',
    totalDurationDays: 270,
    criticalStages: ['Nursery', 'Transplanting', 'Sex Expression', 'Flowering & Setting', 'Fruit Enlargement', 'Harvest'],
    stages: [
      { name: 'Nursery Stage', startDay: 0, endDay: 45, desc: 'Polybag seedling raising' },
      { name: 'Transplanting & Vegetative', startDay: 46, endDay: 100, desc: 'Field planting on raised mounds' },
      { name: 'Sex Expression & Roguing', startDay: 101, endDay: 130, desc: 'Flower emergence; rogue out excess male trees (keep 1 male:10 females)' },
      { name: 'Continuous Fruit Setting', startDay: 131, endDay: 210, desc: 'Spiral fruit cluster development on trunk' },
      { name: 'Color Break & Harvest', startDay: 211, endDay: 270, desc: 'Yellow streak color break at fruit apex; harvest carefully' }
    ],
    irrigation: {
      criticalDays: [55, 90, 140, 190, 240],
      sensitivity: 'HIGHLY_SENSITIVE_TO_COLLAR_ROT',
      guidance: 'Never allow water to stand at stem base (causes Stem / Foot rot). Irrigate through ring basin or drip system.'
    },
    nutrientReminders: [
      { day: 60, title: 'Monthly Fertigation', message: 'Apply 50g Urea + 50g MOP per plant every 2 months.' }
    ],
    weedingReminders: [{ day: 45, message: 'Hand weed basins without disturbing shallow papaya roots.' }],
    pestsAndDiseases: ['Papaya Ring Spot Virus (PRSV)', 'Foot Rot / Stem Rot (Pythium)', 'Anthracnose', 'Red Spider Mite'],
    weatherSensitivities: { maxTemp: 42, minTemp: 10, heavyRainSensitive: true }
  }
}

/**
 * Helper to normalize crop name matching against the 30 crops catalog
 */
export function normalizeCropName(cropName = '') {
  if (!cropName) return 'Soybean'
  const c = cropName.toLowerCase().trim()

  const keys = Object.keys(CROPS_CONFIG_30)
  for (const key of keys) {
    if (key.toLowerCase() === c) return key
  }
  for (const key of keys) {
    const kLow = key.toLowerCase()
    if (c.includes(kLow) || kLow.includes(c)) return key
  }
  return 'Soybean'
}

/**
 * Get config for a specific crop
 */
export function getCropConfig(cropName) {
  const norm = normalizeCropName(cropName)
  return CROPS_CONFIG_30[norm] || CROPS_CONFIG_30['Soybean']
}
