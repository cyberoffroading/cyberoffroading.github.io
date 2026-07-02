---
category: Guide Content
---
Comparison table in a scrollable wrap: cyan mono headers, hairline rows. Use `<span className="yes">Yes</span>` / `<span className="no">No</span>` for verdict cells.

```jsx
<GuideTable
  headers={["Roof glass", "Starlink Mini works?", "Notes"]}
  rows={[
    ["Non-metallic tint", <span className="yes">Yes</span>, "Full signal from under the glass"],
    ["Metallic coating", <span className="no">No</span>, "Blocks the antenna — mount externally"],
  ]}
/>
```
