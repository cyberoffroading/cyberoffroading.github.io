import { SpecRow } from '@cyberoffroading/night-trail';

/** Spec rows as they ship: a bordered spec block inside a product card panel. */
export const InflatorSpecs = () => (
  <div className="product-card revealed" style={{ maxWidth: 340, padding: 18 }}>
    <div className="product-card__specs">
      <SpecRow label="Tires" value="All 4 at once" />
      <SpecRow label="Pressure" value="35–50 psi" />
      <SpecRow label="Time" value="3.5 min" />
      <SpecRow label="Power" value="120V AC" />
    </div>
  </div>
);

/** Three-row block — the winch card's specs. */
export const WinchSpecs = () => (
  <div className="product-card revealed" style={{ maxWidth: 340, padding: 18 }}>
    <div className="product-card__specs">
      <SpecRow label="Capacity" value="12,000 lb" />
      <SpecRow label="Rope" value="Synthetic" />
      <SpecRow label="Remote" value="Wireless" />
    </div>
  </div>
);

/** Longer values stay right-aligned without crowding the key. */
export const LongValues = () => (
  <div className="product-card revealed" style={{ maxWidth: 340, padding: 18 }}>
    <div className="product-card__specs">
      <SpecRow label="Profile" value="60W PD" />
      <SpecRow label="Connector" value="USB-C → DC barrel" />
      <SpecRow label="Source" value="CT 240V 50A" />
    </div>
  </div>
);
