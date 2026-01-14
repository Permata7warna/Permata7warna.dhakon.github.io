/**
 * instructions.js - Pengelola instruksi untuk permainan Dhakon/Congklak
 */

// Inisialisasi instruksi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    setupInstructionTabs();
    setupDemoSeeds();
});

// Setup tab instruksi
function setupInstructionTabs() {
    const tabs = document.querySelectorAll('.instructions-tab');
    const contents = document.querySelectorAll('.instructions-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Hapus kelas active dari semua tab
            tabs.forEach(t => t.classList.remove('active'));
            
            // Tambahkan kelas active ke tab yang diklik
            tab.classList.add('active');
            
            // Sembunyikan semua konten
            contents.forEach(content => content.classList.remove('active'));
            
            // Tampilkan konten yang sesuai
            const tabId = tab.dataset.tab;
            document.getElementById(`${tabId}-content`).classList.add('active');
        });
    });
}

// Setup biji demo untuk instruksi
function setupDemoSeeds() {
    const demoPits = document.querySelectorAll('.demo-pit');
    const demoStores = document.querySelectorAll('.demo-store');
    
    // Tambahkan biji ke lubang
    demoPits.forEach(pit => {
        // Tambahkan 3-5 biji ke setiap lubang
        const seedCount = Math.floor(Math.random() * 3) + 3;
        addSeedsToContainer(pit, seedCount);
    });
    
    // Tambahkan biji ke lumbung
    demoStores.forEach(store => {
        // Tambahkan 8-12 biji ke setiap lumbung
        const seedCount = Math.floor(Math.random() * 5) + 8;
        addSeedsToContainer(store, seedCount);
    });
}

// Tambahkan biji ke container
function addSeedsToContainer(container, count) {
    // Hapus biji yang ada
    const existingSeeds = container.querySelectorAll('.demo-seed');
    existingSeeds.forEach(seed => seed.remove());
    
    // Tambahkan biji baru
    for (let i = 0; i < count; i++) {
        const seed = document.createElement('div');
        seed.className = 'demo-seed';
        
        // Posisi acak dalam container
        const containerWidth = container.offsetWidth || 40;
        const containerHeight = container.offsetHeight || 40;
        
        const maxDistance = Math.min(containerWidth, containerHeight) / 3;
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * maxDistance;
        
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        seed.style.left = `calc(50% + ${x}px)`;
        seed.style.top = `calc(50% + ${y}px)`;
        
        // Warna acak dari palet
        const colors = ['#8B4513', '#A0522D', '#CD853F', '#D2691E', '#B8860B'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        seed.style.backgroundColor = randomColor;
        
        container.appendChild(seed);
    }
}

// Tambahkan animasi demo untuk instruksi
function setupDemoAnimations() {
    // Animasi untuk giliran tambahan
    const extraTurnDemo = document.querySelector('#rules-content .demo-active');
    const extraTurnStore = document.querySelector('#rules-content .demo-highlight');
    
    if (extraTurnDemo && extraTurnStore) {
        // Animasi sederhana untuk menunjukkan giliran tambahan
        setInterval(() => {
            extraTurnDemo.classList.toggle('pulse');
            extraTurnStore.classList.toggle('pulse');
        }, 2000);
    }
    
    // Animasi untuk pengambilan biji
    const captureDemo = document.querySelector('#rules-content .demo-active:not(.pulse)');
    const captureTarget = document.querySelector('#rules-content .demo-highlight:not(.pulse)');
    
    if (captureDemo && captureTarget) {
        // Animasi sederhana untuk menunjukkan pengambilan biji
        setInterval(() => {
            captureDemo.classList.toggle('shake');
            captureTarget.classList.toggle('shake');
        }, 3000);
    }
}

