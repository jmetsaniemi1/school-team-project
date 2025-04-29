// Hae käyttäjän tiedot
const fetchUserData = async (token) => {
    try {
        console.log('[Vercel] Fetching user data');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/current`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error('[Vercel] Failed to fetch user data:', { status: response.status });
            throw new Error('Käyttäjän tietojen hakeminen epäonnistui');
        }

        const data = await response.json();
        console.log('[Vercel] User data fetched successfully');
        return data;
    } catch (error) {
        console.error('[Vercel] Error fetching user data:', { error: error.message, stack: error.stack });
        throw error;
    }
};

module.exports = { fetchUserData }; 