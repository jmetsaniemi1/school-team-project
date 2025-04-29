// Kirjaudu sisään
const loginUser = async (credentials) => {
    try {
        console.log('[Vercel] Login attempt:', { email: credentials.email });
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            console.error('[Vercel] Login failed:', { status: response.status });
            throw new Error('Kirjautuminen epäonnistui');
        }

        const data = await response.json();
        console.log('[Vercel] Login successful');
        return data;
    } catch (error) {
        console.error('[Vercel] Login error:', { error: error.message, stack: error.stack });
        throw error;
    }
};

// Rekisteröidy
const registerUser = async (userData) => {
    try {
        console.log('[Vercel] Registration attempt:', { email: userData.email });
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            console.error('[Vercel] Registration failed:', { status: response.status });
            throw new Error('Rekisteröityminen epäonnistui');
        }

        const data = await response.json();
        console.log('[Vercel] Registration successful');
        return data;
    } catch (error) {
        console.error('[Vercel] Registration error:', { error: error.message, stack: error.stack });
        throw error;
    }
};

// Palauta salasana
const resetPassword = async (email) => {
    try {
        console.log('[Vercel] Password reset attempt:', { email });
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            console.error('[Vercel] Password reset failed:', { status: response.status });
            throw new Error('Salasanan palautus epäonnistui');
        }

        const data = await response.json();
        console.log('[Vercel] Password reset successful');
        return data;
    } catch (error) {
        console.error('[Vercel] Password reset error:', { error: error.message, stack: error.stack });
        throw error;
    }
};

module.exports = { loginUser, registerUser, resetPassword };