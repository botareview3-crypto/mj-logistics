# MJ Logistics — AI Handoff Notes

## Project Overview
Static Next.js 14 frontend (`output: 'export'`) deployed on Hostinger shared hosting.
Backend: FastAPI (in-memory, not yet connected to the live site).
Stack: Next.js 14, TypeScript, Tailwind CSS v4, GSAP, Framer Motion, Lucide icons, Chopin Trial font.

## Repository
`https://github.com/botareview3-crypto/mj-logistics.git`  
Branch: `main`  
Deployed folder: `frontend/out/` (static export — always rebuild after changes)

## How to run
```bash
# Frontend
cd frontend
npm install
npm run dev        # dev server at http://localhost:3000
npm run build      # rebuilds the out/ folder for deployment
```

## How to deploy
After `npm run build`, upload the contents of `frontend/out/` to Hostinger.  
The `.htaccess` file in `out/` handles clean URLs.

---

## Page-by-Page Fix Progress

### ✅ 1. Homepage (`/`) — DONE
All fixes applied and pushed. Summary of what was fixed:

**Header (`components/SiteHeader.tsx`)**
- Replaced "Business Equipment" with "MJ Mining" in the mega dropdown
- Fixed mobile accordion bug: separated `mobileProdOpen` (top-level toggle) and `mobileSection` (sub-section) states — previously they shared one state causing sections to merge when switching between them

**Hero section (`pages/index.tsx`)**
- Hero image now fills full screen on mobile: section has explicit `height: 100svh` + `min-height: 100svh` (without explicit height, `h-full` on absolute children computes to 0)
- Browse Catalog dropdown opens upward (`bottom-full`) so it stays visible at bottom of screen
- Image uses `object-center` on mobile, `object-[60%_center]` on sm+

**VideoScrollSection (`components/VideoScrollSection.tsx`)**
- Rewrote to use CSS visibility (`lg:hidden` / `hidden lg:block`) instead of conditional rendering — the old `hydrated && !isMobile` gate meant GSAP refs were missing when the effect ran
- Mobile section: real autoplay video background using `logistics-mobile.mp4` (2.2MB, 720p, 25fps, H.264, faststart)
- Desktop section: always in DOM, GSAP scroll-pinned pill expansion works correctly
- Video files:
  - `public/logistics-mobile.mp4` — 2.2MB, 720p, for mobile (autoPlay + muted)
  - `public/logistics-video-web.mp4` — 17MB, 1080p, for desktop GSAP section
  - `public/logistics-video.mp4` — 84MB raw, not used in UI (kept for reference)

**Divisions section (`pages/index.tsx`)**
- Auto Parts card uses `public/homepage/auto-parts-istock.jpg` (from root `istockphoto-488844774-612x612.jpg`)
- Icon wrapper box removed — bare icon only (no rounded square background)

**Footer (`components/SiteFooter.tsx`)**
- Fixed broken "Contact → `/contact`" link → now "Advantages → `/advantages`"
- All other links verified correct

---

### ⬜ 2. Shop (`/shop`) — NEXT
File: `frontend/pages/shop.tsx`

**What the page has:**
- Hero search banner with vehicle fitment selector
- Category grid (auto parts systems + other catalog roots like office/stationery)
- Best-selling parts grid (8 products, from `PARTS_DATABASE` where `isBestSeller: true`)
- Top Brands strip (from `POPULAR_BRANDS`)
- "My Garage" promo banner

**Known issues to check/fix** (user has not reviewed yet — ask user what to fix):
- Verify layout on mobile/tablet
- Check that category icons render correctly
- Check product cards render and link correctly
- Check vehicle selector integration works

---

### ⬜ 3. Search (`/search`)
File: `frontend/pages/search.tsx`

### ⬜ 4. Garage (`/garage`)
File: `frontend/pages/garage.tsx`

### ⬜ 5. Cart (`/cart`)
File: `frontend/pages/cart.tsx`

### ⬜ 6. Account (`/account`)
File: `frontend/pages/account.tsx`

### ⬜ 7. Sign In (`/signin`)
File: `frontend/pages/signin.tsx`

### ⬜ 8. Divisions (`/divisions`)
File: `frontend/pages/divisions.tsx`

### ⬜ 9. Mining (`/mining`)
File: `frontend/pages/mining.tsx`

### ⬜ 10. Advantages (`/advantages`)
File: `frontend/pages/advantages.tsx`

### ⬜ 11. Admin (`/admin`)
File: `frontend/pages/admin.tsx`

### ⬜ 12. Terms (`/terms`)
File: `frontend/pages/terms.tsx`

### ⬜ 13. Privacy (`/privacy`)
File: `frontend/pages/privacy.tsx`

### ⬜ 14. Catalog Index (`/catalog`)
File: `frontend/pages/catalog/index.tsx`

### ⬜ 15. Catalog System (`/catalog/[system]`)
File: `frontend/pages/catalog/[system]/index.tsx`

### ⬜ 16. Catalog Subsystem (`/catalog/[system]/[subsystem]`)
File: `frontend/pages/catalog/[system]/[subsystem].tsx` (inside `[system]` folder)

### ⬜ 17. Product Detail (`/parts/[id]`)
File: `frontend/pages/parts/[id].tsx`

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `frontend/pages/index.tsx` | Homepage |
| `frontend/pages/_app.tsx` | App wrapper — handles which header/footer each page gets |
| `frontend/components/SiteHeader.tsx` | Header used on homepage + marketing pages |
| `frontend/components/SiteFooter.tsx` | Footer used on homepage + marketing pages |
| `frontend/components/Header.tsx` | Header used on shop/catalog/product pages |
| `frontend/components/Footer.tsx` | Footer used on shop/catalog/product pages |
| `frontend/components/VideoScrollSection.tsx` | Homepage video scroll animation |
| `frontend/components/ProductCard.tsx` | Product card used across shop/catalog/search |
| `frontend/components/FilterSidebar.tsx` | Sidebar filters on catalog subsystem pages |
| `frontend/components/VehicleSelectorModal.tsx` | Vehicle selection modal |
| `frontend/lib/AppContext.tsx` | Global state: cart, active vehicle, toasts, navigation |
| `frontend/lib/data/parts.ts` | All product data |
| `frontend/lib/data/categories.ts` | All category/catalog structure |
| `frontend/lib/data/vehicles.ts` | Vehicle database |
| `frontend/styles/globals.css` | All global styles, custom classes, animations |
| `frontend/next.config.js` | Static export config |
| `frontend/public/` | All static assets (images, videos, fonts) |

## Page Layout System (`_app.tsx`)
Pages are grouped into layout categories:
- **Self-contained** (`/`, `/mining`): manage their own `SiteHeader` + `SiteFooter` internally
- **Bare chrome** (`/admin`, `/signin`): no header/footer
- **Marketing** (`/divisions`, `/advantages`): `SiteHeader` + `SiteFooter`
- **Shop/catalog** (everything else): `Header` + `Footer` + `VehicleSelectorModal`

## Important Notes
- **Always run `npm run build` before pushing** — the site is static export, `out/` must be rebuilt
- **`.gitignore` has `*.mp4`** — use `git add -f` to force-add video files
- **Video files in `public/`**: `logistics-mobile.mp4` (mobile), `logistics-video-web.mp4` (desktop)
- The `glass` CSS class is a custom glassmorphism utility defined in `globals.css`
- Font is "Chopin Trial" loaded from `public/fonts/` — applied globally via `globals.css`
- All navigation uses `navigate()` from `useApp()` hook, not Next.js `<Link>` or `router.push`
