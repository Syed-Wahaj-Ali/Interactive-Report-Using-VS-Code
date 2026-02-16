document.addEventListener('DOMContentLoaded', () => {
    loadData();
    // Initial calculation in case of empty state or fresh load
    calculateAll();
});

// --- State Management ---

function saveData() {
    const data = {
        header: {
            fundName: document.getElementById('fundName').value,
            accountNumber: document.getElementById('accountNumber').value,
            reportPeriod: document.getElementById('reportPeriod').value,
        },
        overview: getTableData('overviewTable'),
        holdings: getTableData('holdingsTable'),
        performance: {
            monthlyReturn: document.getElementById('monthlyReturn').value
        },
        cash: {
            startBalance: document.getElementById('startBalance').value,
            deposits: document.getElementById('deposits').value,
            withdrawals: document.getElementById('withdrawals').value,
        },
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('clientReportData', JSON.stringify(data));
}

function loadData() {
    const saved = localStorage.getItem('clientReportData');
    if (!saved) return;

    try {
        const data = JSON.parse(saved);

        // Header
        document.getElementById('fundName').value = data.header.fundName || '';
        document.getElementById('accountNumber').value = data.header.accountNumber || '';
        document.getElementById('reportPeriod').value = data.header.reportPeriod || '';

        // Overview Table
        if (data.overview && data.overview.length > 0) {
            const tbody = document.querySelector('#overviewTable tbody');
            tbody.innerHTML = ''; // Clear defaults
            data.overview.forEach(row => {
                addOverviewRow(row.cols[0], row.cols[1]); // Pass values
            });
        }

        // Holdings Table
        if (data.holdings && data.holdings.length > 0) {
            const tbody = document.querySelector('#holdingsTable tbody');
            tbody.innerHTML = '';
            data.holdings.forEach(row => {
                addHoldingRow(row.cols[0], row.cols[1], row.cols[2], row.cols[3]);
            });
        }

        // Performance
        document.getElementById('monthlyReturn').value = data.performance.monthlyReturn || 0;

        // Cash
        document.getElementById('startBalance').value = data.cash.startBalance || 0;
        document.getElementById('deposits').value = data.cash.deposits || 0;
        document.getElementById('withdrawals').value = data.cash.withdrawals || 0;

    } catch (e) {
        console.error("Error loading data", e);
    }
}

function resetData() {
    if (confirm("Are you sure you want to reset the report? This will clear all saved data.")) {
        localStorage.removeItem('clientReportData');
        location.reload();
    }
}

function getTableData(tableId) {
    const rows = document.querySelectorAll(`#${tableId} tbody tr`);
    const data = [];
    rows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        const cols = [];
        inputs.forEach(input => cols.push(input.value));
        data.push({ cols });
    });
    return data;
}

// --- Dynamic Rows ---

function addOverviewRow(type = '', value = 0) {
    const tbody = document.querySelector('#overviewTable tbody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" value="${type}" placeholder="Type"></td>
        <td><input type="number" class="market-value" value="${value}" oninput="calculateOverview()"></td>
        <td><span class="percent-assets">0%</span></td>
        <td class="no-print"><button class="btn-delete" onclick="deleteRow(this)">×</button></td>
    `;
    tbody.appendChild(tr);
    calculateOverview();
}

function addHoldingRow(symbol = '', name = '', qty = 0, price = 0) {
    const tbody = document.querySelector('#holdingsTable tbody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" value="${symbol}" placeholder="Symbol"></td>
        <td><input type="text" value="${name}" placeholder="Name"></td>
        <td><input type="number" class="qty" value="${qty}" oninput="calculateHoldings()"></td>
        <td><input type="number" class="price" value="${price}" oninput="calculateHoldings()"></td>
        <td><span class="holding-value">$0.00</span></td>
        <td class="no-print"><button class="btn-delete" onclick="deleteRow(this)">×</button></td>
    `;
    tbody.appendChild(tr);
    calculateHoldings();
}

function deleteRow(btn) {
    const row = btn.closest('tr');
    // Identify which table to recalculate
    const tableId = row.closest('table').id;
    row.remove();
    
    if (tableId === 'overviewTable') calculateOverview();
    if (tableId === 'holdingsTable') calculateHoldings();
}

// --- Calculations ---

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

function calculateAll() {
    calculateOverview();
    calculateHoldings();
    calculatePerformance();
    calculateCash();
    updateDate();
}

function calculateOverview() {
    const rows = document.querySelectorAll('#overviewTable tbody tr');
    let total = 0;

    // First pass: Calculate Total
    rows.forEach(row => {
        const valInput = row.querySelector('.market-value');
        const val = parseFloat(valInput.value) || 0;
        total += val;
    });

    document.getElementById('overviewTotalValue').textContent = formatter.format(total);

    // Second pass: Calculate Percentages
    rows.forEach(row => {
        const valInput = row.querySelector('.market-value');
        const percentSpan = row.querySelector('.percent-assets');
        const val = parseFloat(valInput.value) || 0;
        
        let percent = 0;
        if (total > 0) {
            percent = (val / total) * 100;
        }
        percentSpan.textContent = percent.toFixed(2) + '%';
    });

    saveData();
}

function calculateHoldings() {
    const rows = document.querySelectorAll('#holdingsTable tbody tr');
    let total = 0;

    rows.forEach(row => {
        const qty = parseFloat(row.querySelector('.qty').value) || 0;
        const price = parseFloat(row.querySelector('.price').value) || 0;
        const marketVal = qty * price;
        
        row.querySelector('.holding-value').textContent = formatter.format(marketVal);
        total += marketVal;
    });

    document.getElementById('holdingsTotalValue').textContent = formatter.format(total);
    saveData();
}

function calculatePerformance() {
    const monthlyReturn = parseFloat(document.getElementById('monthlyReturn').value) || 0;
    
    // Simple Annualization: ((1 + r)^12 - 1)
    // NOTE: In real finance, we'd take a series of monthly returns. 
    // Here we project the single monthly input.
    const decimalRate = monthlyReturn / 100;
    const annualized = (Math.pow(1 + decimalRate, 12) - 1) * 100;

    document.getElementById('ytdReturn').textContent = annualized.toFixed(2) + '%';
    saveData();
}

function calculateCash() {
    const start = parseFloat(document.getElementById('startBalance').value) || 0;
    const dep = parseFloat(document.getElementById('deposits').value) || 0;
    const withdr = parseFloat(document.getElementById('withdrawals').value) || 0;

    const end = start + dep - withdr;

    document.getElementById('endBalance').textContent = formatter.format(end);
    saveData();
}

function updateDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        dateElement.textContent = new Date().toLocaleDateString();
    }
}

// Global Listeners for simple inputs that don't need row-specific logic
// (delegation handles the table inputs, but we need these for header/cash/perf)
document.getElementById('fundName').addEventListener('input', saveData);
document.getElementById('accountNumber').addEventListener('input', saveData);
document.getElementById('reportPeriod').addEventListener('input', saveData);
