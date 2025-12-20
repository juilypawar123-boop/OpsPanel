document.addEventListener('DOMContentLoaded', () => {

    const logTableBody = document.getElementById("logTableBody");
    const alertList = document.getElementById("alertList");
    const startDateInput = document.getElementById("startDate");
    const endDateInput = document.getElementById("endDate");
    const userFilter = document.getElementById("userFilter");
    const moduleFilter = document.getElementById("moduleFilter");
    const searchBtn = document.getElementById("searchBtn");
    const exportBtn = document.getElementById("exportBtn");

    const defaultLogsData = {
        logs: [
            { timestamp: "2025-12-20 08:15", user: "JP", action: "Login", module: "Auth", ip: "192.168.0.1" },
            { timestamp: "2025-12-20 09:30", user: "AL", action: "Update Plan", module: "Billing", ip: "192.168.0.2" },
            { timestamp: "2025-12-20 10:00", user: "JP", action: "Viewed Logs", module: "Logs", ip: "192.168.0.1" },
            { timestamp: "2025-12-20 11:15", user: "AL", action: "Deleted User", module: "Users", ip: "192.168.0.2" }
        ],
        alerts: [
            { severity: "High", module: "Auth", message: "Multiple failed logins" },
            { severity: "Medium", module: "Billing", message: "Payment failed" },
            { severity: "Low", module: "Users", message: "New user created" }
        ]
    };

    let logsData = JSON.parse(localStorage.getItem("logsData"));
    if (!logsData) {
        logsData = defaultLogsData;
        localStorage.setItem("logsData", JSON.stringify(logsData));
    }

    function saveLogsData() {
        localStorage.setItem("logsData", JSON.stringify(logsData));
    }

    function renderLogsTable(logs) {
        if (!logTableBody) return;
        logTableBody.innerHTML = "";
        if (!logs || logs.length === 0) {
            logTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#6b7280;">No logs found</td></tr>`;
            return;
        }
        logs.forEach(log => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${log.timestamp}</td>
                <td>${log.user}</td>
                <td>${log.action}</td>
                <td>${log.module}</td>
                <td>${log.ip}</td>
            `;
            logTableBody.appendChild(tr);
        });
    }

    function renderAlerts(alerts) {
        if (!alertList) return;
        alertList.innerHTML = "";
        if (!alerts || alerts.length === 0) {
            alertList.innerHTML = `<p style="color:#6b7280;text-align:center;">No alerts</p>`;
            return;
        }
        alerts.forEach(alert => {
            const div = document.createElement("div");
            div.className = `alert ${alert.severity.toLowerCase()}`;
            div.innerHTML = `
                <span><strong>${alert.severity}</strong> | ${alert.module}: ${alert.message}</span>
                <span>
                    <button class="btn btn-secondary" onclick="acknowledgeAlert('${alert.message}')">Acknowledge</button>
                    <button class="btn btn-primary" onclick="investigateAlert('${alert.message}')">Investigate</button>
                </span>
            `;
            alertList.appendChild(div);
        });
    }

    window.acknowledgeAlert = message => alert(`Alert acknowledged: ${message}`);
    window.investigateAlert = message => alert(`Investigating alert: ${message}`);

    function filterLogs() {
        let filteredLogs = [...logsData.logs];

        const startDate = startDateInput.value ? new Date(startDateInput.value) : null;
        const endDate = endDateInput.value ? new Date(endDateInput.value) : null;
        const selectedUser = userFilter.value;
        const selectedModule = moduleFilter.value;

        filteredLogs = filteredLogs.filter(log => {
            const logDate = new Date(log.timestamp);
            const dateMatch = (!startDate || logDate >= startDate) && (!endDate || logDate <= endDate);
            const userMatch = !selectedUser || log.user === selectedUser;
            const moduleMatch = !selectedModule || log.module === selectedModule;
            return dateMatch && userMatch && moduleMatch;
        });

        renderLogsTable(filteredLogs);
    }

    if (searchBtn) searchBtn.addEventListener("click", filterLogs);
    if (startDateInput) startDateInput.addEventListener("change", filterLogs);
    if (endDateInput) endDateInput.addEventListener("change", filterLogs);
    if (userFilter) userFilter.addEventListener("change", filterLogs);
    if (moduleFilter) moduleFilter.addEventListener("change", filterLogs);

    function exportLogsToCSV() {
        if (!logsData.logs || logsData.logs.length === 0) return;
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Timestamp,User,Action,Module,IP\n";
        logsData.logs.forEach(log => {
            csvContent += `${log.timestamp},${log.user},${log.action},${log.module},${log.ip}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `logs_export_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    if (exportBtn) exportBtn.addEventListener("click", exportLogsToCSV);

    function populateFilters() {
        if (!userFilter || !moduleFilter) return;
        const users = [...new Set(logsData.logs.map(log => log.user))];
        const modules = [...new Set(logsData.logs.map(log => log.module))];
        userFilter.innerHTML = `<option value="">All Users</option>` + users.map(u => `<option value="${u}">${u}</option>`).join("");
        moduleFilter.innerHTML = `<option value="">All Modules</option>` + modules.map(m => `<option value="${m}">${m}</option>`).join("");
    }

    populateFilters();
    renderLogsTable(logsData.logs);
    renderAlerts(logsData.alerts);

});
