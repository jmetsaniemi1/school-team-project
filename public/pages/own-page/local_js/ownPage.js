// Poistetaan require-komennot, koska ne eivät toimi selaimessa
document.addEventListener('DOMContentLoaded', function() {
    // Modaalin elementit
    const avatarModal = document.getElementById('avatar-selection-dialog');
    const editProfileModal = document.getElementById('edit-profile-dialog');
    const changePasswordModal = document.getElementById('change-password-dialog');
    const changeEmailModal = document.getElementById('change-email-dialog');
    const deleteProfileModal = document.getElementById('delete-profile-dialog');
    
    const changeAvatarBtn = document.getElementById('change-avatar-btn');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const changePasswordBtn = document.getElementById('change-password-btn');
    const changeEmailBtn = document.getElementById('change-email-btn');
    const deleteProfileBtn = document.getElementById('delete-profile-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    
    const saveAvatarBtn = document.getElementById('save-avatar-btn');
    const currentAvatar = document.getElementById('current-avatar');
    const avatarOptions = document.querySelectorAll('input[name="avatar"]');

    // Käyttäjän tiedot
    let currentUser = null;

    // Alusta Materialize-modaalit
    const avatarModalInstance = M.Modal.init(avatarModal);
    const editProfileModalInstance = M.Modal.init(editProfileModal);
    const changePasswordModalInstance = M.Modal.init(changePasswordModal);
    const changeEmailModalInstance = M.Modal.init(changeEmailModal);
    const deleteProfileModalInstance = M.Modal.init(deleteProfileModal);

    // Alusta dropdown-valikot
    const dropdowns = document.querySelectorAll('.dropdown-trigger');
    if (dropdowns.length > 0) {
        M.Dropdown.init(dropdowns, {
            constrainWidth: false,
            coverTrigger: false,
            hover: true
        });
    }

    // API endpoints
    const API_BASE_URL = '/api';
    const ENDPOINTS = {
        CURRENT_USER: `${API_BASE_URL}/users/profile`,
        UPDATE_USER: `${API_BASE_URL}/users/update`,
        DELETE_USER: `${API_BASE_URL}/users/delete`,
        LAST_VISITS: `${API_BASE_URL}/users/visits`
    };

    // Päivitä käyttöliittymä käyttäjän tiedoilla
    function updateUserInterface(userData) {
        if (!userData) return;
        
        console.log('Päivitetään käyttöliittymä:', userData);

        // Päivitä profiilitiedot
        document.getElementById('username-display').textContent = userData.username || 'Ei saatavilla';
        document.getElementById('email-display').textContent = userData.email || 'Ei saatavilla';
        
        // Muotoile päivämäärä suomalaiseen muotoon
        const registrationDate = userData.registration_date ? 
            new Date(userData.registration_date).toLocaleDateString('fi-FI', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric'
            }) : 'Ei saatavilla';
        
        document.getElementById('join-date').textContent = registrationDate;

        // Päivitä profiilikuva
        if (userData.avatar) {
            currentAvatar.src = userData.avatar;
        }

        // Päivitä viimeisimmät vierailut
        updateLastVisits(userData.lastVisits || []);
    }

    // Päivitä viimeisimmät vierailut
    function updateLastVisits(visits) {
        const recentVisitsContainer = document.querySelector('.recent-visits');
        if (!visits || visits.length === 0) {
            recentVisitsContainer.innerHTML = '<p class="center-align">Ei vielä vierailuja</p>';
            return;
        }

        const visitsList = visits.map(visit => {
            const date = new Date(visit.timestamp).toLocaleDateString('fi-FI', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            return `<div class="visit-item">
                        <span class="visit-date">${date}</span>
                        <span class="visit-page">${visit.page}</span>
                    </div>`;
        }).join('');

        recentVisitsContainer.innerHTML = `
            <div class="visits-list">
                ${visitsList}
            </div>
        `;
    }

    // Tallenna vierailu
    async function saveVisit() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(ENDPOINTS.LAST_VISITS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    page: 'Oma profiili',
                    timestamp: new Date()
                })
            });

            if (!response.ok) {
                throw new Error('Vierailun tallennus epäonnistui');
            }
        } catch (error) {
            console.error('Virhe vierailun tallennuksessa:', error);
        }
    }

    // Hae käyttäjän tiedot
    async function fetchUserData() {
        try {
            console.log('Haetaan käyttäjän tiedot...');
            const token = localStorage.getItem('token');
            
            if (!token) {
                console.error('Token puuttuu');
                window.location.href = '../../sign-in-page/sign.html';
                return;
            }

            console.log('Lähetetään pyyntö:', ENDPOINTS.CURRENT_USER);
            const response = await fetch(ENDPOINTS.CURRENT_USER, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            console.log('Vastaus saatu:', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries())
            });

            if (!response.ok) {
                if (response.status === 401) {
                    console.error('Käyttäjän autentikointi epäonnistui');
                    localStorage.removeItem('token');
                    window.location.href = '../../sign-in-page/sign.html';
                    return;
                }

                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.error('Virheellinen content-type:', contentType);
                throw new Error('Palvelimen vastaus ei ole JSON-muodossa');
            }

            let userData;
            const responseText = await response.text();
            console.log('Palvelimen vastaus:', responseText);

            try {
                userData = JSON.parse(responseText);
            } catch (parseError) {
                console.error('JSON-parsinnan virhe:', parseError);
                throw new Error('Palvelimen vastaus ei ole kelvollinen JSON-muoto');
            }

            if (!userData || typeof userData !== 'object') {
                console.error('Virheellinen vastausmuoto:', userData);
                throw new Error('Virheellinen vastausmuoto palvelimelta');
            }

            console.log('Käyttäjän tiedot haettu:', userData);
            currentUser = userData;
            updateUserInterface(userData);

            // Tallenna vierailu
            await saveVisit();

            return userData;
        } catch (error) {
            console.error('Virhe käyttäjän tietojen haussa:', error);
            M.toast({html: 'Virhe käyttäjän tietojen haussa: ' + error.message, classes: 'red'});
            if (error.message.includes('401')) {
                localStorage.removeItem('token');
                window.location.href = '../../sign-in-page/sign.html';
            }
        }
    }

    // Päivitä käyttäjän tiedot
    async function updateUserData(updateData) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(ENDPOINTS.UPDATE_USER, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedUser = await response.json();
            currentUser = updatedUser;
            updateUserInterface(updatedUser);
            return updatedUser;
        } catch (error) {
            console.error('Virhe päivityksessä:', error);
            throw error;
        }
    }

    // Sähköpostin vaihto
    async function changeEmail(newEmail) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(ENDPOINTS.UPDATE_USER, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email: newEmail })
            });

            if (!response.ok) {
                throw new Error('Sähköpostin vaihto epäonnistui');
            }

            M.toast({html: 'Sähköposti vaihdettu onnistuneesti', classes: 'green'});
            fetchUserData(); // Päivitä näyttö
        } catch (error) {
            console.error('Virhe sähköpostin vaihdossa:', error);
            M.toast({html: 'Virhe sähköpostin vaihdossa', classes: 'red'});
        }
    }

    // Poista profiili
    async function deleteProfile() {
        if (!confirm('Haluatko varmasti poistaa profiilisi? Tätä toimintoa ei voi perua.')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(ENDPOINTS.DELETE_USER, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Profiilin poisto epäonnistui');
            }

            localStorage.removeItem('token');
            window.location.href = '/public/index.html';
        } catch (error) {
            console.error('Virhe profiilin poistossa:', error);
            M.toast({html: 'Virhe profiilin poistossa', classes: 'red'});
        }
    }

    // Event listeners
    changeAvatarBtn?.addEventListener('click', () => avatarModalInstance.open());
    editProfileBtn?.addEventListener('click', () => editProfileModalInstance.open());
    changePasswordBtn?.addEventListener('click', () => changePasswordModalInstance.open());
    changeEmailBtn?.addEventListener('click', () => changeEmailModalInstance.open());
    deleteProfileBtn?.addEventListener('click', () => deleteProfileModalInstance.open());
    
    // Alusta sivu
    fetchUserData();
});