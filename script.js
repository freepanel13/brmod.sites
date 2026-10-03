// ================= CẤU HÌNH THÔNG SỐ =================
const CONFIG = {
    // ========== ĐIỀN LINK CỦA BẠN VÀO ĐÂY ==========
    linkBrmod: "ĐIỀN_LINK_BRMOD_CỦA_BẠN_VÀO_ĐÂY",
    linkFFV7A: "ĐIỀN_LINK_FFV7A_CỦA_BẠN_VÀO_ĐÂY",
    
    // ========== TÀI KHOẢN MẬT KHẨU ADMIN ==========
    adminUsername: "admin",
    adminPassword: "nguyenthanhnam@1301",
    
    // Thời hạn key: 5 giờ
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

function saveKey(key, modType) {
    const record = {
        key,
        mod: modType,
        createdAt: Date.now(),
        expiresAt: Date.now() + CONFIG.keyValidMs
    };
    localStorage.setItem('lastKeyRecord', JSON.stringify(record));
    return record;
}

// ================= TRANG CHÍNH =================
document.addEventListener('DOMContentLoaded', () => {
    // Bấm thẻ chọn MOD
    document.querySelectorAll('.mod-card').forEach(card => {
        card.addEventListener('click', () => {
            handleUserClick(card.dataset.mod);
        });
    });

    // Vào trang đăng nhập admin
    const adminEntry = document.getElementById('admin-entry');
    if (adminEntry) {
        adminEntry.addEventListener('click', (e) => {
            e.preventDefault();
            showAdminLogin();
        });
    }

    // Kiểm tra quay về sau vượt link
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === '1' && params.get('mod')) {
        showSuccessSection(params.get('mod'));
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

function handleUserClick(modType) {
    showSection('loading-section');

    setTimeout(() => {
        const targetLink = modType === 'BRMOD' 
            ? CONFIG.linkBrmod 
            : CONFIG.linkFFV7A;
        
        const redirectBack = encodeURIComponent(
            window.location.origin + window.location.pathname + `?success=1&mod=${modType}`
        );
        
        // Đổi '?to=' thành định dạng link của bạn nếu cần
        window.location.href = targetLink + '?to=' + redirectBack;
    }, 1200);
}

function showSuccessSection(modType) {
    const key = generateKey(modType);
    saveKey(key, modType);
    
    const keyDisplay = document.getElementById('key-display');
    if (keyDisplay) keyDisplay.textContent = key;
    
    showSection('success-section');
}

function showSection(sectionId) {
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.add('hidden');
    });
    const target = document.getElementById(sectionId);
    if (target) target.classList.remove('hidden');
}

function goBack() {
    showSection('home-section');
}

// ================= ADMIN LOGIN =================
function showAdminLogin() {
    showSection('admin-login-section');
}

function hideAdminLogin() {
    showSection('home-section');
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

// ================= TRANG ADMIN =================
if (window.location.pathname.includes('admin.html')) {
    document.addEventListener('DOMContentLoaded', () => {
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
    const noKeyText = document.getElementById('no-key-yet');
    
    if (display) display.textContent = key;
    if (resultDiv) resultDiv.classList.remove('hidden');
    if (noKeyText) noKeyText.style.display = 'none';
}

function logoutAdmin() {
    sessionStorage.removeItem('adminAuth');
    window.location.href = 'index.html';
}
