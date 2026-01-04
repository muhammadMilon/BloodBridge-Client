export const ambulanceDirectory = [
  {
    division: "Dhaka",
    name: "Dhaka Rapid Rescue",
    hotline: "01911-000111",
    etaMinutes: 12,
    verified: true,
    coverage: ["Dhaka Metro", "Gazipur"],
    gps: { lat: 23.8103, lng: 90.4125 },
    status: "online",
  },
  {
    division: "Dhaka",
    name: "Dhaka Emergency Care",
    hotline: "01777-112233",
    etaMinutes: 15,
    verified: true,
    coverage: ["Dhanmondi", "Gulshan", "Banani"],
    gps: { lat: 23.7500, lng: 90.4000 },
    status: "online",
  },
  {
    division: "Chattogram",
    name: "Chattogram TraumaLink",
    hotline: "01888-112233",
    etaMinutes: 20,
    verified: true,
    coverage: ["Chattogram", "Cox's Bazar"],
    gps: { lat: 22.3569, lng: 91.7832 },
    status: "online",
  },
  {
    division: "Rajshahi",
    name: "North Bengal EMS",
    hotline: "01777-998877",
    etaMinutes: 25,
    verified: false,
    coverage: ["Rajshahi", "Pabna", "Sirajganj"],
    gps: { lat: 24.374, lng: 88.6042 },
    status: "on-call",
  },
  {
    division: "Sylhet",
    name: "Sylhet AirCare",
    hotline: "01444-889900",
    etaMinutes: 18,
    verified: true,
    coverage: ["Sylhet", "Habiganj", "Moulvibazar"],
    gps: { lat: 24.8949, lng: 91.8687 },
    status: "online",
  },
  {
    division: "Khulna",
    name: "Khulna Emergency Response",
    hotline: "01988-445566",
    etaMinutes: 22,
    verified: true,
    coverage: ["Khulna", "Jessore", "Jhenaidah"],
    gps: { lat: 22.8088, lng: 89.2467 },
    status: "online",
  },
  {
    division: "Barishal",
    name: "Barishal Coastal Ambulance",
    hotline: "01877-991122",
    etaMinutes: 28,
    verified: true,
    coverage: ["Barishal", "Pirojpur", "Jhalokathi"],
    gps: { lat: 22.7010, lng: 90.3535 },
    status: "on-call",
  },
  {
    division: "Rangpur",
    name: "Rangpur Northern EMS",
    hotline: "01766-778899",
    etaMinutes: 30,
    verified: true,
    coverage: ["Rangpur", "Dinajpur", "Gaibandha"],
    gps: { lat: 25.7439, lng: 89.2752 },
    status: "online",
  },
  {
    division: "Mymensingh",
    name: "Mymensingh Central Medical",
    hotline: "01955-334455",
    etaMinutes: 25,
    verified: true,
    coverage: ["Mymensingh", "Jamalpur", "Netrokona"],
    gps: { lat: 24.7471, lng: 90.4203 },
    status: "online",
  },
];

export const clinicDirectory = [
  {
    division: "Dhaka",
    name: "Dhaka Hemato Care",
    rating: 4.9,
    facilities: ["24/7 ICU", "On-site Blood Bank", "Dialysis"],
    emergencyContact: "09612-558855",
    address: "House 12, Road 9, Dhanmondi",
  },
  {
    division: "Chattogram",
    name: "Chattogram Blood & Cancer Center",
    rating: 4.7,
    facilities: ["Hematology Lab", "Platelet Apheresis", "Critical Care"],
    emergencyContact: "031-778899",
    address: "Agrabad Commercial Area",
  },
  {
    division: "Khulna",
    name: "Khulna Hematology Institute",
    rating: 4.5,
    facilities: ["Cancer Day Care", "Emergency OT"],
    emergencyContact: "041-556677",
    address: "Sonadanga Residential Area",
  },
];

export const hematologyDoctors = [
  // Dhaka (2)
  {
    division: "Dhaka",
    name: "Dr. Fahmida Noor",
    hospital: "Square Hospitals",
    specialties: ["Leukemia", "Stem Cell Therapy"],
    contact: "01552-778899",
    verified: true,
  },
  {
    division: "Dhaka",
    name: "Dr. A. B. M. Yunus",
    hospital: "Bangabandhu Sheikh Mujib Medical University",
    specialties: ["Bone Marrow Transplant", "Anemia"],
    contact: "01711-223344",
    verified: true,
  },

  // Chattogram (1)
  {
    division: "Chattogram",
    name: "Dr. S. M. Anik Rahman",
    hospital: "Imperial Hospital",
    specialties: ["Thalassemia", "Bone Marrow Transplant"],
    contact: "01611-335577",
    verified: true,
  },

  // Rajshahi (1)
  {
    division: "Rajshahi",
    name: "Dr. Md. Mizanur Rahman",
    hospital: "Rajshahi Medical College Hospital",
    specialties: ["Hemato-Oncology", "Anemia"],
    contact: "01733-889900",
    verified: true,
  },

  // Khulna (1)
  {
    division: "Khulna",
    name: "Dr. Sheikh Md. Bodiuzzaman",
    hospital: "Khulna City Medical College",
    specialties: ["Blood Cancer", "Bleeding Disorders"],
    contact: "01944-778899",
    verified: true,
  },

  // Barishal (1)
  {
    division: "Barishal",
    name: "Dr. Ashraful Islam",
    hospital: "Sher-e-Bangla Medical College",
    specialties: ["Hematology", "Transfusion Medicine"],
    contact: "01788-112233",
    verified: true,
  },

  // Sylhet (1)
  {
    division: "Sylhet",
    name: "Dr. Nusrat Ahmed",
    hospital: "Osmani Medical College",
    specialties: ["Platelet Disorders", "Pediatric Hematology"],
    contact: "01788-992211",
    verified: true,
  },

  // Rangpur (1)
  {
    division: "Rangpur",
    name: "Dr. Md. Abdul Motin",
    hospital: "Rangpur Medical College",
    specialties: ["Hemato-Oncology", "Blood Transfusion"],
    contact: "01755-667788",
    verified: true,
  },

  // Mymensingh (1)
  {
    division: "Mymensingh",
    name: "Dr. Md. Rafiqul Islam",
    hospital: "Mymensingh Medical College",
    specialties: ["Hematology", "Bone Marrow Failure"],
    contact: "01966-778899",
    verified: true,
  },
];

export const ngoDirectory = [
  {
    division: "Dhaka",
    name: "BD Blood Bank",
    type: "Blood Bank",
    contact: "01811-223344",
    email: "help@bdblood.org",
    verified: true,
  },
  {
    division: "Chattogram",
    name: "Chattogram Blood Friends",
    type: "NGO",
    contact: "01822-556677",
    email: "ctg@bloodfriends.org",
    verified: true,
  },
  {
    division: "Rajshahi",
    name: "North Bengal Life Savers",
    type: "NGO",
    contact: "01744-556677",
    email: "support@nbls.org",
    verified: true,
  },
  {
    division: "Khulna",
    name: "Khulna Sheba Sangha",
    type: "NGO",
    contact: "01933-445566",
    email: "info@sheba.org",
    verified: true,
  },
  {
    division: "Barishal",
    name: "Coastal Blood & Relief",
    type: "NGO",
    contact: "01900-889977",
    email: "coastalcare@ngo.org",
    verified: false,
  },
  {
    division: "Sylhet",
    name: "Jalalabad Blood Bank",
    type: "Blood Bank",
    contact: "01755-889900",
    email: "contact@jalalabadblood.com",
    verified: true,
  },
  {
    division: "Rangpur",
    name: "Rangpur Rokto Sheba",
    type: "NGO",
    contact: "01766-112233",
    email: "volunteer@rangpurrokto.org",
    verified: true,
  },
  {
    division: "Mymensingh",
    name: "Brahmaputra Blood Bank",
    type: "Blood Bank",
    contact: "01977-223344",
    email: "service@brahmaputra.org",
    verified: true,
  },
];

export const healthMetricsTimeline = [
  {
    label: "Baseline",
    hemoglobin: 12.8,
    platelet: 210,
    wbc: 5.6,
    creatinine: 1.1,
  },
  {
    label: "Last Month",
    hemoglobin: 13.1,
    platelet: 225,
    wbc: 6.2,
    creatinine: 1.05,
  },
  {
    label: "This Week",
    hemoglobin: 13.4,
    platelet: 215,
    wbc: 5.9,
    creatinine: 0.98,
  },
];

export const urgencyDefinitions = [
  {
    level: "Critical",
    color: "bg-red-600/10 text-red-700 border-red-600/30",
    badge: "🔴",
    description: "Respond within 3 hours. Trauma & ICU cases auto-alert donors.",
  },
  {
    level: "Urgent",
    color: "bg-orange-500/10 text-orange-700 border-orange-500/30",
    badge: "🟠",
    description: "Needed within 24 hours. Ideal for surgeries & transfusions.",
  },
  {
    level: "Flexible",
    color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
    badge: "🟢",
    description: "Needed in 2–3 days. Great for community donor planning.",
  },
];

export const rewardBadges = [
  {
    name: "Bronze",
    threshold: 1,
    description: "First successful donation",
    color: "from-amber-500 to-orange-500",
  },
  {
    name: "Silver",
    threshold: 3,
    description: "3 verified donations",
    color: "from-slate-300 to-slate-500",
  },
  {
    name: "Gold",
    threshold: 5,
    description: "5+ lifesaving donations",
    color: "from-yellow-400 to-amber-600",
  },
];

export const healthEducationCards = [
  {
    title: "Serum Creatinine",
    safe: "0.7 – 1.3 mg/dL",
    alert: "≥ 2.0 mg/dL",
    description:
      "Elevated creatinine can indicate kidney stress. Donors must be within the safe range before donating.",
  },
  {
    title: "Hemoglobin",
    safe: "12.5 – 17.5 g/dL",
    alert: "≤ 11 g/dL",
    description:
      "Low hemoglobin increases anemia risk. Female donors must be ≥12.5 g/dL and male donors ≥13.0 g/dL.",
  },
  {
    title: "Platelet Count",
    safe: "150k – 450k /µL",
    alert: "< 100k /µL",
    description:
      "Platelets support clotting. Very low counts require medical review before donation.",
  },
];

