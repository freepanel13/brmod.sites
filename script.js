// ================= CẤU HÌNH THÔNG SỐ =================
const CONFIG = {
    // Link chuyển hướng link4m của bạn — thay bằng link thật của bạn
    link4mBrmod: "https://link4m.com/your-link-here",
    link4mFFV7A: "https://link4m.com/your-other-link-here",
    
    // Tài khoản mật khẩu quản trị — BẠN CÓ THỂ ĐỔI Ở ĐÂY
    adminUsername: "admin",
    adminPassword: "admin123",
    
    // Thời hạn key: 5 giờ = 5 * 60 * 60 * 1000 ms
    keyValidMs: 5 * 60 * 60 * 1000
};

// ================= TẠO KEY NGẪU NHIÊN =================
function generateKey(modType) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let part1 = '', part2 = '', part3 = '', part4 = '';
    for (let i = 0; i < 4; i++) {
        part1 += chars[Math.floor(Math.random() * chars.length)];
        part2 += chars[Math.floor(Math.random() * chars.length)];
        part3 += chars[Math.floor(Math.random() * chars.length)];
        part4 += chars[Math.floor(Math.random() * chars.length)];
    }
    const prefix = modType === 'BRMOD' ? 'BR' : 'FF';
    return `${prefix}-${part1}-${part2}-${part3}-${part4}`;
}

// ================= LƯU & KIỂM TRA KEY =================
function saveKey(key, modType) {
    const record = {
        key: key,
        mod: modType,
        createdAt: Date.now(),
        expiresAt: Date.now() + CONFIG.keyValidMs
    };
    localStorage.setItem('lastKeyRecord', JSON.stringify(record));
    return record;
}

// ================= TRANG CHÍNH — NGƯỜI DÙNG =================
document.addEventListener('DOMContentLoaded', () => {
    // Bấm vào thẻ BRMOD
    document.querySelectorAll('.mod-card[data-mod="BRMOD"]').forEach(card => {
        card.addEventListener('click', () => handleUserClick('BRMOD'));
    });
    // Bấm vào thẻ FF V7A
    document.querySelectorAll('.mod-card[data-mod="FFV7A"]').forEach(card => {
        card.addEventListener('click', () => handleUserClick('FFV7A'));
    });

    // Kiểm tra xem vừa quay về từ link4m không
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === '1' && params.get('mod')) {
        showSuccessSection(params.get('mod'));
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

function handleUserClick(modType) {
    const loading = document.getElementById('loading-section');
    const cards = document.querySelector('.cards-grid');
    if (!loading) return;
    
    cards.classList.add('hidden');
    loading.classList.remove('hidden');

    // Chuyển sang link4m sau 1 giây
    setTimeout(() => {
        const targetLink = modType === 'BRMOD' 
            ? CONFIG.link4mBrmod 
            : CONFIG.link4mFFV7A;
        // Thêm tham số để link4m chuyển về khi xong
        const redirectBack = encodeURIComponent(
            window.location.origin + window.location.pathname + `?success=1&mod=${modType}`
        );
        window.location.href = targetLink + '?to=' + redirectBack;
    }, 1000);
}

function showSuccessSection(modType) {
    const key = generateKey(modType);
    saveKey(key, modType);
    
    const loading = document.getElementById('loading-section');
    const success = document.getElementById('success-section');
    const keyDisplay = document.getElementById('key-display');
    
    if (loading) loading.classList.add('hidden');
    if (success) success.classList.remove('hidden');
    if (keyDisplay) keyDisplay.textContent = key;
}

function goBack() {
    window.location.href = window.location.pathname;
}

// ================= ĐĂNG NHẬP QUẢN TRỊ =================
function showAdminLogin() {
    document.getElementById('admin-login-form').classList.remove('hidden');
}
function hideAdminLogin() {
    document.getElementById('admin-login-form').classList.add('hidden');
}
function adminLogin() {
    const user = document.getElementById('admin-user').value.trim();
    const pass = document.getElementById('admin-pass').value.trim();
    
    if (user === CONFIG.adminUsername && pass === CONFIG.adminPassword) {
        sessionStorage.setItem('adminAuth', 'ok');
        window.location.href = 'admin.html';
    } else {
        alert('Sai tên đăng nhập hoặc mật khẩu!');
    }
}

// ================= TRANG QUẢN TRỊ =================
if (window.location.pathname.includes('admin.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        // Kiểm tra đăng nhập
        if (sessionStorage.getItem('adminAuth') !== 'ok') {
            window.location.href = 'index.html';
        }
    });
}

function adminGenerateKey() {
    const select = document.getElementById('admin-mod-type');
    const modType = select.value;
    const key = generateKey(modType);
    saveKey(key, modType);
    
    const resultDiv = document.getElementById('admin-key-result');
    const display = document.getElementById('admin-key-display');
    
    display.textContent = key;
    resultDiv.classList.remove('hidden');
}

function logoutAdmin() {
    sessionStorage.removeItem('adminAuth');
    window.location.href = 'index.html';
}
