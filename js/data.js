const defaultDestinations = [
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
    zoneId: "bujumbura",
    lat: -3.3822,
    lng: 29.3644
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
    zoneId: "kibira",
    lat: -2.9333,
    lng: 29.5
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
    zoneId: "gitega",
    lat: -3.428,
    lng: 29.93
  },
  {
    id: "rusizi-national-park",
    name: "Rusizi National Park",
    region: "West",
    province: "Bujumbura Rural",
    category: "park",
    label: "Nature",
    description: "Experience the delta where the Rusizi River meets Lake Tanganyika. Famous for hippos and birdlife.",
    image: "https://images.unsplash.com/photo-1516422317950-ad91171b2049?auto=format&fit=crop&w=1200&q=80",
    landmarkDirections: "15km north of Bujumbura city center. Follow the RN4 highway towards the border.",
    verifiedBy: "Bujumbura Delta Rangers",
    visibilityRoles: ["Tourist", "Investor", "Community", "Guide"],
    services: ["Boat safaris", "Birdwatching", "Guided walks"],
    zoneId: "bujumbura",
    lat: -3.32,
    lng: 29.27
  },
  {
    id: "source-of-the-nile",
    name: "Source of the Nile (Rutovu)",
    region: "South",
    province: "Bururi",
    category: "culture",
    label: "Landmark",
    description: "Visit the southern-most source of the world's longest river in the heart of Burundi.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    landmarkDirections: "Located in Rutovu. Look for the pyramid monument atop the hill near the village center.",
    verifiedBy: "Rutovu Heritage Trust",
    visibilityRoles: ["Tourist", "Investor", "Community", "Guide"],
    services: ["Local guides", "Photography", "Souvenirs"],
    zoneId: "rutovu",
    lat: -3.91,
    lng: 29.85
  },
  {
    id: "mount-heha",
    name: "Mount Heha",
    region: "West",
    province: "Bujumbura Rural",
    category: "nature",
    label: "Peak",
    description: "The highest mountain in Burundi, offering breathtaking views and rigorous trekking opportunities.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    landmarkDirections: "Start from the Mugaruro community hub. Follow the markers left of the central broadcast tower.",
    verifiedBy: "Burundi Alpine Club",
    visibilityRoles: ["Tourist", "Investor", "Community", "Guide"],
    services: ["Trekking guides", "Camping", "Photography"],
    zoneId: "bujumbura",
    lat: -3.44,
    lng: 29.49
  },
  {
    id: "lake-rwihinda",
    name: "Lake Rwihinda (Bird Lake)",
    region: "North",
    province: "Kirundo",
    category: "lake",
    label: "Birding",
    description: "A sanctuary for migratory birds. A must-visit for nature lovers and birdwatchers.",
    image: "https://images.unsplash.com/photo-1444464666168-49d633b867ad?auto=format&fit=crop&w=1200&q=80",
    landmarkDirections: "Located in Kirundo province. Follow the community signage near the lake shore entrance.",
    verifiedBy: "Kirundo Birding Club",
    visibilityRoles: ["Tourist", "Investor", "Community", "Guide"],
    services: ["Birding tours", "Boat rentals", "Eco-lodges"],
    zoneId: "rutovu",
    lat: -2.34,
    lng: 30.01
  }
];

const defaultTourismZones = [
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

let destinations = typeof readLS === 'function' ? readLS('destinations', defaultDestinations) : defaultDestinations;
let tourismZones = typeof readLS === 'function' ? readLS('tourismZones', defaultTourismZones) : defaultTourismZones;

function saveDestinations(items) {
  if(typeof writeLS === 'function') writeLS('destinations', items);
  destinations = items;
}
function saveTourismZones(items) {
  if(typeof writeLS === 'function') writeLS('tourismZones', items);
  tourismZones = items;
}

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
  }
];

const seedJobs = [
  {
    id: "job-tour-guide",
    title: "Senior Eco-Guide",
    company: "Kibira Discovery",
    location: "Kayanza",
    type: "Full-time",
    description: "Lead forest treks and educate visitors on biodiversity safe paths.",
    applyContact: "jobs@kibiradiscovery.bi",
    createdAt: new Date().toISOString()
  },
  {
    id: "job-driver",
    title: "Tourist Shuttle Driver",
    company: "SIT Logistics",
    location: "Bujumbura",
    type: "Contract",
    description: "Provide safe transport between Bujumbura and major landmarks.",
    applyContact: "drive@sit-logistics.bi",
    createdAt: new Date().toISOString()
  },
  {
    id: "job-hospitality",
    title: "Hospitality Manager",
    company: "Lakeside Lodge",
    location: "Lake Tanganyika",
    type: "Full-time",
    description: "Manage guest services and ensure high standards of safety and comfort.",
    applyContact: "careers@lakesidelodge.bi",
    createdAt: new Date().toISOString()
  },
  {
    id: "job-ict",
    title: "Community ICT Specialist",
    company: "SIT Burundi Tech",
    location: "Gitega",
    type: "Part-time",
    description: "Maintain Wi-Fi hotspots and digital service points in cultural hubs.",
    applyContact: "tech@sit-burundi.bi",
    createdAt: new Date().toISOString()
  }
];

const seedServices = [
  {
    id: "svc-handicraft",
    ownerName: "Cynthia B.",
    ownerEmail: "cynthia@example.com",
    businessName: "Gitega Artisans Hub",
    category: "Arts & Crafts",
    location: "Gitega",
    description: "Authentic handmade drums and traditional crafts.",
    contact: "+257 79 123 456",
    status: "Approved",
    createdAt: new Date().toISOString()
  },
  {
    id: "svc-boat",
    ownerName: "Peter K.",
    ownerEmail: "peter@example.com",
    businessName: "Tanganyika Sunset Tours",
    category: "Transport",
    location: "Bujumbura",
    description: "Verified boat tours and sunset cruises on the lake.",
    contact: "+257 61 789 012",
    status: "Approved",
    createdAt: new Date().toISOString()
  },
  {
    id: "svc-restaurant",
    ownerName: "Maria G.",
    ownerEmail: "maria@example.com",
    businessName: "Hillside Terrace",
    category: "Food & Restaurant",
    location: "Near Mt. Heha",
    description: "Traditional Burundian cuisine with a panoramic view.",
    contact: "+257 71 345 678",
    status: "Approved",
    createdAt: new Date().toISOString()
  },
  {
    id: "svc-hotel",
    ownerName: "Samuel O.",
    ownerEmail: "sam@example.com",
    businessName: "Heritage Guesthouse",
    category: "Accommodation",
    location: "Gishora",
    description: "Stay in a traditional-style guesthouse near the drum sanctuary.",
    contact: "+257 75 000 999",
    status: "Approved",
    createdAt: new Date().toISOString()
  }
];

function averageScore(values) {
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}