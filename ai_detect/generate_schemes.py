import json
import csv

schemes_data = [
    # 1. Direct Income Support & Institutional Agri-Credit
    ("MHAG001", "Namo Shetkari Mahasanmaan Nidhi Yojana (State Cash Support)", "Direct Income Support & Institutional Agri-Credit", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG002", "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)", "Direct Income Support & Institutional Agri-Credit", "Central", "Department of Agriculture & Farmers Welfare", "https://pmkisan.gov.in"),
    ("MHAG003", "Mahatma Jyotirao Phule Shetkari Karjmukti Yojana (Loan Waiver Framework)", "Direct Income Support & Institutional Agri-Credit", "Central", "Department of Agriculture & Farmers Welfare", "https://pmfby.gov.in"),
    ("MHAG004", "Dr. Punjabrao Deshmukh Interest Subsidy Scheme (Up to ₹1 Lakh Interest Waiver)", "Direct Income Support & Institutional Agri-Credit", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG005", "Dr. Punjabrao Deshmukh Interest Concession Scheme (₹1 Lakh to ₹3 Lakh Credit)", "Direct Income Support & Institutional Agri-Credit", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG006", "Maharashtra Crop Loan Timely Repayment Incentive Scheme (₹50,000 Cash Bonus)", "Direct Income Support & Institutional Agri-Credit", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG007", "Gopinath Munde Shetkari Apghat Suraksha Sanugrah Anudan Yojana (Accident Relief)", "Direct Income Support & Institutional Agri-Credit", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG008", "Chief Minister Relief Fund for Drought-Affected Landholders", "Direct Income Support & Institutional Agri-Credit", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG009", "West Maharashtra Co-operative Credit Allocation Scheme", "Direct Income Support & Institutional Agri-Credit", "Central", "Department of Agriculture & Farmers Welfare", "https://pmfby.gov.in"),
    ("MHAG010", "Vidarbha-Marathwada Distressed Districts Special Input Subsidy", "Direct Income Support & Institutional Agri-Credit", "Central", "Department of Agriculture & Farmers Welfare", "https://pmfby.gov.in"),
    ("MHAG011", "Unified Farmer Services Platform (UFSP) Direct Benefit Relief", "Direct Income Support & Institutional Agri-Credit", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG012", "Zero Collateral Institutional Production Credit Facility for Marginal Farmers", "Direct Income Support & Institutional Agri-Credit", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG013", "Land Development Bank Long-Term Investment Loan Subsidy", "Direct Income Support & Institutional Agri-Credit", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG014", "Primary Agricultural Credit Societies (PACS) Seasonal Crop Financing", "Direct Income Support & Institutional Agri-Credit", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG015", "Maharashtra State Co-operative Bank Medium-Term Term Loan Framework", "Direct Income Support & Institutional Agri-Credit", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),

    # 2. On-Farm Irrigation & Water Infrastructure Components
    ("MHAG016", "PMKSY Per Drop More Crop – Inline Drip Irrigation System (Small/Marginal)", "On-Farm Irrigation & Water Infrastructure Components", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG017", "PMKSY Per Drop More Crop – Online Drip Irrigation System (General Category)", "On-Farm Irrigation & Water Infrastructure Components", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG018", "PMKSY Per Drop More Crop – Portable Sprinkler Irrigation Unit", "On-Farm Irrigation & Water Infrastructure Components", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG019", "PMKSY Per Drop More Crop – Micro-Sprinkler Irrigation System", "On-Farm Irrigation & Water Infrastructure Components", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG020", "Chief Minister Sustainable Agriculture Irrigation Scheme – Micro-Irrigation Top-up Fund", "On-Farm Irrigation & Water Infrastructure Components", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG021", "Magel Tyala Shettale – Individual Excavated Farm Pond Grant", "On-Farm Irrigation & Water Infrastructure Components", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG022", "RKVY Component – High-Density Polyethylene (HDPE) Plastic Lining for Farm Ponds", "On-Farm Irrigation & Water Infrastructure Components", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG023", "Subsidized Underground PVC Water Distribution Pipeline Scheme", "On-Farm Irrigation & Water Infrastructure Components", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG024", "Community Farm Pond Framework with Shared Micro-Irrigation Network", "On-Farm Irrigation & Water Infrastructure Components", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG025", "New Dug Well Construction Subsidy under State Planning", "On-Farm Irrigation & Water Infrastructure Components", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG026", "Borewell and Tube Well Exploratory Drilling Subsidy", "On-Farm Irrigation & Water Infrastructure Components", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG027", "Solar Powered Micro-Irrigation Community Lift System", "On-Farm Irrigation & Water Infrastructure Components", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG028", "Command Area Development (CADWM) Concrete Field Channel Construction", "On-Farm Irrigation & Water Infrastructure Components", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG029", "Jalyukt Shivar Abhiyan 2.0 – Silt Excavation and Farmland Application Grant", "On-Farm Irrigation & Water Infrastructure Components", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG030", "State Lift Irrigation Cooperative Society Machinery Rehabilitation Subsidy", "On-Farm Irrigation & Water Infrastructure Components", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG031", "Rainwater Harvesting Recharge Pit Subsidy for Over-exploited Aquifers", "On-Farm Irrigation & Water Infrastructure Components", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG032", "Check Dam and Cement Nala Bandhara Local Sluice Gate Funding", "On-Farm Irrigation & Water Infrastructure Components", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG033", "District Planning Committee (DPDC) Emergency Local Farm Pond Grants", "On-Farm Irrigation & Water Infrastructure Components", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG034", "Community Water Storage Tank Subsidy for Hilly Terrains", "On-Farm Irrigation & Water Infrastructure Components", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG035", "Subsidized Flexible HDPE Lay-flat Delivery Pipe Component", "On-Farm Irrigation & Water Infrastructure Components", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),

    # 3. Farm Mechanization & Agri-Machinery Profiles
    ("MHAG036", "Sub-Mission on Farm Mechanization (SMAM) – Four-Wheel Tractor (Below 20 PTO HP)", "Farm Mechanization & Agri-Machinery Profiles", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG037", "Sub-Mission on Farm Mechanization (SMAM) – Four-Wheel Tractor (20 to 50 PTO HP)", "Farm Mechanization & Agri-Machinery Profiles", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG038", "Sub-Mission on Farm Mechanization (SMAM) – Four-Wheel Tractor (Above 50 PTO HP)", "Farm Mechanization & Agri-Machinery Profiles", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG039", "SMAM Component – Power Tiller (Below 8 BHP)", "Farm Mechanization & Agri-Machinery Profiles", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG040", "SMAM Component – Power Tiller (8 BHP and Above)", "Farm Mechanization & Agri-Machinery Profiles", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG041", "State Sponsored Mechanization Scheme – Tractor Operated Rotavator", "Farm Mechanization & Agri-Machinery Profiles", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG042", "State Sponsored Mechanization Scheme – Power Weeder (Engine Operated)", "Farm Mechanization & Agri-Machinery Profiles", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG043", "Agriculture Drone Procurement Subsidy for Custom Hiring Centers (CHC)", "Farm Mechanization & Agri-Machinery Profiles", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG044", "Agriculture Drone Spraying Assistance Grant for Farmer Producer Organizations", "Farm Mechanization & Agri-Machinery Profiles", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG045", "Tractor Operated Multi-Crop Seed-cum-Fertilizer Precision Drill", "Farm Mechanization & Agri-Machinery Profiles", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG046", "Self-Propelled Vertical Conveyor Paddy Transplanter Subsidy", "Farm Mechanization & Agri-Machinery Profiles", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG047", "Tractor Operated Pneumatic Row Planter Component", "Farm Mechanization & Agri-Machinery Profiles", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG048", "Laser Land Leveler Equipment Purchasing Subsidy", "Farm Mechanization & Agri-Machinery Profiles", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG049", "Multi-Crop Power Thresher (Engine/Tractor Operated)", "Farm Mechanization & Agri-Machinery Profiles", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG050", "High-Capacity Combine Harvester Procurement Grant", "Farm Mechanization & Agri-Machinery Profiles", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG051", "Solar-Powered Knapsack Spray Pump Subsidy", "Farm Mechanization & Agri-Machinery Profiles", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG052", "Battery-Operated Ergonomic Hand Sprayer Distribution Scheme", "Farm Mechanization & Agri-Machinery Profiles", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG053", "Tractor Mounted Boom Sprayer Component Grant", "Farm Mechanization & Agri-Machinery Profiles", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG054", "Power Driven Chaff Cutter Asset Subsidy", "Farm Mechanization & Agri-Machinery Profiles", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG055", "Straw Reaper and Post-Harvest Crop Residue Baler Unit", "Farm Mechanization & Agri-Machinery Profiles", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG056", "Mini Paddy De-husking Rubber Roller Replacement Subsidy", "Farm Mechanization & Agri-Machinery Profiles", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG057", "Mobile Maize De-husker Sheller Machinery Grant", "Farm Mechanization & Agri-Machinery Profiles", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG058", "Manual and Ergonomic Toolkits for Registered Women Farmers", "Farm Mechanization & Agri-Machinery Profiles", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG059", "Custom Hiring Center Machine Bank Setup Capital Grant", "Farm Mechanization & Agri-Machinery Profiles", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG060", "Village Level High-Tech Machinery Hub Entrepreneurship Subsidy", "Farm Mechanization & Agri-Machinery Profiles", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),

    # 4. Horticulture Crop Variants & Protected Farming
    ("MHAG061", "Bhausaheb Fundkar Falbaag Lagvad Yojana – Mango Orchard Profile", "Horticulture Crop Variants & Protected Farming", "Central/State", "Horticulture Department", "https://midh.gov.in"),
    ("MHAG062", "Bhausaheb Fundkar Falbaag Lagvad Yojana – Cashew Plantation Profile", "Horticulture Crop Variants & Protected Farming", "Central/State", "Horticulture Department", "https://midh.gov.in"),
    ("MHAG063", "Bhausaheb Fundkar Falbaag Lagvad Yojana – Pomegranate Orchard Profile", "Horticulture Crop Variants & Protected Farming", "Central/State", "Horticulture Department", "https://midh.gov.in"),
    ("MHAG064", "Bhausaheb Fundkar Falbaag Lagvad Yojana – Sweet Lime (Mosambi) Profile", "Horticulture Crop Variants & Protected Farming", "Central/State", "Horticulture Department", "https://midh.gov.in"),
    ("MHAG065", "Bhausaheb Fundkar Falbaag Lagvad Yojana – Mandarin Orange (Santra) Profile", "Horticulture Crop Variants & Protected Farming", "Central/State", "Horticulture Department", "https://midh.gov.in"),
    ("MHAG066", "Kaju Kalam Vatap Yojana (High-Yielding Cashew Graft Distribution)", "Horticulture Crop Variants & Protected Farming", "Central/State", "Horticulture Department", "https://midh.gov.in"),
    ("MHAG067", "Mission for Integrated Development of Horticulture (MIDH) – Naturally Ventilated Polyhouse", "Horticulture Crop Variants & Protected Farming", "Central/State", "Horticulture Department", "https://midh.gov.in"),
    ("MHAG068", "Mission for Integrated Development of Horticulture (MIDH) – Shade Net House Structure", "Horticulture Crop Variants & Protected Farming", "Central/State", "Horticulture Department", "https://midh.gov.in"),
    ("MHAG069", "National Bamboo Mission – Farm Boundary Agro-Forestry Plantation Subsidy", "Horticulture Crop Variants & Protected Farming", "Central/State", "Horticulture Department", "https://midh.gov.in"),
    ("MHAG070", "High-Density Orchard Rejuvenation and Canopy Management Scheme", "Horticulture Crop Variants & Protected Farming", "Central/State", "Horticulture Department", "https://midh.gov.in"),
    ("MHAG071", "State Plantation Promotion Scheme for Exotic Fruit Varieties (Dragon Fruit/Avocado)", "Horticulture Crop Variants & Protected Farming", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG072", "Integrated Development of Floriculture under Protected Structures", "Horticulture Crop Variants & Protected Farming", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG073", "National Beekeeping and Honey Mission (NBHM) – Bee Box and Colony Grant", "Horticulture Crop Variants & Protected Farming", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG074", "Coconut Development Board – Coastal Replanting and Rejuvenation Subsidy", "Horticulture Crop Variants & Protected Farming", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG075", "Subsidized UV-Stabilized Plastic Mulching Film Component", "Horticulture Crop Variants & Protected Farming", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),

    # 5. Post-Harvest Storage, Processing & FPO Infrastructure
    ("MHAG076", "Onion Storage Structure (Kanda Chawl – 25 MT Standard Unit) Subsidy", "Post-Harvest Storage, Processing & FPO Infrastructure", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG077", "Agricultural Infrastructure Fund (AIF) – 3% Interest Subvention Facility", "Post-Harvest Storage, Processing & FPO Infrastructure", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG078", "PMFME Scheme – Micro Food Processing Unit Upgradation Capital Grant", "Post-Harvest Storage, Processing & FPO Infrastructure", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG079", "SMART Project – Integrated Sorting and Grading Packhouse Facility for FPOs", "Post-Harvest Storage, Processing & FPO Infrastructure", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG080", "SMART Project – Primary Agri-Commodity Processing Unit (PPU) Subsidy", "Post-Harvest Storage, Processing & FPO Infrastructure", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG081", "State Agro-Processing Cluster (APC) Development Common Facility Infrastructure Grant", "Post-Harvest Storage, Processing & FPO Infrastructure", "Central", "Department of Agriculture & Farmers Welfare", "https://agriinfra.dac.gov.in"),
    ("MHAG082", "Integrated Cold Chain and Pre-Cooling Chamber Subsidies", "Post-Harvest Storage, Processing & FPO Infrastructure", "Central", "Department of Agriculture & Farmers Welfare", "https://agriinfra.dac.gov.in"),
    ("MHAG083", "Operation Greens – 50% Crop Transportation and Cold Storage Subsidy", "Post-Harvest Storage, Processing & FPO Infrastructure", "Central", "Department of Agriculture & Farmers Welfare", "https://agriinfra.dac.gov.in"),
    ("MHAG084", "Warehouse Receipts Financing Scheme (State Warehousing Corporation Interest Discount)", "Post-Harvest Storage, Processing & FPO Infrastructure", "Central", "Department of Agriculture & Farmers Welfare", "https://agriinfra.dac.gov.in"),
    ("MHAG085", "Automated Electronic Sorter and Moisture Meter Supply for Farmer Groups", "Post-Harvest Storage, Processing & FPO Infrastructure", "Central", "Department of Agriculture & Farmers Welfare", "https://agriinfra.dac.gov.in"),

    # 6. Soil Health, Seeds & Sustainable Bio-Farming
    ("MHAG086", "Soil Health Card Scheme (Free Soil Sampling and Nutrient Profiling)", "Soil Health, Seeds & Sustainable Bio-Farming", "Central", "Department of Agriculture & Farmers Welfare", "https://soilhealth.dac.gov.in"),
    ("MHAG087", "Paramparagat Krishi Vikas Yojana (PKVY) – Organic Contiguous Cluster Farming Grant", "Soil Health, Seeds & Sustainable Bio-Farming", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG088", "PKVY Component – Large Area Certification (Free Bio-Chemical Residue Testing)", "Soil Health, Seeds & Sustainable Bio-Farming", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG089", "Dr. Punjabrao Deshmukh Jaivik Sheti Mission – Organic Input Production Unit Subsidy", "Soil Health, Seeds & Sustainable Bio-Farming", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG090", "National Project on Organic Farming – Commercial Vermicompost Brick Structure Grant", "Soil Health, Seeds & Sustainable Bio-Farming", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG091", "Rainfed Area Development Programme (RADP) – Integrated Farming System (IFS) Subsidy", "Soil Health, Seeds & Sustainable Bio-Farming", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG092", "National Food Security Mission (NFSM) – Certified Soyabean Seed Hub Distribution", "Soil Health, Seeds & Sustainable Bio-Farming", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG093", "NFSM Component – Certified Wheat and Pulse Seed Minikit Subsidy", "Soil Health, Seeds & Sustainable Bio-Farming", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG094", "Green Manuring Seed Bag Distribution Scheme (Dhaincha/Sunnhemp Subsidies)", "Soil Health, Seeds & Sustainable Bio-Farming", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG095", "Integrated Pest Management (IPM) Pheromone Trap and Trichocard Demonstration Plot", "Soil Health, Seeds & Sustainable Bio-Farming", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),

    # 7. Social Upliftment & Special Category Farm Programs
    ("MHAG096", "Dr. Babasaheb Ambedkar Krushi Swavalamban Yojana (SC Farm Irrigation Infrastructure)", "Social Upliftment & Special Category Farm Programs", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG097", "Birsa Munda Krishi Kranti Yojana – TSP Area (ST Complete Irrigation Grant)", "Social Upliftment & Special Category Farm Programs", "State", "Tribal Development Department", "https://tribal.maharashtra.gov.in"),
    ("MHAG098", "Birsa Munda Krishi Kranti Yojana – OTSP Area (ST Out-of-Sub-Plan Irrigation Grant)", "Social Upliftment & Special Category Farm Programs", "State", "Tribal Development Department", "https://tribal.maharashtra.gov.in"),
    ("MHAG099", "Mahila Kisan Sashaktikaran Pariyojana (MKSP Organic Agri-Tool Provision)", "Social Upliftment & Special Category Farm Programs", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in"),
    ("MHAG100", "Dr. Shyamprasad Mukherjee Jan-Van Vikas Scheme (Tiger Reserve Buffer Zone Crop Protection)", "Social Upliftment & Special Category Farm Programs", "State", "Agriculture Department, Maharashtra", "https://mahadbt.maharashtra.gov.in")
]

schemes_dict = {}
csv_rows = []

for s_id, s_name, cat, gov, dept, link in schemes_data:
    obj = {
        "scheme_id": s_id,
        "scheme_name": s_name,
        "category": cat,
        "government": gov,
        "department": dept,
        "description": f"Government support for {s_name}.",
        "beneficiary": "Farmers",
        "eligibility": "Eligible farmers as per scheme guidelines.",
        "benefits": "Financial assistance / subsidy / technical support as applicable.",
        "required_documents": "Aadhaar, Land Record, Bank Passbook",
        "application_mode": "Online",
        "official_link": link,
        "status": "Active"
    }
    schemes_dict[s_id] = obj
    csv_rows.append(obj)

header = ["scheme_id","scheme_name","category","government","department","description","beneficiary","eligibility","benefits","required_documents","application_mode","official_link","status"]

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
target_dirs = [
    BASE_DIR / "sih 2026" / "backend" / "data",
    BASE_DIR / "sih 2026" / "ml" / "data"
]
for td in target_dirs:
    td.mkdir(parents=True, exist_ok=True)
    with open(td / "government_schemes.json", 'w', encoding='utf-8') as f:
        json.dump(schemes_dict, f, indent=2)
    with open(td / "government_schemes.csv", 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=header)
        writer.writeheader()
        writer.writerows(csv_rows)

print("Generated all 100 schemes in CSV and JSON successfully!")
