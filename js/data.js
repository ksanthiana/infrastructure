const destinations = [
  {
    id: "lake-tanganyika",
    name: "Lake Tanganyika",
    region: "West",
    province: "Bujumbura",
    category: "lake",
    label: "Lake",
    description: "Burundi’s most iconic lakeside destination with beaches, sunsets, and restaurants.",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
    landmarkDirections: "Located along the Chaussée d'Uvira, follow the main road towards the port.",
    verifiedBy: "Bujumbura Local Guide Hub",
    visibilityRoles: ["Tourist", "Investor", "Community", "Guide"],
    services: ["Hotels", "Restaurants", "Boat tours", "Local transport"],
    zoneId: "bujumbura"
  },
  {
    id: "kibira-national-park",
    name: "Kibira National Park",
    region: "North-West",
    province: "Kayanza",
    category: "park",
    label: "Park",
    description: "A biodiversity hotspot for hiking and primates. Access is via community-verified routes.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
    landmarkDirections: "Ascend from Kayanza city center, follow the signs for the tea factory, then take the community trail.",
    verifiedBy: "Kibira Eco-Validators",
    visibilityRoles: ["Tourist", "Investor", "Community", "Guide"],
    services: ["Guided hikes", "Camping", "Eco-lodges"],
    zoneId: "kibira"
  },
  {
    id: "gishora-drum-sanctuary",
    name: "Gishora Drum Sanctuary",
    region: "Central",
    province: "Gitega",
    category: "culture",
    label: "Culture",
    description: "The heart of Burundi’s drumming tradition, safely accessible through the cultural corridor.",
    image: "https://images.unsplash.com/photo-1520975958225-3f61d0a1c1a3?auto=format&fit=crop&w=1200&q=80",
    landmarkDirections: "7km from Gitega market, situated on the hill overlooking the royal plains.",
    verifiedBy: "Gitega Community Council",
    visibilityRoles: ["Tourist", "Investor", "Community", "Guide"],
    services: ["Cultural tours", "Craft markets", "Guesthouses"],
    zoneId: "gitega"
  }
];

const tourismZones = [
  {
    id: "bujumbura",
    name: "Bujumbura Lakeshore",
    road: 85,
    transport: 88,
    ict: 90,
    electricity: 80,
    water: 84,
    accommodation: 92,
    keyGap: "Waste management",
    recommendation: "Improve cleanliness, visitor facilities, and public waterfront services."
  },
  {
    id: "gitega",
    name: "Gitega Cultural Corridor",
    road: 74,
    transport: 68,
    ict: 66,
    electricity: 70,
    water: 73,
    accommodation: 61,
    keyGap: "Accommodation capacity",
    recommendation: "Support eco-lodges, event-ready stays, and local hospitality SMEs."
  },
  {
    id: "kibira",
    name: "Kibira Eco-Tourism Zone",
    road: 52,
    transport: 41,
    ict: 35,
    electricity: 42,
    water: 60,
    accommodation: 36,
    keyGap: "Road access",
    recommendation: "Upgrade feeder roads, utilities, and emergency response access."
  },
  {
    id: "rutovu",
    name: "Rutovu Landmark Zone",
    road: 58,
    transport: 49,
    ict: 42,
    electricity: 51,
    water: 60,
    accommodation: 40,
    keyGap: "Transport and ICT",
    recommendation: "Expand shuttle routes, signage, and public connectivity points."
  }
];

const investmentOpportunities = [
  {
    id: "eco-lodges-gitega",
    title: "Eco-lodges & Small Hotels",
    sector: "Hospitality",
    location: "Gitega",
    zoneId: "gitega",
    budget: "$80k - $250k",
    expectedImpact: "Increases visitor stay duration and local jobs",
    roi: "Medium to high",
    summary: "Expand accommodation around cultural destinations and events."
  },
  {
    id: "tourist-shuttle-routes",
    title: "Tourist Shuttle Routes",
    sector: "Transport",
    location: "Bujumbura / Gitega / Rutovu",
    zoneId: "bujumbura",
    budget: "$50k - $180k",
    expectedImpact: "Improves access to multiple destinations",
    roi: "Medium",
    summary: "Reliable transport for tourists between top sites and towns."
  },
  {
    id: "wifi-hotspots",
    title: "Wi-Fi Hotspots Near Tourism Sites",
    sector: "ICT",
    location: "Multiple zones",
    zoneId: "rutovu",
    budget: "$20k - $90k",
    expectedImpact: "Better visitor experience and digital promotion",
    roi: "Medium",
    summary: "Install public internet points near major destinations."
  },
  {
    id: "waste-water",
    title: "Waste & Water Facilities",
    sector: "Sustainability",
    location: "Bujumbura / Gitega",
    zoneId: "bujumbura",
    budget: "$40k - $160k",
    expectedImpact: "Cleaner zones and stronger visitor confidence",
    roi: "Long-term",
    summary: "Improve sanitation, cleanliness, and public facilities."
  }
];

const seedJobs = [
  {
    id: "job-tour-guide",
    title: "Tour Guide",
    company: "SIT Burundi Tours",
    location: "Bujumbura",
    type: "Part-time",
    description: "Guide visitors around lakeside and city experiences.",
    applyContact: "jobs@sitburundi.com",
    createdAt: new Date().toISOString()
  },
  {
    id: "job-reception",
    title: "Reception Assistant",
    company: "Gitega Heritage Lodge",
    location: "Gitega",
    type: "Full-time",
    description: "Support front desk and guest coordination.",
    applyContact: "careers@gitegaheritage.com",
    createdAt: new Date().toISOString()
  }
];

const seedServices = [
  {
    id: "svc-driver-1",
    ownerName: "Jean N.",
    ownerEmail: "jean@example.com",
    businessName: "Jean Local Driver",
    category: "Transport",
    location: "Bujumbura",
    description: "Airport pickups and day trips for visitors.",
    contact: "+257 79 000 111",
    status: "Approved",
    createdAt: new Date().toISOString()
  },
  {
    id: "svc-crafts-1",
    ownerName: "Aline M.",
    ownerEmail: "aline@example.com",
    businessName: "Aline Crafts",
    category: "Arts & Crafts",
    location: "Gitega",
    description: "Handmade crafts and souvenirs supporting local artisans.",
    contact: "+257 79 000 222",
    status: "Approved",
    createdAt: new Date().toISOString()
  }
];

function averageScore(values) {
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}