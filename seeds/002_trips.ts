import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("trip_packs").del();
  await knex("trips").del();

  // Insert seed trips (Himalayan trek examples)
  await knex("trips").insert([
    {
      id: "20000000-0000-0000-0000-000000000001",
      name: "Everest Base Camp Trek",
      description:
        "A classic trek to the base of the world's highest mountain. Journey through Sherpa villages and experience stunning Himalayan vistas.",
      start_lat: 27.7172,
      start_lng: 86.7274,
      end_lat: 28.0026,
      end_lng: 86.8528,
      path_coordinates: JSON.stringify([
        { lat: 27.7172, lng: 86.7274 },
        { lat: 27.7456, lng: 86.7312 },
        { lat: 27.8012, lng: 86.7458 },
        { lat: 27.8889, lng: 86.8012 },
        { lat: 27.9623, lng: 86.8321 },
        { lat: 28.0026, lng: 86.8528 },
      ]),
      difficulty: "hard",
      estimated_duration_hours: 336, // ~14 days
      region: "Khumbu, Nepal",
    },
    {
      id: "20000000-0000-0000-0000-000000000002",
      name: "Annapurna Circuit",
      description:
        "One of the most diverse treks in Nepal, featuring varied terrain from subtropical forests to high-altitude desert.",
      start_lat: 28.2638,
      start_lng: 84.0016,
      end_lat: 28.7958,
      end_lng: 83.8223,
      path_coordinates: JSON.stringify([
        { lat: 28.2638, lng: 84.0016 },
        { lat: 28.3124, lng: 84.0234 },
        { lat: 28.4456, lng: 84.1123 },
        { lat: 28.6234, lng: 84.2345 },
        { lat: 28.7456, lng: 83.9123 },
        { lat: 28.7958, lng: 83.8223 },
      ]),
      difficulty: "hard",
      estimated_duration_hours: 408, // ~17 days
      region: "Annapurna, Nepal",
    },
    {
      id: "20000000-0000-0000-0000-000000000003",
      name: "Langtang Valley Trek",
      description:
        "A beautiful trek through the Langtang Valley with opportunities to see glaciers, high-altitude lakes, and Tibetan-influenced culture.",
      start_lat: 28.1958,
      start_lng: 85.5234,
      end_lat: 28.3123,
      end_lng: 85.6123,
      path_coordinates: JSON.stringify([
        { lat: 28.1958, lng: 85.5234 },
        { lat: 28.2234, lng: 85.5456 },
        { lat: 28.2567, lng: 85.5678 },
        { lat: 28.289, lng: 85.589 },
        { lat: 28.3123, lng: 85.6123 },
      ]),
      difficulty: "medium",
      estimated_duration_hours: 192, // ~8 days
      region: "Langtang, Nepal",
    },
  ]);

  // Insert trip packs (metadata - actual assets would be in S3 or static files)
  await knex("trip_packs").insert([
    {
      id: "30000000-0000-0000-0000-000000000001",
      trip_id: "20000000-0000-0000-0000-000000000001",
      pack_version: "1.0.0",
      map_image_url: "/assets/everest-base-camp-map.jpg",
      waypoints: JSON.stringify([
        { lat: 27.7172, lng: 86.7274, label: "Start - Lukla" },
        { lat: 27.8056, lng: 86.7123, label: "Namche Bazaar" },
        { lat: 28.0026, lng: 86.8528, label: "EBC" },
      ]),
      gallery_urls: JSON.stringify([
        "/assets/ebc-1.jpg",
        "/assets/ebc-2.jpg",
        "/assets/ebc-3.jpg",
      ]),
      guide_text:
        "Day 1: Lukla to Phakding. Day 2: Namche. Day 3: Acclimatize. ... First-aid: carry Diamox; emergency: 100 Nepal Police.",
      offline_advisory:
        "Last Updated: 2 Nov 2025 - Path is clear; snow expected above 3000m.",
      tips: JSON.stringify([
        {
          title: "Acclimatization",
          content:
            "Take rest days at Namche Bazaar (3,440m) and Dingboche (4,410m) to acclimatize properly.",
        },
        {
          title: "Weather",
          content:
            "Weather can change rapidly. Carry warm layers and rain protection at all times.",
        },
        {
          title: "Altitude Sickness",
          content:
            "Watch for symptoms: headache, nausea, dizziness. Descend immediately if symptoms worsen.",
        },
      ]),
      pack_size_bytes: 5242880, // 5MB example
      checksum: "abc123def456",
    },
    {
      id: "30000000-0000-0000-0000-000000000002",
      trip_id: "20000000-0000-0000-0000-000000000002",
      pack_version: "1.0.0",
      map_image_url: "/assets/annapurna-circuit-map.jpg",
      waypoints: JSON.stringify([
        { lat: 28.2638, lng: 84.0016, label: "Start - Besisahar" },
        { lat: 28.7958, lng: 83.8223, label: "End - Jomsom" },
      ]),
      gallery_urls: JSON.stringify([
        "/assets/annapurna-1.jpg",
        "/assets/annapurna-2.jpg",
      ]),
      guide_text:
        "Thorong La crossing requires early start and proper acclimatization. Contacts: ACAP office.",
      offline_advisory:
        "Last Updated: 2 Nov 2025 - Windy at the pass; carry thermal wear.",
      tips: JSON.stringify([
        {
          title: "Thorong La Pass",
          content:
            "The pass at 5,416m is the highest point. Start early in the morning for best weather.",
        },
        {
          title: "Permits",
          content:
            "You need ACAP (Annapurna Conservation Area Permit) and TIMS card. Get them in Kathmandu or Pokhara.",
        },
      ]),
      pack_size_bytes: 4194304, // 4MB example
      checksum: "xyz789uvw012",
    },
    {
      id: "30000000-0000-0000-0000-000000000003",
      trip_id: "20000000-0000-0000-0000-000000000003",
      pack_version: "1.0.0",
      map_image_url: "/assets/langtang-valley-map.jpg",
      waypoints: JSON.stringify([
        { lat: 28.1958, lng: 85.5234, label: "Start - Syabrubesi" },
        { lat: 28.3123, lng: 85.6123, label: "End - Kyanjin" },
      ]),
      gallery_urls: JSON.stringify([
        "/assets/langtang-1.jpg",
        "/assets/langtang-2.jpg",
      ]),
      guide_text:
        "Langtang itinerary: Syabrubesi to Lama Hotel to Langtang Village to Kyanjin.",
      offline_advisory:
        "Last Updated: 2 Nov 2025 - Occasional rockfall reported; follow local guidance.",
      tips: JSON.stringify([
        {
          title: "Wildlife",
          content:
            "Keep food secure at night. Langtang is home to bears and other wildlife.",
        },
        {
          title: "Cultural Sites",
          content:
            "Visit the ancient monasteries and learn about Tamang culture along the way.",
        },
      ]),
      pack_size_bytes: 3145728, // 3MB example
      checksum: "mno345pqr678",
    },
  ]);
}
