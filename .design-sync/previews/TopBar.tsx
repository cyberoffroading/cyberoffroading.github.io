import { TopBar } from '@cyberoffroading/night-trail';

/** The live cross-promo bar: underlined link with the cyan <span> brand idiom. */
export const CrossPromo = () => (
  <TopBar>
    Driving another Tesla? Check out{' '}
    <a href="https://tesla-essentials.com" target="_blank" rel="noopener noreferrer">
      <span>Tesla-Essentials.com</span>
    </a>{' '}
    for accessories covering the rest of the lineup.
  </TopBar>
);

/** Link-less announcement copy at the same slim scale. */
export const PlainNotice = () => (
  <TopBar>Trail season is here — new recovery gear reviews landing weekly.</TopBar>
);
