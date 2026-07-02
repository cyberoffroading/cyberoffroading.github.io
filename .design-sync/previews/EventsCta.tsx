import { CtaButton, EventsCta } from '@cyberoffroading/night-trail';

/** Canonical promo band — the site's Cybertrex Events section, full width with neon border. */
export const CybertrexEvents = () => (
  <EventsCta
    label="// Cybertrex Events"
    text="Find upcoming Cybertruck off-road events, group runs, and meetups. The main hub for organized CT trail runs."
  >
    <CtaButton className="events-cta__button" href="https://www.cybertrexevents.com/">
      View Events
    </CtaButton>
  </EventsCta>
);

/** Alternate band content — the Starlink referral pitch as a promo band. */
export const StarlinkReferral = () => (
  <EventsCta
    label="// Starlink Referral"
    text="If you're planning to get Starlink — for the truck, the house, wherever — use my referral link."
  >
    <CtaButton className="events-cta__button" href="https://starlink.com/residential?referral=RC-3612570-92192-62">
      Sign Up for Starlink
    </CtaButton>
  </EventsCta>
);
