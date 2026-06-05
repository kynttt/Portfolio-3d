import Image from "next/image";

export function MechanicalAssembly() {
  return (
    <div className="mechanical-assembly" aria-hidden="true">
      <Image
        className="origin-clock-fallback"
        src="/assets/mech-clock/ezgif-frame-001.png"
        alt=""
        height={960}
        loading="eager"
        priority
        width={960}
      />
      <canvas
        className="origin-clock-sequence"
        data-frame="0"
        height={960}
        width={960}
      />
      <div className="origin-clock-reticle" />
      <div className="origin-annotation origin-annotation-top">GEAR TRAIN / CLOCKWORK</div>
      <div className="origin-annotation origin-annotation-right">MECHANICAL CLOCK / 02</div>
      <div className="origin-annotation origin-annotation-bottom">96-FRAME SCROLL SEQUENCE</div>
    </div>
  );
}
