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

    // API endpoints
    const API_BASE_URL = '/api';
    const ENDPOINTS = {
        CURRENT_USER: `${API_BASE_URL}/users/current`,
        UPDATE_USER: `${API_BASE_URL}/users/update`,
        DELETE_USER: `${API_BASE_URL}/users/delete`
    };

    // Päivitä käyttöliittymä käyttäjän tiedoilla
    function updateUserInterface(userData) {
        if (!userData) return;
        
        console.log('Päivitetään käyttöliittymä:', userData);

        // Päivitä profiilitiedot
        document.getElementById('username-display').textContent = userData.username || 'Ei saatavilla';
        document.getElementById('email-display').textContent = userData.email || 'Ei saatavilla';
        document.getElementById('join-date').textContent = userData.registration_date ? 
            new Date(userData.registration_date).toLocaleDateString('fi-FI') : 'Ei saatavilla';

        // Päivitä profiilikuva
        if (userData.avatar) {
            currentAvatar.src = userData.avatar;
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

            const response = await fetch(ENDPOINTS.CURRENT_USER, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const userData = await response.json();
            console.log('Käyttäjän tiedot haettu:', userData);
            currentUser = userData;
            updateUserInterface(userData);
            return userData;
        } catch (error) {
            console.error('Virhe käyttäjän tietojen haussa:', error);
            M.toast({html: 'Virhe käyttäjän tietojen haussa', classes: 'red'});
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

    // Event listeners
    saveAvatarBtn.addEventListener('click', async function() {
        const selectedAvatar = document.querySelector('input[name="avatar"]:checked');
        if (selectedAvatar) {
            try {
                await updateUserData({ avatar: selectedAvatar.value });
                avatarModalInstance.close();
                M.toast({html: 'Avatar päivitetty!', classes: 'green'});
            } catch (error) {
                M.toast({html: 'Virhe avatarin päivityksessä', classes: 'red'});
            }
        } else {
            M.toast({html: 'Valitse ensin avatar!', classes: 'red'});
        }
    });

    // Alusta sivu
    fetchUserData();
});

// Hae käyttäjän tiedot
const fetchUserData = async () => {
    try {
        const response = await fetch('/api/users/current', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Käyttäjän tietojen haku epäonnistui');
        }

        const userData = await response.json();
        updateProfileDisplay(userData);
    } catch (error) {
        console.error('Virhe käyttäjän tietojen haussa:', error);
        M.toast({html: 'Virhe käyttäjän tietojen haussa', classes: 'red'});
    }
};

// Päivitä profiilin näyttö
const updateProfileDisplay = (userData) => {
    document.getElementById('username-display').textContent = userData.username;
    document.getElementById('email-display').textContent = userData.email;
    document.getElementById('join-date').textContent = new Date(userData.registration_date).toLocaleDateString('fi-FI');
    if (userData.avatar) {
        document.getElementById('current-avatar').src = userData.avatar;
    }
};

// Vaihda salasana
const changePassword = async (newPassword) => {
    try {
        const response = await fetch('/api/users/current', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ password: newPassword })
        });

        if (!response.ok) {
            throw new Error('Salasanan vaihto epäonnistui');
        }

        M.toast({html: 'Salasana vaihdettu onnistuneesti', classes: 'green'});
    } catch (error) {
        console.error('Virhe salasanan vaihdossa:', error);
        M.toast({html: 'Virhe salasanan vaihdossa', classes: 'red'});
    }
};

// Vaihda sähköposti
const changeEmail = async (newEmail) => {
    try {
        const response = await fetch('/api/users/current', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
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
};

// Poista profiili
const deleteProfile = async () => {
    if (!confirm('Haluatko varmasti poistaa profiilisi? Tätä toimintoa ei voi perua.')) {
        return;
    }

    try {
        const response = await fetch('/api/users/current', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
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
};

// Tapahtumankäsittelijät
document.addEventListener('DOMContentLoaded', () => {
    // Hae käyttäjän tiedot sivun latautuessa
    fetchUserData();

    // Profiilin muokkaus -modaali
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const editProfileDialog = document.getElementById('edit-profile-dialog');
    M.Modal.init(editProfileDialog);

    editProfileBtn.addEventListener('click', () => {
        const modal = M.Modal.getInstance(editProfileDialog);
        modal.open();
    });

    // Salasanan vaihto
    const changePasswordForm = document.getElementById('change-password-form');
    changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-new-password').value;

        if (newPassword !== confirmPassword) {
            M.toast({html: 'Salasanat eivät täsmää', classes: 'red'});
            return;
        }

        await changePassword(newPassword);
        const modal = M.Modal.getInstance(document.getElementById('change-password-dialog'));
        modal.close();
        changePasswordForm.reset();
    });

    // Sähköpostin vaihto
    const changeEmailBtn = document.getElementById('change-email-btn');
    changeEmailBtn.addEventListener('click', () => {
        const newEmail = prompt('Syötä uusi sähköpostiosoite:');
        if (newEmail) {
            changeEmail(newEmail);
        }
    });

    // Profiilin poisto
    const deleteProfileBtn = document.getElementById('delete-profile-btn');
    deleteProfileBtn.addEventListener('click', deleteProfile);
}); 