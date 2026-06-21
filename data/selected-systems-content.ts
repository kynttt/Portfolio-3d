export type SelectedSystemPlaceholderVariant =
  | "genius"
  | "field-systems"
  | "poseidon"
  | "ai-product-lab";

export type SelectedSystem = {
  id: string;
  number: string;
  label: string;
  title: string;
  subtitle: string;
  dynamicDescription: string;
  shortCaption: string;
  category: string;
  role: string;
  stack: string[];
  constraints: string[];
  visualLabel: string;
  footerLeft: string;
  footerRight: string;
  imageAlt: string;
  imageSrc: string;
  placeholderVariant: SelectedSystemPlaceholderVariant;
};

export const selectedSystemsContent: {
  sectionLabel: string;
  chapter: string;
  defaultDescription: string;
  systems: SelectedSystem[];
} = {
  sectionLabel: "SELECTED SYSTEMS",
  chapter: "04 / 05",
  defaultDescription:
    "Selected work across utility infrastructure, field operations, geospatial tools, logistics workflows, AI products, and creative digital systems.",
  systems: [
    {
      id: "genius",
      number: "01",
      label: "UTILITY DIGITAL TWIN",
      title: "GENIUS",
      subtitle: "Planning and asset management for distribution utilities",
      dynamicDescription:
        "A utility-focused digital system supporting asset visibility, planning workflows, field-data coordination, and infrastructure mapping.",
      shortCaption: "UTILITY INFRASTRUCTURE",
      category: "Geospatial / Utility Systems",
      role: "Frontend Development / System Implementation",
      stack: ["React", "Next.js", "React Native", "PostgreSQL", "Leaflet", "Mapbox"],
      constraints: ["Utility assets", "Geospatial data", "Field workflows", "Operational planning"],
      visualLabel: "SYSTEM 01",
      footerLeft: "UTILITY DIGITAL TWIN",
      footerRight: "CASE FILE / 01 / 04",
      imageAlt:
        "Abstract utility digital twin interface with map routes, asset nodes, and dashboard layers",
      imageSrc: "/assets/selected-systems/genius.webp",
      placeholderVariant: "genius",
    },
    {
      id: "field-systems",
      number: "02",
      label: "FIELD OPERATIONS",
      title: "FIELD SYSTEMS",
      subtitle: "Offline-first tools for utility field crews",
      dynamicDescription:
        "Mobile and web tools designed for field crews working in low-connectivity environments, supporting task downloads, pole mapping, photo capture, and later synchronization.",
      shortCaption: "OFFLINE FIELD CAPTURE",
      category: "Mobile / Offline-first Systems",
      role: "Mobile and Web Development",
      stack: ["React Native", "Expo", "Leaflet", "IndexedDB", "Service Workers", "PHP", "PostgreSQL"],
      constraints: ["Offline usage", "Map tiles", "Field photos", "Sync reliability"],
      visualLabel: "SYSTEM 02",
      footerLeft: "FIELD CAPTURE",
      footerRight: "CASE FILE / 02 / 04",
      imageAlt:
        "Abstract offline field application interface with mobile screens, map tiles, route lines, and pole markers",
      imageSrc: "/assets/selected-systems/field-systems.webp",
      placeholderVariant: "field-systems",
    },
    {
      id: "poseidon",
      number: "03",
      label: "LOGISTICS PLATFORM",
      title: "POSEIDON",
      subtitle: "Freight quoting, booking, and logistics workflows",
      dynamicDescription:
        "A logistics platform for shipment workflows, distance-based quoting, booking flows, map routing, payments, and operational dashboards.",
      shortCaption: "ROUTE-BASED WORKFLOWS",
      category: "Business Platform / Logistics",
      role: "Frontend and Product Implementation",
      stack: ["React", "TypeScript", "Tailwind CSS", "Redux", "Google Maps API", "REST API", "Stripe"],
      constraints: ["Route pricing", "Shipment details", "Booking flow", "Payment integration"],
      visualLabel: "SYSTEM 03",
      footerLeft: "LOGISTICS SYSTEM",
      footerRight: "CASE FILE / 03 / 04",
      imageAlt:
        "Abstract logistics platform interface with route map, quote panels, shipment metadata, and dashboard elements",
      imageSrc: "/assets/selected-systems/poseidon.webp",
      placeholderVariant: "poseidon",
    },
    {
      id: "ai-product-lab",
      number: "04",
      label: "AI PRODUCT LAB",
      title: "AI PRODUCT LAB",
      subtitle: "Practical experiments in applied intelligence",
      dynamicDescription:
        "Applied AI experiments exploring document workflows, resume screening, legal research assistance, retrieval systems, and local-model integrations.",
      shortCaption: "APPLIED AI SYSTEMS",
      category: "AI / Product Experiments",
      role: "Product Prototyping / Full-stack Development",
      stack: ["Next.js", "TypeScript", "Supabase", "RAG", "Ollama", "Embeddings", "LLM Integrations"],
      constraints: ["Document retrieval", "Ranking logic", "User workflows", "AI-assisted decisions"],
      visualLabel: "SYSTEM 04",
      footerLeft: "AI WORKFLOWS",
      footerRight: "CASE FILE / 04 / 04",
      imageAlt:
        "Abstract AI workflow interface with knowledge graph, document chunks, retrieval paths, and system nodes",
      imageSrc: "/assets/selected-systems/ai-product-lab.webp",
      placeholderVariant: "ai-product-lab",
    },
  ],
};
