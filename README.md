# Diagram Regression Tests

This repository contains an automated end-to-end (E2E) testing suite for the core diagram functionality of our Confluence Forge app, covering Create, Edit, and View scenarios. Tests are written in TypeScript using WebdriverIO and Mocha, and are designed to run daily against a dedicated Confluence test instance. The suite:

- Logs in via UI
- Creates a fresh Confluence space per run (`Regression Test Space: DD-MM-YYYY-1`, with a `-2` retry suffix on failure)
- Iterates data-driven PlantUML tests (positive and negative cases)
- Inserts the `/plant` macro and validates SVG content
- Captures screenshots on failure and deletes the test space on success

> **Note:** This was initially validated by running a local Forge tunnel via **ngrok** and a local PlantUML server. Tests were executed with a personal Atlassian account; for reliability and security, you should provision a dedicated **service account** (non-SSO, password login, 2FA disabled) instead.

---

## Features

- **Automated Space Provisioning & Cleanup**
- **Data-Driven Diagram Scenarios** via JSON
- **Page-Object Pattern** for reusable UI interactions
- **Loading Indicators & iFrame Handling** (macro fullscreen)
- **Screenshot Capture** on failures

## Tech Stack & Tools

- **Node.js & TypeScript**
- **WebdriverIO** (v8+) + Mocha + spec reporter
- **Chromedriver** service
- **node-fetch** for Confluence REST API calls
- **ngrok** + `forge tunnel` for local testing
- **Local PlantUML server**

## Getting Started

1. **Clone**

   ```bash
   git clone https://github.com/StratusAddons/confluence-e2e-tests.git
   cd confluence-e2e-tests
   ```

2. **Install**

   ```bash
   npm install
   ```

3. **Configure**  
   Create a `.env` at project root:

   ```dotenv
   CONFLUENCE_BASE_URL=https://your-test-instance.atlassian.net
   CONFLUENCE_USER_EMAIL=svc-e2e@yourdomain.com
   CONFLUENCE_USER_PASSWORD=YourSecretPassword
   CONFLUENCE_API_TOKEN=your_api_token
   ```

   ⚠️ Use a **service account** instead of personal SSO.

4. **(Optional) Dev Tunnel**

   ```bash
   forge tunnel --port 8000 &
   ngrok http 8000 --host-header=localhost
   ```

   Point your app’s callback URLs to the ngrok address.

5. **Run Tests**
   ```bash
   npx wdio run wdio.conf.ts
   ```

## Project Structure

```
.
├── data.json            # Test definitions (id, description, validation, PlantUML)
├── package.json
├── tsconfig.json
├── wdio.conf.ts         # WDIO config & hooks (including space cleanup)
└── test/
    ├── pageobjects/     # Reusable UI page classes
    ├── specs/           # Mocha E2E spec files
    └── testdata/        # Additional JSON inputs
```
