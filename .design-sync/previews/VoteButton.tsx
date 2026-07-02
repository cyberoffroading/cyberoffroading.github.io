import { VoteButton } from '@cyberoffroading/night-trail';

/** Resting state: steel outline, muted mono count. */
export const Resting = () => <VoteButton count={128} />;

/** Voted: cyan neon outline, soft glow, filled star. */
export const Voted = () => <VoteButton count={214} voted />;

/** Placeholder dash shown before the worker returns counts. */
export const Placeholder = () => <VoteButton />;
