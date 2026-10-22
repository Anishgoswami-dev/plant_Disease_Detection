/**
 * 🌾 KRISHI MEDICINE & COMPREHENSIVE AGRONOMIC KNOWLEDGE BASE
 * Production-ready database of disease treatments, CIB&RC-approved chemical formulations,
 * bio-control agents, and farmer prescription data for Indian crops.
 */

export const DISEASE_PRESCRIPTIONS = {
  // ==========================================
  // 🍅 TOMATO & SOLANACEOUS DISEASES
  // ==========================================
  'Early Blight': {
    scientificName: 'Alternaria solani',
    pathogen: 'Alternaria solani (Fungus)',
    severityGuidance: 'Concentric brown target-board lesions on lower canopy spreading upwards.',
    medicines: [
      {
        id: 'med_eb_1',
        type: 'Contact Protectant Fungicide (सुरक्षात्मक फफूंदनाशक)',
        productName: 'Mancozeb 75% WP (Dithane M-45 / Indofil M-45)',
        activeIngredient: 'Mancozeb 75% WP',
        formulation: 'Wettable Powder (WP)',
        dosePerLiter: '2.5 g / Liter water',
        dosePerPump: '35 - 40 g per 15-Liter Pump',
        dosePerAcre: '500 g in 200 Liters water / Acre',
        applicationMethod: 'Foliar canopy spray with uniform coverage on lower and upper leaf surface.',
        applicationInterval: '7 to 10 days interval',
        phi: '7 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Wear N95 respirator mask and nitrile gloves. Do not spray during windy hours.',
        targetPathogen: 'Inhibits fungal spore germination and cellular respiration in Alternaria solani.',
        cibRegistration: 'Approved under CIB&RC Section 9(3) for Solanaceous Crops'
      },
      {
        id: 'med_eb_2',
        type: 'Broad-Spectrum Systemic Curative (अंतःप्रवाही फफूंदनाशक)',
        productName: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC (Amistar Top)',
        activeIngredient: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC',
        formulation: 'Suspension Concentrate (SC)',
        dosePerLiter: '1.0 ml / Liter water',
        dosePerPump: '15 ml per 15-Liter Pump',
        dosePerAcre: '200 ml in 200 Liters water / Acre',
        applicationMethod: 'Fine mist foliar canopy spray with hollow cone nozzle.',
        applicationInterval: '12 to 14 days interval',
        phi: '5 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Do not exceed recommended dose. Keep away from ponds and fish habitats.',
        targetPathogen: 'Dual translaminar and systemic mode of action stopping mycelium growth.',
        cibRegistration: 'CIB&RC Registered for Solanaceous and Horticultural Blights'
      },
      {
        id: 'med_eb_3',
        type: 'Biological Bio-Fungicide (जैविक कवकनाशी)',
        productName: 'Trichoderma viride 1.5% WP (Bio-Shield / Sanjeevani)',
        activeIngredient: 'Trichoderma viride (2 x 10^8 CFU/g min)',
        formulation: 'Wettable Powder (WP)',
        dosePerLiter: '5.0 g / Liter water',
        dosePerPump: '75 g per 15-Liter Pump',
        dosePerAcre: '1.0 kg in 200 Liters water / Acre',
        applicationMethod: 'Foliar spray + root zone soil drenching during calm morning/evening.',
        applicationInterval: 'Repeat every 10 to 14 days for preventive bio-layering.',
        phi: '0 days (Completely Safe / Non-toxic)',
        toxicityBand: 'GREEN (Safe Bio-Pesticide)',
        safetyInstructions: 'Do not mix with chemical fungicides or bactericides. Use within 24 hours of mixing.',
        targetPathogen: 'Hyper-parasitizes pathogenic fungal mycelia and boosts plant systemic resistance.',
        cibRegistration: 'CIB&RC Bio-pesticide Schedule 1968'
      }
    ],
    solutionSteps: [
      {
        stepNumber: '01',
        title: 'Sanitation & Lower Canopy Rogueing (सफाई एवं संक्रमित पत्तियों की छंटाई)',
        badge: 'Immediate Action (Day 1)',
        icon: '✂️',
        desc: 'Carefully prune and remove all lower yellow leaves with target-ring necrotic spots located within 30cm of soil level. Collect in a plastic bag and bury in a 2-foot deep pit away from the field. Never leave infected foliage on field bunds.',
        timing: 'Immediately upon spotting symptoms'
      },
      {
        stepNumber: '02',
        title: 'Tool Disinfection & Field Hygiene (उपकरणों का विसंक्रमण)',
        badge: 'Sanitation Protocol',
        icon: '🧼',
        desc: 'Sterilize secateurs, pruning knives, and scissors by dipping in 1% sodium hypochlorite (household bleach) or 0.1% potassium permanganate solution between plants to stop pathogen transfer.',
        timing: 'During each pruning pass'
      },
      {
        stepNumber: '03',
        title: 'Irrigation & Microclimate Control (जल एवं हवा प्रबंधन)',
        badge: 'Cultural Control (Day 2)',
        icon: '💧',
        desc: 'Immediately stop overhead sprinkler irrigation which keeps foliage wet for >6 hours. Switch completely to drip irrigation. Stake or trellis tomato plants to ensure adequate air circulation and rapid morning canopy drying.',
        timing: 'Immediate permanent adjustment'
      },
      {
        stepNumber: '04',
        title: 'Protective Fungicide Foliar Application (दवा का पहला छिड़काव)',
        badge: 'Chemical Therapy (Day 2-3)',
        icon: '🧪',
        desc: 'Spray Mancozeb 75% WP @ 2.5g/L (35-40g per 15L knapsack pump) thoroughly covering both upper and lower leaf surfaces during morning hours (7:00 AM - 10:00 AM). Add a non-ionic spreader/sticker (0.5ml/L) for rainfastness.',
        timing: 'Morning or late afternoon'
      },
      {
        stepNumber: '05',
        title: 'Systemic Follow-up Spray if Infection Persists (द्वितीय उपचारात्मक छिड़काव)',
        badge: 'Curative Spray (Day 8-10)',
        icon: '🔬',
        desc: 'If lesions continue expanding onto upper clusters, spray Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1ml/L (15ml / 15L pump). Maintain at least 8 to 10 days gap from the first contact spray.',
        timing: 'Day 8 to 10 post-first spray'
      },
      {
        stepNumber: '06',
        title: 'Pre-Harvest Interval (PHI) & Field Monitoring (तुड़ाई अंतराल व निगरानी)',
        badge: 'Harvest Safety',
        icon: '⏱️',
        desc: 'Observe a strict Pre-Harvest Interval (PHI) of 5 to 7 days before picking fruit. Regularly scout 20 random plants weekly to ensure new emerging shoots remain healthy and spot-free.',
        timing: 'Weekly scouting until harvest'
      }
    ]
  },

  'Late Blight': {
    scientificName: 'Phytophthora infestans',
    pathogen: 'Phytophthora infestans (Oomycete)',
    severityGuidance: 'Water-soaked irregular dark lesions with white fungal down on leaf undersides in cold humid weather.',
    medicines: [
      {
        id: 'med_lb_1',
        type: 'Curative Systemic Oomyceticide (अंतःप्रवाही फफूंदनाशक)',
        productName: 'Metalaxyl-M 4% + Mancozeb 64% WP (Ridomil Gold)',
        activeIngredient: 'Metalaxyl-M 4% + Mancozeb 64% WP',
        formulation: 'Wettable Powder (WP)',
        dosePerLiter: '2.5 g / Liter water',
        dosePerPump: '35 - 40 g per 15-Liter Pump',
        dosePerAcre: '500 g in 200 Liters water / Acre',
        applicationMethod: 'Thorough canopy wetting including stems and leaf undersides.',
        applicationInterval: '7 to 10 days interval',
        phi: '7 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Avoid skin contact. Use protective overalls, goggles, and face shield.',
        targetPathogen: 'Inhibits RNA polymerase in Phytophthora and halts rapid blighting.',
        cibRegistration: 'Approved for Potato & Tomato Late Blight'
      },
      {
        id: 'med_lb_2',
        type: 'Translaminar Protectant Fungicide (पारगामी कवकनाशी)',
        productName: 'Cymoxanil 8% + Mancozeb 64% WP (Curzate / Sectin)',
        activeIngredient: 'Cymoxanil 8% + Mancozeb 64% WP',
        formulation: 'Wettable Powder (WP)',
        dosePerLiter: '2.0 g / Liter water',
        dosePerPump: '30 g per 15-Liter Pump',
        dosePerAcre: '400 g in 200 Liters water / Acre',
        applicationMethod: 'Foliar spray with hollow cone nozzle.',
        applicationInterval: '7 to 10 days interval',
        phi: '7 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Do not spray when rain is imminent within 2 hours.',
        targetPathogen: 'Translaminar kick-back action halts established mycelial hyphae.',
        cibRegistration: 'CIB&RC Registered for Blight Management'
      },
      {
        id: 'med_lb_3',
        type: 'Protective Contact Copper Fungicide (ताम्रयुक्त कवकनाशी)',
        productName: 'Copper Oxychloride 50% WP (Blitox 50 / Fytolan)',
        activeIngredient: 'Copper Oxychloride 50% WP',
        formulation: 'Wettable Powder (WP)',
        dosePerLiter: '2.5 - 3.0 g / Liter water',
        dosePerPump: '40 - 45 g per 15-Liter Pump',
        dosePerAcre: '600 g in 200 Liters water / Acre',
        applicationMethod: 'Preventive protective spray after continuous cloudy/rainy spells.',
        applicationInterval: '8 to 12 days interval',
        phi: '5 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Do not mix with organophosphates. Spray during calm air conditions.',
        targetPathogen: 'Copper ions disrupt multi-site enzyme functions in oomycetes.',
        cibRegistration: 'CIB&RC Registered for Solanaceous Crops'
      }
    ],
    solutionSteps: [
      {
        stepNumber: '01',
        title: 'Emergency Rogueing of Water-Soaked Shoots (संक्रमित टहनियों का त्वरित निष्कासन)',
        badge: 'Critical Step (Day 1)',
        icon: '✂️',
        desc: 'Immediately cut and dispose of shoots showing water-soaked black lesions and white mildew felt. Phytophthora reproduces rapidly in humid conditions; infected material must be buried away from waterways.',
        timing: 'Immediate action'
      },
      {
        stepNumber: '02',
        title: 'Soil Drenching & Drainage Optimization (जल निकासी एवं जड़ सुरक्षा)',
        badge: 'Cultural Hygiene',
        icon: '💧',
        desc: 'Ensure field furrows have zero standing water. Form high earthing-up ridges around potato/tomato stems to prevent zoospores from washing down into tuber/root zones.',
        timing: 'Day 1 to 2'
      },
      {
        stepNumber: '03',
        title: 'Systemic Fungicide Spray (दवा का छिड़काव)',
        badge: 'Chemical Control (Day 2)',
        icon: '🧪',
        desc: 'Spray Metalaxyl-M 4% + Mancozeb 64% WP @ 2.5g/L (40g/15L pump). Target the underside of foliage where spore-bearing sporangia cluster.',
        timing: 'Immediate morning spray'
      },
      {
        stepNumber: '04',
        title: 'Preventive Anti-Resistance Rotation (कवकनाशी चक्रीकरण)',
        badge: 'Resistance Management',
        icon: '🔄',
        desc: 'After 7 days, rotate with Cymoxanil 8% + Mancozeb 64% WP @ 2.0g/L or Dimethomorph 50% WP @ 1g/L to prevent Phytophthora from developing fungicide resistance.',
        timing: 'Day 8 post-first spray'
      },
      {
        stepNumber: '05',
        title: 'Harvesting & Safety Protocol (तुड़ाई सुरक्षा)',
        badge: 'Harvest Safety',
        icon: '⏱️',
        desc: 'Observe a 7-day Pre-Harvest Interval (PHI). Do not harvest fruit or tubers during wet/foggy mornings to prevent storage rot.',
        timing: '7 days before harvesting'
      }
    ]
  },

  'Bacterial Spot': {
    scientificName: 'Xanthomonas campestris / Xanthomonas euvesicatoria',
    pathogen: 'Xanthomonas campestris / Xanthomonas euvesicatoria (Bacteria)',
    severityGuidance: 'Small dark water-soaked spots on leaves with yellow halos; scabby spots on fruit.',
    medicines: [
      {
        id: 'med_bs_1',
        type: 'Bactericide & Antibiotic Formulation (जीवाणुनाशक दवा)',
        productName: 'Streptocycline 90:10 (Streptomycin Sulphate 90% + Tetracycline Hydrochloride 10%)',
        activeIngredient: 'Streptomycin Sulphate 90% + Tetracycline Hydrochloride 10% SP',
        formulation: 'Soluble Powder (SP)',
        dosePerLiter: '0.1 g / Liter water (1 pouch of 6g in 60 Liters)',
        dosePerPump: '1.5 g per 15-Liter Pump',
        dosePerAcre: '20 g in 200 Liters water / Acre',
        applicationMethod: 'Foliar spray in combination with Copper Oxychloride.',
        applicationInterval: '10 to 12 days interval',
        phi: '10 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Accurate measurement required; do not overdose. Wear dust mask.',
        targetPathogen: 'Inhibits bacterial protein synthesis and stops cellular division in Xanthomonas.',
        cibRegistration: 'Approved for Horticultural Crops under CIB&RC'
      },
      {
        id: 'med_bs_2',
        type: 'Bactericidal Copper Complex (ताम्रयुक्त जीवाणुरोधक)',
        productName: 'Copper Oxychloride 50% WP (Blitox 50)',
        activeIngredient: 'Copper Oxychloride 50% WP',
        formulation: 'Wettable Powder (WP)',
        dosePerLiter: '2.5 g / Liter water',
        dosePerPump: '35 - 40 g per 15-Liter Pump',
        dosePerAcre: '500 g in 200 Liters water / Acre',
        applicationMethod: 'Tank-mixed alongside Streptocycline for synergistic contact bacterial control.',
        applicationInterval: '10 to 12 days interval',
        phi: '7 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Wash thoroughly after use. Store away from food grains.',
        targetPathogen: 'Forms protective copper barrier inhibiting bacterial entry into stomata.',
        cibRegistration: 'CIB&RC Registered'
      },
      {
        id: 'med_bs_3',
        type: 'Agricultural Bactericide (एंटीबायोटिक कवक व जीवाणुनाशक)',
        productName: 'Kasugamycin 3% SL (Kasu-B / Kasumin)',
        activeIngredient: 'Kasugamycin 3% SL',
        formulation: 'Soluble Liquid (SL)',
        dosePerLiter: '2.0 ml / Liter water',
        dosePerPump: '30 ml per 15-Liter Pump',
        dosePerAcre: '400 ml in 200 Liters water / Acre',
        applicationMethod: 'Foliar spray with uniform coverage during early lesion appearance.',
        applicationInterval: '10 days interval',
        phi: '5 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Avoid direct eye contact. Use protective goggles.',
        targetPathogen: 'Specific bactericidal antibiotic against Xanthomonas without cross-resistance.',
        cibRegistration: 'CIB&RC Registered'
      }
    ],
    solutionSteps: [
      {
        stepNumber: '01',
        title: 'Avoid Working in Wet Foliage (गीले पौधों में कार्य न करें)',
        badge: 'Sanitation Rule',
        icon: '🚫',
        desc: 'Never prune, stake, or walk through fields when leaves are wet with dew or rain. Xanthomonas bacteria spread extremely fast through water droplets on workers hands and tools.',
        timing: 'Strict rule during morning hours'
      },
      {
        stepNumber: '02',
        title: 'Sterilize Pruning Shears & Implements (उपकरण की सफाई)',
        badge: 'Disinfection Protocol',
        icon: '✂️',
        desc: 'Disinfect all agricultural tools with 1% bleach solution or methylated spirit before and after pruning any infected plant rows.',
        timing: 'Before starting field operations'
      },
      {
        stepNumber: '03',
        title: 'Combined Bactericide & Copper Spray (एंटीबायोटिक व कॉपर का छिड़काव)',
        badge: 'Chemical Control (Day 1-2)',
        icon: '🧪',
        desc: 'Tank-mix Streptocycline (1.5g per 15L pump) + Copper Oxychloride 50% WP (35g per 15L pump). Spray thoroughly across entire canopy to seal bacterial entry pores.',
        timing: 'Early morning spray'
      },
      {
        stepNumber: '04',
        title: 'Certified Disease-Free Seed Requirement (प्रमाणित बीज का उपयोग)',
        badge: 'Long-term Prevention',
        icon: '🌱',
        desc: 'For subsequent plantings, only purchase certified pathogen-tested seed or hot-water treat seeds at 50°C for 25 minutes prior to nursery sowing.',
        timing: 'Next crop planting cycle'
      }
    ]
  },

  // ==========================================
  // 🐛 VIRUS & VECTOR / PEST DISEASES
  // ==========================================
  'Tomato Yellow Leaf Curl Virus': {
    scientificName: 'Tomato Yellow Leaf Curl Virus (TYLCV)',
    pathogen: 'Begomovirus (Transmitted by Whitefly: Bemisia tabaci)',
    severityGuidance: 'Upward leaf curling, severe stunting, chlorotic margins, and blossom drop.',
    medicines: [
      {
        id: 'med_tylcv_1',
        type: 'Systemic Neonicotinoid Insecticide (सफेद मक्खी नाशक)',
        productName: 'Thiamethoxam 25% WG (Actara / Areva)',
        activeIngredient: 'Thiamethoxam 25% WG',
        formulation: 'Water Dispersible Granules (WG)',
        dosePerLiter: '0.3 - 0.5 g / Liter water',
        dosePerPump: '5 - 7 g per 15-Liter Pump',
        dosePerAcre: '100 g in 200 Liters water / Acre',
        applicationMethod: 'Foliar canopy spray targeting underside of leaves where whiteflies colonize.',
        applicationInterval: '10 to 12 days interval',
        phi: '5 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Do not spray when flowering and honeybees are foraging. Wear nitrile gloves.',
        targetPathogen: 'Controls Whitefly vector (Bemisia tabaci) to prevent viral inoculation.',
        cibRegistration: 'Approved for Solanaceous Sucking Pests under CIB&RC'
      },
      {
        id: 'med_tylcv_2',
        type: 'Systemic Vector Management (प्रणालीगत कीटनाशक)',
        productName: 'Imidacloprid 17.8% SL (Confidor / Victor)',
        activeIngredient: 'Imidacloprid 17.8% SL',
        formulation: 'Soluble Liquid (SL)',
        dosePerLiter: '0.5 ml / Liter water',
        dosePerPump: '7.5 ml per 15-Liter Pump',
        dosePerAcre: '100 ml in 200 Liters water / Acre',
        applicationMethod: 'Foliar spray or seedling root dip before transplanting.',
        applicationInterval: '14 days interval',
        phi: '7 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Wash skin thoroughly with soap and water after application.',
        targetPathogen: 'Systemic transmission blockade against hemipteran vectors.',
        cibRegistration: 'CIB&RC Registered'
      },
      {
        id: 'med_tylcv_3',
        type: 'Botanical Antifeedant & Ovicide (जैविक नीम कीटनाशक)',
        productName: 'Cold-Pressed Neem Oil 10,000 ppm (Azadirachtin 1% EC)',
        activeIngredient: 'Azadirachtin 1% EC',
        formulation: 'Emulsifiable Concentrate (EC)',
        dosePerLiter: '2.0 ml / Liter water',
        dosePerPump: '30 ml per 15-Liter Pump',
        dosePerAcre: '400 ml in 200 Liters water / Acre',
        applicationMethod: 'Foliar spray with liquid soap emulsifier (1 ml/L).',
        applicationInterval: 'Repeat every 7 days for vector oviposition disruption.',
        phi: '0 days (Completely Safe / Non-toxic)',
        toxicityBand: 'GREEN (Safe Bio-Pesticide)',
        safetyInstructions: 'Shake well before pouring into water. Safe for beneficial pollinators.',
        targetPathogen: 'Repels whiteflies, inhibits nymph molting, and disrupts egg laying.',
        cibRegistration: 'CIB&RC Bio-pesticide Schedule'
      }
    ],
    solutionSteps: [
      {
        stepNumber: '01',
        title: 'Emergency Rogueing of Stunted Virus Plants (संक्रमित पौधों को उखाड़ना)',
        badge: 'Critical Quarantine (Day 1)',
        icon: '⚠️',
        desc: 'Viruses have NO curative chemical cure once inside the plant. Immediately uproot all severely stunted, curled plants, place in plastic bags, and burn/bury outside the plot to prevent them acting as viral reservoirs.',
        timing: 'Immediate rogueing on sight'
      },
      {
        stepNumber: '02',
        title: 'Yellow Sticky Trap Installation (पीले चिपचिपे ट्रैप लगाना)',
        badge: 'Mechanical Monitoring',
        icon: '🪤',
        desc: 'Install 15 to 20 yellow sticky cards per acre slightly above the crop canopy level to monitor and trap adult whiteflies.',
        timing: 'Day 1 setup'
      },
      {
        stepNumber: '03',
        title: 'Vector Suppression Spray (सफेद मक्खी नियंत्रण छिड़काव)',
        badge: 'Vector Control (Day 2)',
        icon: '🧪',
        desc: 'Spray Thiamethoxam 25% WG @ 5g per 15L pump targeting the underside of leaves where whiteflies live and feed.',
        timing: 'Early morning spray'
      },
      {
        stepNumber: '04',
        title: 'Barrier Netting & Border Cropping (बाधा फसल प्रबंधन)',
        badge: 'Agronomic IPM',
        icon: '🌾',
        desc: 'Plant 2 to 3 dense border rows of maize, sorghum, or pearl millet around the tomato field to act as a physical living windbreak against migrating whiteflies.',
        timing: 'Next planting season'
      }
    ]
  },

  'Spider Mites': {
    scientificName: 'Tetranychus urticae',
    pathogen: 'Tetranychus urticae (Arachnid Pest - Two-spotted Spider Mite)',
    severityGuidance: 'Fine yellow-white stippling on upper leaves; fine webbing on leaf undersides.',
    medicines: [
      {
        id: 'med_sm_1',
        type: 'Lipid Biosynthesis Inhibitor Acaricide (विशिष्ट मकड़ी नाशक)',
        productName: 'Spiromesifen 22.9% SC (Oberon / Volt)',
        activeIngredient: 'Spiromesifen 22.9% SC',
        formulation: 'Suspension Concentrate (SC)',
        dosePerLiter: '1.0 ml / Liter water',
        dosePerPump: '15 ml per 15-Liter Pump',
        dosePerAcre: '200 ml in 200 Liters water / Acre',
        applicationMethod: 'High-pressure mist foliar spray with focus on leaf undersides.',
        applicationInterval: '12 to 15 days interval',
        phi: '3 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Wear protective goggles. Avoid spraying during midday heat.',
        targetPathogen: 'Inhibits lipid biosynthesis in all mite developmental stages including eggs.',
        cibRegistration: 'Approved for Solanaceous Crops under CIB&RC'
      },
      {
        id: 'med_sm_2',
        type: 'Contact Miticide & Ovicide (संपर्क मकड़ी नाशक)',
        productName: 'Propargite 57% EC (Omite / Simbaa)',
        activeIngredient: 'Propargite 57% EC',
        formulation: 'Emulsifiable Concentrate (EC)',
        dosePerLiter: '2.0 ml / Liter water',
        dosePerPump: '30 ml per 15-Liter Pump',
        dosePerAcre: '400 ml in 200 Liters water / Acre',
        applicationMethod: 'Thorough canopy drenching with fine hollow cone spray.',
        applicationInterval: '10 to 14 days interval',
        phi: '7 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Do not mix with alkaline solutions or sulfur products.',
        targetPathogen: 'Disrupts mitochondrial ATP synthesis resulting in rapid knockdown.',
        cibRegistration: 'CIB&RC Registered'
      },
      {
        id: 'med_sm_3',
        type: 'Macrocyclic Lactone Acaricide (जैविक मूल का कीटनाशी)',
        productName: 'Abamectin 1.9% EC (Vertimec / Promectin)',
        activeIngredient: 'Abamectin 1.9% EC',
        formulation: 'Emulsifiable Concentrate (EC)',
        dosePerLiter: '0.5 ml / Liter water',
        dosePerPump: '7.5 ml per 15-Liter Pump',
        dosePerAcre: '100 ml in 200 Liters water / Acre',
        applicationMethod: 'Translaminar spray absorbed into leaf tissue for feeding mites.',
        applicationInterval: '10 days interval',
        phi: '3 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Keep away from waterways and aquatic organisms.',
        targetPathogen: 'Stimulates GABA release paralyzing spider mite neuromuscular activity.',
        cibRegistration: 'CIB&RC Approved'
      }
    ],
    solutionSteps: [
      {
        stepNumber: '01',
        title: 'Water Jetting of Webbing (पानी के फव्वारे से जाले तोड़ना)',
        badge: 'Mechanical Action (Day 1)',
        icon: '🚿',
        desc: 'Use a high-pressure knapsack spray of clean water directed at the underside of leaves to physically wash off webs, adult mites, and reduce dust which fosters mite outbreaks.',
        timing: 'Early morning'
      },
      {
        stepNumber: '02',
        title: 'Targeted Specific Acaricide Application (सटीक मकड़ीनाशक छिड़काव)',
        badge: 'Acaricide Treatment (Day 2)',
        icon: '🧪',
        desc: 'Spray Spiromesifen 22.9% SC @ 1ml/L (15ml / 15L pump) ensuring complete coverage of leaf undersides. Do NOT use synthetic pyrethroids which kill beneficial predatory mites.',
        timing: 'Morning or late afternoon'
      },
      {
        stepNumber: '03',
        title: 'Predatory Bio-Control & Humidity Management (हवा में नमी का संतुलन)',
        badge: 'Bio-Management',
        icon: '🐞',
        desc: 'Maintain field humidity via micro-sprinklers or furrow irrigation as spider mites thrive in hot, dry, dusty conditions (>32°C). Conserve natural predatory Phytoseiid mites.',
        timing: 'Ongoing throughout dry spell'
      }
    ]
  },

  'Septoria Leaf Spot': {
    scientificName: 'Septoria lycopersici',
    pathogen: 'Septoria lycopersici (Fungus)',
    severityGuidance: 'Numerous small circular spots with grey centers and dark borders containing tiny black pycnidia.',
    medicines: [
      {
        id: 'med_sep_1',
        type: 'Broad-Spectrum Multi-Site Protectant (सुरक्षात्मक कवकनाशी)',
        productName: 'Chlorothalonil 75% WP (Kavach / Bravo)',
        activeIngredient: 'Chlorothalonil 75% WP',
        formulation: 'Wettable Powder (WP)',
        dosePerLiter: '2.0 g / Liter water',
        dosePerPump: '30 g per 15-Liter Pump',
        dosePerAcre: '400 g in 200 Liters water / Acre',
        applicationMethod: 'Uniform foliar spray before disease spreads to middle canopy.',
        applicationInterval: '7 to 10 days interval',
        phi: '7 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Wear eye goggles. Do not spray during windy conditions.',
        targetPathogen: 'Inactivates cellular thiols stopping Septoria pycnidia spore germination.',
        cibRegistration: 'Approved for Solanaceous Crops'
      },
      {
        id: 'med_sep_2',
        type: 'Curative Triazole Fungicide (उपचारात्मक कवकनाशी)',
        productName: 'Difenoconazole 25% EC (Score / Karamat)',
        activeIngredient: 'Difenoconazole 25% EC',
        formulation: 'Emulsifiable Concentrate (EC)',
        dosePerLiter: '0.5 ml / Liter water',
        dosePerPump: '8 ml per 15-Liter Pump',
        dosePerAcre: '100 ml in 200 Liters water / Acre',
        applicationMethod: 'Foliar spray with translaminar leaf penetration.',
        applicationInterval: '12 to 14 days interval',
        phi: '5 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Avoid prolonged inhalation. Wash hands thoroughly.',
        targetPathogen: 'Stops fungal cell membrane ergosterol biosynthesis.',
        cibRegistration: 'CIB&RC Registered'
      }
    ],
    solutionSteps: [
      {
        stepNumber: '01',
        title: 'Bottom Leaf Defoliation (निचली संक्रमित पत्तियों की तुड़ाई)',
        badge: 'Cultural Practice (Day 1)',
        icon: '✂️',
        desc: 'Prune out all lower leaves touching the soil or displaying speckling up to the first flower cluster. Septoria spores splash onto lower foliage from rain drops hitting the soil.',
        timing: 'Day 1'
      },
      {
        stepNumber: '02',
        title: 'Organic Straw Mulching (पुआल से मल्चिंग)',
        badge: 'Barrier Protection',
        icon: '🌾',
        desc: 'Apply a 3-inch layer of clean straw, dry grass, or plastic mulch over planting beds to create a physical barrier against rain splash from the soil.',
        timing: 'Immediately after pruning'
      },
      {
        stepNumber: '03',
        title: 'Protectant Fungicide Application (सुरक्षात्मक कवकनाशी छिड़काव)',
        badge: 'Chemical Control',
        icon: '🧪',
        desc: 'Spray Chlorothalonil 75% WP @ 2g/L (30g per 15L pump) with a non-ionic spreader (0.5ml/L) to coat both sides of foliage.',
        timing: 'Day 2'
      }
    ]
  },

  'Leaf Mold': {
    scientificName: 'Passalora fulva (Cladosporium fulvum)',
    pathogen: 'Passalora fulva (Fungus)',
    severityGuidance: 'Pale green or yellowish spots on upper leaf surface; olive-brown velvety mold underneath.',
    medicines: [
      {
        id: 'med_lm_1',
        type: 'Protective Copper Hydroxide (उन्नत ताम्र कवकनाशी)',
        productName: 'Copper Hydroxide 53.8% DF (Kocide 3000)',
        activeIngredient: 'Copper Hydroxide 53.8% DF',
        formulation: 'Dry Flowable (DF)',
        dosePerLiter: '1.5 g / Liter water',
        dosePerPump: '20 - 25 g per 15-Liter Pump',
        dosePerAcre: '350 g in 200 Liters water / Acre',
        applicationMethod: 'Foliar spray targeted directly at leaf undersides.',
        applicationInterval: '8 to 10 days interval',
        phi: '3 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Wear safety glasses and gloves.',
        targetPathogen: 'High bioavailability copper ions kill velvety fungal conidia on leaf undersides.',
        cibRegistration: 'Approved under CIB&RC'
      },
      {
        id: 'med_lm_2',
        type: 'Systemic Strobilurin Curative (प्रणालीगत कवकनाशी)',
        productName: 'Azoxystrobin 23% SC (Amistar / Mirador)',
        activeIngredient: 'Azoxystrobin 23% SC',
        formulation: 'Suspension Concentrate (SC)',
        dosePerLiter: '1.0 ml / Liter water',
        dosePerPump: '15 ml per 15-Liter Pump',
        dosePerAcre: '200 ml in 200 Liters water / Acre',
        applicationMethod: 'Foliar mist covering internal plant canopy.',
        applicationInterval: '12 to 14 days interval',
        phi: '5 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Do not allow drift into fish ponds.',
        targetPathogen: 'Inhibits fungal mitochondrial respiration.',
        cibRegistration: 'CIB&RC Registered'
      }
    ],
    solutionSteps: [
      {
        stepNumber: '01',
        title: 'Greenhouse & Canopy Ventilation (हवा का संचार बढ़ाना)',
        badge: 'Microclimate Hygiene',
        icon: '💨',
        desc: 'Leaf mold requires >85% relative humidity to germinate. Open greenhouse vents, prune dense foliage, and increase row spacing to reduce humidity around leaves.',
        timing: 'Immediate'
      },
      {
        stepNumber: '02',
        title: 'Underside Canopy Copper Spray (पत्ती के नीचे दवा छिड़कना)',
        badge: 'Targeted Spray',
        icon: '🧪',
        desc: 'Spray Copper Hydroxide 53.8% DF @ 1.5g/L (25g per 15L pump) pointing spray nozzles upward to thoroughly coat velvety mold underneath leaves.',
        timing: 'Morning spray'
      }
    ]
  },

  'Tomato Mosaic Virus': {
    scientificName: 'Tomato Mosaic Tobamovirus (ToMV)',
    pathogen: 'Tobamovirus (Mechanically & Seed Transmitted)',
    severityGuidance: 'Mottled light and dark green mosaic pattern on leaves with distortion and filiform shoestringing.',
    medicines: [
      {
        id: 'med_tomv_1',
        type: 'Sanitizing Antiviral Rinse (विषाणु निष्प्रभावी घोल)',
        productName: 'Skimmed Milk Solution 10% (मलाई रहित दूध का घोल)',
        activeIngredient: 'Casein protein antiviral suspension',
        formulation: 'Natural Aqueous Solution',
        dosePerLiter: '100 ml / Liter water',
        dosePerPump: '1.5 Liters per 15-Liter Pump',
        dosePerAcre: '20 Liters milk in 200 Liters water / Acre',
        applicationMethod: 'Foliar spray during pruning or handling to denature and precipitate virus particles.',
        applicationInterval: 'Spray before every major field pruning pass',
        phi: '0 days (Completely Organic)',
        toxicityBand: 'GREEN (Safe Organic)',
        safetyInstructions: 'Safe for human consumption.',
        targetPathogen: 'Casein proteins bind and inactivate mechanically transferred tobamovirus particles.',
        cibRegistration: 'Standard ICAR Recommended Antiviral Protocol'
      },
      {
        id: 'med_tomv_2',
        type: 'Insect Vector Control (सफेद मक्खी व थ्रिप्स नियंत्रण)',
        productName: 'Acetamiprid 20% SP (Pride / Manik)',
        activeIngredient: 'Acetamiprid 20% SP',
        formulation: 'Soluble Powder (SP)',
        dosePerLiter: '0.3 g / Liter water',
        dosePerPump: '5 g per 15-Liter Pump',
        dosePerAcre: '60 g in 200 Liters water / Acre',
        applicationMethod: 'Foliar canopy spray to eliminate secondary insect carriers.',
        applicationInterval: '12 to 14 days interval',
        phi: '7 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Avoid contact with eyes and skin.',
        targetPathogen: 'Sucking insect pest suppression.',
        cibRegistration: 'Approved under CIB&RC'
      }
    ],
    solutionSteps: [
      {
        stepNumber: '01',
        title: 'Immediate Eradication of Mosaic Plants (मोज़ेक पौधों को तुरंत नष्ट करना)',
        badge: 'Strict Quarantine',
        icon: '🔥',
        desc: 'ToMV is extremely stable and easily spread by touching healthy plants after handling infected ones. Uproot infected plants carefully without shaking, seal in bags, and destroy.',
        timing: 'Immediate action'
      },
      {
        stepNumber: '02',
        title: 'Smoker Ban & Hand Washing (धूम्रपान निषेध व साबुन से हाथ धोना)',
        badge: 'Hygiene Rule',
        icon: '🧼',
        desc: 'Workers must not use tobacco products in the field. Wash hands and secateurs thoroughly with soap or 10% trisodium phosphate (TSP) solution before touching crops.',
        timing: 'Continuous rule'
      }
    ]
  },

  // ==========================================
  // 🌾 RICE, WHEAT, MAIZE & CEREALS
  // ==========================================
  'Rice Blast': {
    scientificName: 'Pyricularia oryzae (Magnaporthe oryzae)',
    pathogen: 'Pyricularia oryzae (Fungus)',
    severityGuidance: 'Spindle-shaped elliptical diamond lesions with pointed ends and grey-white centers on leaves and neck.',
    medicines: [
      {
        id: 'med_rb_1',
        type: 'Specific Anti-Blast Systemic Fungicide (ब्लास्ट प्रतिरोधी दवा)',
        productName: 'Tricyclazole 75% WP (Beam / Baan)',
        activeIngredient: 'Tricyclazole 75% WP',
        formulation: 'Wettable Powder (WP)',
        dosePerLiter: '0.6 g / Liter water',
        dosePerPump: '10 g per 15-Liter Pump',
        dosePerAcre: '120 g in 200 Liters water / Acre',
        applicationMethod: 'Foliar spray at tillering and boot leaf stage.',
        applicationInterval: '10 to 12 days interval',
        phi: '14 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Wear protective mask. Do not inhale spray mist.',
        targetPathogen: 'Inhibits melanin biosynthesis in fungal appressoria preventing leaf penetration.',
        cibRegistration: 'Approved by CIB&RC specifically for Rice Blast'
      },
      {
        id: 'med_rb_2',
        type: 'Systemic Curative Blast Fungicide (अंतःप्रवाही फफूंदनाशक)',
        productName: 'Isoprothiolane 40% EC (Fujione / Kasu-Max)',
        activeIngredient: 'Isoprothiolane 40% EC',
        formulation: 'Emulsifiable Concentrate (EC)',
        dosePerLiter: '1.5 ml / Liter water',
        dosePerPump: '25 ml per 15-Liter Pump',
        dosePerAcre: '300 ml in 200 Liters water / Acre',
        applicationMethod: 'Foliar spray during early spindle lesion detection.',
        applicationInterval: '12 to 14 days interval',
        phi: '14 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Do not spray during midday sun. Keep away from cattle fodder.',
        targetPathogen: 'Inhibits phospholipid biosynthesis in Pyricularia hyphae.',
        cibRegistration: 'CIB&RC Registered'
      }
    ],
    solutionSteps: [
      {
        stepNumber: '01',
        title: 'Nitrogen Fertilizer Rationing (यूरिया का अत्यधिक प्रयोग रोकें)',
        badge: 'Nutritional Hygiene',
        icon: '⚖️',
        desc: 'Immediately stop top-dressing urea/nitrogen fertilizer which produces succulent tissues vulnerable to blast infection. Apply potash (MOP @ 15kg/acre) to strengthen cell walls.',
        timing: 'Immediate'
      },
      {
        stepNumber: '02',
        title: 'Blast Fungicide Canopy Spray (दवा का त्वरित छिड़काव)',
        badge: 'Chemical Control',
        icon: '🧪',
        desc: 'Spray Tricyclazole 75% WP @ 0.6g/L (10g / 15L pump) during morning hours. Ensure coverage of boot leaf and panicle neck.',
        timing: 'Early morning spray'
      }
    ]
  },

  'Wheat Rust': {
    scientificName: 'Puccinia striiformis / Puccinia triticina',
    pathogen: 'Puccinia striiformis (Yellow/Stripe Rust) / Puccinia triticina (Brown Rust)',
    severityGuidance: 'Yellow-orange pustules arranged in parallel linear stripes on wheat leaves.',
    medicines: [
      {
        id: 'med_wr_1',
        type: 'Broad-Spectrum Systemic Triazole (गेहूं का रतुआ नाशक)',
        productName: 'Propiconazole 25% EC (Tilt / Radar)',
        activeIngredient: 'Propiconazole 25% EC',
        formulation: 'Emulsifiable Concentrate (EC)',
        dosePerLiter: '1.0 ml / Liter water',
        dosePerPump: '15 ml per 15-Liter Pump',
        dosePerAcre: '200 ml in 200 Liters water / Acre',
        applicationMethod: 'Uniform foliar spray as soon as yellow pustule stripes appear on leaves.',
        applicationInterval: '15 days interval',
        phi: '21 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Wear safety goggles and boots. Do not let spray drift into water bodies.',
        targetPathogen: 'Inactivates ergosterol synthesis in Puccinia spores halting rust pustules.',
        cibRegistration: 'Approved by ICAR & CIB&RC for Wheat Rust'
      },
      {
        id: 'med_wr_2',
        type: 'Curative Triazole Fungicide (उपचारात्मक कवकनाशी)',
        productName: 'Tebuconazole 25.9% EC (Folicur / Raxil)',
        activeIngredient: 'Tebuconazole 25.9% EC',
        formulation: 'Emulsifiable Concentrate (EC)',
        dosePerLiter: '1.0 ml / Liter water',
        dosePerPump: '15 ml per 15-Liter Pump',
        dosePerAcre: '200 ml in 200 Liters water / Acre',
        applicationMethod: 'Foliar canopy spray with fine mist nozzle.',
        applicationInterval: '14 days interval',
        phi: '21 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Avoid skin contact. Use full personal protective gear.',
        targetPathogen: 'Translaminar eradication of Puccinia rust mycelia in wheat leaf veins.',
        cibRegistration: 'CIB&RC Registered'
      }
    ],
    solutionSteps: [
      {
        stepNumber: '01',
        title: 'Focal Patch Scouting (पीले धब्बों की तुरंत पहचान)',
        badge: 'Early Detection',
        icon: '🔍',
        desc: 'Inspect wheat fields weekly, especially in cool humid depressions. Rub yellow stripes with white cloth; if yellow powder rubs off, rust is active.',
        timing: 'Weekly scouting'
      },
      {
        stepNumber: '02',
        title: 'Community Focal Spray (सामुदायिक छिड़काव)',
        badge: 'Chemical Control',
        icon: '🧪',
        desc: 'Spray Propiconazole 25% EC @ 1ml/L (15ml / 15L pump) across the affected patch and a 5-meter buffer zone around it to prevent wind-borne spore spread.',
        timing: 'Immediate on spot detection'
      }
    ]
  },

  // ==========================================
  // 🌶️ CHILLI & PEPPER DISEASES
  // ==========================================
  'Chilli Anthracnose': {
    scientificName: 'Colletotrichum capsici',
    pathogen: 'Colletotrichum capsici (Fungus - Dieback & Fruit Rot)',
    severityGuidance: 'Circular sunken lesions on ripe fruit with concentric rings of black acervuli; twig dieback from tip down.',
    medicines: [
      {
        id: 'med_ca_1',
        type: 'Systemic Curative & Protectant (डाईबैक व फल सड़न नाशक)',
        productName: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC (Amistar Top)',
        activeIngredient: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC',
        formulation: 'Suspension Concentrate (SC)',
        dosePerLiter: '1.0 ml / Liter water',
        dosePerPump: '15 ml per 15-Liter Pump',
        dosePerAcre: '200 ml in 200 Liters water / Acre',
        applicationMethod: 'Foliar spray with thorough wetting of fruit branches and flowers.',
        applicationInterval: '10 to 12 days interval',
        phi: '5 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Use chemical gloves and protective face shield during application.',
        targetPathogen: 'Dual-action suppression of Colletotrichum appressoria and mycelium.',
        cibRegistration: 'Approved for Chilli Dieback under CIB&RC'
      },
      {
        id: 'med_ca_2',
        type: 'Protective Contact Copper Fungicide (ताम्रयुक्त कवकनाशी)',
        productName: 'Copper Oxychloride 50% WP (Blitox 50)',
        activeIngredient: 'Copper Oxychloride 50% WP',
        formulation: 'Wettable Powder (WP)',
        dosePerLiter: '2.5 g / Liter water',
        dosePerPump: '35 - 40 g per 15-Liter Pump',
        dosePerAcre: '500 g in 200 Liters water / Acre',
        applicationMethod: 'Foliar spray during early flowering and fruit set.',
        applicationInterval: '10 days interval',
        phi: '5 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Wash hands thoroughly after use.',
        targetPathogen: 'Multi-site spore germination barrier on fruit surface.',
        cibRegistration: 'CIB&RC Registered'
      }
    ],
    solutionSteps: [
      {
        stepNumber: '01',
        title: 'Dieback Pruning & Mummified Fruit Disposal (सूखी टहनियों की छंटाई)',
        badge: 'Sanitation (Day 1)',
        icon: '✂️',
        desc: 'Prune dead twigs 2-3 cm below the visible necrotic margin. Collect all dropped rotted fruit from the soil and destroy to stop conidial splash.',
        timing: 'Immediate'
      },
      {
        stepNumber: '02',
        title: 'Protective Foliar Spray (सुरक्षात्मक छिड़काव)',
        badge: 'Chemical Control',
        icon: '🧪',
        desc: 'Spray Azoxystrobin + Difenoconazole @ 1ml/L (15ml / 15L pump) at 50% flowering and repeat 12 days later during fruit formation.',
        timing: 'Morning spray'
      }
    ]
  },

  // ==========================================
  // 🍏 APPLE & FRUIT CROPS
  // ==========================================
  'Apple Scab': {
    scientificName: 'Venturia inaequalis',
    pathogen: 'Venturia inaequalis (Fungus)',
    severityGuidance: 'Olive-green to dark velvety circular spots on leaf upper surface; corky lesions on fruit.',
    medicines: [
      {
        id: 'med_as_1',
        type: 'Curative Triazole Fungicide (सेब का स्कैब नाशक)',
        productName: 'Difenoconazole 25% EC (Score 25 EC)',
        activeIngredient: 'Difenoconazole 25% EC',
        formulation: 'Emulsifiable Concentrate (EC)',
        dosePerLiter: '0.3 - 0.5 ml / Liter water',
        dosePerPump: '5 - 8 ml per 15-Liter Pump',
        dosePerAcre: '100 ml in 200 Liters water / Acre',
        applicationMethod: 'Fine mist canopy spray at petal fall and walnut fruit size stage.',
        applicationInterval: '12 to 14 days interval',
        phi: '14 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Wear respirator and goggles. Do not spray during blossom bloom to protect bees.',
        targetPathogen: 'Halts Venturia ascospore germ-tube elongation inside leaf cuticle.',
        cibRegistration: 'Approved by ICAR & CIB&RC for Apple Orchards'
      },
      {
        id: 'med_as_2',
        type: 'Multi-Site Protectant Contact Fungicide (सुरक्षात्मक कवकनाशी)',
        productName: 'Captan 50% WP (Captaf / Dhanutan)',
        activeIngredient: 'Captan 50% WP',
        formulation: 'Wettable Powder (WP)',
        dosePerLiter: '2.5 g / Liter water',
        dosePerPump: '35 - 40 g per 15-Liter Pump',
        dosePerAcre: '500 g in 200 Liters water / Acre',
        applicationMethod: 'Preventive spray during pink bud and pre-rain forecast periods.',
        applicationInterval: '10 days interval',
        phi: '14 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Wash thoroughly after use. Store away from livestock.',
        targetPathogen: 'Multi-site thiol reactant preventing ascospore germination.',
        cibRegistration: 'CIB&RC Registered for Apples'
      }
    ],
    solutionSteps: [
      {
        stepNumber: '01',
        title: 'Orchard Floor Leaf Sanitation (गिरे पत्तों का प्रबंधन)',
        badge: 'Inoculum Reduction',
        icon: '🍂',
        desc: 'Rake and burn or shred fallen orchard leaves with 5% urea spray in late autumn. Over 95% of spring scab ascospores overwinter in fallen wet leaves.',
        timing: 'Autumn & early spring'
      },
      {
        stepNumber: '02',
        title: 'Critical Stage Scab Spray (गुलाबी कली व पंखुड़ी झड़ने पर छिड़काव)',
        badge: 'Chemical Control',
        icon: '🧪',
        desc: 'Apply Captan 50% WP @ 2.5g/L at pink bud stage, followed by Difenoconazole 25% EC @ 0.4ml/L at petal fall.',
        timing: 'Pink bud to petal fall'
      }
    ]
  },

  // ==========================================
  // 🌿 POWDERY MILDEW (MULTI-CROP)
  // ==========================================
  'Powdery Mildew': {
    scientificName: 'Oidium spp. / Erysiphe cichoracearum / Podosphaera',
    pathogen: 'Oidium spp. / Erysiphe cichoracearum (Fungus)',
    severityGuidance: 'White talcum-powder-like fungal patches on leaf surfaces causing curling and drying.',
    medicines: [
      {
        id: 'med_pm_1',
        type: 'Sulfur Bio-Fungicide & Acaricide (सल्फर कवकनाशी)',
        productName: 'Wettable Sulphur 80% WDG (Sulfex / Thiovit)',
        activeIngredient: 'Sulphur 80% WDG',
        formulation: 'Water Dispersible Granules (WDG)',
        dosePerLiter: '3.0 g / Liter water',
        dosePerPump: '45 g per 15-Liter Pump',
        dosePerAcre: '600 g in 200 Liters water / Acre',
        applicationMethod: 'Foliar spray with uniform coverage on upper leaf surfaces.',
        applicationInterval: '10 to 14 days interval',
        phi: '3 days before harvest',
        toxicityBand: 'GREEN (Low Toxicity)',
        safetyInstructions: 'Do not spray when temperatures exceed 32°C to prevent sulfur burn.',
        targetPathogen: 'Vapor action disrupts fungal respiration and spore germination.',
        cibRegistration: 'Approved for Vegetables & Fruit Crops'
      },
      {
        id: 'med_pm_2',
        type: 'Triazole Systemic Curative (अंतःप्रवाही फफूंदनाशक)',
        productName: 'Hexaconazole 5% SC (Contaf Plus / Sitara)',
        activeIngredient: 'Hexaconazole 5% SC',
        formulation: 'Suspension Concentrate (SC)',
        dosePerLiter: '1.5 - 2.0 ml / Liter water',
        dosePerPump: '25 - 30 ml per 15-Liter Pump',
        dosePerAcre: '300 ml in 200 Liters water / Acre',
        applicationMethod: 'Foliar application during initial white powdery appearance.',
        applicationInterval: '12 to 15 days interval',
        phi: '7 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Wear protective mask and gloves. Avoid spray drift.',
        targetPathogen: 'Inhibits ergosterol biosynthesis in powdery mildew fungus.',
        cibRegistration: 'CIB&RC Registered'
      }
    ],
    solutionSteps: [
      {
        stepNumber: '01',
        title: 'Canopy Thinning for Sunlight & Air Flow (धूप और हवा के लिए छंटाई)',
        badge: 'Cultural Practice',
        icon: '🌿',
        desc: 'Prune excess vegetative lateral shoots to allow direct sunlight penetration into the interior canopy. Powdery mildew spores perish under direct ultraviolet sunlight.',
        timing: 'Immediate action'
      },
      {
        stepNumber: '02',
        title: 'Initial Protective Sulfur Application (सल्फर का छिड़काव)',
        badge: 'Protective Bio-Spray',
        icon: '🧪',
        desc: 'Spray Wettable Sulphur 80% WDG @ 3g/L (45g per 15L pump) in the calm morning before temperatures rise. Do not spray during hot midday sun (>30°C).',
        timing: 'Day 1 to 2'
      },
      {
        stepNumber: '03',
        title: 'Curative Systemic Follow-Up Spray (प्रणालीगत कवकनाशी)',
        badge: 'Curative Phase',
        icon: '🔬',
        desc: 'If white powdery coating covers >15% of foliage, spray Hexaconazole 5% SC @ 2ml/L (30ml/pump). Repeat after 12 days if new leaves exhibit symptoms.',
        timing: 'Day 7 to 10'
      }
    ]
  },

  // ==========================================
  // 🌱 HEALTHY PLANT TISSUE (NO CHEMICAL PESTICIDES NEEDED)
  // ==========================================
  'Healthy': {
    scientificName: 'Healthy Crop Specimen (रोगमुक्त स्वस्थ पौधा)',
    pathogen: 'None — Normal Healthy Chlorophyll Foliage',
    severityGuidance: 'Zero disease lesions detected. Foliage exhibits vigorous chlorophyll development.',
    medicines: [
      {
        id: 'med_health_1',
        type: 'Water Soluble Balanced NPK Nutrition (घुलनशील संतुलित पोषण)',
        productName: '19:19:19 NPK Foliar Fertilizer (Iffco / Mahadhan)',
        activeIngredient: 'Nitrogen 19% + Phosphorus 19% + Potassium 19%',
        formulation: '100% Water Soluble Fertilizer',
        dosePerLiter: '5.0 g / Liter water',
        dosePerPump: '75 g per 15-Liter Pump',
        dosePerAcre: '1.0 kg in 200 Liters water / Acre',
        applicationMethod: 'Foliar spray during active vegetative and flowering stage.',
        applicationInterval: '15 to 20 days interval',
        phi: '0 days (Non-toxic Plant Food)',
        toxicityBand: 'GREEN (Safe Bio-Nutrient)',
        safetyInstructions: 'Safe fertilizer. Store away from damp moisture.',
        targetPathogen: 'Boosts plant vitality, leaf thickness, and natural systemic disease resistance.',
        cibRegistration: 'Fertilizer Control Order (FCO) Approved'
      },
      {
        id: 'med_health_2',
        type: 'Chelated Micronutrient Booster (सूक्ष्म पोषक तत्व मिश्रण)',
        productName: 'Chelated Micronutrient Mix (Zinc, Boron, Iron, Manganese)',
        activeIngredient: 'Chelated Fe, Zn, Mn, Cu, B, Mo',
        formulation: 'Soluble Powder',
        dosePerLiter: '1.5 g / Liter water',
        dosePerPump: '20 - 25 g per 15-Liter Pump',
        dosePerAcre: '300 g in 200 Liters water / Acre',
        applicationMethod: 'Foliar misting during early morning for peak stomatal uptake.',
        applicationInterval: 'Monthly preventive application',
        phi: '0 days (Safe Mineral Nutrition)',
        toxicityBand: 'GREEN (Safe Mineral Nutrients)',
        safetyInstructions: 'Standard agricultural mineral handling.',
        targetPathogen: 'Prevents micronutrient chlorosis and strengthens cellular cuticle.',
        cibRegistration: 'Approved under FCO Guidelines'
      },
      {
        id: 'med_health_3',
        type: 'Prophylactic Botanical Protectant (रोकथाम हेतु नीम तेल)',
        productName: 'Cold-Pressed Neem Oil 1500 ppm (जैविक नीम सुरक्षा)',
        activeIngredient: 'Azadirachtin 0.15% EC',
        formulation: 'Emulsifiable Concentrate (EC)',
        dosePerLiter: '3.0 ml / Liter water',
        dosePerPump: '45 ml per 15-Liter Pump',
        dosePerAcre: '600 ml in 200 Liters water / Acre',
        applicationMethod: 'Preventive monthly canopy misting.',
        applicationInterval: 'Every 20 to 25 days',
        phi: '0 days (Completely Safe / Non-toxic)',
        toxicityBand: 'GREEN (Safe Bio-Pesticide)',
        safetyInstructions: 'Safe organic extract. Does not harm honeybees or ladybird beetles.',
        targetPathogen: 'Prophylactic barrier preventing opportunistic spore settlement.',
        cibRegistration: 'CIB&RC Bio-pesticide Schedule'
      }
    ],
    solutionSteps: [
      {
        stepNumber: '01',
        title: 'Maintain Balanced Irrigation & Fertigation (संतुलित सिंचाई व खाद प्रबंधन)',
        badge: 'Nutritional Care (Day 1)',
        icon: '💧',
        desc: 'Continue regular drip or furrow irrigation schedule. Avoid soil moisture stress or water stagnation which predisposes root systems to stress.',
        timing: 'Regular farm schedule'
      },
      {
        stepNumber: '02',
        title: 'Preventive Foliar Nutrition Spray (पोषक तत्वों का छिड़काव)',
        badge: 'Vitality Booster',
        icon: '🌱',
        desc: 'Spray balanced 19:19:19 NPK @ 5g/L (75g / 15L pump) + Chelated Micronutrients @ 1.5g/L to ensure continuous lush canopy development.',
        timing: 'Morning 7:00 AM - 10:00 AM'
      },
      {
        stepNumber: '03',
        title: 'Weekly Pest & Disease Scouting (नियमित साप्ताहिक निगरानी)',
        badge: 'Preventive Scouting',
        icon: '🔍',
        desc: 'Inspect 20 random plants across the plot every 7 days. Early detection allows zero-pesticide biological management before any outbreak occurs.',
        timing: 'Weekly routine'
      }
    ]
  },

  // ==========================================
  // 🌿 GENERAL FOLIAR LESION (INTELLIGENT FALLBACK)
  // ==========================================
  'General Foliar Disease': {
    scientificName: 'Pathogenic Foliar Infection',
    pathogen: 'Foliar Pathogen (Fungus/Bacteria)',
    severityGuidance: 'Visible foliar necrotic spots, chlorosis, or leaf discoloration.',
    medicines: [
      {
        id: 'med_gen_1',
        type: 'Broad-Spectrum Protective Fungicide (सर्वग्राही सुरक्षात्मक कवकनाशी)',
        productName: 'Mancozeb 75% WP (Dithane M-45)',
        activeIngredient: 'Mancozeb 75% WP',
        formulation: 'Wettable Powder (WP)',
        dosePerLiter: '2.5 g / Liter water',
        dosePerPump: '35 - 40 g per 15-Liter Pump',
        dosePerAcre: '500 g in 200 Liters water / Acre',
        applicationMethod: 'Uniform foliar canopy spray with non-ionic sticker.',
        applicationInterval: '7 to 10 days interval',
        phi: '7 days before harvest',
        toxicityBand: 'BLUE (Moderately Toxic)',
        safetyInstructions: 'Use complete protective equipment. Follow pesticide label instructions.',
        targetPathogen: 'Multi-site contact fungicide protecting foliage from spore infection.',
        cibRegistration: 'Approved by Central Insecticides Board (CIB&RC)'
      },
      {
        id: 'med_gen_2',
        type: 'Biological Crop Protectant (जैविक फफूंदनाशक)',
        productName: 'Trichoderma viride @ 5g/L + Neem Oil 1500 ppm @ 3ml/L',
        activeIngredient: 'Trichoderma viride + Azadirachtin 0.15% EC',
        formulation: 'Bio-Fungicide & Botanical Protectant',
        dosePerLiter: '5.0 g / L (Trichoderma) + 3.0 ml / L (Neem Oil)',
        dosePerPump: '75 g Trichoderma + 45 ml Neem Oil per 15L Pump',
        dosePerAcre: '1.0 kg Trichoderma + 600 ml Neem Oil in 200L water / Acre',
        applicationMethod: 'Preventive foliar canopy misting during calm morning or late afternoon hours.',
        applicationInterval: '10 to 14 days interval',
        phi: '0 days (Non-toxic)',
        toxicityBand: 'GREEN (Safe Bio-Pesticide)',
        safetyInstructions: 'Shake well before use. Mix in clean neutral water.',
        targetPathogen: 'Biological antagonism against foliar and soil-borne fungal pathogens.',
        cibRegistration: 'Approved under CIB&RC Bio-pesticide Guidelines'
      }
    ],
    solutionSteps: [
      {
        stepNumber: '01',
        title: 'Sanitation & Diseased Leaf Removal (सफाई एवं संक्रमित पत्तियों को हटाना)',
        badge: 'Immediate Action (Day 1)',
        icon: '✂️',
        desc: 'Rogue out severely diseased lower leaves and debris from the base of the crop canopy. Dispose safely away from irrigation canals and field borders.',
        timing: 'Day 1'
      },
      {
        stepNumber: '02',
        title: 'Canopy Aeration & Drip Irrigation Adjustment (हवा एवं सिंचाई प्रबंधन)',
        badge: 'Cultural Hygiene',
        icon: '🌿',
        desc: 'Ensure field drainage is clear. Avoid overhead sprinkling during evening hours. Space plants to allow adequate sunlight into lower branches.',
        timing: 'Day 1 to 2'
      },
      {
        stepNumber: '03',
        title: 'Targeted Protective Spray Application (दवा का संतुलित छिड़काव)',
        badge: 'Chemical Control',
        icon: '🧪',
        desc: 'Spray Mancozeb 75% WP @ 2.5g/L (40g/15L pump) thoroughly wetting both sides of foliage using a hollow cone nozzle.',
        timing: 'Morning 7-10 AM or Evening 4-6 PM'
      },
      {
        stepNumber: '04',
        title: 'Follow-up Inspection & Pre-Harvest Safety (पुनः निरीक्षण व तुड़ाई अंतराल)',
        badge: 'Harvest Safety',
        icon: '⏱️',
        desc: 'Observe a 7-day Pre-Harvest Interval (PHI) before picking produce. Re-scout the plot after 7 to 10 days to verify healthy new shoot emergence.',
        timing: 'Every 7-10 days'
      }
    ]
  }
};

/**
 * Intelligent Matcher to fetch accurate CIB&RC approved medicines and treatment steps
 * Supports exact matches, partial matches, scientific names, and PlantVillage class format
 */
export function getDetailedTreatmentPlan(cropName = 'Tomato', diseaseName = 'Early Blight') {
  if (!diseaseName) {
    return DISEASE_PRESCRIPTIONS['Early Blight'];
  }

  const query = `${cropName || ''} ${diseaseName || ''}`.toLowerCase().replace(/___|_/g, ' ');

  // 1. Check Healthy
  if (query.includes('healthy') || query.includes('normal') || diseaseName.toLowerCase() === 'healthy') {
    return DISEASE_PRESCRIPTIONS['Healthy'];
  }

  // 2. Check Viral Diseases (Crucial: Virus must NEVER get Mancozeb!)
  if (query.includes('curl') || query.includes('tylcv') || query.includes('yellow leaf curl')) {
    return DISEASE_PRESCRIPTIONS['Tomato Yellow Leaf Curl Virus'];
  }
  if (query.includes('mosaic') || query.includes('tomv')) {
    return DISEASE_PRESCRIPTIONS['Tomato Mosaic Virus'];
  }

  // 3. Check Mite Pests (Crucial: Mites must get Acaricides, not fungicides!)
  if (query.includes('mite') || query.includes('spider') || query.includes('two-spotted')) {
    return DISEASE_PRESCRIPTIONS['Spider Mites'];
  }

  // 4. Check Bacterial Diseases
  if (query.includes('bacterial') || query.includes('xanthomonas') || (query.includes('spot') && query.includes('bacterial'))) {
    return DISEASE_PRESCRIPTIONS['Bacterial Spot'];
  }

  // 5. Check Blights (Distinguish Late vs Early Blight!)
  if (query.includes('late') && query.includes('blight')) {
    return DISEASE_PRESCRIPTIONS['Late Blight'];
  }
  if (query.includes('phytophthora')) {
    return DISEASE_PRESCRIPTIONS['Late Blight'];
  }
  if (query.includes('early') || (query.includes('blight') && !query.includes('late'))) {
    return DISEASE_PRESCRIPTIONS['Early Blight'];
  }

  // 6. Check Specific Leaf Spots
  if (query.includes('septoria')) {
    return DISEASE_PRESCRIPTIONS['Septoria Leaf Spot'];
  }
  if (query.includes('mold') || query.includes('passalora') || query.includes('cladosporium')) {
    return DISEASE_PRESCRIPTIONS['Leaf Mold'];
  }
  if (query.includes('powdery') || query.includes('mildew')) {
    return DISEASE_PRESCRIPTIONS['Powdery Mildew'];
  }

  // 7. Check Cereal & Fruit Diseases
  if (query.includes('blast') || query.includes('pyricularia')) {
    return DISEASE_PRESCRIPTIONS['Rice Blast'];
  }
  if (query.includes('rust') || query.includes('puccinia')) {
    return DISEASE_PRESCRIPTIONS['Wheat Rust'];
  }
  if (query.includes('anthracnose') || query.includes('dieback')) {
    return DISEASE_PRESCRIPTIONS['Chilli Anthracnose'];
  }
  if (query.includes('scab') || query.includes('venturia')) {
    return DISEASE_PRESCRIPTIONS['Apple Scab'];
  }

  // 8. Direct Dictionary Key Search
  for (const [key, plan] of Object.entries(DISEASE_PRESCRIPTIONS)) {
    if (query.includes(key.toLowerCase()) || key.toLowerCase().includes(diseaseName.toLowerCase())) {
      return plan;
    }
  }

  // 9. Intelligent Default: if Solanaceous, default to Early Blight, otherwise General Foliar
  if (query.includes('tomato') || query.includes('potato') || query.includes('brinjal')) {
    return DISEASE_PRESCRIPTIONS['Early Blight'];
  }

  return DISEASE_PRESCRIPTIONS['General Foliar Disease'];
}
