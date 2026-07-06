import { CategoryNav, NavPill } from '@cyberoffroading/night-trail';

/** The full site header: neon brand left, scrolling pill row in section order, Offroad current. */
export const SiteHeader = () => (
  <CategoryNav>
    <NavPill href="#articles">Articles</NavPill>
    <NavPill href="#offroad" active>
      Offroad
    </NavPill>
    <NavPill href="#recovery" tone="red">
      Recovery
    </NavPill>
    <NavPill href="#flat-tire" tone="red">
      Flat Tire
    </NavPill>
    <NavPill href="#winter" tone="red">
      Winter
    </NavPill>
    <NavPill href="#winch">Winch Build</NavPill>
    <NavPill href="#starlink">Starlink</NavPill>
    <NavPill href="#comms">Comms</NavPill>
    <NavPill href="#essentials">Essentials</NavPill>
    <NavPill href="#events" tone="red">
      Events
    </NavPill>
    <NavPill href="#gallery">Gallery</NavPill>
  </CategoryNav>
);

/** Top-of-page state: brand concealed until the hero wordmark scrolls away, red section current. */
export const PreScrollHeader = () => (
  <CategoryNav showBrand={false}>
    <NavPill href="#articles">Articles</NavPill>
    <NavPill href="#offroad">Offroad</NavPill>
    <NavPill href="#recovery" tone="red" active>
      Recovery
    </NavPill>
    <NavPill href="#flat-tire" tone="red">
      Flat Tire
    </NavPill>
    <NavPill href="#winter" tone="red">
      Winter
    </NavPill>
    <NavPill href="#winch">Winch Build</NavPill>
    <NavPill href="#starlink">Starlink</NavPill>
    <NavPill href="#comms">Comms</NavPill>
  </CategoryNav>
);
