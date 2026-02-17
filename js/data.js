// js/data.js
// Data definitions ONLY. Logic is in app.js.

const destinations = [
  {
    id: "dest_bujumbura",
    name: "Bujumbura (Lake Tanganyika)",
    region: "West",
    category: "Beaches & Leisure",
    description: "The economic capital and main port, offering beautiful beaches along Lake Tanganyika, vibrant nightlife, and culinary experiences.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Bujumbura_Burundi.jpg/800px-Bujumbura_Burundi.jpg", // Placeholder or real URL
    lat: -3.3822,
    lng: 29.3644,
    services: ["Hotels", "Restaurants", "Boat Tours", "Nightclubs"],
    access: {
      road: 85,
      transport: 90,
      ict: 95,
      utilities: 80
    }
  },
  {
    id: "dest_gitega",
    name: "Gitega (National Museum)",
    region: "Central",
    category: "Culture & History",
    description: "The political capital, home to the National Museum of Gitega and the Gishora Drum Sanctuary (UNESCO Intangible Heritage).",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Gitega_center.jpg/800px-Gitega_center.jpg",
    lat: -3.4273,
    lng: 29.9246,
    services: ["Museums", "Cultural Tours", "Guesthouses", "Craft Markets"],
    access: {
      road: 75,
      transport: 70,
      ict: 65,
      utilities: 70
    }
  },
  {
    id: "dest_kibira",
    name: "Kibira National Park",
    region: "North-West",
    category: "Nature & Adventure",
    description: "A vast primeval forest perched on the Congo-Nile divide, ideal for hiking, bird watching, and primate tracking.",
    image: "https://idsb.tmgrup.com.tr/ly/uploads/images/2021/08/17/136774.jpg",
    lat: -2.9333,
    lng: 29.5000,
    services: ["Guided Hikes", "Camping", "Eco-Lodges"],
    access: {
      road: 50,
      transport: 40,
      ict: 30,
      utilities: 40
    }
  },
  {
    id: "dest_karera",
    name: "Karera Waterfalls",
    region: "South-East",
    category: "Nature",
    description: "Spectacular series of waterfalls in Rutana province, a UNESCO candidate site.",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/96/63/09/chutes-de-la-karera.jpg?w=1200&h=-1&s=1",
    lat: -3.8333,
    lng: 30.0833,
    services: ["Hiking", "Photography", "Picnic Spots"],
    access: {
      road: 60,
      transport: 50,
      ict: 40,
      utilities: 50
    }
  }
];

const tourismZones = [
  {
    id: "zone_bujumbura",
    name: "Bujumbura Zone",
    road: 85,
    transport: 90,
    ict: 95,
    electricity: 80,
    water: 85,
    accommodation: 90
  },
  {
    id: "zone_gitega",
    name: "Gitega Zone",
    road: 75,
    transport: 70,
    ict: 65,
    electricity: 70,
    water: 75,
    accommodation: 60
  },
  {
    id: "zone_kibira",
    name: "Kibira (North-West) Zone",
    road: 50,
    transport: 40,
    ict: 30,
    electricity: 40,
    water: 60,
    accommodation: 30
  },
  {
    id: "zone_rutana",
    name: "Rutana / South-East Zone",
    road: 60,
    transport: 50,
    ict: 40,
    electricity: 50,
    water: 60,
    accommodation: 40
  }
];
