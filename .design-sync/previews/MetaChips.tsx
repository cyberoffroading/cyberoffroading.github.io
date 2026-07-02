import { MetaChips } from '@cyberoffroading/night-trail';

/** Roundup meta under the inflator comparison header. */
export const RoundupMeta = () => (
  <MetaChips
    items={[
      { value: '14', label: 'inflators tested' },
      { value: '9', label: 'months on trail' },
      { label: 'updated June 2026' },
    ]}
  />
);

/** Build-guide stats: the winch-wiring headline numbers. */
export const WinchBuildMeta = () => (
  <MetaChips
    items={[
      { value: '12,000', label: 'lb winch' },
      { value: '240', label: 'v input' },
      { value: '4', label: 'PSUs in parallel' },
    ]}
  />
);
