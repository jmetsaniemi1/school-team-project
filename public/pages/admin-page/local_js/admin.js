document.addEventListener('DOMContentLoaded', async function() {
    const userTableBody = document.querySelector('#user-table tbody');

    // Hae kaikki käyttäjät
    async function fetchUsers() {
        try {
            const token = localStorage.getItem('token');
            console.log("Token localStoragessa:", token);
            if (!token) {
                alert("Kirjaudu ensin sisään!");
                return [];
            }
            const res = await fetch('/api/users/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return await res.json();
        } catch (err) {
            console.error("Virhe käyttäjien haussa:", err);
            return [];
        }
    }

    // Renderöi käyttäjätaulukko
    async function renderUserTable() {
        const users = await fetchUsers();
        userTableBody.innerHTML = '';
        users.forEach(user => {
            const tr = document.createElement('tr');
            let banStatus = 'Ei banniä';
            if (user.banUntil && new Date(user.banUntil) > new Date()) {
                banStatus = 'Bannissa (' + new Date(user.banUntil).toLocaleDateString('fi-FI') + ')';
            }
            tr.innerHTML = `
                <td class="compact-cell">${user.username}</td>
                <td class="compact-cell">${user.email}</td>
                <td class="compact-cell">${user.registration_date ? new Date(user.registration_date).toLocaleDateString('fi-FI') : '-'}</td>
                <td class="compact-cell"><span class="grey-text">-</span></td>
                <td class="compact-cell">
                    <span style="font-size: 0.95em;">${banStatus}</span>
                </td>
                <td class="compact-cell">
                    <select class="action-select" data-userid="${user._id}" style="font-size:0.95em; padding:2px 4px; min-width:120px;">
                        <option value="">Toiminnot</option>
                        <option value="ban-1h">Bannaa 1h</option>
                        <option value="ban-3h">Bannaa 3h</option>
                        <option value="ban-1d">Bannaa 1d</option>
                        <option value="ban-1w">Bannaa 1w</option>
                        <option value="ban-1m">Bannaa 1m</option>
                        <option value="ban-forever">Bannaa ikuisesti</option>
                        <option value="delete">Poista käyttäjä pysyvästi</option>
                    </select>
                </td>
            `;
            userTableBody.appendChild(tr);
        });

        // Toiminnot-dropdown
        document.querySelectorAll('.action-select').forEach(select => {
            select.addEventListener('change', async function() {
                const userId = this.dataset.userid;
                const value = this.value;
                if (value.startsWith('ban-')) {
                    const duration = value.replace('ban-', '');
                    await fetch(`/api/users/ban/${userId}`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ duration })
                    });
                    M.toast({html: 'Banni asetettu!', classes: 'green'});
                    renderUserTable();
                } else if (value === 'delete') {
                    if (confirm('Haluatko varmasti poistaa käyttäjän pysyvästi?')) {
                        await fetch(`/api/users/delete/${userId}`, {
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                        });
                        M.toast({html: 'Käyttäjä poistettu pysyvästi!', classes: 'green'});
                        renderUserTable();
                    }
                }
                this.value = '';
            });
        });
    }

    renderUserTable();
});
