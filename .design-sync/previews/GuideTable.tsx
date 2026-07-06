import { GuideTable } from '@cyberoffroading/night-trail';

/** The roof-glass Starlink Mini compatibility table from the live guide. */
export const RoofGlassCompatibility = () => (
  <div style={{ maxWidth: 760 }}>
    <GuideTable
      headers={['Glass Type', 'Starlink Mini (Interior)', 'Starlink Mini (Exterior)', 'Notes']}
      rows={[
        [
          <strong>1st Gen Silver</strong>,
          <span className="no">No</span>,
          <span className="yes">Yes</span>,
          'Metallic coating blocks RF. Must use exterior mount.',
        ],
        [
          <strong>2nd Gen Silver</strong>,
          <span className="yes">Yes</span>,
          <span className="yes">Yes</span>,
          'RF-transparent coating. Interior mount works perfectly.',
        ],
        [
          <strong>Black Glass</strong>,
          <span className="no">No</span>,
          <span className="yes">Yes</span>,
          'Dark tint blocks RF. Must use exterior mount.',
        ],
      ]}
    />
  </div>
);

/** Compact three-column reference: PSU pin functions from the winch-wiring guide. */
export const PinReference = () => (
  <div style={{ maxWidth: 640 }}>
    <GuideTable
      headers={['Pin', 'Signal', 'Action']}
      rows={[
        ['34', 'PS_ON', 'Wire all pin 34s together — grounding turns every PSU on at once'],
        ['33 & 36', '3.3v rail sense', 'Jump with a low-ohm resistor for the minimum load'],
      ]}
    />
  </div>
);
