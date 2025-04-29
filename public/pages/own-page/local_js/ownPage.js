// Importataan tietokantaoperaatiot
const { fetchUserData } = require('../../database/methods/ownPage/GET');
const { updateUserData } = require('../../database/methods/ownPage/PUT');
const { deleteUser } = require('../../database/methods/ownPage/DELETE');

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

    // Päivitä käyttöliittymä käyttäjän tiedoilla
    function updateUserInterface() {
        if (!currentUser) return;

        // Päivitä profiilitiedot
        document.getElementById('username-display').textContent = currentUser.username;
        document.getElementById('email-display').textContent = currentUser.email;
        document.getElementById('join-date').textContent = new Date(currentUser.registration_date).toLocaleDateString('fi-FI');

        // Päivitä profiilikuva
        if (currentUser.avatar) {
            currentAvatar.src = currentUser.avatar;
        }

        // Päivitä modaalien kentät
        document.getElementById('edit-username').value = currentUser.username;
        document.getElementById('edit-email').value = currentUser.email;
    }

    // Avaa avatar-modaali
    changeAvatarBtn.addEventListener('click', function(e) {
        e.preventDefault();
        avatarModalInstance.open();
    });

    // Avaa profiilin asetukset -modaali
    editProfileBtn.addEventListener('click', function(e) {
        e.preventDefault();
        editProfileModalInstance.open();
    });

    // Avaa salasanan vaihto -modaali
    changePasswordBtn.addEventListener('click', function() {
        editProfileModalInstance.close();
        changePasswordModalInstance.open();
    });

    // Avaa sähköpostin vaihto -modaali
    changeEmailBtn.addEventListener('click', function() {
        editProfileModalInstance.close();
        changeEmailModalInstance.open();
    });

    // Avaa profiilin poisto -modaali
    deleteProfileBtn.addEventListener('click', function() {
        editProfileModalInstance.close();
        deleteProfileModalInstance.open();
    });

    // Tallenna valittu avatar
    saveAvatarBtn.addEventListener('click', async function() {
        const selectedAvatar = document.querySelector('input[name="avatar"]:checked');
        if (selectedAvatar) {
            try {
                await updateUserData(currentUser._id, localStorage.getItem('token'), {
                    avatar: selectedAvatar.value
                });

                currentAvatar.src = selectedAvatar.value;
                avatarModalInstance.close();
                M.toast({html: 'Avatar päivitetty!'});
            } catch (error) {
                M.toast({html: 'Virhe avatarin päivityksessä'});
            }
        } else {
            M.toast({html: 'Valitse ensin avatar!'});
        }
    });

    // Valitse avatar klikkaamalla kuvaa
    document.querySelectorAll('.avatar-option img').forEach(img => {
        img.addEventListener('click', function() {
            const radio = this.previousElementSibling;
            radio.checked = true;
        });
    });

    // Tallenna uusi salasana
    document.getElementById('change-password-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-new-password').value;

        if (newPassword !== confirmPassword) {
            M.toast({html: 'Salasanat eivät täsmää!'});
            return;
        }

        try {
            await updateUserData(currentUser._id, localStorage.getItem('token'), {
                password: newPassword
            });

            changePasswordModalInstance.close();
            M.toast({html: 'Salasana vaihdettu!'});
        } catch (error) {
            M.toast({html: 'Virhe salasanan päivityksessä'});
        }
    });

    // Tallenna uusi sähköposti
    document.getElementById('change-email-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const newEmail = document.getElementById('new-email').value;
        const confirmEmail = document.getElementById('confirm-new-email').value;

        if (newEmail !== confirmEmail) {
            M.toast({html: 'Sähköpostiosoitteet eivät täsmää!'});
            return;
        }

        try {
            await updateUserData(currentUser._id, localStorage.getItem('token'), {
                email: newEmail
            });

            currentUser.email = newEmail;
            document.getElementById('email-display').textContent = newEmail;
            changeEmailModalInstance.close();
            M.toast({html: 'Sähköposti vaihdettu!'});
        } catch (error) {
            M.toast({html: 'Virhe sähköpostin päivityksessä'});
        }
    });

    // Vahvista profiilin poisto
    confirmDeleteBtn.addEventListener('click', async function() {
        try {
            await deleteUser(currentUser._id, localStorage.getItem('token'));

            deleteProfileModalInstance.close();
            M.toast({html: 'Profiili poistettu!'});
            
            // Poista token ja ohjaa kirjautumissivulle
            localStorage.removeItem('token');
            setTimeout(() => {
                window.location.href = '/public/index.html';
            }, 2000);
        } catch (error) {
            M.toast({html: 'Virhe profiilin poistossa'});
        }
    });

    // Tarkista kirjautuminen ja hae käyttäjän tiedot
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../sign.html';
    } else {
        fetchUserData(token)
            .then(user => {
                currentUser = user;
                updateUserInterface();
            })
            .catch(error => {
                M.toast({html: 'Virhe käyttäjän tietojen haussa'});
            });
    }
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