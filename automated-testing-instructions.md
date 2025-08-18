# Overview

This document describes the structure and purpose of automated tests for core diagram functionality: **Create**, **Edit**, and **View**.

Automated tests are executed on a dedicated test server as part of a daily regression suite.  
Each test run creates a separate Confluence space named in the format: `Regression Test Space: DD-MM-YYYY-1`

If the test run fails, a second space is created with suffix `-2` (e.g., `Regression Test Space: 15-07-2025-2`) and the tests are executed again.

- **If the tests pass** → The space is automatically deleted.
- **If any test fails** → A report is generated with the following details:
  - Total number of tests executed
  - Number of failed tests
  - Names of failed tests

Additionally, error notifications are sent to the appropriate recipients.

---

# Test Data

Test data is loaded from a dedicated folder in the project repository.  
Each test input consists of:

- **Descriptive test name** (e.g., _Mindmap test_, _OK_)
- **A unique ID** (integer), used to name the Confluence page
- **Field to be validated** — type (regex, HTML path, HTML tag, etc.) and value (string)
- **A PlantUML data string**, used to generate the diagram content

Data is stored in **JSON** format.

---

# Test Flow

1. **Login to Confluence**  
   The test framework authenticates with Confluence using API credentials to gain access to the testing environment.

2. **Create Regression Test Space**  
   A new Confluence space is created with a name in the format:  
   `Regression Test Space: DD-MM-YYYY-1`  
   If a retry is needed, the suffix `-2` is appended.

3. **Switch to the Test Space**  
   All page operations during the test run are scoped to this temporary test space.

4. **Create Diagram Pages**  
   For each test input:
   - A new page is created using the test ID as the title.
   - The corresponding PlantUML data is inserted.
   - The page is saved and rendered.
   - Diagram rendering or error message is validated.

5. **Run Positive Scenarios**  
   Valid PlantUML input is used to verify that diagrams render correctly.

6. **Run Negative Scenarios**  
   Invalid or malformed input is used to ensure that error messages are shown instead of diagrams.

7. **Cleanup and Reporting**
   - If all tests pass → The test space is deleted.
   - If failures occur:
     - A report is generated containing test counts and failed test names.
     - Notifications are sent to **support@stratus-addons.com**.

---

# Goals

The primary goals of this automated testing process are:

- To ensure stability of core diagram features each day
- To provide early feedback in case of regressions
- To maintain a high level of confidence before releasing to production
