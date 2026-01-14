/**
 * theme-manager.js - Pengelola tema untuk permainan Dhakon/Congklak
 */

// Definisikan tema-tema yang tersedia
const themes = [
    { 
        id: 'default', 
        name: 'Klasik', 
        description: 'Tema kayu tradisional dengan warna coklat alami',
        colors: {
            primary: '#8b5a2b',
            secondary: '#d2b48c',
            background: '#f5f5dc',
            text: '#333',
            pitColor: '#a0522d',
            pitBorder: '#654321',
            seedColor: '#654321',
            seedHighlight: '#8b4513',
            buttonColor: '#8b5a2b',
            buttonText: '#fff',
            buttonHover: '#654321'
        }
    },
    { 
        id: 'modern', 
        name: 'Modern', 
        description: 'Tema minimalis dengan warna-warna cerah dan bersih',
        colors: {
            primary: '#3498db',
            secondary: '#ecf0f1',
            background: '#f9f9f9',
            text: '#2c3e50',
            pitColor: '#3498db',
            pitBorder: '#2980b9',
            seedColor: '#e74c3c',
            seedHighlight: '#c0392b',
            buttonColor: '#3498db',
            buttonText: '#fff',
            buttonHover: '#2980b9'
        }
    },
    { 
        id: 'nature', 
        name: 'Alam', 
        description: 'Tema dengan warna-warna alami dan tekstur daun',
        colors: {
            primary: '#27ae60',
            secondary: '#daf7e8',
            background: '#f0f9f4',
            text: '#2c3e50',
            pitColor: '#27ae60',
            pitBorder: '#219653',
            seedColor: '#f39c12',
            seedHighlight: '#d35400',
            buttonColor: '#27ae60',
            buttonText: '#fff',
            buttonHover: '#219653'
        }
    },
    { 
        id: 'royal', 
        name: 'Kerajaan', 
        description: 'Tema mewah dengan warna emas dan ungu',
        colors: {
            primary: '#9b59b6',
            secondary: '#f5eef8',
            background: '#f9f5fd',
            text: '#34495e',
            pitColor: '#9b59b6',
            pitBorder: '#8e44ad',
            seedColor: '#f1c40f',
            seedHighlight: '#f39c12',
            buttonColor: '#9b59b6',
            buttonText: '#fff',
            buttonHover: '#8e44ad'
        }
    },
    { 
        id: 'dark', 
        name: 'Gelap', 
        description: 'Tema gelap untuk bermain di malam hari',
        colors: {
            primary: '#34495e',
            secondary: '#2c3e50',
            background: '#1a1a1a',
            text: '#ecf0f1',
            pitColor: '#34495e',
            pitBorder: '#2c3e50',
            seedColor: '#e74c3c',
            seedHighlight: '#c0392b',
            buttonColor: '#3498db',
            buttonText: '#fff',
            buttonHover: '#2980b9'
        }
    }
];

// Definisikan opsi biji
const seedOptions = [
    {
        id: 'default',
        name: 'Biji Kayu',
        image: 'assets/images/seeds/marbles-1.jpg'
    },
    {
        id: 'colorful',
        name: 'Biji Warna-warni',
        image: 'assets/images/seeds/marbles-2.jpg'
    },
    {
        id: 'glass',
        name: 'Biji Kaca',
        image: 'assets/images/seeds/marbles-3.jpg'
    },
    {
        id: 'gems',
        name: 'Biji Permata',
        image: 'assets/images/seeds/marbles-4.jpg'
    },
    {
        id: 'mixed',
        name: 'Biji Campuran',
        image: 'assets/images/seeds/marbles-5.jpg'
    }
];

// Variabel untuk menyimpan preferensi tema
let currentTheme = 'default';
let currentSeedType = 'default';
let currentBoardShape = 'rectangle';
let currentAnimationSpeed = 300;

// Inisialisasi tema saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Setup tema
    setupThemeOptions();
    setupSeedOptions();
    setupBoardShapeOptions();
    setupAnimationSpeedSlider();
    
    // Muat preferensi dari localStorage
    loadPreferences();
    
    // Setup event listener untuk tombol apply
    document.getElementById('applyThemeBtn').addEventListener('click', applyThemeChanges);
});

// Setup opsi tema
function setupThemeOptions() {
    const themeContainer = document.querySelector('.theme-preview-container');
    
    // Bersihkan container
    themeContainer.innerHTML = '';
    
    // Tambahkan opsi tema
    themes.forEach(theme => {
        const themeElement = document.createElement('div');
        themeElement.className = `theme-option ${theme.id === currentTheme ? 'active' : ''}`;
        themeElement.dataset.theme = theme.id;
        
        themeElement.innerHTML = `
            <div class="theme-preview theme-${theme.id}">
                <div class="theme-preview-board">
                    <div class="theme-preview-store"></div>
                    <div class="theme-preview-pits">
                        <div class="theme-preview-row">
                            <div class="theme-preview-pit"></div>
                            <div class="theme-preview-pit"></div>
                            <div class="theme-preview-pit"></div>
                        </div>
                        <div class="theme-preview-row">
                            <div class="theme-preview-pit"></div>
                            <div class="theme-preview-pit"></div>
                            <div class="theme-preview-pit"></div>
                        </div>
                    </div>
                    <div class="theme-preview-store"></div>
                </div>
            </div>
            <div class="theme-info">
                <h3>${theme.name}</h3>
                <p>${theme.description}</p>
            </div>
        `;
        
        // Tambahkan event listener
        themeElement.addEventListener('click', () => {
            // Hapus kelas active dari semua tema
            document.querySelectorAll('.theme-option').forEach(el => {
                el.classList.remove('active');
            });
            
            // Tambahkan kelas active ke tema yang dipilih
            themeElement.classList.add('active');
            
            // Update tema saat ini
            currentTheme = theme.id;
        });
        
        themeContainer.appendChild(themeElement);
    });
}

// Setup opsi biji
function setupSeedOptions() {
    const seedContainer = document.querySelector('.seed-options');
    
    // Bersihkan container
    seedContainer.innerHTML = '';
    
    // Tambahkan opsi biji
    seedOptions.forEach(seed => {
        const seedElement = document.createElement('div');
        seedElement.className = `seed-option ${seed.id === currentSeedType ? 'active' : ''}`;
        seedElement.dataset.seed = seed.id;
        
        seedElement.innerHTML = `
            <img src="${seed.image}" alt="${seed.name}">
        `;
        
        // Tambahkan event listener
        seedElement.addEventListener('click', () => {
            // Hapus kelas active dari semua opsi biji
            document.querySelectorAll('.seed-option').forEach(el => {
                el.classList.remove('active');
            });
            
            // Tambahkan kelas active ke opsi biji yang dipilih
            seedElement.classList.add('active');
            
            // Update jenis biji saat ini
            currentSeedType = seed.id;
        });
        
        seedContainer.appendChild(seedElement);
    });
}

// Setup opsi bentuk papan
function setupBoardShapeOptions() {
    const shapeOptions = document.querySelectorAll('.board-shape-option');
    
    shapeOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Hapus kelas active dari semua opsi bentuk
            shapeOptions.forEach(el => {
                el.classList.remove('active');
            });
            
            // Tambahkan kelas active ke opsi bentuk yang dipilih
            option.classList.add('active');
            
            // Update bentuk papan saat ini
            currentBoardShape = option.dataset.shape;
        });
    });
}

// Setup slider kecepatan animasi
function setupAnimationSpeedSlider() {
    const slider = document.getElementById('animationSpeedSlider');
    const speedValue = document.querySelector('.speed-value');
    
    // Set nilai awal
    slider.value = currentAnimationSpeed;
    updateSpeedLabel(currentAnimationSpeed);
    
    // Tambahkan event listener
    slider.addEventListener('input', () => {
        const value = slider.value;
        currentAnimationSpeed = parseInt(value);
        updateSpeedLabel(value);
    });
    
    function updateSpeedLabel(value) {
        let speedText;
        if (value < 200) {
            speedText = 'Cepat';
        } else if (value < 400) {
            speedText = 'Sedang';
        } else {
            speedText = 'Lambat';
        }
        
        speedValue.textContent = `${speedText} (${value}ms)`;
    }
}

// Terapkan perubahan tema
function applyThemeChanges() {
    // Update kelas tema pada body
    document.body.className = `theme-${currentTheme}`;
    
    // Update variabel CSS sesuai tema
    const theme = themes.find(t => t.id === currentTheme);
    if (theme) {
        updateThemeVariables(theme.colors);
    }
    
    // Update bentuk papan
    updateBoardShape();
    
    // Update kecepatan animasi
    animationSpeed = currentAnimationSpeed;
    
    // Simpan preferensi di localStorage
    savePreferences();
    
    // Tutup modal
    themeModal.style.display = 'none';
    
    // Tampilkan pesan
    displayMessage(`Tema berubah menjadi: ${theme.name}`);
}

// Update variabel CSS sesuai tema
function updateThemeVariables(colors) {
    const root = document.documentElement;
    
    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--secondary-color', colors.secondary);
    root.style.setProperty('--background-color', colors.background);
    root.style.setProperty('--text-color', colors.text);
    root.style.setProperty('--pit-color', colors.pitColor);
    root.style.setProperty('--pit-border', colors.pitBorder);
    root.style.setProperty('--seed-color', colors.seedColor);
    root.style.setProperty('--seed-highlight', colors.seedHighlight);
    root.style.setProperty('--button-color', colors.buttonColor);
    root.style.setProperty('--button-text', colors.buttonText);
    root.style.setProperty('--button-hover', colors.buttonHover);
}

// Update bentuk papan
function updateBoardShape() {
    const board = document.querySelector('.board');
    const pits = document.querySelectorAll('.pit');
    const stores = document.querySelectorAll('.store');
    
    // Hapus kelas bentuk yang ada
    board.classList.remove('rectangle', 'oval', 'hexagon');
    pits.forEach(pit => {
        pit.classList.remove('rectangle', 'oval', 'hexagon');
    });
    stores.forEach(store => {
        store.classList.remove('rectangle', 'oval', 'hexagon');
    });
    
    // Tambahkan kelas bentuk baru
    board.classList.add(currentBoardShape);
    pits.forEach(pit => {
        pit.classList.add(currentBoardShape);
    });
    stores.forEach(store => {
        store.classList.add(currentBoardShape);
    });
}

// Simpan preferensi di localStorage
function savePreferences() {
    const preferences = {
        theme: currentTheme,
        seedType: currentSeedType,
        boardShape: currentBoardShape,
        animationSpeed: currentAnimationSpeed
    };
    
    localStorage.setItem('congklak-preferences', JSON.stringify(preferences));
}

// Muat preferensi dari localStorage
function loadPreferences() {
    const savedPreferences = localStorage.getItem('congklak-preferences');
    
    if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        
        currentTheme = preferences.theme || 'default';
        currentSeedType = preferences.seedType || 'default';
        currentBoardShape = preferences.boardShape || 'rectangle';
        currentAnimationSpeed = preferences.animationSpeed || 300;
        
        // Terapkan preferensi
        document.body.className = `theme-${currentTheme}`;
        updateBoardShape();
        animationSpeed = currentAnimationSpeed;
        
        // Update UI
        document.querySelectorAll('.theme-option').forEach(el => {
            el.classList.toggle('active', el.dataset.theme === currentTheme);
        });
        
        document.querySelectorAll('.seed-option').forEach(el => {
            el.classList.toggle('active', el.dataset.seed === currentSeedType);
        });
        
        document.querySelectorAll('.board-shape-option').forEach(el => {
            el.classList.toggle('active', el.dataset.shape === currentBoardShape);
        });
        
        document.getElementById('animationSpeedSlider').value = currentAnimationSpeed;
    }
}

