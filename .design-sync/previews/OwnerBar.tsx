import { OwnerBar } from '@cyberoffroading/night-trail';

/** The live provenance bar: cyan <span> link to the owner's profile, top hairline border. */
export const Provenance = () => (
  <OwnerBar>
    Built by{' '}
    <a href="https://x.com/kchau" target="_blank" rel="noopener noreferrer">
      <span>Kevin</span>
    </a>{' '}
    — Cyberbeast owner. Every product on this site is gear I run on my truck.
  </OwnerBar>
);

/** Short-copy variant of the same bar. */
export const Compact = () => (
  <OwnerBar>
    Built by{' '}
    <a href="https://x.com/kchau" target="_blank" rel="noopener noreferrer">
      <span>Kevin</span>
    </a>{' '}
    — Cyberbeast owner.
  </OwnerBar>
);
