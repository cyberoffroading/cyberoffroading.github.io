import { Container } from '@cyberoffroading/night-trail';

/** Freeform prose in the 1200px centered column (grids carry their own container — this is for long-form content). */
export const ProseColumn = () => (
  <Container>
    <h2>Winch Wiring — 240v AC</h2>
    <p>
      This guide covers how to power a 12,000 lb winch using the Cybertruck's 240v 50A plug and four HP
      Common Slot power supplies wired in parallel. The 240v is split to all four PSUs. The DC side wiring
      is up to you.
    </p>
    <p>
      Everything here was tested on my Cyberbeast. Salvaged server PSUs keep the whole build around $120 —
      verify your outlet wiring before you commit to the harness.
    </p>
  </Container>
);

/** Quiet single-paragraph use: the site's affiliate disclosure copy in the same column. */
export const DisclosureParagraph = () => (
  <Container>
    <p>
      CyberOffroading.com is a participant in the Amazon Services LLC Associates Program and other affiliate
      programs. Links on this site may earn us a commission at no extra cost to you. We only recommend
      products we personally use or have thoroughly researched.
    </p>
  </Container>
);
