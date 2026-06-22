export function ManifestoTransitionBridge() {
  return (
    <div className="manifesto-transition-bridge" aria-hidden="true">
      <svg viewBox="0 0 900 900" role="presentation">
        <g className="manifesto-bridge-gear" fill="none" stroke="currentColor">
          <circle cx="450" cy="450" r="142" />
          <circle cx="450" cy="450" r="58" />
          <g className="manifesto-bridge-teeth">
            {Array.from({ length: 24 }, (_, index) => (
              <line
                key={index}
                x1="450"
                y1="282"
                x2="450"
                y2="238"
                transform={`rotate(${index * 15} 450 450)`}
              />
            ))}
          </g>
          <path d="M212 450h676" className="manifesto-bridge-data-line" />
          <path d="M450 176v648" className="manifesto-bridge-data-line" />
          <path d="M270 642 722 270" className="manifesto-bridge-data-line" />
        </g>
        <g className="manifesto-bridge-node" fill="currentColor">
          <circle cx="234" cy="450" r="5" />
          <circle cx="450" cy="450" r="7" />
          <circle cx="724" cy="450" r="5" />
          <circle cx="450" cy="222" r="5" />
          <circle cx="450" cy="718" r="5" />
          <circle cx="674" cy="310" r="5" />
        </g>
        <g className="manifesto-bridge-labels">
          <text x="174" y="426">DATA PATH</text>
          <text x="474" y="214">SYSTEM NODE</text>
          <text x="590" y="468">OPERATIONAL OUTPUT</text>
        </g>
      </svg>
    </div>
  );
}
