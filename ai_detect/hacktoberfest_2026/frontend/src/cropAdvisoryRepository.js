/**
 * CROP ADVISORY REPOSITORY (Cultivation Tips Phase 3)
 * Centralized, scalable source of truth for crop cultivation schedules,
 * stages, tasks, and relative-timing activities.
 */

export const CROPS_CATALOG = [
  { id: 'Bean', name: 'Bean', emoji: '🫘', scientificName: 'Phaseolus vulgaris / Vicia faba', durationDays: 90 },
  { id: 'Rice', name: 'Rice', emoji: '🌾', scientificName: 'Oryza sativa', durationDays: 120 },
  { id: 'Wheat', name: 'Wheat', emoji: '🌾', scientificName: 'Triticum aestivum', durationDays: 130 },
  { id: 'Maize', name: 'Maize', emoji: '🌽', scientificName: 'Zea mays', durationDays: 105 },
  { id: 'Potato', name: 'Potato', emoji: '🥔', scientificName: 'Solanum tuberosum', durationDays: 90 },
  { id: 'Tomato', name: 'Tomato', emoji: '🍅', scientificName: 'Solanum lycopersicum', durationDays: 110 },
  { id: 'Cotton', name: 'Cotton', emoji: '🌸', scientificName: 'Gossypium hirsutum', durationDays: 160 },
  { id: 'Mustard', name: 'Mustard', emoji: '🌼', scientificName: 'Brassica juncea', durationDays: 100 },
  { id: 'Chickpea & Gram', name: 'Chickpea & Gram', emoji: '🧆', scientificName: 'Cicer arietinum', durationDays: 110 },
  { id: 'Groundnut', name: 'Groundnut', emoji: '🥜', scientificName: 'Arachis hypogaea', durationDays: 120 }
];

// Standard 9 Task Categories for Bean Reference
export const BEAN_TASKS = [
  { id: 'monitoring', name: 'Monitoring', icon: '🔍', order: 1, desc: 'Pest scouting, disease checks & field visits' },
  { id: 'site-selection', name: 'Site Selection', icon: '📍', order: 2, desc: 'Soil suitability, sun exposure & crop rotation' },
  { id: 'field-preparation', name: 'Field Preparation', icon: '🚜', order: 3, desc: 'Deep ploughing, harrowing & bed formation' },
  { id: 'weeding', name: 'Weeding', icon: '🌾', order: 4, desc: 'Pre-emergence & manual post-emergence weed control' },
  { id: 'irrigation', name: 'Irrigation', icon: '💧', order: 5, desc: 'Water scheduling & moisture stress management' },
  { id: 'fertilization-chemical', name: 'Fertilization Chemical', icon: '🧪', order: 6, desc: 'Basal and split inorganic nutrient applications' },
  { id: 'preventive-measure', name: 'Preventive Measure', icon: '🛡️', order: 7, desc: 'Proactive protection against insects and fungal pathogens' },
  { id: 'harvesting', name: 'Harvesting', icon: '🧺', order: 8, desc: 'Optimal pod maturity picking & timing' },
  { id: 'post-harvest', name: 'Post Harvest', icon: '📦', order: 9, desc: 'Drying, threshing, grading & cold storage' }
];

// Standard Stages for Bean Reference
export const BEAN_STAGES = [
  {
    id: 'pre-seeding',
    name: 'Pre-seeding',
    order: 1,
    timingDesc: '3 to 1 weeks before sowing',
    startOffsetDays: -21,
    endOffsetDays: 0,
    desc: 'Land preparation, soil solarization, variety selection and basal nutrient replenishment.'
  },
  {
    id: 'seeding',
    name: 'Seeding & Emergence',
    order: 2,
    timingDesc: 'Week 1',
    startOffsetDays: 0,
    endOffsetDays: 7,
    desc: 'Direct sowing or transplanting, initial hydration and pre-emergence weed barrier.'
  },
  {
    id: 'early-growth',
    name: 'Early Growth',
    order: 3,
    timingDesc: 'Weeks 2 – 3',
    startOffsetDays: 7,
    endOffsetDays: 21,
    desc: 'First true leaves expansion, pest prevention for aphids and early root development.'
  },
  {
    id: 'vegetative-growth',
    name: 'Vegetative Growth',
    order: 4,
    timingDesc: 'Weeks 4 – 6',
    startOffsetDays: 21,
    endOffsetDays: 42,
    desc: 'Rapid canopy development, split nitrogen/micronutrient booster and weed eradication.'
  },
  {
    id: 'flowering',
    name: 'Flowering',
    order: 5,
    timingDesc: 'Weeks 7 – 8',
    startOffsetDays: 42,
    endOffsetDays: 56,
    desc: 'Floral initiation; moisture stress must be strictly avoided during blossom set.'
  },
  {
    id: 'pod-development',
    name: 'Pod Development',
    order: 6,
    timingDesc: 'Weeks 9 – 10',
    startOffsetDays: 56,
    endOffsetDays: 70,
    desc: 'Pod elongation, seed filling, frequent monitoring for pod borers and foliar diseases.'
  },
  {
    id: 'maturity',
    name: 'Maturity',
    order: 7,
    timingDesc: 'Week 11',
    startOffsetDays: 70,
    endOffsetDays: 77,
    desc: 'Physiological maturity, pod yellowing/drying and planning harvest logistics.'
  },
  {
    id: 'harvest',
    name: 'Harvest',
    order: 8,
    timingDesc: 'Weeks 11 – 12',
    startOffsetDays: 70,
    endOffsetDays: 84,
    desc: 'Timely morning picking to preserve pod tenderness or harvesting dried broad beans.'
  },
  {
    id: 'post-harvest',
    name: 'Post Harvest',
    order: 9,
    timingDesc: 'Weeks 12 – 14+',
    startOffsetDays: 84,
    endOffsetDays: 98,
    desc: 'Threshing, moisture testing, standardized packaging, cold chain storage and market dispatch.'
  }
];

// Reference Bean Activities (100% faithful to the Cultivation Tips PDF)
export const BEAN_ACTIVITIES = [
  // 1. MONITORING
  {
    id: 'bean-monitoring-001',
    cropId: 'Bean',
    taskId: 'monitoring',
    stageId: 'pod-development',
    title: 'Monitor fields frequently',
    timing: {
      type: 'after_sowing',
      startWeek: 9,
      durationWeeks: 1
    },
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&auto=format&fit=crop&q=80',
    contentStatus: 'complete',
    source: 'Provided Cultivation Tips reference PDF',
    sourceType: 'reference',
    details: {
      description: 'Scout your bean plot at least twice weekly during the critical pod development window. Carefully inspect the underside of leaves, blossoms, and tender young pods.',
      whyImportant: 'Pod borers, fungal anthracnose, and rust develop rapidly during pod filling. Early spot detection prevents catastrophic yield collapse.',
      instructions: [
        'Walk through the field in a zig-zag or "W" pattern stopping at 10 random stations.',
        'Examine 5 consecutive bean plants at each station, checking both leaf surfaces and growing tips.',
        'Record pest counts (aphids, mites, caterpillars) and note any leaf speckling or water-soaked lesions.',
        'Install yellow and blue sticky traps at canopy level (4-5 per acre) to monitor insect migration.'
      ],
      tips: [
        'Perform scouting during early morning hours when insects are less active and easier to count.',
        'Carry a 10x hand lens to inspect leaf undersides for spider mites and minute fungal spore pustules.'
      ],
      warnings: [
        'Do not touch or disturb wet plants early in the morning if bacterial blight is suspected, as water droplets spread bacteria between plants.'
      ]
    }
  },

  // 2. SITE SELECTION
  {
    id: 'bean-site-001',
    cropId: 'Bean',
    taskId: 'site-selection',
    categoryName: 'Site Selection',
    stageId: 'pre-seeding',
    title: 'Conditions for bean cultivation',
    timing: {
      type: 'before_sowing',
      weeksBefore: 3,
      durationWeeks: 1,
      label: '3 weeks before seedling'
    },
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80',
    contentStatus: 'complete',
    source: 'Provided Cultivation Tips reference PDF',
    sourceType: 'reference',
    details: {
      description: 'Select well-drained fertile loam or sandy-loam soil with an optimal soil pH between 6.0 and 6.8. Beans are highly sensitive to waterlogging and soil salinity.',
      whyImportant: 'Proper soil aeration and sunny orientation maximize nitrogen-fixing nodulation and reduce root rot pathogens.',
      instructions: [
        'Test soil pH and electrical conductivity (EC) before final bed layout.',
        'Ensure the plot receives at least 6-8 hours of direct unobstructed sunlight daily.',
        'Avoid low-lying depressions where runoff water accumulates after monsoon showers.',
        'Ensure an accessible clean irrigation source (sweet water, EC < 1.0 dS/m).'
      ],
      tips: [
        'In heavy clay soils, cultivate beans on raised beds (15 cm height) to ensure rapid internal drainage.'
      ],
      warnings: [
        'Avoid soils with pH above 7.5; high alkalinity induces severe iron and zinc chlorosis in beans.'
      ]
    }
  },
  {
    id: 'bean-site-002',
    cropId: 'Bean',
    taskId: 'site-selection',
    stageId: 'post-harvest',
    title: 'Rotate crops properly',
    timing: {
      type: 'after_sowing',
      startWeek: 13,
      durationWeeks: 1
    },
    image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=600&auto=format&fit=crop&q=80',
    contentStatus: 'complete',
    source: 'Provided Cultivation Tips reference PDF',
    sourceType: 'reference',
    details: {
      description: 'Rotate your bean field with non-leguminous heavy feeders such as maize, sorghum, or root vegetables after harvest.',
      whyImportant: 'Continuous cultivation of legumes builds up soil-borne Rhizoctonia, Fusarium solani, and root-knot nematodes.',
      instructions: [
        'Do not plant legumes (peas, beans, chickpeas) on the same plot for at least 2 consecutive seasons.',
        'Plan a rotation cycle of Maize/Millet -> Legume (Bean) -> Oilseed/Brassica.',
        'Incorporate decomposed bean residues into the soil to harness nitrogen credits for the succeeding cereal.'
      ],
      tips: [
        'Deep plow in summer following bean harvest to expose dormant nematode cysts to solar radiation.'
      ],
      warnings: [
        'Never follow beans with solanaceous crops (tomatoes/brinjals) without confirming nematode-free status.'
      ]
    }
  },

  // 3. FIELD PREPARATION
  {
    id: 'bean-field-001',
    cropId: 'Bean',
    taskId: 'field-preparation',
    stageId: 'pre-seeding',
    title: 'Prepare fields well in advance of sowing date.',
    timing: {
      type: 'before_sowing',
      weeksBefore: 2,
      durationWeeks: 1
    },
    image: 'https://images.unsplash.com/photo-1527842891421-42eec6e703ea?w=600&auto=format&fit=crop&q=80',
    contentStatus: 'complete',
    source: 'Provided Cultivation Tips reference PDF',
    sourceType: 'reference',
    details: {
      description: 'Plow the soil 2 to 3 times to achieve a fine, friable tilth. Apply well-decomposed Farm Yard Manure (FYM) or compost during primary tillage.',
      whyImportant: 'Loose, crumbly soil structure encourages unhindered taproot penetration and healthy Rhizobium bacterial colonization.',
      instructions: [
        'Perform one deep moldboard plowing (20-25 cm depth) followed by 2 passes with a disc harrow.',
        'Broadcast 8-10 tons of well-composted farmyard manure per acre and mix thoroughly into the top 15 cm.',
        'Level the plot accurately using a laser leveler or wooden plank to eliminate water stagnation points.'
      ],
      tips: [
        'Allow 10-14 days between manure incorporation and seeding to avoid root scorching from decomposition heat.'
      ],
      warnings: [
        'Never plow fields when the soil is overly wet, as this creates dense plow pans and cloddy seedbeds.'
      ]
    }
  },
  {
    id: 'bean-field-002',
    cropId: 'Bean',
    taskId: 'field-preparation',
    stageId: 'post-harvest',
    title: 'Start preparing fields again soon after harvest',
    timing: {
      type: 'after_sowing',
      startWeek: 13,
      durationWeeks: 1
    },
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
    contentStatus: 'complete',
    source: 'Provided Cultivation Tips reference PDF',
    sourceType: 'reference',
    details: {
      description: 'Remove remnant crop stalks or chop and plow them under immediately after final pod harvest to begin residue decomposition.',
      whyImportant: 'Prevents surviving pest pupae and stem borers from overwintering and entering nearby plots.',
      instructions: [
        'Chop standing dry stalks and harrow the field immediately.',
        'Spray Trichoderma viride or decomposer spray if plowing under green residues.',
        'Give a light pre-irrigation to initiate rapid organic breakdown.'
      ],
      tips: [
        'Conserve soil moisture by mulching or planting a short-duration green manure crop.'
      ],
      warnings: [
        'Do not burn dry crop residues; burning destroys beneficial soil microbiota and pollutes the atmosphere.'
      ]
    }
  },

  // 4. WEEDING
  {
    id: 'bean-weed-001',
    cropId: 'Bean',
    taskId: 'weeding',
    stageId: 'seeding',
    title: 'Plan a pre-emergence weeding after sowing',
    timing: {
      type: 'after_sowing',
      startWeek: 1,
      durationWeeks: 1
    },
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d69102377?w=600&auto=format&fit=crop&q=80',
    contentStatus: 'complete',
    source: 'Provided Cultivation Tips reference PDF',
    sourceType: 'reference',
    details: {
      description: 'Apply approved pre-emergence herbicide within 24-48 hours after sowing while the soil surface remains moist, before seedlings sprout.',
      whyImportant: 'Young bean sprouts are fragile and slow to establish; early weed competition can suppress bean yields by up to 50%.',
      instructions: [
        'Ensure soil has adequate moisture prior to chemical application for optimal chemical film activation.',
        'Spray Pendimethalin 30% EC @ 1.0 kg a.i./ha in 500 liters of water using a flat fan nozzle.',
        'Avoid soil surface disturbance after spraying to keep the chemical barrier intact.'
      ],
      tips: [
        'Calibrate spray equipment properly to avoid over-concentration in field turns and overlapping swaths.'
      ],
      warnings: [
        'Do not apply pre-emergence herbicides once bean sprouts have cracked the soil surface, to prevent severe crop stunting.'
      ]
    }
  },
  {
    id: 'bean-weed-002',
    cropId: 'Bean',
    taskId: 'weeding',
    stageId: 'vegetative-growth',
    title: 'Weeding your fields',
    timing: {
      type: 'after_sowing',
      startWeek: 4,
      durationWeeks: 1
    },
    image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=600&auto=format&fit=crop&q=80',
    contentStatus: 'complete',
    source: 'Provided Cultivation Tips reference PDF',
    sourceType: 'reference',
    details: {
      description: 'Conduct manual weeding or light inter-cultivation between rows around 25-30 days after sowing before canopy closure.',
      whyImportant: 'Eliminates stubborn perennial weeds and creates a soil dust mulch that reduces evaporative water loss.',
      instructions: [
        'Use a hand hoe or wheel hoe between crop rows to slice weed roots.',
        'Hand pull weeds growing within the immediate plant rows without disturbing shallow bean roots.',
        'Earth up soil gently around bean stems to support plants and smother emerging weed flushes.'
      ],
      tips: [
        'Weed during clear sunny days so severed weed plants dry out and desiccate rapidly on the soil surface.'
      ],
      warnings: [
        'Do not cultivate deeply near bean stems (> 3-4 cm); bean root systems are superficial and easily damaged.'
      ]
    }
  },

  // 5. IRRIGATION
  {
    id: 'bean-irr-001',
    cropId: 'Bean',
    taskId: 'irrigation',
    stageId: 'seeding',
    title: 'Make an irrigation plan for your leguminous crops',
    timing: {
      type: 'after_sowing',
      startWeek: 1,
      durationWeeks: 1
    },
    image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&auto=format&fit=crop&q=80',
    contentStatus: 'complete',
    source: 'Provided Cultivation Tips reference PDF',
    sourceType: 'reference',
    details: {
      description: 'Establish a systematic water delivery schedule tailored to soil texture, seasonal evapotranspiration rates, and growth phases.',
      whyImportant: 'Beans require uniform soil moisture. Both water deficiency and excess saturation severely stunt seedling vigor.',
      instructions: [
        'Provide a gentle initial irrigation immediately after sowing to settle seed contact.',
        'Maintain soil moisture around 60-70% of field capacity throughout the vegetative stage.',
        'Deploy drip irrigation if possible, delivering 2-3 liters/plant every alternate day based on tensiometer readings.'
      ],
      tips: [
        'Irrigate in the early morning to minimize foliar wetness overnight and prevent damping-off diseases.'
      ],
      warnings: [
        'Never allow standing water in bean fields for more than 12 hours; roots asphyxiate and yellow within 24 hours.'
      ]
    }
  },
  {
    id: 'bean-irr-002',
    cropId: 'Bean',
    taskId: 'irrigation',
    stageId: 'flowering',
    title: 'Critical irrigation time',
    timing: {
      type: 'after_sowing',
      startWeek: 7,
      durationWeeks: 1
    },
    image: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?w=600&auto=format&fit=crop&q=80',
    contentStatus: 'complete',
    source: 'Provided Cultivation Tips reference PDF',
    sourceType: 'reference',
    details: {
      description: 'Flowering and early pod initiation represent the most critical water-sensitive stages in the bean crop cycle.',
      whyImportant: 'Moisture stress during flowering causes heavy flower abortion, reduced pod set, and flat empty pods.',
      instructions: [
        'Schedule a thorough, uniform irrigation at the first sighting of flower buds.',
        'Ensure soil does not crack or dry out between flower opening and pod elongation.',
        'Avoid heavy overhead sprinkler irrigation during peak pollination hours (9 AM - 1 PM) to prevent pollen washing.'
      ],
      tips: [
        'Mulching with clean organic straw (2-3 tons/acre) helps retain critical soil moisture through flowering.'
      ],
      warnings: [
        'Sudden flooding after extreme dry soil induces blossom drop and splits emerging tender pods.'
      ]
    }
  },

  // 6. FERTILIZATION CHEMICAL
  {
    id: 'bean-fert-001',
    cropId: 'Bean',
    taskId: 'fertilization-chemical',
    categoryName: 'Fertilization Chemical',
    stageId: 'pre-seeding',
    title: 'Basal fertilization of beans',
    timing: {
      type: 'before_sowing',
      weeksBefore: 1,
      durationWeeks: 1,
      label: '1 week before seedling'
    },
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&auto=format&fit=crop&q=80',
    contentStatus: 'complete',
    source: 'Provided Cultivation Tips reference PDF',
    sourceType: 'reference',
    details: {
      description: 'Apply basal chemical fertilizers in furrows 5 cm to the side and 5 cm below the seed placement line before seeding.',
      whyImportant: 'Supplies immediate phosphorus for root elongation and starting nitrogen before symbiotic Rhizobium nodules form.',
      instructions: [
        'Recommended basal dosage per acre: 20-25 kg N, 50-60 kg P2O5 (Single Super Phosphate), and 25-30 kg K2O (MOP).',
        'SSP is preferred over DAP as it provides essential sulphur (12%) and calcium (19%) required by legumes.',
        'Band the fertilizer in rows rather than broad broadcasting to enhance nutrient use efficiency.'
      ],
      tips: [
        'Incorporate biofertilizers (Rhizobium phaseoli & PSB) as seed treatments rather than mixing directly with chemical fertilizers.'
      ],
      warnings: [
        'Do not place fertilizer in direct contact with seeds; chemical salts will burn the germinating embryo.'
      ]
    }
  },
  {
    id: 'bean-fert-002',
    cropId: 'Bean',
    taskId: 'fertilization-chemical',
    stageId: 'vegetative-growth',
    // Truncated title preserved exactly from PDF without fabrication
    title: 'Micronutrient application for extr...',
    timing: {
      type: 'after_sowing',
      startWeek: 4,
      durationWeeks: 1
    },
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&auto=format&fit=crop&q=80',
    contentStatus: 'reference-title-only',
    source: 'Provided Cultivation Tips reference PDF',
    sourceType: 'reference',
    details: {
      description: 'Foliar micronutrient supplementation during rapid vegetative expansion. Title preserved exactly as provided in the reference PDF.',
      whyImportant: 'Legumes require zinc, molybdenum, and boron for nitrogen fixation enzymes and cell wall formation.',
      instructions: [
        'Prepare balanced chelated micronutrient mixture spray @ 1.5 - 2.0 g/liter of water.',
        'Add a quality non-ionic wetting agent (surfactant) @ 0.5 ml/liter.',
        'Spray during late afternoon hours ensuring uniform foliar coverage on both sides of leaves.'
      ],
      tips: [
        'Consult local agricultural extension officers for specific regional soil deficiency corrections.'
      ],
      warnings: [
        'Never exceed recommended micronutrient concentrations; trace elements can easily cause severe foliar toxicity.'
      ]
    }
  },
  {
    id: 'bean-fert-003',
    cropId: 'Bean',
    taskId: 'fertilization-chemical',
    stageId: 'vegetative-growth',
    title: 'French bean split fertilizer',
    timing: {
      type: 'after_sowing',
      startWeek: 4,
      durationWeeks: 1
    },
    image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=600&auto=format&fit=crop&q=80',
    contentStatus: 'complete',
    source: 'Provided Cultivation Tips reference PDF',
    sourceType: 'reference',
    details: {
      description: 'Top-dress French beans with second split dose of nitrogen alongside light earthing up at 25-30 days after emergence.',
      whyImportant: 'French beans (Phaseolus vulgaris) have relatively poor natural nodulation compared to other pulses and demand supplemental nitrogen for green pod yield.',
      instructions: [
        'Apply 15-20 kg Urea per acre banded 8-10 cm away from plant stems.',
        'Lightly mix urea into moist soil immediately and follow with light irrigation.',
        'Optionally apply 19:19:19 (NPK water-soluble) @ 5g/liter as a foliar booster.'
      ],
      tips: [
        'Apply fertilizer when leaves are dry to avoid granules adhering to wet foliage and causing chemical scorch.'
      ],
      warnings: [
        'Excessive nitrogen promotes lush vegetative growth at the expense of flowering and increases aphid vulnerability.'
      ]
    }
  },

  // 7. PREVENTIVE MEASURE
  {
    id: 'bean-prev-001',
    cropId: 'Bean',
    taskId: 'preventive-measure',
    stageId: 'seeding',
    title: 'Prevent leafhoppers in your plants',
    timing: {
      type: 'after_sowing',
      startWeek: 1,
      durationWeeks: 1
    },
    image: 'https://images.unsplash.com/photo-1533294455009-a77b7557d2d1?w=600&auto=format&fit=crop&q=80',
    contentStatus: 'complete',
    source: 'Provided Cultivation Tips reference PDF',
    sourceType: 'reference',
    details: {
      description: 'Deploy preventive physical and botanical barriers to shield young seedlings from leafhoppers (Empoasca spp.) from emergence.',
      whyImportant: 'Leafhoppers pierce tender leaf tissues, injecting toxins that cause hopperburn (yellowing, curling, and edge necrosis) and vector bean viruses.',
      instructions: [
        'Seed treat with Imidacloprid 600 FS @ 3 ml/kg seed before sowing for 21-day seedling protection.',
        'Install yellow sticky traps (10 per acre) slightly above the emerging canopy.',
        'Spray Neem oil (10,000 ppm) @ 2-3 ml/liter at 10-day intervals as an oviposition deterrent.'
      ],
      tips: [
        'Keep borders free from wild weed hosts such as Amaranthus and Solanum nigrum.'
      ],
      warnings: [
        'Avoid early broad-spectrum synthetic pyrethroids which kill predatory ladybird beetles and lacewings.'
      ]
    }
  },
  {
    id: 'bean-prev-002',
    cropId: 'Bean',
    taskId: 'preventive-measure',
    stageId: 'early-growth',
    title: 'Prevent aphids in your plants',
    timing: {
      type: 'after_sowing',
      startWeek: 2,
      durationWeeks: 1
    },
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    contentStatus: 'complete',
    source: 'Provided Cultivation Tips reference PDF',
    sourceType: 'reference',
    details: {
      description: 'Proactively monitor and manage bean aphid (Aphis craccivora) colonies on tender terminal shoots and leaf axils.',
      whyImportant: 'Aphids suck sap, excrete sticky honeydew fostering sooty mold, and serve as primary vectors of Bean Common Mosaic Virus (BCMV).',
      instructions: [
        'Inspect the youngest growing points of 20 randomly selected plants weekly.',
        'Dislodge early scattered colonies with high-pressure water spray or organic potassium soap solution (5g/liter).',
        'If infestation exceeds 5-10% plants, spray Azadirachtin 1% EC @ 2 ml/liter or Thiamethoxam 25 WG @ 0.3 g/liter.'
      ],
      tips: [
        'Preserve natural ladybird beetle grubs (Coccinellids); one adult ladybird consumes up to 50 aphids per day.'
      ],
      warnings: [
        'Never spray systemic chemical insecticides during open flowering to protect honeybee pollinators.'
      ]
    }
  },
  {
    id: 'bean-prev-003',
    cropId: 'Bean',
    taskId: 'preventive-measure',
    stageId: 'early-growth',
    title: 'Prevent leaf miners in your plants',
    timing: {
      type: 'after_sowing',
      startWeek: 2,
      durationWeeks: 1
    },
    image: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=600&auto=format&fit=crop&q=80',
    contentStatus: 'complete',
    source: 'Provided Cultivation Tips reference PDF',
    sourceType: 'reference',
    details: {
      description: 'Prevent serpentine leaf miner (Liriomyza trifolii) larvae from burrowing into the mesophyll of bean leaves.',
      whyImportant: 'Serpentine tunneling destroys photosynthetic leaf area and creates entry wounds for fungal spores.',
      instructions: [
        'Install yellow sticky sheets at 30 cm height to capture adult winged flies before egg deposition.',
        'Hand pick and destroy the first few mined leaves if detected on isolated seedling plants.',
        'Spray Cyromazine 75 WP @ 0.3 g/liter or Spinosad 45 SC @ 0.3 ml/liter if serpentine mines appear on more than 3 leaves per plant.'
      ],
      tips: [
        'Intercrop with marigold or coriander to encourage parasitoid wasps (Diglyphus isaea).'
      ],
      warnings: [
        'Contact insecticides do not kill larvae inside leaf mines; only translaminar or systemic chemicals are effective.'
      ]
    }
  },

  // 8. HARVESTING
  {
    id: 'bean-harv-001',
    cropId: 'Bean',
    taskId: 'harvesting',
    stageId: 'harvest',
    title: 'Bean harvest timing',
    timing: {
      type: 'after_sowing',
      startWeek: 11,
      durationWeeks: 1
    },
    image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=600&auto=format&fit=crop&q=80',
    contentStatus: 'complete',
    source: 'Provided Cultivation Tips reference PDF',
    sourceType: 'reference',
    details: {
      description: 'Pick tender green pods when they reach full length but before seeds visibly bulge. For dry beans, allow pods to dry on the plant.',
      whyImportant: 'Late picking turns green pods fibrous, stringy, and bitter, drastically reducing market price.',
      instructions: [
        'Harvest green pods every 3-4 days in the morning after dew dries.',
        'Snap or clip pods cleanly with a short stalk attached; do not yank branches.',
        'Keep harvested produce under shade immediately to avoid heat wilt.'
      ],
      tips: [
        'Regular picking stimulates plants to produce new flowers and extends the harvest duration by 2-3 weeks.'
      ],
      warnings: [
        'Never harvest while plants are soaked with rain or dew to prevent post-harvest pod rotting.'
      ]
    }
  },

  // 9. POST HARVEST
  {
    id: 'bean-post-001',
    cropId: 'Bean',
    taskId: 'post-harvest',
    stageId: 'post-harvest',
    title: 'Threshing dry broad beans',
    timing: {
      type: 'after_sowing',
      startWeek: 12,
      durationWeeks: 1
    },
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&auto=format&fit=crop&q=80',
    contentStatus: 'complete',
    source: 'Provided Cultivation Tips reference PDF',
    sourceType: 'reference',
    details: {
      description: 'Thresh sun-dried broad bean plants when pod moisture drops below 14% to separate clean seeds without cracking seed coats.',
      whyImportant: 'Proper threshing preserves seed germination capacity and prevents fungal contamination during grain storage.',
      instructions: [
        'Dry harvested whole plants on clean tarpaulins for 3-5 days in the sun until pods rattle.',
        'Beat gently with wooden flails or pass through a low-RPM pulse thresher.',
        'Winnow thoroughly to remove chaff, broken pod pieces, and dirt particles.'
      ],
      tips: [
        'Test grain moisture by pressing with teeth; properly dry beans crack cleanly without denting.'
      ],
      warnings: [
        'Avoid high-speed mechanical threshers which cause internal embryo cracks and poor seed vigor.'
      ]
    }
  },
  {
    id: 'bean-post-002',
    cropId: 'Bean',
    taskId: 'post-harvest',
    stageId: 'post-harvest',
    title: 'Refrigerated storage for French beans',
    timing: {
      type: 'after_sowing',
      startWeek: 12,
      durationWeeks: 1
    },
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    contentStatus: 'complete',
    source: 'Provided Cultivation Tips reference PDF',
    sourceType: 'reference',
    details: {
      description: 'Pre-cool fresh French beans immediately after harvest and store in cold storage at 4°C - 7°C with 90-95% relative humidity.',
      whyImportant: 'Fresh beans have high respiration rates; prompt cooling extends marketable shelf life from 2 days to over 14 days.',
      instructions: [
        'Pre-cool beans using forced-air cooling within 4 hours of field picking.',
        'Maintain cold room temperature strictly between 4°C and 7°C.',
        'Pack in perforated polyethylene bags or ventilated corrugated boxes to prevent condensation build-up.'
      ],
      tips: [
        'Keep cold storage rooms free from ethylene-producing fruits like ripening bananas or apples.'
      ],
      warnings: [
        'Never store beans below 3°C; freezing temperatures induce chilling injury, pitting, and russeting.'
      ]
    }
  },
  {
    id: 'bean-post-003',
    cropId: 'Bean',
    taskId: 'post-harvest',
    stageId: 'post-harvest',
    // Truncated title preserved from PDF
    title: 'Standardization of your leguminous s...',
    timing: {
      type: 'after_sowing',
      startWeek: 13,
      durationWeeks: 1
    },
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
    contentStatus: 'reference-title-only',
    source: 'Provided Cultivation Tips reference PDF',
    sourceType: 'reference',
    details: {
      description: 'Standardization, grading, and moisture certification of leguminous seed stocks. Title preserved exactly as provided in the reference PDF.',
      whyImportant: 'Ensures seed quality, uniform size grading, and certification compliance for commercial market delivery.',
      instructions: [
        'Grade seeds using appropriate sieves to eliminate broken, shriveled, and discolored grains.',
        'Ensure moisture content is strictly below 10-12% before sealing in airtight storage bags.',
        'Treat storage seeds with Neem oil or inert diatomaceous earth to prevent bruchid beetle attacks.'
      ],
      tips: [
        'Use certified moisture meters to document exact moisture percentages for buyers.'
      ],
      warnings: [
        'Do not store seeds in damp non-ventilated rooms where mould can produce mycotoxins.'
      ]
    }
  },
  {
    id: 'bean-post-004',
    cropId: 'Bean',
    taskId: 'post-harvest',
    stageId: 'post-harvest',
    // Truncated title preserved from PDF
    title: 'Make sure you know where to sell your h...',
    timing: {
      type: 'after_sowing',
      startWeek: 13,
      durationWeeks: 1
    },
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&auto=format&fit=crop&q=80',
    contentStatus: 'reference-title-only',
    source: 'Provided Cultivation Tips reference PDF',
    sourceType: 'reference',
    details: {
      description: 'Market linkages and off-take agreements for bean harvest. Title preserved exactly as provided in the reference PDF.',
      whyImportant: 'Pre-established mandi or contract buyer arrangements eliminate distress sales of perishable produce.',
      instructions: [
        'Check real-time APMC mandi prices and e-NAM rates 2 weeks prior to anticipated harvest.',
        'Connect with local Farmer Producer Organizations (FPOs) for bulk aggregation and transport savings.',
        'Arrange transport vehicles and crates ahead of harvest morning.'
      ],
      tips: [
        'Sort produce into Grade A (premium market) and Grade B to maximize average revenue.'
      ],
      warnings: [
        'Avoid shipping during extreme midday heat without protective tarpaulins.'
      ]
    }
  },

  // PRE-SEEDING BY STAGE REFERENCE ACTIVITIES (From PDF Reference)
  {
    id: 'bean-sel-001',
    cropId: 'Bean',
    taskId: 'site-selection', // Accessible through Site Selection task
    categoryName: 'Plant Selection', // Stage reference sub-category
    stageId: 'pre-seeding',
    title: 'Varieties for broad bean',
    timing: {
      type: 'before_sowing',
      weeksBefore: 2,
      durationWeeks: 1,
      label: '2 weeks before seedling'
    },
    image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=600&auto=format&fit=crop&q=80',
    contentStatus: 'complete',
    source: 'Provided Cultivation Tips reference PDF',
    sourceType: 'reference',
    details: {
      description: 'Select certified high-yielding broad bean (Vicia faba) varieties suited to your agro-climatic zone and sowing window.',
      whyImportant: 'Certified seeds ensure genetic purity, uniform flowering, resistance to chocolate spot and rust.',
      instructions: [
        'Procure certified seeds from recognized state seed corporations or research institutes.',
        'Popular varieties include Pusa Sumeet, Jawahar Bean 1, and Vikrant.',
        'Perform germination test on 100 seeds; discard seed lots with germination under 85%.'
      ],
      tips: [
        'Treat seeds with Rhizobium culture and Trichoderma (10g/kg) before sowing.'
      ],
      warnings: [
        'Do not save seeds from infected fields where virus symptoms were evident.'
      ]
    }
  },
  {
    id: 'bean-sel-002',
    cropId: 'Bean',
    taskId: 'site-selection',
    categoryName: 'Plant Selection',
    stageId: 'pre-seeding',
    title: 'Varieties for French beans',
    timing: {
      type: 'before_sowing',
      weeksBefore: 2,
      durationWeeks: 1,
      label: '2 weeks before seedling'
    },
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=600&auto=format&fit=crop&q=80',
    contentStatus: 'complete',
    source: 'Provided Cultivation Tips reference PDF',
    sourceType: 'reference',
    details: {
      description: 'Choose between bush-type and pole-type French bean (Phaseolus vulgaris) varieties depending on staking infrastructure.',
      whyImportant: 'Bush varieties (e.g. Arka Komal, Contender) mature quickly (50-55 days) without trellis costs.',
      instructions: [
        'For bush types, choose Contender, Pusa Parvati, or Arka Komal.',
        'For pole/climbing types, select Kentucky Wonder or Arka Sukomal.',
        'Estimate seed requirement: 30-35 kg/acre for bush types; 15-20 kg/acre for pole types.'
      ],
      tips: [
        'Pole types yield 2x higher per unit area but require strong bamboo trellis support.'
      ],
      warnings: [
        'Ensure seed moisture is below 9% before handling; bean seed coats crack easily if dropped.'
      ]
    }
  }
];

// Reusable / extensible crop-specific data for 9 other crops
export const OTHER_CROPS_DATA = {
  Rice: {
    tasks: [
      { id: 'nursery', name: 'Nursery Management', icon: '🌱', order: 1 },
      { id: 'field-prep', name: 'Puddling & Field Prep', icon: '🚜', order: 2 },
      { id: 'transplanting', name: 'Transplanting', icon: '🌾', order: 3 },
      { id: 'water-mgmt', name: 'Water Management', icon: '💧', order: 4 },
      { id: 'nutrient-mgmt', name: 'Nutrient Management', icon: '🧪', order: 5 },
      { id: 'pest-mgmt', name: 'Pest & Stem Borer Control', icon: '🛡️', order: 6 },
      { id: 'harvest', name: 'Harvest & Threshing', icon: '🧺', order: 7 }
    ],
    stages: [
      { id: 'rice-nursery', name: 'Nursery Stage', order: 1, timingDesc: 'Weeks -4 to 0', startOffsetDays: -28, endOffsetDays: 0 },
      { id: 'rice-tillering', name: 'Vegetative Tillering', order: 2, timingDesc: 'Weeks 1 to 5', startOffsetDays: 0, endOffsetDays: 35 },
      { id: 'rice-panicle', name: 'Panicle Initiation', order: 3, timingDesc: 'Weeks 6 to 9', startOffsetDays: 35, endOffsetDays: 63 },
      { id: 'rice-heading', name: 'Heading & Flowering', order: 4, timingDesc: 'Weeks 10 to 12', startOffsetDays: 63, endOffsetDays: 84 },
      { id: 'rice-ripening', name: 'Grain Ripening', order: 5, timingDesc: 'Weeks 13 to 16', startOffsetDays: 84, endOffsetDays: 112 },
      { id: 'rice-harvest', name: 'Harvest', order: 6, timingDesc: 'Weeks 17+', startOffsetDays: 112, endOffsetDays: 126 }
    ],
    activities: [
      {
        id: 'rice-act-001',
        cropId: 'Rice',
        taskId: 'nursery',
        stageId: 'rice-nursery',
        title: 'Nursery bed preparation and wet seeding',
        timing: { type: 'before_sowing', weeksBefore: 3, durationWeeks: 1 },
        contentStatus: 'complete',
        image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=600&auto=format&fit=crop&q=80',
        details: {
          description: 'Prepare raised nursery beds of 1.2m width and apply decomposed FYM. Broadcast sprouted paddy seeds uniformly.',
          whyImportant: 'Healthy vigorous rice seedlings develop sturdy tillers and establish quickly after transplanting.',
          instructions: ['Soak seeds in water for 24h and incubate in gunny bags for 24-36h.', 'Maintain thin film of water in nursery.'],
          tips: ['Treat seed with Carbendazim 2g/kg to prevent seedling blight.'],
          warnings: ['Do not submerge young rice sprouts under deep water.']
        }
      },
      {
        id: 'rice-act-002',
        cropId: 'Rice',
        taskId: 'transplanting',
        stageId: 'rice-tillering',
        title: 'Transplant 21-day old seedlings at optimal spacing',
        timing: { type: 'after_sowing', startWeek: 1, durationWeeks: 1 },
        contentStatus: 'complete',
        image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80',
        details: {
          description: 'Transplant 2-3 seedlings per hill at a spacing of 20 x 15 cm in puddled fields.',
          whyImportant: 'Optimal plant population maximizes effective panicle-bearing tillers per square meter.',
          instructions: ['Keep transplanting depth shallow (2-3 cm).', 'Maintain 2-3 cm standing water during transplanting.'],
          tips: ['Follow line transplanting to facilitate mechanical cono-weeding.'],
          warnings: ['Deep transplanting (>5 cm) delays tiller formation.']
        }
      },
      {
        id: 'rice-act-003',
        cropId: 'Rice',
        taskId: 'pest-mgmt',
        stageId: 'rice-panicle',
        title: 'Monitor and control Yellow Stem Borer',
        timing: { type: 'after_sowing', startWeek: 7, durationWeeks: 1 },
        contentStatus: 'complete',
        image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&auto=format&fit=crop&q=80',
        details: {
          description: 'Install pheromone traps @ 5/acre to monitor Yellow Stem Borer adult moth emergence.',
          whyImportant: 'Stem borer larvae cause dead hearts at tillering and white ears at panicle stage.',
          instructions: ['Inspect egg masses on leaf tips.', 'Apply Cartap Hydrochloride 4G @ 10 kg/acre if dead hearts exceed 5%.'],
          tips: ['Clip seedling leaf tips before transplanting to remove borer egg masses.'],
          warnings: ['Avoid indiscriminate sprays which eradicate spider predators.']
        }
      }
    ]
  },
  Wheat: {
    tasks: [
      { id: 'seedbed', name: 'Seedbed Preparation', icon: '🚜', order: 1 },
      { id: 'sowing', name: 'Sowing & Spacing', icon: '🌱', order: 2 },
      { id: 'irrigation', name: 'CRI & Irrigation', icon: '💧', order: 3 },
      { id: 'weeding', name: 'Weed Management', icon: '🌾', order: 4 },
      { id: 'rust-mgmt', name: 'Rust & Disease Control', icon: '🛡️', order: 5 },
      { id: 'harvest', name: 'Harvesting', icon: '🧺', order: 6 }
    ],
    stages: [
      { id: 'wheat-pre', name: 'Pre-Sowing', order: 1, timingDesc: 'Weeks -2 to 0', startOffsetDays: -14, endOffsetDays: 0 },
      { id: 'wheat-cri', name: 'Crown Root Initiation (CRI)', order: 2, timingDesc: 'Weeks 1 to 3', startOffsetDays: 0, endOffsetDays: 21 },
      { id: 'wheat-tillering', name: 'Tillering & Jointing', order: 3, timingDesc: 'Weeks 4 to 7', startOffsetDays: 21, endOffsetDays: 49 },
      { id: 'wheat-heading', name: 'Heading & Flowering', order: 4, timingDesc: 'Weeks 8 to 11', startOffsetDays: 49, endOffsetDays: 77 },
      { id: 'wheat-dough', name: 'Milking & Dough Stage', order: 5, timingDesc: 'Weeks 12 to 15', startOffsetDays: 77, endOffsetDays: 105 },
      { id: 'wheat-harvest', name: 'Maturity & Harvest', order: 6, timingDesc: 'Weeks 16+', startOffsetDays: 105, endOffsetDays: 120 }
    ],
    activities: [
      {
        id: 'wheat-act-001',
        cropId: 'Wheat',
        taskId: 'irrigation',
        stageId: 'wheat-cri',
        title: 'First irrigation at Crown Root Initiation (CRI)',
        timing: { type: 'after_sowing', startWeek: 3, durationWeeks: 1 },
        contentStatus: 'complete',
        image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&auto=format&fit=crop&q=80',
        details: {
          description: 'Apply the most crucial irrigation at 20-25 days after sowing when crown roots initiate.',
          whyImportant: 'Missing CRI irrigation reduces tillering and permanently lowers grain yield by up to 30%.',
          instructions: ['Apply light, uniform irrigation.', 'Follow with top dressing of urea @ 35 kg/acre.'],
          tips: ['Avoid standing water as wheat roots suffer from lack of aeration.'],
          warnings: ['Delaying this irrigation beyond 25 days severely restricts secondary root growth.']
        }
      }
    ]
  },
  Maize: {
    tasks: [
      { id: 'land-prep', name: 'Land Preparation', icon: '🚜', order: 1 },
      { id: 'sowing', name: 'Ridge Sowing', icon: '🌱', order: 2 },
      { id: 'faw-control', name: 'Fall Armyworm Scouting', icon: '🛡️', order: 3 },
      { id: 'fertilization', name: 'Split Fertilization', icon: '🧪', order: 4 },
      { id: 'harvest', name: 'Cob Harvesting', icon: '🧺', order: 5 }
    ],
    stages: [
      { id: 'maize-pre', name: 'Pre-Sowing', order: 1, timingDesc: 'Weeks -2 to 0', startOffsetDays: -14, endOffsetDays: 0 },
      { id: 'maize-knee', name: 'Knee High Stage', order: 2, timingDesc: 'Weeks 1 to 5', startOffsetDays: 0, endOffsetDays: 35 },
      { id: 'maize-tassel', name: 'Tasseling & Silking', order: 3, timingDesc: 'Weeks 6 to 9', startOffsetDays: 35, endOffsetDays: 63 },
      { id: 'maize-grain', name: 'Grain Filling', order: 4, timingDesc: 'Weeks 10 to 13', startOffsetDays: 63, endOffsetDays: 91 },
      { id: 'maize-harvest', name: 'Harvest', order: 5, timingDesc: 'Weeks 14+', startOffsetDays: 91, endOffsetDays: 105 }
    ],
    activities: [
      {
        id: 'maize-act-001',
        cropId: 'Maize',
        taskId: 'faw-control',
        stageId: 'maize-knee',
        title: 'Scout whorls for Fall Armyworm (FAW) egg masses',
        timing: { type: 'after_sowing', startWeek: 2, durationWeeks: 1 },
        contentStatus: 'complete',
        image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&auto=format&fit=crop&q=80',
        details: {
          description: 'Inspect central whorls for shot holes, sawdust-like frass, and FAW larvae.',
          whyImportant: 'FAW can devastate young corn whorls within 48 hours if unmonitored.',
          instructions: ['Apply neem cake in whorls or spray Emamectin Benzoate 5 SG @ 0.4 g/L into whorls.'],
          tips: ['Install FAW pheromone traps @ 5/acre.'],
          warnings: ['Direct spray into the whorl rather than broadcasting on outer leaves.']
        }
      }
    ]
  },
  Potato: {
    tasks: [
      { id: 'tuber-prep', name: 'Tuber Selection & Treatment', icon: '🥔', order: 1 },
      { id: 'ridge-making', name: 'Ridge & Furrow Planting', icon: '🚜', order: 2 },
      { id: 'earthing-up', name: 'Earthing Up', icon: '🌱', order: 3 },
      { id: 'late-blight', name: 'Late Blight Protection', icon: '🛡️', order: 4 },
      { id: 'harvest', name: 'Dehaulming & Harvest', icon: '🧺', order: 5 }
    ],
    stages: [
      { id: 'pot-pre', name: 'Pre-Planting', order: 1, timingDesc: 'Weeks -2 to 0', startOffsetDays: -14, endOffsetDays: 0 },
      { id: 'pot-sprout', name: 'Sprouting & Emergence', order: 2, timingDesc: 'Weeks 1 to 3', startOffsetDays: 0, endOffsetDays: 21 },
      { id: 'pot-tuber', name: 'Tuber Initiation', order: 3, timingDesc: 'Weeks 4 to 7', startOffsetDays: 21, endOffsetDays: 49 },
      { id: 'pot-bulking', name: 'Tuber Bulking', order: 4, timingDesc: 'Weeks 8 to 11', startOffsetDays: 49, endOffsetDays: 77 },
      { id: 'pot-harvest', name: 'Maturity & Harvest', order: 5, timingDesc: 'Weeks 12+', startOffsetDays: 77, endOffsetDays: 90 }
    ],
    activities: [
      {
        id: 'pot-act-001',
        cropId: 'Potato',
        taskId: 'earthing-up',
        stageId: 'pot-tuber',
        title: 'Earthing up to prevent greening of developing tubers',
        timing: { type: 'after_sowing', startWeek: 4, durationWeeks: 1 },
        contentStatus: 'complete',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
        details: {
          description: 'Mound loose soil around plant stems at 30-35 days after planting.',
          whyImportant: 'Exposure of growing tubers to sunlight triggers toxic solanine production (greening).',
          instructions: ['Pull soil from furrow bottoms up around plant base.', 'Apply split potassium fertilizer before earthing up.'],
          tips: ['Conduct when soil is moist but workable.'],
          warnings: ['Take care not to cut stolons with hoes.']
        }
      }
    ]
  },
  Tomato: {
    tasks: [
      { id: 'nursery', name: 'Nursery & Seedling', icon: '🌱', order: 1 },
      { id: 'transplanting', name: 'Transplanting & Staking', icon: '🚜', order: 2 },
      { id: 'irrigation', name: 'Drip Irrigation', icon: '💧', order: 3 },
      { id: 'pest-blight', name: 'Blight & Borer Management', icon: '🛡️', order: 4 },
      { id: 'picking', name: 'Color Stage Picking', icon: '🧺', order: 5 }
    ],
    stages: [
      { id: 'tom-nursery', name: 'Nursery Stage', order: 1, timingDesc: 'Weeks -4 to 0', startOffsetDays: -28, endOffsetDays: 0 },
      { id: 'tom-veg', name: 'Early Vegetative', order: 2, timingDesc: 'Weeks 1 to 4', startOffsetDays: 0, endOffsetDays: 28 },
      { id: 'tom-flower', name: 'Flowering & Fruit Set', order: 3, timingDesc: 'Weeks 5 to 8', startOffsetDays: 28, endOffsetDays: 56 },
      { id: 'tom-ripen', name: 'Fruit Development', order: 4, timingDesc: 'Weeks 9 to 13', startOffsetDays: 56, endOffsetDays: 91 },
      { id: 'tom-harvest', name: 'Harvesting', order: 5, timingDesc: 'Weeks 14+', startOffsetDays: 91, endOffsetDays: 110 }
    ],
    activities: [
      {
        id: 'tom-act-001',
        cropId: 'Tomato',
        taskId: 'pest-blight',
        stageId: 'tom-flower',
        title: 'Prevent Early & Late Blight with prophylactic spray',
        timing: { type: 'after_sowing', startWeek: 6, durationWeeks: 1 },
        contentStatus: 'complete',
        image: 'https://images.unsplash.com/photo-1592417817098-8f3d69102377?w=600&auto=format&fit=crop&q=80',
        details: {
          description: 'Spray Mancozeb 75 WP @ 2.5 g/liter before humid cloudy weather promotes spore germination.',
          whyImportant: 'Blight defoliates tomato vines and causes rotting lesions on fruits.',
          instructions: ['Ensure complete spray coverage including lower leaves.'],
          tips: ['Remove and destroy infected bottom leaves.'],
          warnings: ['Rotate fungicide chemical groups to prevent fungal resistance.']
        }
      }
    ]
  },
  Cotton: {
    tasks: [
      { id: 'seedbed', name: 'Seedbed & Spacing', icon: '🚜', order: 1 },
      { id: 'sucking-pests', name: 'Sucking Pest Management', icon: '🛡️', order: 2 },
      { id: 'bollworm', name: 'Bollworm Monitoring', icon: '🔍', order: 3 },
      { id: 'defoliation', name: 'Boll Opening & Picking', icon: '🧺', order: 4 }
    ],
    stages: [
      { id: 'cot-seedling', name: 'Seedling Stage', order: 1, timingDesc: 'Weeks 1 to 4', startOffsetDays: 0, endOffsetDays: 28 },
      { id: 'cot-squaring', name: 'Squaring (Budding)', order: 2, timingDesc: 'Weeks 5 to 9', startOffsetDays: 28, endOffsetDays: 63 },
      { id: 'cot-flowering', name: 'Flowering & Boll Setting', order: 3, timingDesc: 'Weeks 10 to 16', startOffsetDays: 63, endOffsetDays: 112 },
      { id: 'cot-opening', name: 'Boll Opening & Harvest', order: 4, timingDesc: 'Weeks 17 to 22', startOffsetDays: 112, endOffsetDays: 154 }
    ],
    activities: [
      {
        id: 'cot-act-001',
        cropId: 'Cotton',
        taskId: 'bollworm',
        stageId: 'cot-squaring',
        title: 'Install Pink Bollworm pheromone traps',
        timing: { type: 'after_sowing', startWeek: 6, durationWeeks: 1 },
        contentStatus: 'complete',
        image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&auto=format&fit=crop&q=80',
        details: {
          description: 'Set up funnel traps @ 8/acre with Gossyplure lures to monitor moth flights.',
          whyImportant: 'Pink bollworm larvae enter bolls unnoticed and stain lint.',
          instructions: ['Replace lures every 21 days.'],
          tips: ['Spray Azadirachtin if trap catches exceed 8 moths/night for 3 consecutive nights.'],
          warnings: ['Dispose of rosette flowers containing larvae manually.']
        }
      }
    ]
  },
  Mustard: {
    tasks: [
      { id: 'land-prep', name: 'Field Preparation', icon: '🚜', order: 1 },
      { id: 'aphid-control', name: 'Mustard Aphid Control', icon: '🛡️', order: 2 },
      { id: 'harvest', name: 'Pod Maturity Harvest', icon: '🧺', order: 3 }
    ],
    stages: [
      { id: 'mus-seedling', name: 'Seedling Stage', order: 1, timingDesc: 'Weeks 1 to 3', startOffsetDays: 0, endOffsetDays: 21 },
      { id: 'mus-rosette', name: 'Rosette & Branching', order: 2, timingDesc: 'Weeks 4 to 6', startOffsetDays: 21, endOffsetDays: 42 },
      { id: 'mus-flowering', name: 'Flowering & Pod Set', order: 3, timingDesc: 'Weeks 7 to 10', startOffsetDays: 42, endOffsetDays: 70 },
      { id: 'mus-harvest', name: 'Siliqua Maturity & Harvest', order: 4, timingDesc: 'Weeks 11 to 14', startOffsetDays: 70, endOffsetDays: 98 }
    ],
    activities: [
      {
        id: 'mus-act-001',
        cropId: 'Mustard',
        taskId: 'aphid-control',
        stageId: 'mus-flowering',
        title: 'Check mustard aphid colonies on inflorescence branches',
        timing: { type: 'after_sowing', startWeek: 8, durationWeeks: 1 },
        contentStatus: 'complete',
        image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&auto=format&fit=crop&q=80',
        details: {
          description: 'Inspect central flower stalks. If aphid colony length exceeds 1.5 cm on >20% plants, spray Dimethoate 30 EC @ 1.5 ml/L.',
          whyImportant: 'Aphid swarms curl floral shoots and cause empty siliquae.',
          instructions: ['Spray in late evening to spare pollinators.'],
          tips: ['Yellow sticky traps assist in early detection.'],
          warnings: ['Avoid water stress during pod development.']
        }
      }
    ]
  },
  'Chickpea & Gram': {
    tasks: [
      { id: 'seedbed', name: 'Seedbed & Deep Sowing', icon: '🚜', order: 1 },
      { id: 'pod-borer', name: 'Helicoverpa Pod Borer', icon: '🛡️', order: 2 },
      { id: 'harvest', name: 'Desi Gram Harvest', icon: '🧺', order: 3 }
    ],
    stages: [
      { id: 'chick-seedling', name: 'Seedling Stage', order: 1, timingDesc: 'Weeks 1 to 4', startOffsetDays: 0, endOffsetDays: 28 },
      { id: 'chick-veg', name: 'Branching Stage', order: 2, timingDesc: 'Weeks 5 to 7', startOffsetDays: 28, endOffsetDays: 49 },
      { id: 'chick-flower', name: 'Flowering & Podding', order: 3, timingDesc: 'Weeks 8 to 11', startOffsetDays: 49, endOffsetDays: 77 },
      { id: 'chick-harvest', name: 'Maturity & Harvest', order: 4, timingDesc: 'Weeks 12+', startOffsetDays: 77, endOffsetDays: 105 }
    ],
    activities: [
      {
        id: 'chick-act-001',
        cropId: 'Chickpea & Gram',
        taskId: 'pod-borer',
        stageId: 'chick-flower',
        title: 'Scout and control Helicoverpa armigera caterpillars',
        timing: { type: 'after_sowing', startWeek: 9, durationWeeks: 1 },
        contentStatus: 'complete',
        image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&auto=format&fit=crop&q=80',
        details: {
          description: 'Install bird perches (T-shaped bamboo sticks @ 15/acre) and spray Chlorantraniliprole 18.5 SC @ 0.3 ml/L at early podding.',
          whyImportant: 'Single caterpillar can damage 30-40 developing pods.',
          instructions: ['Spray in late afternoon when caterpillars emerge.'],
          tips: ['Deploy HaNPV (250 LE/acre) for biological control.'],
          warnings: ['Do not over-irrigate during vegetative phase to avoid excessive foliage.']
        }
      }
    ]
  },
  Groundnut: {
    tasks: [
      { id: 'seed-bed', name: 'Broad Bed & Furrow', icon: '🚜', order: 1 },
      { id: 'gypsum', name: 'Gypsum Application', icon: '🧪', order: 2 },
      { id: 'leaf-spot', name: 'Tikka Disease Control', icon: '🛡️', order: 3 },
      { id: 'harvest', name: 'Pod Harvesting & Drying', icon: '🧺', order: 4 }
    ],
    stages: [
      { id: 'gnd-seedling', name: 'Seedling Stage', order: 1, timingDesc: 'Weeks 1 to 3', startOffsetDays: 0, endOffsetDays: 21 },
      { id: 'gnd-peg', name: 'Pegging Stage', order: 2, timingDesc: 'Weeks 4 to 7', startOffsetDays: 21, endOffsetDays: 49 },
      { id: 'gnd-pod', name: 'Pod Development', order: 3, timingDesc: 'Weeks 8 to 12', startOffsetDays: 49, endOffsetDays: 84 },
      { id: 'gnd-harvest', name: 'Harvest', order: 4, timingDesc: 'Weeks 13+', startOffsetDays: 84, endOffsetDays: 110 }
    ],
    activities: [
      {
        id: 'gnd-act-001',
        cropId: 'Groundnut',
        taskId: 'gypsum',
        stageId: 'gnd-peg',
        title: 'Apply Gypsum at pegging stage for optimal kernel filling',
        timing: { type: 'after_sowing', startWeek: 5, durationWeeks: 1 },
        contentStatus: 'complete',
        image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&auto=format&fit=crop&q=80',
        details: {
          description: 'Broadcast Gypsum @ 200 kg/acre around plant base and lightly hoe into the soil.',
          whyImportant: 'Calcium is directly absorbed by developing pegs; calcium deficiency causes "pops" (empty pods).',
          instructions: ['Apply at 40-45 days after sowing and earth up soil.'],
          tips: ['Ensure adequate soil moisture after application.'],
          warnings: ['Avoid deep hoeing once pegs have entered the soil.']
        }
      }
    ]
  }
};

/**
 * Central Crop Advisory Repository Singleton
 */
export const CropAdvisoryRepository = {
  /**
   * Get all supported crops catalog
   */
  getCrops() {
    return CROPS_CATALOG;
  },

  /**
   * Get crop metadata by ID or name
   */
  getCrop(cropId) {
    if (!cropId) return CROPS_CATALOG[0];
    const normalized = cropId.trim().toLowerCase();
    return (
      CROPS_CATALOG.find(
        (c) => c.id.toLowerCase() === normalized || c.name.toLowerCase() === normalized
      ) || CROPS_CATALOG[0]
    );
  },

  /**
   * Get stages for a given crop
   */
  getCropStages(cropId) {
    const crop = this.getCrop(cropId);
    if (crop.name.toLowerCase() === 'bean') {
      return BEAN_STAGES;
    }
    if (OTHER_CROPS_DATA[crop.name]?.stages) {
      return OTHER_CROPS_DATA[crop.name].stages;
    }
    // Generic fallback stages for extensible crops
    return [
      { id: `${crop.id}-pre`, name: 'Pre-Sowing', order: 1, timingDesc: 'Weeks -2 to 0', startOffsetDays: -14, endOffsetDays: 0 },
      { id: `${crop.id}-veg`, name: 'Vegetative Growth', order: 2, timingDesc: 'Weeks 1 to 6', startOffsetDays: 0, endOffsetDays: 42 },
      { id: `${crop.id}-repro`, name: 'Reproductive & Flowering', order: 3, timingDesc: 'Weeks 7 to 10', startOffsetDays: 42, endOffsetDays: 70 },
      { id: `${crop.id}-mat`, name: 'Maturity & Harvest', order: 4, timingDesc: 'Weeks 11+', startOffsetDays: 70, endOffsetDays: 90 }
    ];
  },

  /**
   * Get tasks for a given crop
   */
  getCropTasks(cropId) {
    const crop = this.getCrop(cropId);
    if (crop.name.toLowerCase() === 'bean') {
      return BEAN_TASKS;
    }
    if (OTHER_CROPS_DATA[crop.name]?.tasks) {
      return OTHER_CROPS_DATA[crop.name].tasks;
    }
    return [
      { id: 'site-selection', name: 'Site Selection', icon: '📍', order: 1 },
      { id: 'field-preparation', name: 'Field Preparation', icon: '🚜', order: 2 },
      { id: 'irrigation', name: 'Irrigation', icon: '💧', order: 3 },
      { id: 'preventive-measure', name: 'Crop Protection', icon: '🛡️', order: 4 },
      { id: 'harvesting', name: 'Harvesting', icon: '🧺', order: 5 }
    ];
  },

  /**
   * Get all activities for a given crop
   */
  getCropActivities(cropId) {
    const crop = this.getCrop(cropId);
    if (crop.name.toLowerCase() === 'bean') {
      return BEAN_ACTIVITIES;
    }
    if (OTHER_CROPS_DATA[crop.name]?.activities) {
      return OTHER_CROPS_DATA[crop.name].activities;
    }
    return [];
  },

  /**
   * Get activities filtered by Task ID
   */
  getActivitiesByTask(cropId, taskId) {
    const all = this.getCropActivities(cropId);
    return all.filter((a) => a.taskId === taskId);
  },

  /**
   * Get activities filtered by Stage ID
   */
  getActivitiesByStage(cropId, stageId) {
    const all = this.getCropActivities(cropId);
    return all.filter((a) => a.stageId === stageId);
  },

  /**
   * Get single activity by ID
   */
  getActivity(activityId) {
    if (!activityId) return null;
    const foundBean = BEAN_ACTIVITIES.find((a) => a.id === activityId);
    if (foundBean) return foundBean;

    for (const cropKey of Object.keys(OTHER_CROPS_DATA)) {
      const foundOther = OTHER_CROPS_DATA[cropKey].activities?.find((a) => a.id === activityId);
      if (foundOther) return foundOther;
    }
    return null;
  },

  /**
   * Data validation utility
   */
  validateRepository() {
    const errors = [];
    const allIds = new Set();

    // Check Bean activities
    for (const act of BEAN_ACTIVITIES) {
      if (allIds.has(act.id)) {
        errors.push(`Duplicate activity ID detected: ${act.id}`);
      }
      allIds.add(act.id);

      if (!act.title) {
        errors.push(`Activity ${act.id} is missing a title.`);
      }

      const validTask = BEAN_TASKS.some((t) => t.id === act.taskId);
      if (!validTask) {
        errors.push(`Activity ${act.id} has invalid taskId: ${act.taskId}`);
      }

      const validStage = BEAN_STAGES.some((s) => s.id === act.stageId);
      if (!validStage) {
        errors.push(`Activity ${act.id} has invalid stageId: ${act.stageId}`);
      }

      if (!act.timing || !act.timing.type) {
        errors.push(`Activity ${act.id} has invalid timing structure.`);
      }
    }

    return {
      valid: errors.length === 0,
      totalBeanActivities: BEAN_ACTIVITIES.length,
      errors
    };
  }
};
