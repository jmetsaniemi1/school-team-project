// Kirjaudu sisään
const loginUser = async (credentials) => {
    try {
        const response = await fetch('https://school-team-project.vercel.app/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            throw new Error('Kirjautuminen epäonnistui');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Virhe kirjautumisessa:', error);
        throw error;
    }
};

// Rekisteröidy
const registerUser = async (userData) => {
    try {
        const response = await fetch('https://school-team-project.vercel.app/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Rekisteröityminen epäonnistui');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Virhe rekisteröitymisessä:', error);
        throw error;
    }
};

// Palauta salasana
const resetPassword = async (email) => {
    try {
        const response = await fetch('https://school-team-project.vercel.app/api/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            throw new Error('Salasanan palautus epäonnistui');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Virhe salasanan palautuksessa:', error);
        throw error;
    }
};

module.exports = { loginUser, registerUser, resetPassword };