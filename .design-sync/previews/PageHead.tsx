import { Container, PageHead } from '@cyberoffroading/night-trail';

/** Cyan listing-page header (the live articles index), inside the page Container as on the site. */
export const ArticlesHead = () => (
  <Container>
    <PageHead
      eyebrow="// Field Notes & Guides"
      title="Articles"
      sub="In-depth, field-tested guides and walkthroughs for the Cybertruck — every one written from a Cyberbeast I actually run on the trail. No fluff, spec-focused."
    />
  </Container>
);

/** Trail-red domain page header: eyebrow, h1 glow, and neon bar go warn-red. */
export const RecoveryGuidesHead = () => (
  <Container>
    <PageHead
      tone="trail"
      eyebrow="// When You're Stuck"
      title="Recovery Guides"
      sub="Winch wiring, strap ratings, and recovery-board technique — the knowledge that gets you unstuck without breaking gear."
    />
  </Container>
);
