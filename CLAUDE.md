# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Running Tests

```bash
# Run the full E2E test suite
npx wdio run wdio.conf.ts

# Alternative using the npm script
npm run wdio
```

### Development

```bash
# Install dependencies
npm install

# TypeScript compilation check
npx tsc --noEmit
```

## Environment Setup

Tests require a `.env` file in the project root with:

```
CONFLUENCE_BASE_URL=https://your-test-instance.atlassian.net
CONFLUENCE_USER_EMAIL=svc-e2e@yourdomain.com
CONFLUENCE_USER_PASSWORD=YourSecretPassword
CONFLUENCE_API_TOKEN=your_api_token
```

**SERVICE ACCOUT IS NOT SET UP YET, USE ACC FROM .env**
Use a dedicated service account (non-SSO, password login, 2FA disabled) for reliability.
**SERVICE ACCOUT IS NOT SET UP YET, USE ACC FROM .env**

## Architecture & Test Flow

This is a **WebdriverIO + Mocha** E2E test suite for Confluence PlantUML diagram functionality. The test architecture follows the **Page Object Model**:

### Key Components

1. **Page Objects** (`test/pageobjects/`)
   - `page.ts` - Base page class with common WebDriver utilities
   - `login.page.ts` - Handles Atlassian ID login flow
   - `space.page.ts` - Space creation and navigation (exports singleton `Space`)
   - `pages.page.ts` - Page creation, macro insertion, and publishing

2. **Test Data** (`test/data.json`)
   - Array of test cases with `id`, `description`, `validation`, and `diagram` fields
   - Each test creates a PlantUML diagram and validates SVG content

3. **Test Flow** (`test/specs/create.e2e.ts`)
   - **Setup**: Login → Create dated space (`Regression Test Space: DD-MM-YYYY-{attempt}`)
   - **For each test**: Create page → Insert `/plant` macro → Input PlantUML → Validate SVG → Publish
   - **Cleanup**: Space deletion handled via REST API in `wdio.conf.ts` onPrepare hook

### WebDriverIO Configuration

- **Framework**: Mocha with 30-minute timeout for slow Confluence interactions
- **Browser**: Chrome with chromedriver service
- **Reporters**: Spec reporter (Allure available but commented out)
- **Screenshots**: Automatically captured on test failures via `afterTest` hook
- **Cleanup**: Pre-test space deletion via Confluence REST API to prevent conflicts

### Test Execution Details

- Tests create iframe-based macro interactions requiring frame switching
- PlantUML content validation happens within the macro's SVG output
- Page publishing flow includes modal interactions and navigation back to space
- Robust login detection with multiple selector fallbacks for different Confluence versions

## Important Notes

- Tests are designed for daily regression against a dedicated Confluence test instance
- Space cleanup occurs before tests (in `onPrepare`) to handle previous run artifacts
- The codebase includes "Visit Site" button clicking for local tunnel testing scenarios
- Screenshot capture path: `./screenshots/test-{id}-browser.png`

# Your Goal

- Your goal is to write a wdio test that will automatically test the Plantuml diagrams.
- Use the Playwright MCP agent to find the appropriate selectors for the e2e test creation.

## Overview

- You will be given instructions of how to write the tests
- There already is the implementation of the test in the /test folder. It is not finished. See if you can re-use that, if the code and the structure is bad create everything from scratch.

## Steps

### 1. Read the documentation

- READ the automated-testing-instructions.md
- READ the create-diagram-instructions.md
- READ the confluence-guidance.md
- READ the todo-plan.md

### 2. Use the Playwright MCP

- Use the Playwright MCP to traverse through the Confluence
- Find what you need to click and where you need to navigate to test the appropriate functionalites.
- Make a list of all selectors you used - these should be used for the WDIO e2e test implementation.
- See how we can bypass any unwanted notifications, popups and other unexpected events to prevent e2e test from failing

### 3. Implement the WDIO e2e test

- You should work feature by feature
- Split the job into multiple task
- Test whether you implemented that task succesfully using command - npx wdio run wdio.conf.ts
- IF the npx wdio run wdio.conf.ts failed, check why and fix it
- IF the npx wdio run wdio.conf.ts succeded, continue working on the e2e test
- Research what is the best approach of writing the WDIO e2e test and stick to that principles
- Use the data.json for diagram data

### 4. Keep track of the progress

- Track all your progress, task and errors in todo-plan.md
- Keep this file up to date
- Be sure to update it with every new finding, error, bug, progress, fix etc...
- Your process should be cyclical
- Keep track of every task and flow you implemented, which one passed which on failed, which one needs updates

### 5.Important notes

- Plantuml plugin should already be installed on https://stratus-int-test.atlassian.net, IF its not report back and stop the process

## Workflow example

**Space creation task**

**ALWAYS FOLLOW THE GUIDANCE INSTRUCTIONS**

1. Use MCP playwright to create a space on the confluence
2. Make sure there are no errors, and space is created with specific instructed you were told
3. Make a list of all the steps you needed to do that (clicks, selectors, awaiting, navigation etc...)
4. Implement that exact flow using wdio
5. Test the flow by running npx wdio run wdio.conf.ts
6. IF there are NO errors
   - verify that you followed instructions and everything was created according to guide
   - continue to the next task

   IF there ARE errors
   - find any logs or what is not working
   - understand what needs to be fixed
   - implement the fix
   - test the flow again by running npx wdio run wdio.conf.ts

   additional note - use the Playwright again to replicate the flow to understand the issue better.

**MAKE SURE YOU TRACK THE PROGRESS AND DOCUMENT EVERYTHING IN todo-plan.md**
**BEFORE STARTING ANY WORK READ THE todo-plan.md**
**IF IT DOES NOT EXIST CREATE IT**
