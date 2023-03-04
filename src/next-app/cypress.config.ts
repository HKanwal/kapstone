import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://kapstone-ten.vercel.app',
  },
  viewportWidth: 414,
  viewportHeight: 896,
  env: {
    TESTMAIL_APIKEY: 'c3a5621d-f55b-4934-b6ae-47bbc0654055',
    TESTMAIL_NAMESPACE: 'dl4z5',
  },
});
