# Interactive Financial Client Report

A fully editable, interactive, and print-ready financial report web application build with pure HTML, CSS, and Vanilla JavaScript.

## Features

- **Fully Editable Interface**: Click on any field (Fund Name, Account Number, Table Data) to edit directly.
- **Real-time Calculations**:
  - Updates **Market Value** automatically when Quantity or Unit Price changes.
  - Recalculates **% of Assets** dynamically based on total portfolio value.
  - Computes **YTD Performance** and **Cash Balance** instantly.
- **Dynamic Tables**: Add or remove rows in the Portfolio and Holdings sections easily.
- **Auto-Save**: Your data is automatically saved to the browser's LocalStorage, so you won't lose your work if you refresh or close the page.
- **PDF Export**: Built-in "Export to PDF" button that formats the report professionally for printing (A4 size).
- **Responsive Design**: Looks great on screens and paper.

## How to Run

There are two ways to run this application:

### Option 1: Direct File Opening (Simplest)
1. Navigate to the `interactive-client-report` folder on your computer.
2. Double-click the `index.html` file.
3. The report will open in your default web browser.

### Option 2: Using VS Code Live Server (Recommended)
If you are using Visual Studio Code:
1. Open the `interactive-client-report` folder in VS Code.
2. Install the **Live Server** extension (if not already installed).
3. Right-click on `index.html` and select **"Open with Live Server"**.
4. This will launch the application and auto-reload if you make any code changes.

## Usage Guide

1. **Editing Data**:
   - Click on any text or number field to edit it.
   - For numbers (e.g., Market Value, Price), simply type the new value and press Enter or click away to see calculations update.

2. **Adding/Removing Rows**:
   - Click **"+ Add Row"** to add a new empty row to a table.
   - Click the red **"×"** button at the end of a row to remove it.

3. **Exporting**:
   - Click the blue **"Export to PDF"** button at the top right.
   - The browser's print dialog will appear.
   - Choose "Save as PDF" to generate a clean, professional file.
   - *Note: The buttons will be hidden automatically in the PDF.*

4. **Resetting Data**:
   - To clear all your changes and return to the default sample data, click the **"Reset Report"** button.

## Project Structure

- `index.html`: The main structure and layout of the report.
- `style.css`: All styling, corporate theme, and print-specific rules.
- `script.js`: Logic for calculations, dynamic rows, and auto-saving data.
- `assets/`: Contains the logo and other static resources.
