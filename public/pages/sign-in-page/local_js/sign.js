// MODAALIT REGISTER JA PASSWORD RECOVERY

document.addEventListener('DOMContentLoaded', function() {
    // API endpoints
    const API_BASE_URL = '/api/auth';
    const ENDPOINTS = {
        LOGIN: `${API_BASE_URL}/login`,
        REGISTER: `${API_BASE_URL}/register`,
        RESET_PASSWORD: `${API_BASE_URL}/reset-password`
    };

    // Alustetaan Materialize modaalit
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, {
        dismissible: true,
        opacity: 0.5,
        inDuration: 300,
        outDuration: 200,
        startingTop: '4%',
        endingTop: '10%'
    });

    // Haetaan tarvittavat elementit
    const registerModal = document.getElementById('sign-in-dialog');
    const passwordRecoveryModal = document.getElementById('password-recovery-dialog');
    const openRegisterModalBtn = document.getElementById('open-register-modal');
    const openPasswordRecoveryBtn = document.getElementById('open-password-recovery');
    const closeButtons = document.querySelectorAll('.modal-close');
    const signInForm = document.getElementById('sign-in-form');
    const registerForm = document.getElementById('register-form');
    const passwordRecoveryForm = document.getElementById('password-recovery-form');

    // Rekisteröitymismodaalin avaaminen
    openRegisterModalBtn.addEventListener('click', function(e) {
        e.preventDefault();
        var instance = M.Modal.getInstance(registerModal);
        instance.open();
    });

    // Salasanan palautus -modaalin avaaminen
    openPasswordRecoveryBtn.addEventListener('click', function(e) {
        e.preventDefault();
        var instance = M.Modal.getInstance(passwordRecoveryModal);
        instance.open();
    });

    // Sulkemistoiminnallisuus kaikille modal-close -luokan elementeille
    closeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const modal = this.closest('.modal');
            if (modal) {
                var instance = M.Modal.getInstance(modal);
                instance.close();
            }
        });
    });

    // Kirjaudu sisään
    signInForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            console.log('Yritetään kirjautua:', username);
            console.log('Käytettävä endpoint:', ENDPOINTS.LOGIN);
            console.log('Lähetettävä data:', { email: username, password });
            const response = await fetch(ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email: username,
                    password 
                })
            });

            console.log('Vastaus status:', response.status);
            const data = await response.json();
            console.log('Vastaus data:', data);
            
            if (!response.ok) {
                throw new Error(data.error || 'Kirjautuminen epäonnistui');
            }

            console.log('Kirjautuminen onnistui:', data);
            
            // Tallenna token
            localStorage.setItem('token', data.token);
            
            // Debug: tulosta tokenin payload
            try {
                const payload = JSON.parse(atob(data.token.split('.')[1]));
                console.log('Token payload:', payload);
                console.log('Kirjautuneen käyttäjän rooli:', payload.role);
                if (payload.role === 'admin') {
                    console.log('Käyttäjä on admin, ohjataan admin-sivulle');
                    setTimeout(() => {
                        window.location.href = '../admin-page/admin.html';
                    }, 1000);
                    return;
                } else {
                    console.log('Käyttäjä EI ole admin, ohjataan ownPage.html');
                }
            } catch (e) {
                console.log('Tokenin purku epäonnistui:', e);
            }
            
            // Näytä onnistumisviesti
            M.toast({html: 'Kirjautuminen onnistui!', classes: 'green'});
            
            // Ohjaa käyttäjä omalle sivulle (vain jos ei admin)
            setTimeout(() => {
                window.location.href = '../own-page/ownPage.html';
            }, 1000);
        } catch (error) {
            console.error('Kirjautumisvirhe:', error);
            M.toast({html: error.message || 'Virhe kirjautumisessa. Tarkista sähköposti ja salasana.', classes: 'red'});
        }
    });

    // Rekisteröidy
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const username = document.getElementById('new-username').value;
        const password = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            M.toast({html: 'Salasanat eivät täsmää!', classes: 'red'});
            return;
        }

        try {
            console.log('Yritetään rekisteröityä:', email);
            const response = await fetch(ENDPOINTS.REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    username,
                    password
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Rekisteröityminen epäonnistui');
            }

            console.log('Rekisteröityminen onnistui:', data);
            
            // Tallenna token jos se tulee rekisteröitymisen yhteydessä
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            
            // Näytä onnistumisviesti
            M.toast({html: 'Rekisteröityminen onnistui! Voit nyt kirjautua sisään.', classes: 'green'});
            
            // Sulje modaali
            var instance = M.Modal.getInstance(registerModal);
            instance.close();
            
            // Tyhjennä lomake
            registerForm.reset();
        } catch (error) {
            console.error('Rekisteröitymisvirhe:', error);
            M.toast({html: error.message || 'Virhe rekisteröitymisessä. Tarkista tiedot ja yritä uudelleen.', classes: 'red'});
        }
    });

    // Palauta salasana
    passwordRecoveryForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('recovery-email').value;

        try {
            console.log('Yritetään palauttaa salasana:', email);
            const response = await fetch(ENDPOINTS.RESET_PASSWORD, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Salasanan palautus epäonnistui');
            }

            M.toast({html: 'Salasanan palautuslinkki on lähetetty sähköpostiisi.', classes: 'green'});
            var instance = M.Modal.getInstance(passwordRecoveryModal);
            instance.close();
            passwordRecoveryForm.reset();
        } catch (error) {
            console.error('Salasanan palautusvirhe:', error);
            M.toast({html: error.message || 'Virhe salasanan palautuksessa. Tarkista sähköpostiosoite.', classes: 'red'});
        }
    });

    // Maapallon liike hiiren mukaan
    const earth = document.querySelector('.earth-image');
    const minRight = -150; // Minimietäisyys oikeasta reunasta
    const baseTop = 170; // Peruskorkeus
    const verticalRange = 50; // Kuinka paljon kuva voi liikkua ylös/alas
    const horizontalRange = 50; // Kuinka paljon kuva voi liikkua sivusuunnassa
    const DELAY_MS = 200; // 0.2 sekunnin viive
    const MOTION_HISTORY_MS = 50; // Kuinka usein tallennetaan sijainti (ms)
    
    // Nykyiset positiot
    let currentRight = -200;
    let currentTop = baseTop;
    let currentScale = 1;
    let velocityScale = 0;
    let velocityRight = 0;
    let velocityTop = 0;
    let targetScale = 1;
    let targetRight = currentRight;
    let targetTop = currentTop;
    let startTime = Date.now();
    let currentRotation = 0;
    
    // Jono hiiren liikkeille
    let mousePositions = [];
    let lastMouseUpdate = Date.now();
    
    // Spring parametrit
    const SPRING_CONFIG = {
        stiffness: 1.3,    // Jousen jäykkyys
        damping: 0.7,      // Vaimennus
        bounce: 1.15       // Bounce-efektin voimakkuus
    };

    // Spring animaatio
    function springAnimation(current, target, velocity, config) {
        const force = (target - current) * config.stiffness;
        const newVelocity = velocity * config.damping + force * config.bounce;
        return {
            position: current + newVelocity,
            velocity: newVelocity
        };
    }

    // Keinuva rotaatio animaatio
    function updateRotation() {
        const time = (Date.now() - startTime) / 1000;
        const amplitude = 3.0;
        const frequency = 0.1;
        currentRotation = Math.sin(time * Math.PI * frequency) * amplitude;
    }

    function updatePosition() {
        if (earth) {
            // Päivitetään rotaatio
            updateRotation();
            
            // Tarkistetaan onko vanhoja hiiren sijainteja joita voidaan käyttää
            const now = Date.now();
            while (mousePositions.length > 0 && now - mousePositions[0].time >= DELAY_MS) {
                const pos = mousePositions.shift();
                targetRight = pos.right;
                targetTop = pos.top;
            }
            
            // Päivitetään sijainnit spring-animaatiolla
            const rightUpdate = springAnimation(currentRight, targetRight, velocityRight, SPRING_CONFIG);
            const topUpdate = springAnimation(currentTop, targetTop, velocityTop, SPRING_CONFIG);
            const scaleUpdate = springAnimation(currentScale, targetScale, velocityScale, SPRING_CONFIG);
            
            currentRight = rightUpdate.position;
            currentTop = topUpdate.position;
            currentScale = scaleUpdate.position;
            
            velocityRight = rightUpdate.velocity;
            velocityTop = topUpdate.velocity;
            velocityScale = scaleUpdate.velocity;
            
            earth.style.right = `${currentRight}px`;
            earth.style.top = `${currentTop}px`;
            earth.style.transform = `scale(${currentScale}) rotate(${currentRotation}deg)`;
            
            requestAnimationFrame(updatePosition);
        }
    }
    
    updatePosition();

    // Hiiren liikkeen seuranta
    document.addEventListener('mousemove', function(e) {
        const now = Date.now();
        
        // Tallennetaan hiiren sijainti vain tietyin väliajoin
        if (now - lastMouseUpdate >= MOTION_HISTORY_MS) {
            // Lasketaan hiiren X ja Y -positioiden prosentit
            const mouseXPercent = e.clientX / window.innerWidth;
            const mouseYPercent = e.clientY / window.innerHeight;
            
            // Lasketaan kohde sijainnit
            const targetRight = minRight + (mouseXPercent * -horizontalRange);
            const targetTop = baseTop + ((mouseYPercent - 0.5) * verticalRange * 2);
            
            // Tallennetaan sijainti jonoon aikaleiman kanssa
            mousePositions.push({
                right: targetRight,
                top: targetTop,
                time: now
            });
            
            lastMouseUpdate = now;
        }
    });

    // Scroll-tapahtuman kuuntelu
    window.addEventListener('scroll', function() {
        // Lasketaan scroll-position prosentti (0-1)
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        
        // Päivitetään kohde skaala (1 -> 0.8 scrollatessa alas)
        targetScale = 1 - (scrollPercent * 0.2);
    });
});
