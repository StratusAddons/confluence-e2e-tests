# Confluence guidance navigation and functionalites for testing app plugins

### Adding PlantUML Macro to Page

```
1. Navigate to test page
2. Click "Edit" button (pencil icon) to open page in edit mode
3. In page body (under title), type: /plant
4. Wait for popup with elements to appear
4a. if the popup does not appear, click on the plus sign (Insert elements /)
5. Click on "PlantUML Diagrams For Confluence"
6. Wait for fullscreen editor to load (this is the "macroEditor")
```

### Publishing Diagram

```
Prerequisites: Must be in macroEditor fullscreen mode

1. Enter PlantUML code from user example file
2. Press Ctrl+Enter (or Cmd+Enter) to generate and preview diagram
3. Wait for diagram to be genrated
3. Click "Publish" button in top-right corner
4. Enter diagram name (use same name as page title)
5. Click "Publish" in popup dialog
6. Wait for page to load showing published diagram
```

### Entering macrEditor

```
Prerequisites: Must be on page with published diagram

1. Click "Edit" button (pencil icon) on page top-right
2. Page opens in edit mode
3. Hover over diagram to reveal Confluence toolbar
4. Click pencil icon in Confluence toolbar (not app toolbar)
5. Wait for fullscreen macroEditor to load
```

### Analyzing Viewer

```
Prerequisites: Must be on page with published diagram

1. Locate published diagram on page
2. Hover over diagram to reveal toolbar
3. Verify 7 toolbar options are present:
   - Fullscreen
   - Reset viewer
   - Zoom out
   - Zoom in
   - Collapse
   - Expand
   - Copy diagram code
4. Verify diagram name appears on right side of toolbar
```
