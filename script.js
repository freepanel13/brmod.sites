// === DANH SÁCH LINK4M CÓ THỂ THAY ĐỔI ===
// Thêm/bớt link tùy ý, hệ thống sẽ chọn ngẫu nhiên
const link4mSources = [
    "https://link4m.org/go/MFR3QYF",
    "https://link4m.org/go/QZ3Fzm",
    "https://link4m.org/go/0BrWy2A",
    "https://link4m.org/go/KhAcX7Z",
    "https://link4m.org/go/Plm9B2R"
];

// Lấy link ngẫu nhiên không trùng lặp liên tiếp
let lastUsedLink = '';
function getRandomLink4M() {
    let available = link4mSources.filter(link => link !== lastUsedLink);
    const selected = available[Math.floor(Math.random() * available.length)];
    lastUsedLink = selected;
    return selected;
}

// Lưu trạng thái vào localStorage
function saveProgress(step, link1, link2) {
    localStorage.setItem('brmod_progress', JSON.stringify({
        step, link1, link2, time: Date.now()
    }));
}

function getProgress() {
    const data = localStorage.getItem('brmod_progress');
    return data ? JSON.parse(data) : null;
}

// Khởi tạo hiển thị link trên trang
function displayRandomLink(buttonId, targetLinkVar) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;
    const link = getRandomLink4M();
    window[targetLinkVar] = link;
    btn.href = link;
    // Hiển thị mã link ngắn gọn
    const codeDisplay = document.getElementById(`${buttonId}-code`);
    if (codeDisplay) {
        const shortCode = link.split('/').pop();
        codeDisplay.textContent = shortCode;
    }
}

// Xử lý khi bấm nút → đánh dấu hoàn thành bước
function markStepDone(stepNum) {
    const progress = getProgress() || { step: 0, link1: '', link2: '' };
    if (stepNum === 1) {
        progress.link1 = window.firstLink || '';
        progress.step = 1;
    } else if (stepNum === 2) {
        progress.link2 = window.secondLink || '';
        progress.step = 2;
    }
    saveProgress(progress.step, progress.link1, progress.link2);
}

// Tự động điền link khi trang tải
document.addEventListener('DOMContentLoaded', () => {
    // Trang index.html → Bước 1
    if (document.getElementById('btn-step1')) {
        displayRandomLink('btn-step1', 'firstLink');
    }
    
    // Trang step2.html → Bước 2
    if (document.getElementById('btn-step2')) {
        displayRandomLink('btn-step2', 'secondLink');
    }
    
    // Nút xác nhận nhận key
    const confirmBtn = document.getElementById('btn-confirm-key');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            // Tạo key ngẫu nhiên 16 ký tự
            const key = 'BRMOD-' + Array.from({length: 16}, () => 
                'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random()*36)]
            ).join('');
            
            // Hiển thị key
            alert(`✅ Key của bạn:\n${key}\n⏰ Hạn dùng: 3 giờ\n🔐 Thiết bị: 1 thiết bị`);
            
            // Xóa tiến trình
            localStorage.removeItem('brmod_progress');
        });
    }
});
