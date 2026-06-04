import { CareerMarker as CareerMarkerData } from "@/data/origin-content";

type CareerMarkerProps = {
  marker: CareerMarkerData;
};

export function CareerMarker({ marker }: CareerMarkerProps) {
  return (
    <article className="origin-marker" data-marker={marker.id}>
      <p className="origin-marker-label">{marker.label}</p>
      <div>
        <span>{marker.period}</span>
        <h3>{marker.role}</h3>
      </div>
      <p>{marker.description}</p>
    </article>
  );
}
