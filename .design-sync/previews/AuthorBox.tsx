import { AuthorBox } from '@cyberoffroading/night-trail';

const avatar = (
  <svg viewBox="0 0 46 46" width="46" height="46" role="img" aria-label="Kevin">
    <rect width="46" height="46" fill="#15161a" />
    <circle cx="23" cy="17" r="8" fill="#3f444b" />
    <path d="M8 46c0-9 6.7-14 15-14s15 5 15 14z" fill="#3f444b" />
  </svg>
);

/** Article sign-off with the inline SVG avatar in the steel-bordered box. */
export const WithAvatar = () => (
  <div style={{ maxWidth: 640 }}>
    <AuthorBox name="Kevin" role="Cyberbeast owner · every product field-tested" avatar={avatar} />
  </div>
);

/** Name + role only — no avatar slot. */
export const NoAvatar = () => (
  <div style={{ maxWidth: 640 }}>
    <AuthorBox name="Kevin" role="Cyberbeast owner · every product field-tested" />
  </div>
);
