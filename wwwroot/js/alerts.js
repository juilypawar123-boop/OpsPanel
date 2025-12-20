/* =========================================================
   Notifications / Alerts JS (Card Layout, Persistent)
========================================================= */

const alertsContainer = document.getElementById("alertsContainer");
const severityFilter = document.getElementById("severityFilter");
const resolveAllBtn = document.getElementById("resolveAllBtn");

const totalAlertsEl = document.getElementById("totalAlerts");
const unackAlertsEl = document.getElementById("unackAlerts");
const highSeverityCountEl = document.getElementById("highSeverityCount");

let alerts = JSON.parse(localStorage.getItem("alertsData")) || [
    { severity: "High", module: "Billing", message: "Payment failed for JP", time: "2025-12-20 10:12", acknowledged: false },
    { severity: "Medium", module: "Users", message: "New user signup pending", time: "2025-12-20 09:45", acknowledged: false },
    { severity: "Low", module: "Logs", message: "Minor log error", time: "2025-12-19 18:30", acknowledged: false }
];

function saveAlerts() {
    localStorage.setItem("alertsData", JSON.stringify(alerts));
    updateKPIs();
}
function renderAlerts() {
    const filter = severityFilter.value;
    alertsContainer.innerHTML = "";

    const filteredAlerts = filter ? alerts.filter(a => a.severity === filter) : alerts;

    if (filteredAlerts.length === 0) {
        alertsContainer.innerHTML = `<p style="text-align:center;color:#6b7280;">No alerts found</p>`;
        return;
    }

    filteredAlerts.forEach((alert, index) => {
        const card = document.createElement("div");
        card.className = `alert-card alert-${alert.severity.toLowerCase()}`;

        card.innerHTML = `
            <h4>${alert.severity} - ${alert.module}</h4>
            <p>${alert.message}</p>
            <p><small>${alert.time}</small></p>
            <div class="alert-actions">
                ${alert.acknowledged ? "<span style='color:#6b7280;'>Acknowledged</span>" : `<button class="btn btn-primary" onclick="acknowledgeAlert(${index})">Acknowledge</button>`}
            </div>
        `;
        alertsContainer.appendChild(card);
    });
}

function acknowledgeAlert(index) {
    alerts[index].acknowledged = true;
    saveAlerts();
    renderAlerts();
}

resolveAllBtn.addEventListener("click", () => {
    if (!alerts.length) return;
    if (!confirm("Resolve all alerts?")) return;

    alerts = alerts.map(a => ({ ...a, acknowledged: true }));
    saveAlerts();
    renderAlerts();
});

severityFilter.addEventListener("change", renderAlerts);


function updateKPIs() {
    totalAlertsEl.textContent = alerts.length;
    unackAlertsEl.textContent = alerts.filter(a => !a.acknowledged).length;
    highSeverityCountEl.textContent = alerts.filter(a => a.severity === "High").length;
}

document.addEventListener("DOMContentLoaded", () => {
    updateKPIs();
    renderAlerts();
});
