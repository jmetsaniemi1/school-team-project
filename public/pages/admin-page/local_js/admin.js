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
                    <a class="dropdown-trigger btn blue lighten-1" href="#" data-target="action-dropdown-${user._id}" style="font-size:0.95em; padding:2px 8px; min-width:unset;">Toiminnot</a>
                    <ul id="action-dropdown-${user._id}" class="dropdown-content">
                        <li><a href="#!" class="ban-action" data-userid="${user._id}" data-duration="1h">Bannaa 1h</a></li>
                        <li><a href="#!" class="ban-action" data-userid="${user._id}" data-duration="3h">Bannaa 3h</a></li>
                        <li><a href="#!" class="ban-action" data-userid="${user._id}" data-duration="1d">Bannaa 1d</a></li>
                        <li><a href="#!" class="ban-action" data-userid="${user._id}" data-duration="1w">Bannaa 1w</a></li>
                        <li><a href="#!" class="ban-action" data-userid="${user._id}" data-duration="1m">Bannaa 1m</a></li>
                        <li><a href="#!" class="ban-action" data-userid="${user._id}" data-duration="forever">Bannaa ikuisesti luuseri mwhahahaha</a></li>
                        <li class="divider" tabindex="-1"></li>
                        <li><a href="#!" class="delete-action red-text" data-userid="${user._id}">Poista käyttäjä pysyvästi</a></li>
                    </ul>
                </td>
            `;
            userTableBody.appendChild(tr);
        });

        // Alusta Materialize-dropdownit
        const elems = document.querySelectorAll('.dropdown-trigger');
        M.Dropdown.init(elems, { constrainWidth: false });

        // Bannaus
        document.querySelectorAll('.ban-action').forEach(link => {
            link.addEventListener('click', async function(e) {
                e.preventDefault();
                const userId = this.dataset.userid;
                const duration = this.dataset.duration;
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
            });
        });

        // Poisto
        document.querySelectorAll('.delete-action').forEach(link => {
            link.addEventListener('click', async function(e) {
                e.preventDefault();
                const userId = this.dataset.userid;
                if (confirm('Haluatko varmasti poistaa käyttäjän pysyvästi?')) {
                    await fetch(`/api/users/delete/${userId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    M.toast({html: 'Käyttäjä poistettu pysyvästi!', classes: 'green'});
                    renderUserTable();
                }
            });
        });
    }

    renderUserTable();
});
