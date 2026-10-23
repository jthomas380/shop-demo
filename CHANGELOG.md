# Changelog

All notable changes to the North & Loom demo storefront are listed here.

## 2026-10-23 — Storefront fixes

### Fixed
- Honor hidden states for the empty bag, discounts, delivery fields, search, dialogs, and confirmation.
- Enforce shared product stock limits across colors and sizes in Add to bag and quantity controls.
- Use item for one bag item and items for zero or multiple items.
- Connect header and footer shop links to the matching product filter and active button.
- Open local shipping, size guide, and demo contact help dialogs.
- Replace large PNGs with compressed WebP artwork, reserve hero image dimensions, and remove the unused screenshot.
- Keep closed drawers and background content inert; manage panel focus, focus return, Tab navigation, and checkout Escape.
- Adjust orange buttons and muted text colors to meet AA contrast while retaining the palette.
- Show two decimal places for fractional-dollar discounts and totals.
- Search product descriptions, color names, and the Weekender bag keyword.
- Scroll matching products into view when using header search.
- Clear promo state after demo orders and hide Return to bag on confirmation.
- Generate a fresh six-digit demo order reference on submission.
- Offer all 50 states and DC in the shipping selector.
- Add a brand favicon, canonical URL, and Open Graph share metadata.
- Remove Finder metadata files and ignore future .DS_Store files.
- Place demo and shipping notice bars in a named landmark.

## 2026-10-23

### Changed
- Skip link now reads "Skip to main content", which matches where it actually goes.
- Header search hint now suggests "overshirt" or "beanie". The old hint, "bag", returned no results because search only looks at product names and categories.
- Newsletter note now says the demo does not store or send email addresses, matching the message shown after joining.
- Checkout summary note now says taxes are not included, since no tax line is shown.
- README now describes the project, its features, and how it is deployed.
