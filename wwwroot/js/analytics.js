

document.addEventListener("DOMContentLoaded", () => {

    // === DOM references ===
    const usersPerModuleCanvas = document.getElementById("usersPerModuleChart");
    const transactionsOverTimeCanvas = document.getElementById("transactionsOverTimeChart");
    const revenueByPlanCanvas = document.getElementById("revenueByPlanChart");

    if (!usersPerModuleCanvas || !transactionsOverTimeCanvas || !revenueByPlanCanvas) {
        console.error("Analytics charts canvas not found");
        return;
    }

    const usersPerModuleCtx = usersPerModuleCanvas.getContext("2d");
    const transactionsOverTimeCtx = transactionsOverTimeCanvas.getContext("2d");
    const revenueByPlanCtx = revenueByPlanCanvas.getContext("2d");

    const kpiTotalUsers = document.getElementById("kpiTotalUsers");
    const kpiTotalTransactions = document.getElementById("kpiTotalTransactions");
    const kpiTotalRevenue = document.getElementById("kpiTotalRevenue");

    const applyFiltersBtn = document.getElementById("applyFiltersBtn");

    let billingData = JSON.parse(localStorage.getItem("billingData")) || {
        plans: [],
        transactions: []
    };

    let usersPerModuleChart = null;
    let transactionsOverTimeChart = null;
    let revenueByPlanChart = null;

    function calculateKPIs(data) {
        const totalUsers = new Set(data.transactions.map(tx => tx.user)).size;
        const totalTransactions = data.transactions.length;
        const totalRevenue = data.transactions
            .filter(tx => tx.status === "Paid")
            .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

        kpiTotalUsers.textContent = totalUsers;
        kpiTotalTransactions.textContent = totalTransactions;
        kpiTotalRevenue.textContent = `€${totalRevenue}`;
    }

    function generateCharts(data) {

        if (usersPerModuleChart) usersPerModuleChart.destroy();
        if (transactionsOverTimeChart) transactionsOverTimeChart.destroy();
        if (revenueByPlanChart) revenueByPlanChart.destroy();

        const modules = [...new Set(data.transactions.map(tx => tx.plan))];
        const usersPerModule = modules.map(
            m => data.transactions.filter(tx => tx.plan === m).length
        );

        usersPerModuleChart = new Chart(usersPerModuleCtx, {
            type: "bar",
            data: {
                labels: modules,
                datasets: [{
                    label: "Users",
                    data: usersPerModule,
                    backgroundColor: "#007bff"
                }]
            },
            options: { responsive: true }
        });

        const dates = [...new Set(data.transactions.map(tx => tx.date))].sort();
        const txCountPerDate = dates.map(
            d => data.transactions.filter(tx => tx.date === d).length
        );

        transactionsOverTimeChart = new Chart(transactionsOverTimeCtx, {
            type: "line",
            data: {
                labels: dates,
                datasets: [{
                    label: "Transactions",
                    data: txCountPerDate,
                    borderColor: "#28a745",
                    fill: false
                }]
            },
            options: { responsive: true }
        });

        // Revenue by Plan
        const revenueByPlan = modules.map(m =>
            data.transactions
                .filter(tx => tx.plan === m && tx.status === "Paid")
                .reduce((sum, tx) => sum + Number(tx.amount || 0), 0)
        );

        revenueByPlanChart = new Chart(revenueByPlanCtx, {
            type: "pie",
            data: {
                labels: modules,
                datasets: [{
                    data: revenueByPlan,
                    backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"]
                }]
            },
            options: { responsive: true }
        });
    }

    applyFiltersBtn.addEventListener("click", () => {
        const startDateEl = document.getElementById("analyticsStartDate");
        const endDateEl = document.getElementById("analyticsEndDate");
        const filterModule = document.getElementById("filterModule").value;
        const filterTenant = document.getElementById("filterTenant").value;
        const filterPlan = document.getElementById("filterPlan").value;

        let filteredTx = [...billingData.transactions];

        if (startDateEl.value)
            filteredTx = filteredTx.filter(tx => new Date(tx.date) >= new Date(startDateEl.value));

        if (endDateEl.value)
            filteredTx = filteredTx.filter(tx => new Date(tx.date) <= new Date(endDateEl.value));

        if (filterModule)
            filteredTx = filteredTx.filter(tx => tx.module === filterModule);

        if (filterTenant)
            filteredTx = filteredTx.filter(tx => tx.tenant === filterTenant);

        if (filterPlan)
            filteredTx = filteredTx.filter(tx => tx.plan === filterPlan);

        const filteredData = {
            plans: billingData.plans,
            transactions: filteredTx
        };

        calculateKPIs(filteredData);
        generateCharts(filteredData);
    });

    calculateKPIs(billingData);
    generateCharts(billingData);
});
