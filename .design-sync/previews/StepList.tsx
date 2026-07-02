import { StepList } from '@cyberoffroading/night-trail';

/** PSU pin-configuration steps from the 240v winch-wiring guide. */
export const WinchWiringSteps = () => (
  <div style={{ maxWidth: 640 }}>
    <StepList
      steps={[
        'Unplug the four PSUs and mount them in the bed enclosure.',
        <>
          Wire all pin 34s together with signal wire. <strong>Pin 34 is PS_ON — grounding it turns all four PSUs on simultaneously.</strong>
        </>,
        'Jump pins 33 & 36 with a low-ohm resistor on each PSU to load the 3.3v rail.',
        'Combine the four 12v outputs and run them to the winch motor terminals.',
      ]}
    />
  </div>
);

/** Shorter checklist: the AC-side hookup from the same guide. */
export const AcSideSteps = () => (
  <div style={{ maxWidth: 640 }}>
    <StepList
      steps={[
        "Split the CT's 240v 50A plug to all four HP Common Slot power supplies.",
        'Fuse each PSU output individually for safety.',
        'Use wire gauge rated for the current draw — the winch can pull 400+ amps at full load.',
      ]}
    />
  </div>
);
