import { initIncludes } from "../src/utils/include.js";

import { initListingPage } from "../src/pages/listing.page.js";
import { initLoginPage } from "../src/pages/login.page.js";
import { initRegisterPage } from "../src/pages/register.page.js";
import { initProfilePage } from "../src/pages/profile.page.js";
import { initPropertyPage } from "../src/pages/property.page.js";

const ROUTES = {
  listing: initListingPage,
  login: initLoginPage,
  register: initRegisterPage,
  profile: initProfilePage,
  property: initPropertyPage,
};

document.addEventListener("DOMContentLoaded", () => {
  Promise.resolve(initIncludes?.())
    .catch((e) => console.warn("includes failed", e))
    .finally(() => {
      const page = document.body?.dataset?.page;

      const init = ROUTES[page];
      if (!init) {
        console.warn(`No init for data-page="${page}"`);
        return;
      }

      void init();
    });
});
