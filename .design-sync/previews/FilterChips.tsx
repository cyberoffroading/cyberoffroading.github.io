import { FilterChip, FilterChips } from '@cyberoffroading/night-trail';

/** The articles-index filter row, everything shown. */
export const ArticleFilters = () => (
  <FilterChips>
    <FilterChip active>All</FilterChip>
    <FilterChip>Build</FilterChip>
    <FilterChip>Field Guide</FilterChip>
    <FilterChip>Reference</FilterChip>
    <FilterChip>Review</FilterChip>
  </FilterChips>
);

/** Topic filtering mid-session: a non-default chip selected. */
export const TopicSelected = () => (
  <FilterChips>
    <FilterChip>All</FilterChip>
    <FilterChip>DIY Builds</FilterChip>
    <FilterChip active>Recovery</FilterChip>
    <FilterChip>Winter</FilterChip>
    <FilterChip>Comms</FilterChip>
  </FilterChips>
);
