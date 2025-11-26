# FastRent Agent Instructions
## Environment
- Run `npx json-server --watch db.json --port 3001` from `homeworks/HW2` before opening the UI; everything in `assets/js/main.js` assumes `http://localhost:3001` is live.
- Pages are plain HTML + Bootstrap CDN; use Live Server or double-click `index.html` to test. There is no bundler, unit test runner, or module system.
- Axios is pulled from CDN and wrapped in the shared `api` instance; prefer that over new fetch clients.
## App Structure
- Each HTML file sets `<body data-page="...">`; `DOMContentLoaded` in `assets/js/main.js` routes to `initSearchPage`, `initDashboard`, `initProfile`, `initPropertyPage`, or `initMessages` plus common hooks (`renderNavbar`, `handleLoginForm`, etc.).
- Shared UI fragments: navbar placeholder `#nav-user`, booking modal IDs (`bookModal`, `bookForm`, `bookPropertyId`), and `.list-item` layout blocks. New pages must replicate these IDs if they expect shared logic to attach.
- Styling tokens live in `assets/css/style.css` (`:root` variables, `.card-custom`, `.badge-ghost`, `.property-img`); extend these before adding ad-hoc inline styles.
## Data & State
- JSON-server exposes `/advertisement`, `/users`, `/conversations`, `/transactions` from `db.json`. Listings need `{id,title,type,price,location,beds,baths,ownerId,status,images[],description,rentTerms}`; mock chats and payments follow the same shape as in `db.json`.
- `advertisementCache` plus `conversationsCache`/`transactionsCache` memoize server payloads; call `fetchAdvertisement(forceRefresh=true)` or clear specific entries (e.g., `removeAdvertisementFromCache`) when mutating data.
- Helpers `normalizeId`, `withStringId`, and `normalizeAdv/Conversation/Transaction` enforce string IDs. Use them whenever accepting user input or API results to keep lookups consistent.
- Auth state persists only in `localStorage` under `rental_currentUser` (`getCurrentUser`/`setCurrentUser`); server passwords stay in plain `db.json`, so avoid introducing server-only session concepts.
## Page Contracts
- **Search (`index.html`)** requires `#propertiesContainer`, `#searchInput`, `#filterType`, `#filterLocation`, `#filterPrice`, `#priceLabel`, and `#resultCount`. Filters mutate an in-memory copy of `fetchAdvertisement()` results; update this function if new filters are added so bindings stay centralized.
- **Dashboard (`dashboard.html`)** expects `#dashWelcome`, `#ownedList`, `#rentedList`. Owner actions call `deleteAdvertisement` and rely on `confirm`/`alert` UX—preserve those cues unless replacing the whole flow.
- **Property detail (`property.html`)** reads `id` from the query string, fills `propTitle/propLocation/propPrice/propDesc/propTerms/propMeta`, builds carousel slides inside `#carouselInner`, and wires `#bookPropBtn` + `#contactBtn`.
- **Profile (`profile.html`)** binds `profileName/profileEmail/profileUsername/profileLocation/profileAbout/profileAvatar`, `editProfileBtn`, `profileModal`, and `profileForm`. The form `submit` issues `updateUser` then mirrors the response back to DOM + `localStorage`.
- **Messages (`messages.html`)** renders stub data into `#conversations` and `#transactions` using the `.list-item` markup shared with the dashboard.
## Interaction Patterns
- `renderAdvertisements` in `assets/js/main.js` is the single source for property card markup (view + booking buttons). When adding card actions, hook them here so every page inherits the change.
- Booking flow: clicking `.book-btn` or `#bookPropBtn` populates `bookPropertyId` and opens the Bootstrap modal created via `new bootstrap.Modal(...)`. Keep these IDs untouched or update both `initBooking` and property detail wiring together.
- Navigation state is injected by `renderNavbar()` into `#nav-user`, showing profile/dashboard buttons for logged-in users and binding `#logoutBtn`. Any navbar redesign should retain this placeholder.
- Error handling is intentionally noisy (`alert()` inside `handleApiError`) to surface missing mock API issues quickly. Wrap new API calls with the same helper to stay consistent.
## Extending Functionality
- New listing/user fields must be supported in both `db.json` and the corresponding `createUser`/`updateUser`/`fetchAdvertisement` flows; always normalize IDs before comparing owners or tenants.
- When introducing new statuses, add them to `statusText` so user-facing labels stay localized.
- External media and CDN links should stay HTTPS to avoid mixed-content warnings noted in existing cards and modals.
