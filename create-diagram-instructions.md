# Test Name

**Create diagram**

# Test ID

**TST-001**

# Purpose

Verify that a user can successfully open PlantUML editor and create a diagram.

# Setup

At the beginning of every test case, the user is located in the current test space root.

## Steps

| Step | Description                                                                                    |
| ---- | ---------------------------------------------------------------------------------------------- |
| 1    | Create Page with the name `TST-001-x` where `x` is an integer representing the tested diagram. |
| 2    | Publish page                                                                                   |
| 3    | Verify that page exists                                                                        |
| 4    | Open page in edit mode                                                                         |

If setup has failed, create a special **"Setup failed"** report type.

---

# Test Steps

| Step | Action                                                                                                    | Expected Result                                                 |
| ---- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| 1    | Open PlantUML editor by typing `/plantumlcloud` on the test page and selecting the PlantUML macro option. | After menu option is selected, full screen editor is displayed. |
| 2    | Insert test diagram and simulate `Ctrl + Enter` to show preview.                                          | Diagram preview with correct element is shown.                  |
| 3    | Click on the publish button.                                                                              | Popup to name diagram is opened.                                |
| 4    | Enter diagram name: `TST-001-x` and click submit.                                                         | Editor is closed and diagram preview is visible on the page.    |

---

# Cleanup

| Step | Description                               |
| ---- | ----------------------------------------- |
| 1    | Publish page `TST-001-x` with the diagram |
| 2    | Go to Space root                          |

Leave published pages for manual verification if some of the tests failed.  
If all tests passed, delete the whole space.

---

# Notes

- This test is part of the nightly regression suite.
- Can be retried once on failure.
