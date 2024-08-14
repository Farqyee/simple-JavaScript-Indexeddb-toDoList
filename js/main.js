"use strict";
//import modules
import { getData, openDatabase } from "./database.js";
import { initDOMEvents } from "./dom.js";
//Constant and global variable

//function

//1. Database Function

//3. Helper Function
// Function to show modal with animation

document.addEventListener("DOMContentLoaded", () => {
  openDatabase(getData);
  initDOMEvents();
});
