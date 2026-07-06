---
category: Cards
---
The core gear card: brushed-steel product stage (contain-fit photo, cyan top edge), then title, cyan price line, spec-first review, bordered spec rows, CTA(s), and the community stats row. One glowing primary CTA per card.

```jsx
<ProductCard
  title="Tankless Inflator Setup"
  price="~$130"
  review="Inflates all 4 tires 35–50psi simultaneously in 3.5 min. Runs off 120v AC from the CT bed outlet."
  imageSrc="/photos/inflator.jpg"
  specs={[
    { label: "Tires", value: "All 4 at once" },
    { label: "Pressure", value: "35–50 psi" },
    { label: "Time", value: "3.5 min" },
  ]}
  stats={{ votes: 128, clicks: 3410 }}
>
  <CtaButton href="https://amzn.to/xyz">Check Price on Amazon</CtaButton>
</ProductCard>
```
