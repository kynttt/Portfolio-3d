export type CareerMarker = {
  id: string;
  label: string;
  period: string;
  role: string;
  description: string;
};

export const originCopy = {
  eyebrow: "02 / ORIGIN",
  title: "BEFORE I BUILT\nDIGITAL SYSTEMS,\nI WORKED INSIDE\nMECHANICAL ONES.",
  supporting:
    "I started in environments where machines, people, maintenance schedules, safety requirements, production targets, and operating constraints all had to work together.",
  secondary: "That experience still shapes the way I build software today.",
  instruction: "SCROLL TO ASSEMBLE THE SYSTEM",
  finalStatement: "THE TOOLS CHANGED.\nTHE SYSTEMS MINDSET DID NOT.",
  metadata: {
    system: "SYSTEM / 02",
    chapter: "MECHANICAL ORIGIN",
  },
};

export const careerMarkers: CareerMarker[] = [
  {
    id: "environmental-systems",
    label: "01 / ENVIRONMENTAL SYSTEMS",
    period: "2017 - 2019",
    role: "ENVIRONMENTAL MANAGEMENT SPECIALIST",
    description:
      "Environmental compliance, inspections, reporting, hazardous-material workflows, and operational documentation.",
  },
  {
    id: "production-engineering",
    label: "02 / PRODUCTION ENGINEERING",
    period: "2020 - 2023",
    role: "PRODUCTION ENGINEER",
    description:
      "Feed-mill operations, equipment reliability, preventive maintenance, production planning, downtime reduction, and process improvement.",
  },
  {
    id: "digital-systems",
    label: "03 / DIGITAL SYSTEMS",
    period: "2023 - PRESENT",
    role: "SOFTWARE DEVELOPMENT",
    description:
      "Web platforms, mobile applications, offline field workflows, geospatial tools, utility systems, and applied AI products.",
  },
];

export const originAssets = {
  centralGear: "/assets/origin/central-gear.svg",
  secondaryGearA: "/assets/origin/secondary-gear-a.svg",
  secondaryGearB: "/assets/origin/secondary-gear-b.svg",
  mainShaft: "/assets/origin/main-shaft.svg",
  secondaryShaft: "/assets/origin/secondary-shaft.svg",
  bearingOuter: "/assets/origin/bearing-outer.svg",
  bearingInner: "/assets/origin/bearing-inner.svg",
  mechanicalLinkage: "/assets/origin/mechanical-linkage.svg",
  cadOverlay: "/assets/origin/cad-overlay.svg",
  digitalNodeOverlay: "/assets/origin/digital-node-overlay.svg",
  dataLines: "/assets/origin/data-lines.svg",
};
