import { loadData } from "./data.js";
import { setupEventListeners } from "./events.js";
import { toggleVisibility } from "./ui.js";


// Initializes the application when the page loads

window.onload = async () => {
    // Load JSON data and set up event handlers
    await loadData();
    setupEventListeners();
};