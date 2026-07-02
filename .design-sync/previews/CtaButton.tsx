import { CtaButton } from '@cyberoffroading/night-trail';

/** Filled cyan neon — the one glowing action per card. External href gets an auto ↗. */
export const PrimaryAffiliate = () => <CtaButton href="https://amzn.to/4phHAcE">Check Price on Amazon</CtaButton>;

/** Red outline neon — the co-primary alternative (budget pick, second option). */
export const SecondaryRedOutline = () => (
  <CtaButton variant="secondary" href="https://amzn.to/3LeeRaK">
    MKII — Budget Option
  </CtaButton>
);

/** Internal navigation: no ↗, no new tab. Put the arrow in the label. */
export const InternalNav = () => (
  <CtaButton internal href="#offroad">
    Explore Gear &rarr;
  </CtaButton>
);

/** The hero pairing: primary + secondary side by side. */
export const PairedActions = () => (
  <div className="hero__actions">
    <CtaButton internal className="hero__cta" href="#offroad">
      Explore Gear &rarr;
    </CtaButton>
    <CtaButton internal variant="secondary" className="hero__cta" href="#winch">
      Winch Build &rarr;
    </CtaButton>
  </div>
);
