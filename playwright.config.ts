import type {PlaywrightTestConfig} from "@playwright/test";

const config: PlaywrightTestConfig = {
    webServer: {
        command: "npm run build:app && npm run preview:app",
        port: 4173,
    },
};

export default config;
