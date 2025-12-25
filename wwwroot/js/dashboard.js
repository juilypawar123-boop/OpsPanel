
// === DOM References ===
const totalUsersEl = document.getElementById("totalUsers");
const activeSessionsEl = document.getElementById("activeSessions");
const transactionsTodayEl = document.getElementById("transactionsToday");
const errorsCountEl = document.getElementById("errorsCount");

const alertsTableBody = document.querySelector("#alertsTable tbody");

const clientSelect = document.getElementById("clientSelect");
const moduleSelect = document.getElementById("moduleSelect");
const timeRangeSelect = document.getElementById("timeRange");
const searchInput = document.getElementById("searchInput");

const activityChartCanvas = document.getElementById("activityChart");
const moduleUsageChartCanvas = document.getElementById("moduleUsageChart");

let activityChartInstance = null;
let moduleUsageChartInstance = null;

const defaultDashboardData = {
    users: 250,
    activeSessions: 67,
    transactions: 124,
    errors: 5,
    activityLogs: [
        { time: "08:00", actions: 15 },
        { time: "09:00", actions: 25 },
        { time: "10:00", actions: 30 },
        { time: "11:00", actions: 22 },
        { time: "12:00", actions: 18 }
    ],
    moduleUsage: [
        { module: "Users", count: 80 },
        { module: "Billing", count: 40 },
        { module: "Logs", count: 50 },
        { module: "Admin", count: 30 }
    ],
    alerts: [
        { date: "2025-12-20 09:15", severity: "High", module: "Auth", message: "Multiple failed logins" },
        { date: "2025-12-20 10:45", severity: "Medium", module: "Billing", message: "Payment failed" },
        { date: "2025-12-20 11:30", severity: "Low", module: "Users", message: "New user registered" }
    ]
};

let dashboardData = JSON.parse(localStorage.getItem("dashboardData")) || defaultDashboardData;

localStorage.setItem("dashboardData", JSON.stringify(dashboardData));
function saveDashboardData() {
    localStorage.setItem("dashboardData", JSON.stringify(dashboardData));
}

document.addEventListener("DOMContentLoaded", () => {
    updateKPIs();
    renderCharts();
    renderAlerts(dashboardData.alerts);
});
function updateKPIs() {
    totalUsersEl.textContent = dashboardData.users;
    activeSessionsEl.textContent = dashboardData.activeSessions;
    transactionsTodayEl.textContent = dashboardData.transactions;
    errorsCountEl.textContent = dashboardData.errors;
}
function renderCharts() {
    
    const labels = dashboardData.activityLogs.map(log => log.time);
    const data = dashboardData.activityLogs.map(log => log.actions);

    if (activityChartInstance) activityChartInstance.destroy();

    activityChartInstance = new Chart(activityChartCanvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "Actions per Hour",
                data: data,
                borderColor: "#2563eb",
                backgroundColor: "rgba(37, 99, 235, 0.2)",
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true } }
        }
    });

    const moduleLabels = dashboardData.moduleUsage.map(m => m.module);
    const moduleCounts = dashboardData.moduleUsage.map(m => m.count);

    if (moduleUsageChartInstance) moduleUsageChartInstance.destroy();

    moduleUsageChartInstance = new Chart(moduleUsageChartCanvas, {
        type: 'bar',
        data: {
            labels: moduleLabels,
            datasets: [{
                label: "Module Usage",
                data: moduleCounts,
                backgroundColor: ["#2563eb", "#f59e0b", "#10b981", "#ef4444"]
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } }
        }
    });
}
function renderAlerts(alerts) {
    alertsTableBody.innerHTML = "";
    if (!alerts || alerts.length === 0) {
        alertsTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#6b7280;">No alerts</td></tr>`;
        return;
    }

    alerts.forEach(alert => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${alert.date}</td>
            <td>${alert.severity}</td>
            <td>${alert.module}</td>
            <td>${alert.message}</td>
            <td>
                <button class="btn btn-secondary" onclick="acknowledgeAlert('${alert.date}')">Acknowledge</button>
                <button class="btn btn-primary" onclick="investigateAlert('${alert.date}')">Investigate</button>
            </td>
        `;
        alertsTableBody.appendChild(tr);
    });
}
function addAlert(alert) {
    dashboardData.alerts.push(alert);
    saveDashboardData();
    renderAlerts(dashboardData.alerts);
}

function acknowledgeAlert(date) {
    alert(`Alert on ${date} acknowledged.`);
}

function investigateAlert(date) {
    alert(`Investigating alert on ${date}.`);
}

function filterDashboard() {
    const searchText = searchInput.value.toLowerCase();
    const selectedClient = clientSelect.value;
    const selectedModule = moduleSelect.value;

    dashboardData = JSON.parse(localStorage.getItem("dashboardData")) || defaultDashboardData;

    const filteredAlerts = dashboardData.alerts.filter(alert => {
        const moduleMatch = selectedModule === "All Modules" || alert.module.toLowerCase().includes(selectedModule.toLowerCase());
        const textMatch = alert.message.toLowerCase().includes(searchText) || alert.module.toLowerCase().includes(searchText);
        return moduleMatch && textMatch;
    });

    renderAlerts(filteredAlerts);
}

searchInput.addEventListener("input", filterDashboard);
clientSelect.addEventListener("change", filterDashboard);
moduleSelect.addEventListener("change", filterDashboard);
timeRangeSelect.addEventListener("change", filterDashboard);
