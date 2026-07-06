import { PartsList } from '@cyberoffroading/night-trail';

/** Canonical parts list — the winch-build shopping list with dashed leader rows. */
export const WinchBuildParts = () => (
  <div style={{ maxWidth: 640 }}>
    <PartsList
      rows={[
        { name: 'HP 1200W Common Slot PSU ×4', value: '$60' },
        { name: '2 AWG welding cable', value: '20 ft' },
        { name: 'NEMA 14-50 plug', value: '$18' },
        { name: 'Low-ohm resistor', value: '2×' },
      ]}
    />
  </div>
);

/** Custom label — the roundup spec-sheet pattern (Badland 12k winch specs). */
export const WinchSpecSheet = () => (
  <div style={{ maxWidth: 640 }}>
    <PartsList
      label="// Spec Sheet"
      rows={[
        { name: 'Pull rating', value: '12,000 lb' },
        { name: 'Rope', value: 'Synthetic' },
        { name: 'Remote', value: 'Wireless' },
        { name: 'Mount', value: '2" receiver' },
      ]}
    />
  </div>
);
