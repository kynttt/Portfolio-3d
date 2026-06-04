export function MechanicalAssembly() {
  const teeth = Array.from({ length: 16 });

  return (
    <div className="mechanical-assembly" aria-hidden="true">
      <svg viewBox="0 0 760 620" role="img">
        <defs>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="18" stdDeviation="16" floodOpacity="0.12" />
          </filter>
        </defs>

        <g className="origin-blueprint-layer">
          <path className="origin-cad-line" d="M68 310H696" pathLength="1" />
          <path className="origin-cad-line" d="M380 72V546" pathLength="1" />
          <path className="origin-cad-line" d="M142 146L618 474" pathLength="1" />
          <path className="origin-cad-line" d="M618 146L142 474" pathLength="1" />
          <circle className="origin-cad-line alignment-ring" cx="380" cy="310" r="182" pathLength="1" />
          <circle className="origin-cad-line alignment-ring" cx="380" cy="310" r="246" pathLength="1" />
        </g>

        <g className="mechanical-assembly-layer" filter="url(#softShadow)">
          <rect
            className="origin-part"
            data-part="main-shaft"
            x="140"
            y="292"
            width="480"
            height="36"
            rx="18"
          />
          <rect
            className="origin-part"
            data-part="secondary-shaft"
            x="250"
            y="182"
            width="330"
            height="28"
            rx="14"
            transform="rotate(18 415 196)"
          />
          <path
            className="origin-part"
            data-part="mechanical-linkage"
            d="M228 420h128l80-78 96 1 38 58-44 68H380l-74-48h-78Z"
          />
          <circle
            className="origin-part bearing"
            data-part="outer-bearing"
            cx="380"
            cy="310"
            r="124"
          />
          <circle
            className="origin-part bearing bearing-inner"
            data-part="inner-bearing"
            cx="380"
            cy="310"
            r="78"
          />

          <g className="origin-part gear central-gear" data-part="central-gear">
            <circle cx="380" cy="310" r="72" />
            {teeth.map((_, index) => (
              <rect
                key={index}
                x="372"
                y="218"
                width="16"
                height="28"
                rx="4"
                transform={`rotate(${index * 22.5} 380 310)`}
              />
            ))}
            <circle className="gear-hole" cx="380" cy="310" r="22" />
          </g>

          <g className="origin-part gear secondary-gear-a" data-part="secondary-gear-a">
            <circle cx="246" cy="244" r="48" />
            {teeth.slice(0, 12).map((_, index) => (
              <rect
                key={index}
                x="240"
                y="182"
                width="12"
                height="20"
                rx="3"
                transform={`rotate(${index * 30} 246 244)`}
              />
            ))}
            <circle className="gear-hole" cx="246" cy="244" r="15" />
          </g>

          <g className="origin-part gear secondary-gear-b" data-part="secondary-gear-b">
            <circle cx="514" cy="392" r="54" />
            {teeth.slice(0, 14).map((_, index) => (
              <rect
                key={index}
                x="508"
                y="322"
                width="12"
                height="22"
                rx="3"
                transform={`rotate(${index * 25.72} 514 392)`}
              />
            ))}
            <circle className="gear-hole" cx="514" cy="392" r="16" />
          </g>

          <path
            className="torque-arrow"
            d="M202 186a116 116 0 0 1 154-40"
            fill="none"
          />
          <path
            className="torque-arrow"
            d="M548 462a104 104 0 0 1-142 28"
            fill="none"
          />
        </g>

        <g className="origin-digital-layer">
          <path className="data-route" d="M380 310H650v-92" pathLength="1" />
          <path className="data-route" d="M380 310H106v126h172" pathLength="1" />
          <path className="data-route" d="M514 392h92v92" pathLength="1" />
          <circle className="digital-node" cx="380" cy="310" r="12" />
          <circle className="digital-node" cx="650" cy="218" r="10" />
          <circle className="digital-node" cx="106" cy="436" r="10" />
          <circle className="digital-node" cx="278" cy="436" r="10" />
          <circle className="digital-node" cx="606" cy="484" r="10" />
        </g>

        <g className="origin-annotation-layer">
          <text className="origin-annotation" x="72" y="92">LOAD PATH / FIELD LOGIC</text>
          <text className="origin-annotation" x="518" y="124">CAD AXIS / 02</text>
          <text className="origin-annotation" x="84" y="536">DATA ROUTE / CLEAN SYSTEM</text>
        </g>
      </svg>
    </div>
  );
}
