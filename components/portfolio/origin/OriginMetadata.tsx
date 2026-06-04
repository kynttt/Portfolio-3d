import { originCopy } from "@/data/origin-content";

export function OriginMetadata() {
  return (
    <aside className="origin-metadata" aria-label="Origin assembly metadata">
      <span>{originCopy.metadata.system}</span>
      <span>{originCopy.metadata.chapter}</span>
      <span>
        ASSEMBLY PROGRESS: <strong className="assembly-progress-value">00%</strong>
      </span>
    </aside>
  );
}
