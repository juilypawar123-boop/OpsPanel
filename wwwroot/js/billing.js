
// === DOM References ===
const activePlansEl = document.getElementById("activePlans");
const revenueTodayEl = document.getElementById("revenueToday");
const pendingPaymentsEl = document.getElementById("pendingPayments");
const totalRevenueEl = document.getElementById("totalRevenue");

const billingTableBody = document.getElementById("billingTableBody");

const filterPlanType = document.getElementById("filterPlanType");
const filterPaymentStatus = document.getElementById("filterPaymentStatus");
const filterStartDate = document.getElementById("filterStartDate");
const filterEndDate = document.getElementById("filterEndDate");
const searchBilling = document.getElementById("searchBilling");

const addPlanBtn = document.getElementById("addPlanBtn");
const planModal = document.getElementById("planModal");
const planForm = document.getElementById("planForm");
const cancelPlanBtn = document.getElementById("cancelPlanBtn");

const defaultBillingData = {
    plans: [
        { name: "Basic", price: 10, duration: "1 month" },
        { name: "Premium", price: 30, duration: "1 month" }
    ],
    transactions: [
        { user: "JP", plan: "Basic", amount: 10, date: "2025-12-20", status: "Paid" },
        { user: "AL", plan: "Premium", amount: 30, date: "2025-12-20", status: "Pending" }
    ]
};

let billingData = JSON.parse(localStorage.getItem("billingData")) || defaultBillingData;
localStorage.setItem("billingData", JSON.stringify(billingData));
function saveBillingData() {
    localStorage.setItem("billingData", JSON.stringify(billingData));
}
function updateKPIs() {
    const today = new Date().toISOString().split("T")[0];
    activePlansEl.textContent = billingData.plans.length;
    revenueTodayEl.textContent = "€" + billingData.transactions
        .filter(t => t.date === today && t.status === "Paid")
        .reduce((sum, t) => sum + t.amount, 0);
    pendingPaymentsEl.textContent = billingData.transactions.filter(t => t.status === "Pending").length;
    totalRevenueEl.textContent = "€" + billingData.transactions
        .filter(t => t.status === "Paid")
        .reduce((sum, t) => sum + t.amount, 0);
}
function renderTransactions(transactions) {
    billingTableBody.innerHTML = "";
    if (!transactions || transactions.length === 0) {
        billingTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#6b7280;">No transactions found</td></tr>`;
        return;
    }

    transactions.forEach(tx => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${tx.user}</td>
            <td>${tx.plan}</td>
            <td>€${tx.amount}</td>
            <td>${tx.date}</td>
            <td>${tx.status}</td>
            <td>
                <button class="btn btn-primary" onclick="editTransaction('${tx.user}','${tx.date}','${tx.plan}')">Edit</button>
                <button class="btn btn-secondary" onclick="deleteTransaction('${tx.user}','${tx.date}','${tx.plan}')">Delete</button>
            </td>
        `;
        billingTableBody.appendChild(tr);
    });
}
function filterTransactions() {
    const searchText = searchBilling.value.toLowerCase();
    const planType = filterPlanType.value;
    const paymentStatus = filterPaymentStatus.value;
    const startDate = filterStartDate.value ? new Date(filterStartDate.value) : null;
    const endDate = filterEndDate.value ? new Date(filterEndDate.value) : null;

    const filtered = billingData.transactions.filter(tx => {
        const txDate = new Date(tx.date);
        return (!planType || tx.plan === planType) &&
            (!paymentStatus || tx.status === paymentStatus) &&
            (!startDate || txDate >= startDate) &&
            (!endDate || txDate <= endDate) &&
            (tx.user.toLowerCase().includes(searchText) || tx.plan.toLowerCase().includes(searchText));
    });

    renderTransactions(filtered);
}

addPlanBtn.addEventListener("click", () => {
    planModal.style.display = "block";
});

cancelPlanBtn.addEventListener("click", () => {
    planModal.style.display = "none";
    planForm.reset();
});

planForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("planName").value.trim();
    const price = parseFloat(document.getElementById("planPrice").value);
    const duration = document.getElementById("planDuration").value.trim();
    const today = new Date().toISOString().split("T")[0];

    if (!name || !price || !duration) return;

    billingData.plans.push({ name, price, duration });

    billingData.transactions.push({
        user: "Admin",        
        plan: name,
        amount: price,
        date: today,
        status: "Paid"        
    });

    saveBillingData();
    planModal.style.display = "none";
    planForm.reset();

    updateKPIs();
    filterTransactions();  
});

function deleteTransaction(user, date, plan) {
    if (!confirm("Delete this transaction?")) return;
    billingData.transactions = billingData.transactions.filter(tx => !(tx.user === user && tx.date === date && tx.plan === plan));
    saveBillingData();
    updateKPIs();
    filterTransactions();
}

function editTransaction(user, date, plan) {
    alert("Edit functionality can be implemented here for " + user + " / " + plan);
}

filterPlanType.addEventListener("change", filterTransactions);
filterPaymentStatus.addEventListener("change", filterTransactions);
filterStartDate.addEventListener("change", filterTransactions);
filterEndDate.addEventListener("change", filterTransactions);
searchBilling.addEventListener("input", filterTransactions);


document.addEventListener("DOMContentLoaded", () => {
    updateKPIs();
    renderTransactions(billingData.transactions);
});
