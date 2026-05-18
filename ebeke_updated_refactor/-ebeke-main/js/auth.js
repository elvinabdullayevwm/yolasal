// ==========================================================================
// YOLASAL - ZİREHLİ F5 QORUMA SİSTEMİ (QEYD-ŞƏRTSİZ GİRİŞ)
// ==========================================================================

/**
 * 1. SƏHİFƏLƏRİ AÇIB-GİZLƏDƏN ANA FUNKSİYA
 */
function showSection(sectionId) {
    // Brauzer yaddasını tam qaranlıq otaqda belə tapırıq
    const isLoggedIn = localStorage.getItem('isLoggedIn') || document.cookie.includes('isLoggedIn=true');
    const userID = localStorage.getItem('userID');

    // 🔥 ƏSAS ZİREH BURADIR: 
    // Əgər istifadəçi giriş EDİBSƏ və hansısa köhnə HTML kodu inadla onu 
    // login-ə və ya register-ə atmaq istəyirsə, biz onun qarşısını kəsirik!
    if (isLoggedIn && userID && (sectionId === 'login-section' || sectionId === 'register-section' || !sectionId)) {
        console.log("Zireh Aktivləşdi: Giriş var, login səhifəsi bloklandı. Marketplace açılır.");
        sectionId = 'marketplace-section'; // Məcburi olaraq marketplace-ə çeviririk
    }

    // Əgər giriş yoxdursa və başqa yerə keçmək istəyirsə, login-ə at
    if (!isLoggedIn && sectionId !== 'login-section' && sectionId !== 'register-section') {
        sectionId = 'login-section';
    }

    // --- Səhifələri ekranda göstərmək məntiqi ---
    const sections = ['login-section', 'register-section', 'marketplace-section', 'dashboard-section'];
    
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    const targetEl = document.getElementById(sectionId);
    if (targetEl) {
        targetEl.style.display = 'block';
    }
}

/**
 * 2. İSTİFADƏÇİ GİRİŞ FUNKSİYASI
 */
async function login(email, pass) {
    if (!email || !pass) {
        alert("Bütün xanaları doldurun!");
        return;
    }

    const requestData = {
        action: "login",
        email: email,
        password: pass
    };

    const response = await apiCall(requestData);
    
    if (response.status === 'success') {
        alert("Giriş edildi!");

        // Məlumatları həm daimi yaddaşa, həm kukiyə yazırıq
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', response.token || 'session-token');
        localStorage.setItem('userID', '650001');
        document.cookie = "isLoggedIn=true; path=/; max-age=2592000; SameSite=Lax";

        showSection('marketplace-section');
    } else {
        alert("Server cavabı: " + response);
    }
}

/**
 * 3. SİSTEMDƏN ÇIXIŞ
 */
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userID');
    document.cookie = "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    alert("Sistemdən çıxış edildi!");
    showSection('login-section');
}

/**
 * 4. SƏHİFƏ AÇILANDA VƏ YA F5 OLUNANDA ARASIKƏSİLMƏZ YOXLAMA (Yarım saniyəlik təhlükəsizlik taymeri ilə)
 */
function checkSessionAndRun() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') || document.cookie.includes('isLoggedIn=true');
    if (isLoggedIn) {
        showSection('marketplace-section');
    } else {
        showSection('login-section');
    }
}

// Səhifə yüklənən kimi dərhal yoxla
window.addEventListener('DOMContentLoaded', checkSessionAndRun);
window.addEventListener('load', checkSessionAndRun);

// 🔥 GİZLİ SİLAH: Əgər HTML-in içindəki hansısa kod səhifə tam açılandan sonra 
// bizi çölə atarsa, bu taymer yarım saniyə sonra onu yenidən məcburi içəri salacaq!
setTimeout(checkSessionAndRun, 500);
