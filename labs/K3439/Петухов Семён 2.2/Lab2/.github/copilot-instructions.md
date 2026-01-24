# FastRent Agent Instructions
## Overview
- Static Bootstrap 5 demo in index.html + sibling pages; JS lives in assets/js/main.js and runs in the browser only.
- No bundler/tests; open the HTML file (Live Server) after edits to validate.
- Language is RU by default; keep UI labels consistent unless a new locale feature is added.
## State & Data
- Sample listings sit in the PROPERTIES array (assets/js/main.js); objects need id, title, type, price, location, beds, baths, ownerId, status, images[], description, rentTerms.
- USERS is an in-memory array for demo auth; mutations only persist for current tab session, so code should not rely on server APIs.
- Auth state is saved under localStorage key rental_currentUser; always update via setCurrentUser/getCurrentUser helpers.
- Availability strings are normalized through statusText helper (available/rented); add new statuses there first.
## Page Wiring Pattern
- Every page loads main.js and tags <body data-page="..."> so DOMContentLoaded can route to initSearchPage/initDashboard/...; new pages must follow the same attribute convention.
- Shared navbar placeholder uses #nav-user; renderNavbar injects login/profile/exit buttons and binds #logoutBtn events.
- Booking modal markup (bookModal/bookForm/bookPropertyId) is duplicated across pages; initBooking assumes those IDs exist before attaching listeners.
- Bootstrap modals accessed via new bootstrap.Modal(...) rely on bundle JS CDN already included in each HTML file; never replace with ESM imports.
## Page-Specific Contracts
- Search page (index.html) must expose #propertiesContainer, #searchInput, #filterType, #filterLocation, #filterPrice, and #resultCount for initSearchPage filters.
- Dashboard needs #dashWelcome, #ownedList, #rentedList; removal buttons use .remove-btn with data-id attributes for stub alerts.
- Property detail expects query param id and DOM ids propTitle/propLocation/propPrice/propDesc/propTerms/propMeta plus #carouselInner, #bookPropBtn, #contactBtn.
- Profile page wiring covers profileName/profileEmail/profileUsername/profileLocation/profileAbout/profileAvatar, editProfileBtn, profileModal, and profileForm inputs.
- Messages page uses #conversations and #transactions containers; content is stubbed in initMessages.
## Styling
- Visual tokens live in assets/css/style.css (:root variables, card-custom, badge-ghost); reuse these classes before inventing new ones.
- Property cards depend on property-img/property-card-body styles for flex behavior; keep markup in renderProperties aligned with that structure.
- Dashboard/message lists rely on .list-item wrappers with image + flex columns; follow the same DOM order if adding new list types.
## Extending Functionality
- When adding filters or buttons, update renderProperties and related event binding blocks in one place to avoid duplicate listeners.
- Any new user fields should be saved both in localStorage user object and mirrored into USERS array inside handleRegisterForm/initProfile update logic.
- Keep demo alerts for destructive actions (booking delete, contact owner) unless replacing with a fuller flow; they signal UX expectations.
- External assets (Bootstrap CDN, Unsplash images) load over https; match that scheme to avoid mixed-content warnings.
