import Page from "./page";

export default class PagesPage extends Page {
  get pageTitle() {
    return $(
      'textbox[data-test-id="editor-title"], textarea[name="editpages-title"][placeholder="Give this page a title"]'
    );
  }

  get pageText() {
    return $('[role="textbox"], div[contenteditable="true"], textarea, [data-test-id="editor-content"]');
  }

  get insertElementsButton() {
    return $('button*=Insert elements');
  }

  get elementsSearchBox() {
    return $('combobox*=suggestions available');
  }

  get plantUmlMacro() {
    return $("button*=PlantUML Diagrams for Confluence");
  }

  get publishButton() {
    return $("button*=Publish...");
  }

  get confirmPublish() {
    return $("button*=Publish");
  }

  get editPageButton() {
    return $('a[id="editPageLink"]');
  }

  async setTitle(title: string) {
    await this.pageTitle.waitForExist({ timeout: 20000 });
    await this.pageTitle.setValue(title);
  }

  async createMacro() {
    // Wait for page to fully load using dynamic wait
    await browser.waitUntil(async () => {
      const readyStates = await browser.execute(() => document.readyState);
      return readyStates === 'complete';
    }, { timeout: 10000, timeoutMsg: 'Page did not load completely' });
    
    // Find any editable content area using multiple selectors
    const contentSelectors = [
      '[role="textbox"]',
      'div[contenteditable="true"]', 
      'textarea',
      '[data-test-id="editor-content"]',
      'p*=Type / to insert elements',
      '[aria-label*="content"]'
    ];
    
    let contentArea = null;
    for (const selector of contentSelectors) {
      try {
        contentArea = await $(selector);
        if (await contentArea.isExisting()) {
          console.log(`Found content area using selector: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`Selector ${selector} failed: ${e}`);
      }
    }
    
    if (!contentArea || !(await contentArea.isExisting())) {
      // Last resort - take a screenshot and try to find any clickable element
      await browser.saveScreenshot('./screenshots/debug-no-content-area.png');
      console.log('Could not find content area, saved debug screenshot');
      
      // Try clicking anywhere in the main content region
      contentArea = await $('main, [role="main"], .content, .editor');
      if (await contentArea.isExisting()) {
        console.log('Found main content region as fallback');
      } else {
        throw new Error('Could not find any content area to click');
      }
    }

    // Click in the content area and wait for focus
    await contentArea.click();
    await contentArea.waitForClickable({ timeout: 5000 });

    // Try typing /plant first
    await browser.keys(["/", "p", "l", "a", "n", "t"]);
    
    // Wait for PlantUML suggestion to appear
    await browser.waitUntil(async () => {
      return await this.plantUmlMacro.isExisting();
    }, { timeout: 5000, timeoutMsg: 'PlantUML macro option did not appear' }).catch(() => {
      console.log('PlantUML macro not found via /plant, will try Insert elements');
    });
    
    // Check if PlantUML option is visible, if not use Insert elements button approach
    if (!(await this.plantUmlMacro.isExisting())) {
      console.log("PlantUML not found via /plant, trying Insert elements button");
      
      // Clear the content and try insert elements button
      await contentArea.click();
      await browser.keys(['Control', 'a']); // Select all
      await browser.keys(['Delete']); // Delete content
      
      // Look for insert elements button with multiple selectors
      const insertBtnSelectors = [
        'button*=Insert elements',
        'button[aria-label*="Insert"]', 
        'button*=Insert',
        '[title*="Insert"]'
      ];
      
      let insertBtn = null;
      for (const selector of insertBtnSelectors) {
        try {
          insertBtn = await $(selector);
          if (await insertBtn.isExisting()) {
            console.log(`Found insert button using: ${selector}`);
            break;
          }
        } catch (e) {
          console.log(`Insert button selector ${selector} failed: ${e}`);
        }
      }
      
      if (insertBtn && (await insertBtn.isExisting())) {
        await this.click(insertBtn);
        
        await this.elementsSearchBox.waitForExist({ timeout: 5000 });
        await this.elementsSearchBox.setValue("plant");
        await browser.waitUntil(async () => {
          return await this.plantUmlMacro.isExisting();
        }, { timeout: 3000, timeoutMsg: 'PlantUML option did not appear in search' });
      } else {
        console.log("Could not find Insert elements button, taking screenshot");
        await browser.saveScreenshot('./screenshots/debug-no-insert-button.png');
      }
    }

    await this.plantUmlMacro.waitForExist({ timeout: 5000 });
    await this.plantUmlMacro.waitForClickable({ timeout: 5000 });
    await this.click(this.plantUmlMacro);
  }

  async confirmPublishedPage() {
    const alert = await $("div*=was successfully published");
    await alert.waitForExist({ timeout: 20000, interval: 100 });
    await alert.waitForDisplayed();
  }

  public async publish(title: string) {
    await this.setTitle(title);

    await this.click(this.publishButton);

    await this.confirmPublish.waitForExist();
    await browser.execute(() => {
      const btn = document.querySelector('button[id="publish-button"]');
      if (!btn) throw new Error("Publish button not found");
      (btn as HTMLElement).click();
    });

    await this.confirmPublishedPage();
  }

  public async openInEditMode() {
    await this.click(this.editPageButton);
  }

  async handlePlantUMLEditor(diagramCode: string, diagramName: string) {
    // Wait for iframe to load
    const macroFrame = await $("iframe");
    await macroFrame.waitForExist({ timeout: 10000 });
    
    // Switch to iframe
    await browser.switchFrame(macroFrame);

    // Handle "Visit Site" button if it exists (for local tunnel testing)
    const visitBtn = await $("button*=Visit Site");
    if (await visitBtn.isExisting()) {
      await visitBtn.click();
      // Wait for the editor to load dynamically
      await browser.waitUntil(async () => {
        const editorExists = await $('textarea, [role="textbox"]').isExisting();
        return editorExists;
      }, { timeout: 5000, timeoutMsg: 'Editor did not load after visiting site' });
    }

    // Find and fill the PlantUML editor textbox using the correct selector
    // Try multiple selectors based on Playwright exploration
    const editorSelectors = [
      'textbox[aria-label*="Editor content"]',
      'textarea[aria-label*="Editor content"]',
      '[aria-label*="Editor content"]',
      'textarea',
      '[role="textbox"]',
      'textbox'
    ];
    
    let editorFound = false;
    for (const selector of editorSelectors) {
      try {
        const editorElement = await $(selector);
        if (await editorElement.isExisting()) {
          console.log(`Found PlantUML editor using selector: ${selector}`);
          await editorElement.setValue(diagramCode);
          editorFound = true;
          break;
        }
      } catch (e) {
        console.log(`Selector ${selector} failed: ${e}`);
      }
    }
    
    if (!editorFound) {
      throw new Error('Could not find PlantUML editor textbox in iframe');
    }

    // Generate preview (Ctrl+Enter)
    await browser.keys(["Control", "Enter", "NULL"]);
    
    // Wait for diagram to render using smart waiting
    console.log('Waiting for diagram to render...');
    await browser.waitUntil(async () => {
      try {
        // Check for diagram elements that indicate rendering is complete
        const svgElements = await $$('svg');
        const imageElements = await $$('img');
        const canvasElements = await $$('canvas');
        
        // If any visual element is found, diagram is likely rendered
        const svgCount = svgElements.length;
        const imageCount = imageElements.length;
        const canvasCount = canvasElements.length;
        
        if (svgCount > 0 || imageCount > 0 || canvasCount > 0) {
          console.log('Diagram element detected');
          return true;
        }
        
        // Also check for any element that might contain rendered content
        const diagramContainers = await $$('[class*="diagram"], [id*="diagram"], [class*="plantuml"]');
        const containerCount = diagramContainers.length;
        if (containerCount > 0) {
          for (const container of diagramContainers) {
            const hasContent = await container.getText();
            if (hasContent && hasContent.trim().length > 0) {
              console.log('Diagram container with content found');
              return true;
            }
          }
        }
        
        return false;
      } catch (e) {
        return false;
      }
    }, { 
      timeout: 30000, 
      interval: 1000,
      timeoutMsg: 'Diagram did not render within 30 seconds' 
    }).catch(() => {
      console.log('Smart diagram wait failed, using fallback delay');
      // Fallback to shorter pause if smart waiting fails
      return browser.pause(5000);
    });
    console.log('Diagram rendering wait completed');

    // Click Publish button
    const publishDiagramButton = await $("button*=Publish");
    if (await publishDiagramButton.isExisting()) {
      await publishDiagramButton.waitForClickable({ timeout: 30000 });
      await publishDiagramButton.click();

      // Set diagram name if name dialog appears
      const diagramNameField = await $('input[name="fname"]');
      if (await diagramNameField.isExisting()) {
        await diagramNameField.setValue(diagramName);
        
        const publishDiagramButtonModal = await $('button[id="selectsaveAsPopup"]');
        if (await publishDiagramButtonModal.isExisting()) {
          await publishDiagramButtonModal.waitForClickable({ timeout: 10000 });
          await publishDiagramButtonModal.click();
        }
      }
    }

    // Wait for diagram publishing to complete using smart wait
    await browser.waitUntil(async () => {
      try {
        // Check if we're still in publish modal or if it's completed
        const publishBtn = await $('button*=Publish');
        const isStillPublishing = await publishBtn.isExisting();
        return !isStillPublishing; // Return true when publish button is gone
      } catch (e) {
        return true; // If we can't find the button, assume publishing is done
      }
    }, { timeout: 10000, interval: 500, timeoutMsg: 'Diagram publishing did not complete' }).catch(() => {
      console.log('Smart publish wait failed, using fallback delay');
      return browser.pause(2000);
    });

    // Switch back to parent frame
    await browser.switchFrame(null);
    
    console.log('PlantUML diagram creation completed');
  }
}
