document.addEventListener('DOMContentLoaded', async function() {
    const userTableBody = document.querySelector('#user-table tbody');

    // Hae kaikki käyttäjät
    async function fetchUsers() {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/users/all', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await res.json();
    }

    // Hae aktiiviset tokenit
    async function fetchActiveTokens() {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/users/active-tokens', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await res.json(); // oletetaan [{userId: ..., active: true}, ...]
    }

    // Renderöi käyttäjätaulukko
    async function renderUserTable() {
        const users = await fetchUsers();
        const activeTokens = await fetchActiveTokens();
        userTableBody.innerHTML = '';
        users.forEach(user => {
            const isActive = activeTokens.some(t => t.userId === user._id && t.active);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${new Date(user.registration_date).toLocaleDateString('fi-FI')}</td>
                <td>${isActive ? '<span class="green-text">Kyllä</span>' : '<span class="red-text">Ei</span>'}</td>
                <td>
                    <select class="ban-select" data-userid="${user._id}">
                        <option value="">Ei banniä</option>
                        <option value="1h">1 tunti</option>
                        <option value="3h">3 tuntia</option>
                        <option value="1d">1 päivä</option>
                        <option value="1w">1 viikko</option>
                        <option value="1m">1 kuukausi</option>
                        <option value="forever">Ikuinen</option>
                    </select>
                </td>
                <td>
                    <button class="btn red delete-user-btn" data-userid="${user._id}">Poista</button>
                </td>
            `;
            userTableBody.appendChild(tr);
        });

        // Bannaus
        document.querySelectorAll('.ban-select').forEach(select => {
            select.addEventListener('change', async function() {
                const userId = this.dataset.userid;
                const banValue = this.value;
                if (banValue) {
                    await fetch(`/api/users/ban/${userId}`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ duration: banValue })
                    });
                    M.toast({html: 'Banni asetettu!', classes: 'green'});
                }
            });
        });

        // Poisto
        document.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const userId = this.dataset.userid;
                if (confirm('Haluatko varmasti poistaa käyttäjän?')) {
                    await fetch(`/api/users/delete/${userId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    M.toast({html: 'Käyttäjä poistettu!', classes: 'green'});
                    renderUserTable();
                }
            });
        });
    }

    renderUserTable();
});
