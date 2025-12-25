document.addEventListener('DOMContentLoaded', () => {
    
    let users = JSON.parse(localStorage.getItem('users')) || [
        { id: 1, name: 'Alice Smith', role: 'Admin', email: 'alice@example.com', lastLogin: '2025-12-19', status: 'Active' },
        { id: 2, name: 'Bob Johnson', role: 'Guest', email: 'bob@example.com', lastLogin: '2025-12-18', status: 'Inactive' },
        { id: 3, name: 'Charlie Lee', role: 'Admin', email: 'charlie@example.com', lastLogin: '2025-12-17', status: 'Suspended' }
    ];

    function saveUsers() {
        localStorage.setItem('users', JSON.stringify(users));
    }

    const usersTableBody = document.getElementById('userTableBody');
    const totalUsersEl = document.getElementById('totalUsers');
    const activeUsersEl = document.getElementById('activeUsers');
    const adminCountEl = document.getElementById('adminCount');
    const guestCountEl = document.getElementById('guestCount');

    const addUserBtn = document.getElementById('addUserBtn');
    const userModal = document.getElementById('userModal');
    const userForm = document.getElementById('userForm');
    const cancelUserBtn = document.getElementById('cancelUserBtn');
    const modalTitle = document.getElementById('modalTitle'); 

    const searchInput = document.getElementById('searchUser');
    const roleFilter = document.getElementById('roleFilter');
    const statusFilter = document.getElementById('statusFilter');

    let editingUserId = null;

    function renderTable(filteredUsers = users) {
        usersTableBody.innerHTML = '';
        if (!filteredUsers.length) {
            usersTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#6b7280;">No users found</td></tr>`;
            return;
        }

        filteredUsers.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.status}</td>
                <td>${user.lastLogin}</td>
                <td>
                    <button class="edit-btn btn btn-primary" data-id="${user.id}">Edit</button>
                    <button class="delete-btn btn btn-secondary" data-id="${user.id}">Delete</button>
                </td>
            `;
            usersTableBody.appendChild(tr);
        });

        updateKPIs();
    }

    function updateKPIs() {
        totalUsersEl.textContent = users.length;
        activeUsersEl.textContent = users.filter(u => u.status === 'Active').length;
        adminCountEl.textContent = users.filter(u => u.role === 'Admin').length;
        guestCountEl.textContent = users.filter(u => u.role === 'Guest').length;
    }

    addUserBtn.addEventListener('click', () => {
        editingUserId = null;
        if (modalTitle) modalTitle.textContent = 'Add User';
        userForm.reset();
        userModal.style.display = 'flex';
    });

    cancelUserBtn.addEventListener('click', () => userModal.style.display = 'none');
    window.addEventListener('click', e => {
        if (e.target === userModal) userModal.style.display = 'none';
    });

    userForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const role = document.getElementById('userRole').value;
        const status = document.getElementById('userStatus').value;
        const lastLogin = new Date().toISOString().split('T')[0];

        if (editingUserId) {
            users = users.map(u => u.id === editingUserId ? { ...u, name, email, role, status, lastLogin } : u);
        } else {
            users.push({ id: Date.now(), name, email, role, status, lastLogin });
        }

        saveUsers();
        renderTable();
        userForm.reset();
        userModal.style.display = 'none';
    });

    usersTableBody.addEventListener('click', e => {
        const id = parseInt(e.target.dataset.id);
        if (e.target.classList.contains('edit-btn')) {
            const user = users.find(u => u.id === id);
            editingUserId = id;
            document.getElementById('userName').value = user.name;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userRole').value = user.role;
            document.getElementById('userStatus').value = user.status;
            if (modalTitle) modalTitle.textContent = 'Edit User';
            userModal.style.display = 'flex';
        } else if (e.target.classList.contains('delete-btn')) {
            if (confirm('Are you sure you want to delete this user?')) {
                users = users.filter(u => u.id !== id);
                saveUsers();
                renderTable();
            }
        }
    });

    function applyFilters() {
        let filtered = [...users];
        if (roleFilter.value) filtered = filtered.filter(u => u.role === roleFilter.value);
        if (statusFilter.value) filtered = filtered.filter(u => u.status === statusFilter.value);
        if (searchInput.value.trim()) {
            const keyword = searchInput.value.toLowerCase();
            filtered = filtered.filter(u => u.name.toLowerCase().includes(keyword) || u.email.toLowerCase().includes(keyword));
        }
        renderTable(filtered);
    }

    roleFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', applyFilters);

    renderTable();
});

        filteredUsers.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.status}</td>
                <td>${user.lastLogin}</td>
                <td>
                    <button class="edit-btn btn btn-primary" data-id="${user.id}">Edit</button>
                    <button class="delete-btn btn btn-secondary" data-id="${user.id}">Delete</button>
                </td>
            `;
            usersTableBody.appendChild(tr);
        });

        updateKPIs();
    }

    function updateKPIs() {
        totalUsersEl.textContent = users.length;
        activeUsersEl.textContent = users.filter(u => u.status === 'Active').length;
        adminCountEl.textContent = users.filter(u => u.role === 'Admin').length;
        guestCountEl.textContent = users.filter(u => u.role === 'Guest').length;
    }

    addUserBtn.addEventListener('click', () => {
        editingUserId = null;
        if (modalTitle) modalTitle.textContent = 'Add User';
        userForm.reset();
        userModal.style.display = 'flex';
    });

    cancelUserBtn.addEventListener('click', () => userModal.style.display = 'none');
    window.addEventListener('click', e => {
        if (e.target === userModal) userModal.style.display = 'none';
    });

    userForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const role = document.getElementById('userRole').value;
        const status = document.getElementById('userStatus').value;
        const lastLogin = new Date().toISOString().split('T')[0];

        if (editingUserId) {
            users = users.map(u => u.id === editingUserId ? { ...u, name, email, role, status, lastLogin } : u);
        } else {
            users.push({ id: Date.now(), name, email, role, status, lastLogin });
        }

        saveUsers();
        renderTable();
        userForm.reset();
        userModal.style.display = 'none';
    });

    usersTableBody.addEventListener('click', e => {
        const id = parseInt(e.target.dataset.id);
        if (e.target.classList.contains('edit-btn')) {
            const user = users.find(u => u.id === id);
            editingUserId = id;
            document.getElementById('userName').value = user.name;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userRole').value = user.role;
            document.getElementById('userStatus').value = user.status;
            if (modalTitle) modalTitle.textContent = 'Edit User';
            userModal.style.display = 'flex';
        } else if (e.target.classList.contains('delete-btn')) {
            if (confirm('Are you sure you want to delete this user?')) {
                users = users.filter(u => u.id !== id);
                saveUsers();
                renderTable();
            }
        }
    });

    function applyFilters() {
        let filtered = [...users];
        if (roleFilter.value) filtered = filtered.filter(u => u.role === roleFilter.value);
        if (statusFilter.value) filtered = filtered.filter(u => u.status === statusFilter.value);
        if (searchInput.value.trim()) {
            const keyword = searchInput.value.toLowerCase();
            filtered = filtered.filter(u => u.name.toLowerCase().includes(keyword) || u.email.toLowerCase().includes(keyword));
        }
        renderTable(filtered);
    }

    roleFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', applyFilters);

    renderTable();
});
