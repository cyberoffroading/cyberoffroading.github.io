---
category: Brand
---
The CyberOffroading neon sign as live text — cyan Audiowide "Cyber" + red Yellowtail "Offroading", each tube glowing and flickering on its own timeline (7s / 6.4s, out of phase). The brand is the only thing that flickers; UI never does.

```jsx
<NeonWordmark href="#top" />           // nav-scale sign, flickering
<NeonWordmark variant="footer" />      // small desaturated sign-off mark
<NeonWordmark flicker={false} />       // static (print/reduced-motion contexts)
```
