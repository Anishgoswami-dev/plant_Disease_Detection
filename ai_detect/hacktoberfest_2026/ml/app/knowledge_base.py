from typing import Dict, Any, Tuple

# Comprehensive Agronomy Knowledge Base for Plant Disease Diagnoses
# Maps predicted PlantVillage / Agricultural disease classes to expert IPM recommendations

DISEASE_KNOWLEDGE_BASE: Dict[str, Dict[str, Any]] = {
    # Apple
    "Apple___Apple_scab": {
        "crop": "Apple",
        "disease": "Apple Scab",
        "scientific_name": "Venturia inaequalis",
        "pathogen": "Fungus (Ascomycete)",
        "organ_detected": "Foliar Leaf & Fruit Surface",
        "observed_symptoms": [
            "Olive-green to dark velvety circular spots on leaf upper surface.",
            "Subsequent corky brown lesions and curling of leaf margins.",
            "Premature yellowing and severe defoliation during rainy periods."
        ],
        "probable_causes": {
            "observed_evidence": "Foliar ascomycete fungal sporulation with distinct olive-brown velvety circular margins.",
            "contributing_factors": "Prolonged leaf wetness (>9 hours) at 16-24°C, dense non-aerated canopy, and overwintering ascospore release from wet fallen leaves."
        },
        "actions": [
            "Rake and destroy fallen leaves to eliminate overwintering ascospore inoculum.",
            "Prune canopy branches to enhance sunlight penetration and rapid morning drying."
        ],
        "organic_remedy": "Foliar spray of Liquid Lime Sulfur (2%) or Bacillus subtilis (3g/L) during pink bud stage.",
        "chemical_remedy": "Apply Difenoconazole 25% EC @ 0.5ml/L or Captan 50% WP @ 2.5g/L at petal fall stage.",
        "phi_days": 14,
        "toxicity_code": "BLUE",
        "safety_precautions": "Wear nitrile gloves, respirator, eye goggles, and protective overalls during spraying.",
        "expert_referral_threshold": "Escalate to District Horticulture Lab if >30% canopy shows resistant lesions despite triazole spray."
    },
    "Apple___Black_rot": {
        "crop": "Apple",
        "disease": "Black Rot (Frog-Eye Leaf Spot)",
        "scientific_name": "Botryosphaeria obtusa",
        "pathogen": "Fungus",
        "organ_detected": "Foliar Leaf & Branch Cankers",
        "observed_symptoms": [
            "Small purple flecks expanding into round spots with light brown centers and purple borders (frog-eye effect).",
            "Black pycnidia dots visible within older necrotic lesions.",
            "Cankers on twigs and fruit rot turning black and mummified."
        ],
        "probable_causes": {
            "observed_evidence": "Concentric frog-eye foliar necrosis with dark pycnidial fruiting bodies.",
            "contributing_factors": "Warm humid weather (24-28°C), presence of unpruned dead wood, and mummified fruit hanging from previous seasons."
        },
        "actions": [
            "Prune out diseased twigs and cankers at least 15cm below visible margins.",
            "Dispose of all mummified fruit hanging on tree or lying on orchard floor."
        ],
        "organic_remedy": "Spray Copper Oxychloride 50% WP @ 3g/L during delayed dormant stage.",
        "chemical_remedy": "Spray Thiophanate-methyl 70% WP @ 1g/L or Mancozeb 75% WP @ 2g/L.",
        "phi_days": 21,
        "toxicity_code": "BLUE",
        "safety_precautions": "Do not spray during high winds (>12 km/h) to prevent drift. Wear full protective gear.",
        "expert_referral_threshold": "Consult extension officer if limb cankers threaten main trunk framework."
    },
    "Apple___Cedar_apple_rust": {
        "crop": "Apple",
        "disease": "Cedar Apple Rust",
        "scientific_name": "Gymnosporangium juniperi-virginianae",
        "pathogen": "Fungus (Basidiomycete)",
        "organ_detected": "Foliar Leaf & Petiole",
        "observed_symptoms": [
            "Bright yellow-orange spots on upper leaf surface with red borders.",
            "Tubular aecial fungal cups (aecia) protruding from leaf underside.",
            "Premature leaf drop causing weakened tree vigor and smaller fruit size."
        ],
        "probable_causes": {
            "observed_evidence": "Bright orange rust pustules and raised aecia on foliar surfaces.",
            "contributing_factors": "Proximity of alternate host Eastern Red Cedar / Juniper trees within 1-2 miles during wet spring weather (12-24°C)."
        },
        "actions": [
            "Remove cedar galls from neighboring alternate host trees where feasible.",
            "Apply protective fungicide sprays early in the season as young leaves emerge."
        ],
        "organic_remedy": "Apply wettable sulfur @ 3g/L or Potassium Bicarbonate @ 4g/L at pink bud stage.",
        "chemical_remedy": "Spray Myclobutanil 10% WP @ 0.8g/L or Tebuconazole 25.9% EC @ 1ml/L.",
        "phi_days": 14,
        "toxicity_code": "BLUE",
        "safety_precautions": "Avoid spraying during honeybee foraging hours (morning/midday). Use protective equipment.",
        "expert_referral_threshold": "Refer to diagnostic center if galling extends to commercial nursery rootstocks."
    },
    "Apple___healthy": {
        "crop": "Apple",
        "disease": "Healthy Plant Tissue",
        "scientific_name": "Malus domestica",
        "pathogen": "None (Intact Foliage)",
        "organ_detected": "Healthy Leaf",
        "observed_symptoms": [
            "Uniform vibrant green foliar color without necrotic lesions.",
            "Intact leaf margins and healthy active photosynthesis tissue."
        ],
        "probable_causes": {
            "observed_evidence": "Healthy chlorophyll distribution with zero localized pathogen lesions.",
            "contributing_factors": "Optimal soil nutrition, balanced irrigation, and effective preventive orchard hygiene."
        },
        "actions": [
            "Maintain balanced NPK fertilization and soil moisture management.",
            "Conduct routine weekly scouting for early detection of mites or aphids."
        ],
        "organic_remedy": "Periodic prophylactic spray of cold-pressed Neem oil (1500ppm) @ 3ml/L.",
        "chemical_remedy": "No chemical treatment required. Maintain balanced micronutrient foliar spray (Boron + Zinc).",
        "phi_days": 0,
        "toxicity_code": "GREEN",
        "safety_precautions": "Follow standard safe handling for organic biostimulants.",
        "expert_referral_threshold": "None required."
    },

    # Blueberry
    "Blueberry___healthy": {
        "crop": "Blueberry",
        "disease": "Healthy Plant Tissue",
        "scientific_name": "Vaccinium corymbosum",
        "pathogen": "None",
        "organ_detected": "Healthy Foliage",
        "observed_symptoms": ["Uniform green leaf surface, vigorous vegetative shoot growth."],
        "probable_causes": {
            "observed_evidence": "Intact foliar structure without chlorosis or necrotic spotting.",
            "contributing_factors": "Maintained acidic soil pH (4.5-5.5) and balanced drip irrigation."
        },
        "actions": ["Maintain soil pH using pine bark mulch and elemental sulfur."],
        "organic_remedy": "Apply mycorrhizal fungi root inoculant and seaweed extract foliar spray.",
        "chemical_remedy": "No chemical treatment required.",
        "phi_days": 0,
        "toxicity_code": "GREEN",
        "safety_precautions": "Standard garden safety practices.",
        "expert_referral_threshold": "None."
    },

    # Cherry
    "Cherry___Powdery_mildew": {
        "crop": "Cherry",
        "disease": "Powdery Mildew",
        "scientific_name": "Podosphaera clandestina",
        "pathogen": "Fungus",
        "organ_detected": "Leaf & Young Terminal Shoots",
        "observed_symptoms": [
            "White to greyish powdery fungal patches on young leaves and twigs.",
            "Leaf distortion, upward curling, and stunted terminal shoot extension."
        ],
        "probable_causes": {
            "observed_evidence": "Superficial white powdery conidial mycelium on leaf lamina.",
            "contributing_factors": "High ambient humidity (70-90%) with dry leaf surfaces, shaded orchard microclimate, and temperatures between 18-26°C."
        },
        "actions": [
            "Prune vigorous watersprouts in tree center to improve airflow and sunlight.",
            "Avoid excessive late-season nitrogen that stimulates vulnerable tender flush."
        ],
        "organic_remedy": "Spray Potassium Silicate (2ml/L) or Ampelomyces quisqualis bio-fungicide @ 5g/L.",
        "chemical_remedy": "Apply Hexaconazole 5% EC @ 1ml/L or Azoxystrobin 23% SC @ 1ml/L.",
        "phi_days": 7,
        "toxicity_code": "BLUE",
        "safety_precautions": "Wear mask and goggles. Avoid application during peak midday heat.",
        "expert_referral_threshold": "Refer if powdery mildew causes severe fruit russeting across >20% crop."
    },
    "Cherry___healthy": {
        "crop": "Cherry",
        "disease": "Healthy Plant Tissue",
        "scientific_name": "Prunus avium",
        "pathogen": "None",
        "organ_detected": "Healthy Foliage",
        "observed_symptoms": ["Glossy dark green leaves without chlorotic margins or spot necrosis."],
        "probable_causes": {
            "observed_evidence": "Intact photosynthetic leaf structure.",
            "contributing_factors": "Well-drained soil and adequate winter chilling."
        },
        "actions": ["Maintain seasonal pruning and drip irrigation."],
        "organic_remedy": "Preventive foliar seaweed or cold-pressed Neem oil spray.",
        "chemical_remedy": "No chemical treatment required.",
        "phi_days": 0,
        "toxicity_code": "GREEN",
        "safety_precautions": "None.",
        "expert_referral_threshold": "None."
    },

    # Corn (Maize)
    "Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot": {
        "crop": "Corn",
        "disease": "Gray Leaf Spot",
        "scientific_name": "Cercospora zeae-maydis",
        "pathogen": "Fungus",
        "organ_detected": "Foliar Leaf Blade",
        "observed_symptoms": [
            "Small tan spots with yellow halos expanding into long, narrow rectangular lesions.",
            "Lesions strictly delimited by leaf veins, giving a characteristic blocky rectangular shape.",
            "Extensive leaf blighting and premature dry down."
        ],
        "probable_causes": {
            "observed_evidence": "Parallel rectangular tan-gray necrotic lesions bounded by major veins.",
            "contributing_factors": "Extended warm, humid weather (>28°C, RH >90%), reduced tillage with infected crop residue, and continuous maize cropping."
        },
        "actions": [
            "Rotate crops with non-host legumes (Soybean/Chickpea) for at least 1-2 seasons.",
            "Incorporate infected crop residue deep into the soil after harvest."
        ],
        "organic_remedy": "Foliar spray of Trichoderma harzianum @ 5g/L + Pseudomonas fluorescens @ 5g/L.",
        "chemical_remedy": "Apply Pyraclostrobin 20% WG @ 1g/L or Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1ml/L at tasseling.",
        "phi_days": 21,
        "toxicity_code": "BLUE",
        "safety_precautions": "Wear mask, nitrile gloves, and wash spray equipment thoroughly away from water bodies.",
        "expert_referral_threshold": "Escalate if lesions reach ear leaf before tasseling stage."
    },
    "Corn_(maize)___Common_rust_": {
        "crop": "Corn",
        "disease": "Common Rust",
        "scientific_name": "Puccinia sorghi",
        "pathogen": "Fungus (Basidiomycete)",
        "organ_detected": "Foliar Leaf Surface",
        "observed_symptoms": [
            "Small, oval to elongate cinnamon-brown powdery pustules on both upper and lower leaf surfaces.",
            "Pustules rupture the leaf epidermis, releasing powdery reddish-brown urediniospores.",
            "Severe chlorosis and death of leaf tissue under high infection pressure."
        ],
        "probable_causes": {
            "observed_evidence": "Epidermal-rupturing cinnamon-brown fungal pustules on both adaxial and abaxial leaf sides.",
            "contributing_factors": "Moderate temperatures (16-25°C) combined with high relative humidity (>95%) and night dew."
        },
        "actions": [
            "Plant certified rust-resistant maize hybrid varieties (e.g. DKC or Pioneer hybrids).",
            "Maintain optimal plant population density to ensure good canopy aeration."
        ],
        "organic_remedy": "Spray wettable sulfur 80% WDG @ 3g/L or bio-fungicide Bacillus subtilis @ 4g/L.",
        "chemical_remedy": "Apply Mancozeb 75% WP @ 2.5g/L or Propiconazole 25% EC @ 1ml/L at first sign of pustules.",
        "phi_days": 14,
        "toxicity_code": "BLUE",
        "safety_precautions": "Use protective gloves and safety goggles. Do not spray during wind drift.",
        "expert_referral_threshold": "Refer to agronomist if rust pustules cover >10% of ear leaves before silking."
    },
    "Corn_(maize)___Northern_Leaf_Blight": {
        "crop": "Corn",
        "disease": "Northern Leaf Blight",
        "scientific_name": "Exserohilum turcicum",
        "pathogen": "Fungus",
        "organ_detected": "Foliar Leaf Lamina",
        "observed_symptoms": [
            "Long, elliptical, grayish-green or tan cigar-shaped lesions (2.5 to 15 cm long).",
            "Dark olive-black fungal sporulation inside lesions under damp morning conditions.",
            "Lesions coalesce, causing extensive foliar firing and premature crop death."
        ],
        "probable_causes": {
            "observed_evidence": "Large elongated cigar-shaped necrotic lesions crossing leaf veins.",
            "contributing_factors": "Moderate temperatures (18-27°C) accompanied by heavy dew and prolonged rainfall."
        },
        "actions": [
            "Utilize Northern Leaf Blight (NLB) resistant maize hybrids.",
            "Destroy and bury infected stubble to reduce overwintering conidia."
        ],
        "organic_remedy": "Apply Trichoderma viride @ 5g/L with cow urine solution (5%) foliar spray.",
        "chemical_remedy": "Spray Tebuconazole 25.9% EC @ 1ml/L or Mancozeb 75% WP @ 2.5g/L.",
        "phi_days": 21,
        "toxicity_code": "BLUE",
        "safety_precautions": "Full PPE required: rubber boots, chemical-resistant gloves, and face shield.",
        "expert_referral_threshold": "Refer to district lab if resistance breakdown is suspected in certified hybrid."
    },
    "Corn_(maize)___healthy": {
        "crop": "Corn",
        "disease": "Healthy Plant Tissue",
        "scientific_name": "Zea mays",
        "pathogen": "None",
        "organ_detected": "Healthy Corn Foliage",
        "observed_symptoms": ["Vigorous green leaves, strong stalks, and healthy tassel/ear formation."],
        "probable_causes": {
            "observed_evidence": "Intact leaf lamina with complete absence of fungal lesions or insect feeding.",
            "contributing_factors": "Balanced NPK fertilization (120:60:40) and timely irrigation."
        },
        "actions": ["Maintain weed-free plots and scheduled side-dressing of Nitrogen at knee-high stage."],
        "organic_remedy": "Apply Jeevamrutha or seaweed bio-fertilizer as foliar booster.",
        "chemical_remedy": "None required.",
        "phi_days": 0,
        "toxicity_code": "GREEN",
        "safety_precautions": "None.",
        "expert_referral_threshold": "None."
    },

    # Grape
    "Grape___Black_rot": {
        "crop": "Grape",
        "disease": "Black Rot",
        "scientific_name": "Guignardia bidwellii",
        "pathogen": "Fungus",
        "organ_detected": "Foliar Leaf & Fruit Cluster",
        "observed_symptoms": [
            "Small reddish-brown circular spots on leaves with black border.",
            "Tiny black pycnidia pimples arranged in rings inside the leaf spots.",
            "Berries turn brown, shrivel, and transform into hard black mummies."
        ],
        "probable_causes": {
            "observed_evidence": "Necrotic foliar spots with concentric black pycnidia rings.",
            "contributing_factors": "Warm and wet weather (20-27°C) during spring shoot elongation, unpruned diseased canes."
        },
        "actions": [
            "Prune out mummified berry clusters and infected canes during winter pruning.",
            "Maintain canopy trellis openness for prompt drying after rains."
        ],
        "organic_remedy": "Spray Bordeaux Mixture (1%) or Copper Hydroxide 53.8% DF @ 2g/L.",
        "chemical_remedy": "Apply Kresoxim-methyl 44.3% SC @ 0.7ml/L or Mancozeb 75% WP @ 2.5g/L.",
        "phi_days": 14,
        "toxicity_code": "BLUE",
        "safety_precautions": "Wear safety goggles, mask, and nitrile gloves. Avoid spraying close to harvest.",
        "expert_referral_threshold": "Contact Grape Research Center if cluster infection exceeds 5%."
    },
    "Grape___Esca_(Black_Measles)": {
        "crop": "Grape",
        "disease": "Esca (Black Measles / Trunk Disease)",
        "scientific_name": "Phaeomoniella chlamydospora & Fomitiporia mediterranea",
        "pathogen": "Fungal Complex (Trunk Vascular)",
        "organ_detected": "Foliar Leaf (Tiger Stripe Pattern)",
        "observed_symptoms": [
            "Interveinal yellowing and necrosis resulting in characteristic 'tiger-stripe' pattern on leaves.",
            "Dark purple-brown spotting ('measles') on the skin of white or red berries.",
            "Sudden apoplexy (complete vine collapse) during hot summer dry spells."
        ],
        "probable_causes": {
            "observed_evidence": "Severe interveinal chlorosis and necrosis leaving veins bordered in green (tiger stripe).",
            "contributing_factors": "Vascular wood decay fungi entering through large unsealed pruning wounds; vine age >8-10 years."
        },
        "actions": [
            "Seal all large pruning wounds immediately with fungicidal paste (Trichoderma / Copper).",
            "Prune suspect diseased vines last and sterilize pruning shears with 70% alcohol between vines."
        ],
        "organic_remedy": "Trunk injection or wound dressing with Trichoderma atroviride bio-protectant.",
        "chemical_remedy": "Fosetyl-Al 80% WP @ 2g/L drench or foliar systemic phosphite to boost vine defense.",
        "phi_days": 21,
        "toxicity_code": "BLUE",
        "safety_precautions": "Sterilize tools. Wear protective gloves when handling wound dressing compounds.",
        "expert_referral_threshold": "Escalate to National Research Centre for Grapes (NRCG) for trunk remediation."
    },
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
        "crop": "Grape",
        "disease": "Leaf Blight (Isariopsis Leaf Spot)",
        "scientific_name": "Pseudocercospora cladosporioides",
        "pathogen": "Fungus",
        "organ_detected": "Foliar Leaf Blade",
        "observed_symptoms": [
            "Irregular brown to black angular spots on mature leaves.",
            "Coalescing lesions causing large marginal scorch and premature leaf drop."
        ],
        "probable_causes": {
            "observed_evidence": "Angular dark brown necrotic foliar blighting.",
            "contributing_factors": "Late season humidity, poor canopy aeration, and post-harvest neglect."
        },
        "actions": ["Prune dense foliage and remove diseased fallen leaves."],
        "organic_remedy": "Spray Copper Oxychloride 50% WP @ 2.5g/L.",
        "chemical_remedy": "Spray Azoxystrobin 23% SC @ 1ml/L or Difenoconazole 25% EC @ 0.5ml/L.",
        "phi_days": 14,
        "toxicity_code": "BLUE",
        "safety_precautions": "Standard PPE required during foliar spraying.",
        "expert_referral_threshold": "None."
    },
    "Grape___healthy": {
        "crop": "Grape",
        "disease": "Healthy Plant Tissue",
        "scientific_name": "Vitis vinifera",
        "pathogen": "None",
        "organ_detected": "Healthy Grape Leaf",
        "observed_symptoms": ["Lush green leaves, healthy tendrils, and uniform berry clusters."],
        "probable_causes": {
            "observed_evidence": "Full chlorophyll green lamina with zero foliar lesions.",
            "contributing_factors": "Good canopy shoot positioning, balanced drip irrigation, and proactive IPM."
        },
        "actions": ["Maintain shoot thinning and scheduled gibberellic acid / nutrient sprays."],
        "organic_remedy": "Prophylactic spray of Trichoderma and soluble silica.",
        "chemical_remedy": "None required.",
        "phi_days": 0,
        "toxicity_code": "GREEN",
        "safety_precautions": "None.",
        "expert_referral_threshold": "None."
    },

    # Peach
    "Peach___Bacterial_spot": {
        "crop": "Peach",
        "disease": "Bacterial Spot",
        "scientific_name": "Xanthomonas arboricola pv. pruni",
        "pathogen": "Bacterium",
        "organ_detected": "Foliar Leaf & Fruit",
        "observed_symptoms": [
            "Small angular water-soaked lesions that turn purple-brown and drop out (shot-hole effect).",
            "Leaf tip yellowing and severe defoliation starting from shoot base.",
            "Cracked, sunken brown lesions on fruit surface."
        ],
        "probable_causes": {
            "observed_evidence": "Water-soaked angular foliar lesions with perforated shot-hole dropouts.",
            "contributing_factors": "Warm, wet windy conditions (22-28°C) that facilitate bacterial entry through stomata and windblown abrasion wounds."
        },
        "actions": [
            "Avoid excessive nitrogen that leads to succulent vulnerable shoot growth.",
            "Plant windbreaks to reduce windblown sand/rain abrasion on foliage."
        ],
        "organic_remedy": "Apply Copper Hydroxide (low dose @ 1.5g/L) combined with Bacillus subtilis.",
        "chemical_remedy": "Spray Streptomycin Sulfate + Tetracycline (90:10) @ 0.5g/L or Oxytetracycline @ 1g/L during pre-bloom.",
        "phi_days": 21,
        "toxicity_code": "YELLOW",
        "safety_precautions": "Strict PPE: respirator mask, rubber apron, and eye goggles. Do not inhale spray mist.",
        "expert_referral_threshold": "Refer to state pathology lab if shot-hole blighting spreads across >25% orchard."
    },
    "Peach___healthy": {
        "crop": "Peach",
        "disease": "Healthy Plant Tissue",
        "scientific_name": "Prunus persica",
        "pathogen": "None",
        "organ_detected": "Healthy Peach Foliage",
        "observed_symptoms": ["Vibrant lanceolate green leaves without shot-holes or chlorosis."],
        "probable_causes": {
            "observed_evidence": "Intact foliar structure.",
            "contributing_factors": "Balanced nutrition and effective dormant oil spray."
        },
        "actions": ["Maintain open center vase pruning and weed control around drip line."],
        "organic_remedy": "Preventive micronutrient foliar spray.",
        "chemical_remedy": "None required.",
        "phi_days": 0,
        "toxicity_code": "GREEN",
        "safety_precautions": "None.",
        "expert_referral_threshold": "None."
    },

    # Bell Pepper (Capsicum)
    "Pepper,_bell___Bacterial_spot": {
        "crop": "Bell Pepper",
        "disease": "Bacterial Spot",
        "scientific_name": "Xanthomonas campestris pv. vesicatoria",
        "pathogen": "Bacterium",
        "organ_detected": "Foliar Leaf Lamina",
        "observed_symptoms": [
            "Small, circular to irregular water-soaked spots on leaves that turn brown with yellow halo.",
            "Lesions become raised on leaf underside with scab-like appearance.",
            "Severe premature defoliation exposing peppers to direct sunscald."
        ],
        "probable_causes": {
            "observed_evidence": "Angular water-soaked necrotic lesions with raised abaxial margins.",
            "contributing_factors": "High humidity, overhead sprinkler irrigation, rain splashing, and warm temperatures (24-30°C)."
        },
        "actions": [
            "Switch strictly from overhead sprinkler to drip irrigation.",
            "Sanitize pruning tools with 1% sodium hypochlorite bleach between plant rows."
        ],
        "organic_remedy": "Foliar spray of Copper Hydroxide 53.8% DF @ 2g/L + Pseudomonas fluorescens @ 5g/L.",
        "chemical_remedy": "Spray Streptocycline @ 0.5g/L + Copper Oxychloride 50% WP @ 2g/L at first appearance.",
        "phi_days": 7,
        "toxicity_code": "BLUE",
        "safety_precautions": "Wear mask, nitrile gloves, and protective boots.",
        "expert_referral_threshold": "Refer if rapid defoliation occurs despite bactericide applications."
    },
    "Pepper,_bell___healthy": {
        "crop": "Bell Pepper",
        "disease": "Healthy Plant Tissue",
        "scientific_name": "Capsicum annuum",
        "pathogen": "None",
        "organ_detected": "Healthy Pepper Foliage",
        "observed_symptoms": ["Deep green glossy leaves, sturdy stem branching, and vigorous flowering."],
        "probable_causes": {
            "observed_evidence": "Intact leaf lamina with zero necrotic spots or puckering.",
            "contributing_factors": "Proper calcium-potassium balance and regulated fertigation."
        },
        "actions": ["Maintain regular drip fertigation and staking support."],
        "organic_remedy": "Apply bio-stimulant seaweed extract and Calcium-Boron foliar spray.",
        "chemical_remedy": "None required.",
        "phi_days": 0,
        "toxicity_code": "GREEN",
        "safety_precautions": "None.",
        "expert_referral_threshold": "None."
    },

    # Potato
    "Potato___Early_blight": {
        "crop": "Potato",
        "disease": "Early Blight",
        "scientific_name": "Alternaria solani",
        "pathogen": "Fungus",
        "organ_detected": "Foliar Leaf & Stem",
        "observed_symptoms": [
            "Dark brown to black spots with concentric rings ('target-board' pattern).",
            "Lesions surrounded by chlorotic yellow halos on older lower leaves.",
            "Progressive upward leaf drying, curling, and premature defoliation."
        ],
        "probable_causes": {
            "observed_evidence": "Concentric target-like necrotic rings bounded by yellow chlorotic halos.",
            "contributing_factors": "Alternating periods of wet and dry weather, plant nitrogen/potassium deficiency stress, and high humidity (>85%)."
        },
        "actions": [
            "Prune off heavily infected lower foliage to reduce soil-splashed inoculum.",
            "Maintain balanced soil nutrition with adequate potassium to strengthen cell walls."
        ],
        "organic_remedy": "Apply Trichoderma viride @ 5g/L + cold-pressed Neem Oil (1500ppm) @ 3ml/L.",
        "chemical_remedy": "Spray Chlorothalonil 75% WP @ 2g/L or Mancozeb 75% WP @ 2.5g/L. If severe, apply Azoxystrobin 23% SC @ 1ml/L.",
        "phi_days": 14,
        "toxicity_code": "BLUE",
        "safety_precautions": "Wear respirator, nitrile gloves, and eye protection. Observe 14-day pre-harvest interval.",
        "expert_referral_threshold": "Escalate if blighting reaches upper canopy before tuber bulking phase."
    },
    "Potato___Late_blight": {
        "crop": "Potato",
        "disease": "Late Blight",
        "scientific_name": "Phytophthora infestans",
        "pathogen": "Oomycete (Water Mold)",
        "organ_detected": "Foliar Leaf & Stem",
        "observed_symptoms": [
            "Large, irregular water-soaked pale green lesions rapidly turning dark brown/black.",
            "White delicate fungal-like downy growth visible on lesion underside in high humidity.",
            "Foul-smelling rapid rot and complete collapse of the entire foliage canopy within 4-7 days."
        ],
        "probable_causes": {
            "observed_evidence": "Rapidly expanding water-soaked necrotic blighting with white abaxial sporulation.",
            "contributing_factors": "Cool, overcast and wet weather (12-20°C, RH >90%), persistent rainfall, and airborne sporangia transport from nearby fields."
        },
        "actions": [
            "IMMEDIATE ACTION: Destroy and burn infected foliage; do not compost.",
            "Avoid overhead irrigation immediately to suppress sporangial germination.",
            "Hill up soil around potato ridges to prevent zoospores from washing down into tubers."
        ],
        "organic_remedy": "Prophylactic spray of Copper Hydroxide 53.8% DF @ 2.5g/L + Potassium Phosphite @ 3g/L.",
        "chemical_remedy": "EMERGENCY: Spray Metalaxyl-M 4% + Mancozeb 64% WP @ 2.5g/L or Cymoxanil 8% + Mancozeb 64% WP @ 2g/L or Dimethomorph 50% WP @ 1g/L.",
        "phi_days": 7,
        "toxicity_code": "BLUE",
        "safety_precautions": "Mandatory full PPE: N95 mask, eye protection goggles, rubber boots, and chemical gloves.",
        "expert_referral_threshold": "URGENT: Alert local Agriculture Department / Extension Officer immediately as Late Blight can destroy entire regional crops."
    },
    "Potato___healthy": {
        "crop": "Potato",
        "disease": "Healthy Plant Tissue",
        "scientific_name": "Solanum tuberosum",
        "pathogen": "None",
        "organ_detected": "Healthy Potato Foliage",
        "observed_symptoms": ["Lush dark-green canopy, sturdy stems, and no visible lesions or insect feeding."],
        "probable_causes": {
            "observed_evidence": "Intact leaf lamina with complete absence of water-soaked spots or target rings.",
            "contributing_factors": "Quality certified disease-free seed tubers, balanced NPK, and proper soil hilling."
        },
        "actions": ["Maintain optimal soil moisture during tuber bulking and keep ridges weed-free."],
        "organic_remedy": "Routine prophylactic bio-spray of Trichoderma and seaweed extract.",
        "chemical_remedy": "None required.",
        "phi_days": 0,
        "toxicity_code": "GREEN",
        "safety_precautions": "None.",
        "expert_referral_threshold": "None."
    },

    # Tomato
    "Tomato___Bacterial_spot": {
        "crop": "Tomato",
        "disease": "Bacterial Spot",
        "scientific_name": "Xanthomonas vesicatoria",
        "pathogen": "Bacterium",
        "organ_detected": "Foliar Leaf & Stem",
        "observed_symptoms": [
            "Small, dark, water-soaked circular spots on leaves that turn brown to black.",
            "Lesions have greasy appearance with translucent yellow margins.",
            "Severe blighting, yellowing, and defoliation of lower canopy."
        ],
        "probable_causes": {
            "observed_evidence": "Water-soaked greasy foliar spots with distinct chlorotic yellow halos.",
            "contributing_factors": "Splashing rain, overhead irrigation, high ambient temperatures (24-30°C), and working in wet fields."
        },
        "actions": [
            "Never cultivate or harvest plants while foliage is wet.",
            "Mulch beds with plastic or straw to prevent soil-splash onto lower leaves."
        ],
        "organic_remedy": "Spray Copper Oxychloride 50% WP @ 2.5g/L + Bacillus subtilis @ 4g/L.",
        "chemical_remedy": "Spray Streptocycline @ 0.5g/L + Copper Hydroxide @ 2g/L at 7-10 day intervals.",
        "phi_days": 5,
        "toxicity_code": "BLUE",
        "safety_precautions": "Wear mask and gloves during preparation and application.",
        "expert_referral_threshold": "Refer to diagnostic lab if bacterial ooze persists on stems."
    },
    "Tomato___Early_blight": {
        "crop": "Tomato",
        "disease": "Early Blight",
        "scientific_name": "Alternaria solani",
        "pathogen": "Fungus",
        "organ_detected": "Foliar Leaf & Stem Collars",
        "observed_symptoms": [
            "Concentric target-like dark brown to black circular rings on older leaves.",
            "Surrounding tissue turns bright yellow, causing leaves to wither and drop.",
            "Stem collar rot and sunken dark lesions at stem-calyx junction."
        ],
        "probable_causes": {
            "observed_evidence": "Concentric target-board rings with surrounding chlorosis on lower foliage.",
            "contributing_factors": "High humidity, warm temperatures (24-29°C), dense foliage touching wet ground, and crop nutrient exhaustion."
        },
        "actions": [
            "Stake and prune bottom 30cm of foliage to prevent contact with soil.",
            "Switch completely to drip irrigation to keep foliar canopy dry."
        ],
        "organic_remedy": "Apply Trichoderma viride @ 5g/L + cold-pressed Neem seed kernel extract (NSKE 5%).",
        "chemical_remedy": "Spray Mancozeb 75% WP @ 2.5g/L or Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1ml/L.",
        "phi_days": 7,
        "toxicity_code": "BLUE",
        "safety_precautions": "Wear nitrile gloves, N95 respirator, and rubber boots during spraying.",
        "expert_referral_threshold": "Escalate to agronomist if lesions spread to upper flowering clusters."
    },
    "Tomato___Late_blight": {
        "crop": "Tomato",
        "disease": "Late Blight",
        "scientific_name": "Phytophthora infestans",
        "pathogen": "Oomycete (Water Mold)",
        "organ_detected": "Foliar Leaf, Stems & Fruit",
        "observed_symptoms": [
            "Large, irregular water-soaked greasy lesions turning rapidly dark brown/black.",
            "White delicate downy fungal mold visible on the underside of affected leaves in humid morning air.",
            "Brown greasy blotches on green fruit and rapid total vine collapse."
        ],
        "probable_causes": {
            "observed_evidence": "Rapidly expanding water-soaked necrotic blighting with white abaxial sporulation.",
            "contributing_factors": "Cool, rainy, overcast weather (15-22°C, RH >90%), high humidity, and airborne sporangia transport."
        },
        "actions": [
            "IMMEDIATELY prune and bag heavily infected stems; destroy by burning or burying.",
            "Stop any overhead watering and maintain strict spacing between plants."
        ],
        "organic_remedy": "Spray Copper Hydroxide 53.8% DF @ 2.5g/L + Potassium Phosphite @ 3g/L.",
        "chemical_remedy": "EMERGENCY: Spray Metalaxyl-M 4% + Mancozeb 64% WP @ 2.5g/L or Cymoxanil 8% + Mancozeb 64% WP @ 2g/L or Famoxadone 16.6% + Cymoxanil 22.1% SC @ 1ml/L.",
        "phi_days": 5,
        "toxicity_code": "BLUE",
        "safety_precautions": "Mandatory PPE: N95 respirator, eye protection goggles, rubber boots, and chemical-resistant gloves.",
        "expert_referral_threshold": "CRITICAL: Notify Extension Worker immediately; regional epidemic containment required."
    },
    "Tomato___Leaf_Mold": {
        "crop": "Tomato",
        "disease": "Leaf Mold",
        "scientific_name": "Passalora fulva (Cladosporium fulvum)",
        "pathogen": "Fungus",
        "organ_detected": "Foliar Leaf Underside",
        "observed_symptoms": [
            "Pale green or yellow spots on upper leaf surfaces with indistinct margins.",
            "Dense olive-green to velvety brown mold growth on the corresponding lower surface.",
            "Leaves curl, wither, and drop prematurely in greenhouse/polyhouse conditions."
        ],
        "probable_causes": {
            "observed_evidence": "Velvety olive-brown fungal sporulation on abaxial leaf surface opposite pale yellow spots.",
            "contributing_factors": "High relative humidity (>85%) with poor polyhouse ventilation and temperatures between 21-24°C."
        },
        "actions": [
            "Increase greenhouse / polyhouse side ventilation and exhaust fans.",
            "Space tomato rows wider to permit free horizontal airflow."
        ],
        "organic_remedy": "Spray Potassium Bicarbonate @ 4g/L or Bacillus subtilis @ 5g/L.",
        "chemical_remedy": "Apply Difenoconazole 25% EC @ 0.5ml/L or Chlorothalonil 75% WP @ 2g/L.",
        "phi_days": 7,
        "toxicity_code": "BLUE",
        "safety_precautions": "Wear mask and goggles in enclosed greenhouse environments.",
        "expert_referral_threshold": "Refer if polyhouse crop defoliation exceeds 20%."
    },
    "Tomato___Septoria_leaf_spot": {
        "crop": "Tomato",
        "disease": "Septoria Leaf Spot",
        "scientific_name": "Septoria lycopersici",
        "pathogen": "Fungus",
        "organ_detected": "Foliar Leaf Lamina",
        "observed_symptoms": [
            "Numerous small circular spots (2-3mm) with dark brown borders and grayish-white centers.",
            "Tiny black pycnidia specks visible inside the pale center of each spot.",
            "Severe yellowing of surrounding leaf tissue leading to rapid lower canopy defoliation."
        ],
        "probable_causes": {
            "observed_evidence": "Dense speckled circular spots with dark margins and gray centers containing pycnidia.",
            "contributing_factors": "Wet humid weather (20-26°C), water splashing from soil onto lower leaves, and dense weed growth."
        },
        "actions": [
            "Prune lower leaves up to 30cm and mulch soil under plants.",
            "Rotate crops away from Solanaceous species for at least 2 years."
        ],
        "organic_remedy": "Spray Copper Oxychloride 50% WP @ 2.5g/L + Trichoderma harzianum @ 5g/L.",
        "chemical_remedy": "Apply Mancozeb 75% WP @ 2.5g/L or Azoxystrobin 23% SC @ 1ml/L.",
        "phi_days": 7,
        "toxicity_code": "BLUE",
        "safety_precautions": "Wear protective gloves and mask during spray application.",
        "expert_referral_threshold": "Refer to extension specialist if premature defoliation causes severe fruit sunscald."
    },
    "Tomato___Spider_mites_Two-spotted_spider_mite": {
        "crop": "Tomato",
        "disease": "Two-Spotted Spider Mite Infestation",
        "scientific_name": "Tetranychus urticae",
        "pathogen": "Pest / Acarid Mite",
        "organ_detected": "Foliar Leaf & Fine Webbing",
        "observed_symptoms": [
            "Fine pale yellow stippling and speckled chlorosis on the upper leaf surface.",
            "Fine silken webbing covering leaf undersides, growing tips, and flower clusters.",
            "Leaves turn bronze, dry out, and become brittle under heavy mite colonization."
        ],
        "probable_causes": {
            "observed_evidence": "Chlorotic foliar stippling accompanied by delicate silken webbing and tiny acarid mites.",
            "contributing_factors": "Hot, dry, and dusty microclimate (>30°C, RH <50%), drought stress, and overuse of broad-spectrum synthetic pyrethroids that destroy natural predatory mites."
        },
        "actions": [
            "Hose down plants with a strong water jet to wash away webbing and suppress mite populations.",
            "Avoid broad-spectrum synthetic pyrethroids that kill natural phytoseiid predatory mites."
        ],
        "organic_remedy": "Spray cold-pressed Neem Oil (10,000ppm) @ 2ml/L + Pongamia oil (2ml/L) or release predatory mites (Phytoseiulus persimilis).",
        "chemical_remedy": "Apply targeted acaricide: Spiromesifen 22.9% SC @ 1ml/L or Propargite 57% EC @ 2ml/L or Abamectin 1.9% EC @ 0.5ml/L.",
        "phi_days": 3,
        "toxicity_code": "BLUE",
        "safety_precautions": "Direct spray to the underside of leaves where mites congregate. Wear full PPE.",
        "expert_referral_threshold": "Refer to entomology specialist if miticide resistance is observed."
    },
    "Tomato___Target_Spot": {
        "crop": "Tomato",
        "disease": "Target Spot",
        "scientific_name": "Corynespora cassiicola",
        "pathogen": "Fungus",
        "organ_detected": "Foliar Leaf & Fruit",
        "observed_symptoms": [
            "Small water-soaked pinpoint spots expanding into circular brown lesions with subtle concentric rings.",
            "Lesions cause large irregular patches of foliar necrosis and significant defoliation.",
            "Sunken brown circular lesions on green and ripe tomato fruit."
        ],
        "probable_causes": {
            "observed_evidence": "Dark brown circular foliar lesions with light brown centers and concentric rings.",
            "contributing_factors": "Warm, humid conditions (25-32°C) combined with free moisture on foliage for >12 hours."
        },
        "actions": [
            "Stake plants and maintain adequate row spacing for ventilation.",
            "Promptly prune and remove diseased foliage from field."
        ],
        "organic_remedy": "Spray Copper Hydroxide @ 2g/L + bio-fungicide Bacillus subtilis @ 4g/L.",
        "chemical_remedy": "Spray Pyraclostrobin 20% WG @ 1g/L or Azoxystrobin 23% SC @ 1ml/L.",
        "phi_days": 7,
        "toxicity_code": "BLUE",
        "safety_precautions": "Wear gloves and respirator. Observe pre-harvest intervals.",
        "expert_referral_threshold": "None."
    },
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
        "crop": "Tomato",
        "disease": "Tomato Yellow Leaf Curl Virus (TYLCV)",
        "scientific_name": "Begomovirus (TYLCV)",
        "pathogen": "Virus (Vector: Whitefly Bemisia tabaci)",
        "organ_detected": "Foliar Growing Tips & Leaves",
        "observed_symptoms": [
            "Severe upward cupping and curling of leaf margins.",
            "Interveinal yellowing (chlorosis) of young growing leaves.",
            "Severe plant stunting, bushy erect habit, and total flower abortion (no fruit set)."
        ],
        "probable_causes": {
            "observed_evidence": "Upward foliar cupping, severe chlorotic stunting, and bushy upright growth.",
            "contributing_factors": "High population density of Silverleaf Whitefly (Bemisia tabaci) vector in hot, dry weather; presence of infected weed hosts."
        },
        "actions": [
            "Immediately rogue out and destroy severely virus-infected plants to prevent further spread.",
            "Install 15-20 yellow sticky traps per acre to monitor and trap whitefly vectors.",
            "Erect 40-mesh insect-proof netting in polyhouses / nursery beds."
        ],
        "organic_remedy": "Spray cold-pressed Neem Oil (1500ppm) @ 3ml/L + Verticillium lecanii (Lecanicillium lecanii) bio-insecticide @ 5g/L to control whiteflies.",
        "chemical_remedy": "Control whitefly vector: Spray Acetamiprid 20% SP @ 0.5g/L or Diafenthiuron 50% WP @ 1g/L or Cyantraniliprole 10.26% OD @ 1.8ml/L.",
        "phi_days": 7,
        "toxicity_code": "BLUE",
        "safety_precautions": "Wear mask, nitrile gloves, and eye goggles. Do not spray during bee activity.",
        "expert_referral_threshold": "Report widespread whitefly vector outbreaks to District Agriculture Office."
    },
    "Tomato___Tomato_mosaic_virus": {
        "crop": "Tomato",
        "disease": "Tomato Mosaic Virus (ToMV)",
        "scientific_name": "Tobamovirus (ToMV)",
        "pathogen": "Virus (Mechanical / Seed Transmission)",
        "organ_detected": "Foliar Leaf & Growing Shoots",
        "observed_symptoms": [
            "Mottling of leaves with alternating dark green and light green/yellow mosaic patches.",
            "Leaf distortion, strapping, and 'fern-like' or 'shoestring' appearance.",
            "Internal brown browning (necrosis) of tomato fruit walls."
        ],
        "probable_causes": {
            "observed_evidence": "Mosaic foliar mottling with blistered distorted lamina and strapping.",
            "contributing_factors": "Mechanical transmission via workers' hands, pruning shears, infected tobacco/smokers, and contaminated seed lots."
        },
        "actions": [
            "Rogue and burn infected plants immediately (virus cannot be cured chemically).",
            "Wash hands thoroughly with soap/milk solution and disinfect tools in 20% non-fat dry milk before touching healthy plants.",
            "Enforce strict no-smoking policy in tomato fields (tobacco carries mosaic virus)."
        ],
        "organic_remedy": "Foliar spray of 20% skimmed milk solution to deactivate viral transmission on tools.",
        "chemical_remedy": "No chemical viricide exists. Apply zinc and micronutrient sprays to support unaffected foliage.",
        "phi_days": 0,
        "toxicity_code": "GREEN",
        "safety_precautions": "Thorough sanitization of equipment and hands.",
        "expert_referral_threshold": "Escalate to Agricultural University Lab for certified seed lot screening."
    },
    "Tomato___healthy": {
        "crop": "Tomato",
        "disease": "Healthy Plant Tissue",
        "scientific_name": "Solanum lycopersicum",
        "pathogen": "None",
        "organ_detected": "Healthy Tomato Foliage",
        "observed_symptoms": [
            "Vigorous deep green leaves with strong turgor pressure.",
            "Healthy flowering clusters and clean growing shoot tips."
        ],
        "probable_causes": {
            "observed_evidence": "Intact leaf lamina with zero necrotic spots, chlorotic halos, or insect stippling.",
            "contributing_factors": "Balanced fertigation (N:P:K 100:60:60), calcium nitrate foliar spray, and proactive IPM scouting."
        },
        "actions": [
            "Maintain consistent drip irrigation to prevent blossom end rot.",
            "Continue regular weekly scouting for early detection of whiteflies or mites."
        ],
        "organic_remedy": "Weekly preventive spray of cold-pressed Neem oil (1500ppm) @ 3ml/L + seaweed extract.",
        "chemical_remedy": "None required. Maintain balanced Calcium + Boron foliar spray at flowering stage.",
        "phi_days": 0,
        "toxicity_code": "GREEN",
        "safety_precautions": "Follow standard safe handling for organic biostimulants.",
        "expert_referral_threshold": "None required."
    },

    # ─── 10 PREVIOUSLY MISSING CLASSES — Added Step 5 ───────────────────────────

    "Cherry_(including_sour)___Powdery_mildew": {
        "crop": "Cherry",
        "disease": "Powdery Mildew",
        "scientific_name": "Podosphaera clandestina",
        "pathogen": "Fungus (Erysiphale)",
        "organ_detected": "Foliar Leaf (Upper Surface)",
        "observed_symptoms": [
            "White powdery superficial fungal growth on upper leaf surface.",
            "Affected leaves curl upward exposing silvery-white mycelial colonies.",
            "Severe infections lead to premature leaf drop and stunted shoot growth."
        ],
        "probable_causes": {
            "observed_evidence": "Dense white oidial conidia coating on leaf lamina without water-soaking.",
            "contributing_factors": "Warm dry days (18-28°C) followed by cool nights with high relative humidity; dense canopy with poor air circulation."
        },
        "actions": [
            "Prune water-sprouts and overcrowded canopy to improve air circulation.",
            "Remove and destroy visibly infected shoots to reduce inoculum pressure."
        ],
        "organic_remedy": "Spray wettable sulfur 80% WP @ 3g/L or Potassium Bicarbonate @ 4g/L at 7-10 day intervals.",
        "chemical_remedy": "Apply Myclobutanil 10% WP @ 0.8g/L or Trifloxystrobin 25% WG @ 0.4g/L.",
        "phi_days": 14,
        "toxicity_code": "BLUE",
        "safety_precautions": "Do not apply sulfur-based products when temperatures exceed 32°C to avoid phytotoxicity. Wear PPE during spraying.",
        "expert_referral_threshold": "Consult District Horticulture Officer if >40% shoot terminal growth shows persistent mildew after two spray cycles."
    },

    "Cherry_(including_sour)___healthy": {
        "crop": "Cherry",
        "disease": "Healthy Plant Tissue",
        "scientific_name": "Prunus avium / Prunus cerasus",
        "pathogen": "None (Intact Foliage)",
        "organ_detected": "Healthy Leaf",
        "observed_symptoms": [
            "Deep green glossy foliage with no necrotic lesions or fungal growth.",
            "Uniform leaf margins without curling, scorching, or chlorotic patches."
        ],
        "probable_causes": {
            "observed_evidence": "Healthy chlorophyll-rich tissue without localized pathogen damage.",
            "contributing_factors": "Balanced soil pH (6.0-7.0), adequate potassium, and preventive orchard hygiene."
        },
        "actions": [
            "Continue current orchard hygiene — rake fallen leaves and remove mummified fruit.",
            "Maintain annual dormant-season copper spray as a preventive measure."
        ],
        "organic_remedy": "Seasonal foliar spray of Seaweed extract (3ml/L) as biostimulant to maintain vigor.",
        "chemical_remedy": "None required. Continue preventive program only.",
        "phi_days": 0,
        "toxicity_code": "GREEN",
        "safety_precautions": "Standard safe practices.",
        "expert_referral_threshold": "None required for healthy tissue."
    },

    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
        "crop": "Corn (Maize)",
        "disease": "Gray Leaf Spot (Cercospora Leaf Spot)",
        "scientific_name": "Cercospora zeae-maydis",
        "pathogen": "Fungus (Deuteromycete)",
        "organ_detected": "Foliar Leaf (Lower Canopy First)",
        "observed_symptoms": [
            "Rectangular gray to tan lesions running parallel to leaf veins (vein-delimited).",
            "Lesions 2-5cm long with distinct brown borders visible under high humidity.",
            "Coalescent lesions cover large leaf area causing premature drying and significant yield loss."
        ],
        "probable_causes": {
            "observed_evidence": "Vein-delimited rectangular gray necrotic lesions — diagnostic for Cercospora.",
            "contributing_factors": "Extended leaf wetness (>12 hours), high relative humidity, reduced tillage that retains infected crop debris, and continuous maize cropping."
        },
        "actions": [
            "Rotate crops — avoid continuous maize monoculture to reduce Cercospora inoculum in debris.",
            "Incorporate maize residues by deep tillage after harvest."
        ],
        "organic_remedy": "Spray Copper Oxychloride 50% WP @ 3g/L or Trichoderma harzianum (2×10^6 spores/ml) as preventive foliar spray.",
        "chemical_remedy": "Apply Propiconazole 25% EC @ 1ml/L or Azoxystrobin 23% SC @ 1ml/L at tasseling stage.",
        "phi_days": 21,
        "toxicity_code": "BLUE",
        "safety_precautions": "Avoid mixing triazoles with strobilurins for >2 consecutive sprays to prevent resistance build-up. Wear full PPE.",
        "expert_referral_threshold": "Consult State Agricultural University Plant Disease Diagnostic Clinic if lesions advance above ear leaf before tasseling."
    },

    "Orange___Haunglongbing_(Citrus_greening)": {
        "crop": "Orange (Citrus)",
        "disease": "Huanglongbing (Citrus Greening / HLB)",
        "scientific_name": "Candidatus Liberibacter asiaticus",
        "pathogen": "Bacterium (Phloem-limited, transmitted by Diaphorina citri psyllid)",
        "organ_detected": "Foliar Leaf (Systemic)",
        "observed_symptoms": [
            "Asymmetric blotchy yellowing of leaves (mottled chlorosis) — distinct from nutrient deficiency which is symmetric.",
            "Fruit remains small, misshapen, and bitter; seeds abort; fruit does not color properly.",
            "Stunted tree growth with 'zinc deficiency-like' mottled chlorosis that does not respond to micronutrient applications."
        ],
        "probable_causes": {
            "observed_evidence": "Asymmetric blotchy mottle on leaves — pathognomonic for HLB/Citrus Greening.",
            "contributing_factors": "Presence of Asian citrus psyllid (Diaphorina citri) vector; infected nursery material; no curative treatment currently exists."
        },
        "actions": [
            "IMMEDIATELY notify local Plant Quarantine Officer — HLB is a notifiable disease in India.",
            "Do not transport plant material from affected orchards. Mark and isolate affected trees.",
            "Control psyllid vector with targeted insecticide sprays; inspect nursery sources."
        ],
        "organic_remedy": "Vector control: spray Neem oil (1500ppm) + Kaolin clay (30g/L) on new flush to deter psyllid feeding.",
        "chemical_remedy": "Vector control: Imidacloprid 17.8% SL @ 0.3ml/L (systemic psyllid control on flush); Thiamethoxam 25% WG @ 0.5g/L. NOTE: No bactericide cures HLB — management is vector control + removal.",
        "phi_days": 21,
        "toxicity_code": "YELLOW",
        "safety_precautions": "Imidacloprid is toxic to honeybees — do not spray during flowering. Follow restricted re-entry intervals. Wear full PPE.",
        "expert_referral_threshold": "MANDATORY: Report immediately to District Horticulture Officer. HLB has no cure; affected trees must be removed and destroyed to prevent orchard spread."
    },

    "Raspberry___healthy": {
        "crop": "Raspberry",
        "disease": "Healthy Plant Tissue",
        "scientific_name": "Rubus idaeus",
        "pathogen": "None (Intact Foliage)",
        "organ_detected": "Healthy Leaf",
        "observed_symptoms": [
            "Deep green compound leaves with serrated margins and no discoloration.",
            "No rust pustules, mottling, or necrotic patches visible on lamina."
        ],
        "probable_causes": {
            "observed_evidence": "Intact healthy foliage with active chlorophyll distribution.",
            "contributing_factors": "Adequate mulching, pH 5.5-6.5, balanced phosphorus and potassium nutrition."
        },
        "actions": [
            "Maintain 2-year fruiting cane rotation — remove spent floricanes after harvest.",
            "Apply preventive sulfur spray (2g/L) during early spring to prevent mite and fungal buildup."
        ],
        "organic_remedy": "Biostimulant foliar spray of Fish emulsion or Seaweed extract (3ml/L) monthly.",
        "chemical_remedy": "None required for healthy tissue.",
        "phi_days": 0,
        "toxicity_code": "GREEN",
        "safety_precautions": "Standard safe practices.",
        "expert_referral_threshold": "None required for healthy tissue."
    },

    "Soybean___healthy": {
        "crop": "Soybean",
        "disease": "Healthy Plant Tissue",
        "scientific_name": "Glycine max",
        "pathogen": "None (Intact Foliage)",
        "organ_detected": "Healthy Trifoliate Leaf",
        "observed_symptoms": [
            "Uniform dark green trifoliate leaves with no chlorosis, necrosis, or rust pustules.",
            "Healthy leaf canopy with full internode expansion."
        ],
        "probable_causes": {
            "observed_evidence": "Intact and healthy chlorophyll-rich tissue.",
            "contributing_factors": "Proper Bradyrhizobium inoculation at sowing, balanced soil pH 6.0-6.5, and adequate potassium."
        },
        "actions": [
            "Monitor for Asian Soybean Rust (Phakopsora pachyrhizi) pustules on lower leaf surface from V3 stage onwards.",
            "Maintain scout-based spray schedule — do not spray preventively without confirmed disease presence."
        ],
        "organic_remedy": "Spray Trichoderma viride (5g/L) at early vegetative stage to suppress soil-borne pathogens.",
        "chemical_remedy": "None required for healthy tissue. Maintain threshold-based program.",
        "phi_days": 0,
        "toxicity_code": "GREEN",
        "safety_precautions": "Standard safe practices.",
        "expert_referral_threshold": "None required for healthy tissue."
    },

    "Squash___Powdery_mildew": {
        "crop": "Squash (Cucurbit)",
        "disease": "Powdery Mildew",
        "scientific_name": "Podosphaera xanthii / Erysiphe cichoracearum",
        "pathogen": "Fungus (Erysiphale)",
        "organ_detected": "Foliar Leaf (Upper & Lower Surface)",
        "observed_symptoms": [
            "White powdery circular patches on upper and lower leaf surfaces — starts as isolated spots, then coalesces.",
            "Severely infected leaves turn yellow, then necrotic, and collapse.",
            "Infected fruit may show skin blemishes; reduced fruit size and quality."
        ],
        "probable_causes": {
            "observed_evidence": "White oidial sporulation on cucurbit leaf lamina — characteristic of Erysiphale fungi.",
            "contributing_factors": "Warm moderate temperature (20-28°C), high humidity at night, shaded dense canopy."
        },
        "actions": [
            "Remove and destroy heavily infected leaves — do not compost.",
            "Improve row spacing and avoid overhead irrigation."
        ],
        "organic_remedy": "Spray Sodium Bicarbonate (5g/L) + Neem Oil (3ml/L) at 5-day intervals. Wettable sulfur 80% WP @ 2.5g/L is highly effective.",
        "chemical_remedy": "Apply Tebuconazole 25.9% EC @ 1ml/L or Penconazole 10% EC @ 0.5ml/L at first symptom appearance.",
        "phi_days": 14,
        "toxicity_code": "BLUE",
        "safety_precautions": "Do not apply sulfur above 30°C — phytotoxicity risk on cucurbits. Wear PPE.",
        "expert_referral_threshold": "Consult extension if >50% leaf area lost before fruit set — yield loss may be unrecoverable."
    },

    "Strawberry___Leaf_scorch": {
        "crop": "Strawberry",
        "disease": "Leaf Scorch",
        "scientific_name": "Diplocarpon earlianum",
        "pathogen": "Fungus (Ascomycete)",
        "organ_detected": "Foliar Leaf (Upper Surface)",
        "observed_symptoms": [
            "Irregular dark purple to brownish-red spots on upper leaf surface without a yellow halo.",
            "Lesion centers do not bleach out — distinct from Leaf Spot (Mycosphaerella fragariae).",
            "Severely affected leaves appear scorched and may dry out; defoliation weakens crown."
        ],
        "probable_causes": {
            "observed_evidence": "Dark purple-red irregular lesions without bleached centers — distinguishes Leaf Scorch from Leaf Spot.",
            "contributing_factors": "Prolonged leaf wetness during fruiting season, dense planting, and splashing irrigation."
        },
        "actions": [
            "Remove and destroy infected leaves; avoid overhead irrigation.",
            "Mulch beds to prevent soil splash and maintain drip irrigation."
        ],
        "organic_remedy": "Spray Copper Hydroxide 77% WP @ 2g/L at 10-day intervals from early spring. Bacillus subtilis strain QST 713 (3g/L) as preventive biological.",
        "chemical_remedy": "Apply Captan 50% WP @ 2.5g/L or Myclobutanil 10% WP @ 0.8g/L. Alternate FRAC groups to prevent resistance.",
        "phi_days": 7,
        "toxicity_code": "BLUE",
        "safety_precautions": "Observe PHI strictly — strawberry fruit is consumed fresh. Wear gloves and mask during spray application.",
        "expert_referral_threshold": "Escalate to District Horticulture Officer if >50% of leaf area is affected prior to bloom — runner production may be impacted."
    },

    "Strawberry___healthy": {
        "crop": "Strawberry",
        "disease": "Healthy Plant Tissue",
        "scientific_name": "Fragaria × ananassa",
        "pathogen": "None (Intact Foliage)",
        "organ_detected": "Healthy Trifoliate Leaf",
        "observed_symptoms": [
            "Vibrant green trifoliate leaves with uniform coloration and no lesions.",
            "Crisp leaf margins without marginal scorch, necrosis, or purple spotting."
        ],
        "probable_causes": {
            "observed_evidence": "Healthy intact foliage without pathogen lesions.",
            "contributing_factors": "Adequate calcium nutrition, well-drained soil, and certified disease-free runners."
        },
        "actions": [
            "Continue drip irrigation to avoid foliar wetness.",
            "Scout weekly for early signs of Angular Leaf Spot or Botrytis crown rot."
        ],
        "organic_remedy": "Foliar spray of Calcium Nitrate (2g/L) monthly to strengthen cell walls against fungal penetration.",
        "chemical_remedy": "None required for healthy tissue.",
        "phi_days": 0,
        "toxicity_code": "GREEN",
        "safety_precautions": "Standard safe practices.",
        "expert_referral_threshold": "None required for healthy tissue."
    },

    "Tomato___Spider_mites Two-spotted_spider_mite": {
        "crop": "Tomato",
        "disease": "Spider Mite Infestation (Two-Spotted Spider Mite)",
        "scientific_name": "Tetranychus urticae",
        "pathogen": "Arachnid Pest (not a fungal or bacterial pathogen)",
        "organ_detected": "Foliar Leaf (Lower Surface — Stippled)",
        "observed_symptoms": [
            "Fine stippling (tiny yellowish or whitish dots) on upper leaf surface caused by mite feeding.",
            "Fine silken webbing on lower leaf surface and between petioles under heavy infestation.",
            "Severely infested leaves turn bronze, dry out, and drop — leading to premature defoliation."
        ],
        "probable_causes": {
            "observed_evidence": "Stippled upper leaf surface with webbing on reverse — diagnostic for Tetranychus urticae.",
            "contributing_factors": "Hot dry conditions (>30°C, <40% RH), excessive nitrogen fertilization, and elimination of predatory mites by broad-spectrum pesticide overuse."
        },
        "actions": [
            "Spray leaf undersides forcefully with water to dislodge mite colonies.",
            "Introduce or conserve predatory mites (Phytoseiulus persimilis) as biological control agents."
        ],
        "organic_remedy": "Spray cold-pressed Neem Oil (1500ppm) @ 3ml/L + soap solution (3g/L) focusing on leaf undersides. Repeat every 5-7 days. Diatomaceous earth dusting on soil surface reduces crawlers.",
        "chemical_remedy": "Apply Abamectin 1.8% EC @ 0.5ml/L (IRAC Group 6) or Hexythiazox 5.45% EC @ 1ml/L (IRAC Group 10). Rotate between IRAC classes — do NOT repeat same group consecutively.",
        "phi_days": 7,
        "toxicity_code": "YELLOW",
        "safety_precautions": "Abamectin is toxic to honeybees and aquatic organisms — do not spray near water bodies or during pollinator activity. Wear full PPE including goggles.",
        "expert_referral_threshold": "Refer to Integrated Pest Management (IPM) specialist if infestation fails to reduce after two applications — resistance to common acaricides is documented in Tetranychus urticae."
    },
}


def format_class_name(raw_label: str) -> Tuple[str, str, bool]:
    """Parses raw class label into (Crop, Disease Name, is_healthy)"""
    is_healthy = "healthy" in raw_label.lower()
    
    if "___" in raw_label:
        parts = raw_label.split("___")
        raw_crop = parts[0].replace("_", " ").replace(",", "").strip()
        raw_disease = parts[1].replace("_", " ").strip()
    else:
        raw_crop = "Plant"
        raw_disease = raw_label.replace("_", " ").strip()

    # Clean formatting
    if raw_crop == "Corn (maize)":
        crop_clean = "Corn"
    elif "Pepper" in raw_crop:
        crop_clean = "Bell Pepper"
    else:
        crop_clean = raw_crop

    disease_clean = raw_disease.title() if not is_healthy else "Healthy Plant"
    return crop_clean, disease_clean, is_healthy

def get_agronomy_info(raw_label: str) -> Dict[str, Any]:
    """Retrieves structured expert agronomy recommendations for a given predicted label"""
CROP_BOTANICAL_NAMES = {
    "Tomato": "Solanum lycopersicum",
    "Soybean": "Glycine max",
    "Corn": "Zea mays",
    "Wheat": "Triticum aestivum",
    "Rice": "Oryza sativa",
    "Potato": "Solanum tuberosum",
    "Bell Pepper": "Capsicum annuum",
    "Pepper": "Capsicum annuum",
    "Apple": "Malus domestica",
    "Grape": "Vitis vinifera",
    "Cherry": "Prunus avium",
    "Peach": "Prunus persica",
    "Strawberry": "Fragaria × ananassa",
    "Cotton": "Gossypium hirsutum",
    "Banana": "Musa acuminata",
    "Orange": "Citrus sinensis",
    "Blueberry": "Vaccinium corymbosum",
    "Squash": "Cucurbita pepo",
    "Raspberry": "Rubus idaeus"
}

def get_agronomy_info(raw_label: str) -> Dict[str, Any]:
    """Retrieves agronomy symptoms, causes, remedies and botanical metadata"""
    if raw_label in DISEASE_KNOWLEDGE_BASE:
        return DISEASE_KNOWLEDGE_BASE[raw_label]
    
    # Generic fallback if class is outside the primary high-fidelity dictionary
    crop_clean, disease_clean, is_healthy = format_class_name(raw_label)
    botanical = CROP_BOTANICAL_NAMES.get(crop_clean, f"{crop_clean}")
    sci_name = botanical if is_healthy else f"{botanical} · {disease_clean} Pathogen"
    return {
        "crop": crop_clean,
        "disease": disease_clean,
        "scientific_name": sci_name,
        "pathogen": "None" if is_healthy else "Fungus / Pathogen",
        "organ_detected": "Foliar Leaf",
        "observed_symptoms": [
            f"Observable foliar discoloration and spotting on {crop_clean} leaf."
        ] if not is_healthy else [
            f"Healthy green {crop_clean} foliage without visible lesions."
        ],
        "probable_causes": {
            "observed_evidence": "Localized leaf necrosis and discoloration." if not is_healthy else "Intact leaf lamina.",
            "contributing_factors": "High humidity, prolonged leaf wetness, or nutrient deficiency stress." if not is_healthy else "Balanced crop management."
        },
        "actions": [
            "Isolate affected plants and improve field air circulation.",
            "Avoid overhead irrigation to keep foliage dry."
        ] if not is_healthy else [
            "Maintain current balanced nutrient and irrigation schedule."
        ],
        "organic_remedy": "Apply bio-fungicide (Trichoderma viride @ 5g/L + Neem Oil 1500ppm @ 3ml/L)" if not is_healthy else "Routine bio-nutrient foliar spray.",
        "chemical_remedy": "Apply broad-spectrum protectant fungicide (Mancozeb 75% WP @ 2.5g/L)" if not is_healthy else "None required.",
        "phi_days": 7 if not is_healthy else 0,
        "toxicity_code": "BLUE" if not is_healthy else "GREEN",
        "safety_precautions": "Wear nitrile gloves, mask, and goggles during spraying." if not is_healthy else "Standard safe practices.",
        "expert_referral_threshold": "Escalate to District Agronomist if symptoms worsen after 5 days."
    }
