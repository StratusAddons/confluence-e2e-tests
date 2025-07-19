Diagram Regression Tests

This repository contains an automated end-to-end (E2E) testing suite for the core diagram functionality of our Confluence Forge app, covering Create, Edit, and View scenarios. Tests are written in TypeScript using WebdriverIO and Mocha, and are designed to run daily against a dedicated Confluence test instance.

Note that the current setup was validated by exposing a local Forge tunnel via ngrok and generating PlantUML diagrams locally. Tests were executed with a personal Atlassian account; for stability and security, you should provision a dedicated service account with password-based (non-SSO) login.

Features
• Automated Space Management: Creates a new space per run (Regression Test Space: DD-MM-YYYY-1), retries with -2 suffix on failure, and deletes the space on success.
• Data-Driven Diagram Tests: Loads JSON test definitions (id, description, validation regex, PlantUML payload) and iterates through positive/negative scenarios.
• Synthetic E2E Flows: Uses WebdriverIO page objects to log in, create pages, insert /plant macro, validate rendering, and assert SVG content.
• Reporting & Screenshots: Captures pass/fail status, detailed error messages, and on-failure screenshots for debugging.

Tech Stack & Tools
• Node.js & TypeScript
• WebdriverIO (v8+) with Mocha framework and @wdio/spec reporter
• Chromedriver for local browser automation
• node-fetch for REST API calls (space provisioning & cleanup)
• ngrok + Forge Tunnel for local testing against a live Confluence instance
• PlantUML server (local) for diagram generation during tests

Getting Started 1. Clone this repo:

git clone https://github.com/StratusAddons/confluence-e2e-tests.git
cd confluence-e2e-tests

    2.	Install dependencies:

npm install

    3.	Configure environment: create a .env file in the root (based on env.example)

⚠️ Tests were originally run with a personal Google-SSO account; instead, use a non-SSO service account with 2FA disabled.

    4.	Start ngrok & Forge tunnel (if developing locally):

forge tunnel --port 8000 &
ngrok http 8000 --host-header=localhost

Configure your Confluence app’s callback URLs to the ngrok address.

    5.	Run tests:

npx wdio run wdio.conf.ts

Project Structure

├─ test/
│ ├─ pageobjects/ # WebdriverIO page object classes
│ ├─ specs/ # Mocha spec files (E2E flows)
│ └─ testdata/ # JSON inputs for diagram scenarios
├─ wdio.conf.ts # WebdriverIO configuration & hooks
├─ tsconfig.json # TypeScript compiler options
└─ package.json # dependencies & scripts
