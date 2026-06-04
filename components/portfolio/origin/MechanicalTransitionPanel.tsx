import { TransitionPanel } from "@/data/origin-content";

type MechanicalTransitionPanelProps = {
  panel: TransitionPanel;
  index: number;
};

function PanelDiagram({ variant }: { variant: TransitionPanel["variant"] }) {
  if (variant === "transmission") {
    return (
      <svg viewBox="0 0 520 420" aria-hidden="true">
        <circle className="panel-ring" cx="190" cy="210" r="86" />
        <circle className="panel-ring panel-ring-soft" cx="322" cy="184" r="62" />
        <circle className="panel-ring panel-ring-soft" cx="344" cy="282" r="42" />
        <path className="panel-line" d="M68 214h390" />
        <path className="panel-line" d="M190 90v240" />
        <path className="panel-arc" d="M112 176a92 92 0 0 1 152-48" />
        <path className="panel-arc" d="M276 158a66 66 0 0 1 96 44" />
      </svg>
    );
  }

  if (variant === "bearing") {
    return (
      <svg viewBox="0 0 520 420" aria-hidden="true">
        <circle className="panel-ring" cx="260" cy="210" r="124" />
        <circle className="panel-ring panel-ring-soft" cx="260" cy="210" r="86" />
        <circle className="panel-ring panel-ring-soft" cx="260" cy="210" r="48" />
        <path className="panel-line" d="M74 210h372" />
        <path className="panel-line" d="M260 46v328" />
        <path className="panel-line panel-line-soft" d="M142 92l236 236" />
        <path className="panel-line panel-line-soft" d="M378 92L142 328" />
      </svg>
    );
  }

  if (variant === "control") {
    return (
      <svg viewBox="0 0 520 420" aria-hidden="true">
        <path className="panel-route" d="M76 116h108v76h146v-42h112" />
        <path className="panel-route panel-route-soft" d="M96 296h92v-68h96v56h142" />
        <path className="panel-line" d="M80 210h360" />
        <circle className="panel-node" cx="184" cy="116" r="11" />
        <circle className="panel-node" cx="330" cy="192" r="11" />
        <circle className="panel-node" cx="284" cy="228" r="11" />
        <circle className="panel-node" cx="426" cy="284" r="11" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 520 420" aria-hidden="true">
      <path className="panel-shell" d="M104 120h256l62 88-62 92H104l-48-92 48-88Z" />
      <path className="panel-line" d="M72 208h384" />
      <path className="panel-line panel-line-soft" d="M136 88v248" />
      <path className="panel-line panel-line-soft" d="M346 88v248" />
      <path className="panel-arc" d="M146 306a142 142 0 0 0 238-26" />
    </svg>
  );
}

export function MechanicalTransitionPanel({
  panel,
  index,
}: MechanicalTransitionPanelProps) {
  return (
    <article className="mechanical-loop-panel" data-panel={panel.id}>
      <div className="loop-panel-index">0{index + 1}</div>
      <div className="loop-panel-diagram">
        <PanelDiagram variant={panel.variant} />
      </div>
      <div className="loop-panel-copy">
        <p>{panel.assembly}</p>
        <h3>{panel.title}</h3>
      </div>
      <ul className="loop-panel-labels" aria-label={`${panel.title} labels`}>
        {panel.labels.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
    </article>
  );
}
