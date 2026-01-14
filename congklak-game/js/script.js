/**
 * script.js - Logika permainan Dhakon/Congklak
 */

// Inisialisasi variabel global
let board = []; // Array untuk menyimpan jumlah biji di setiap lubang
let currentPlayer = 0; // 0 untuk pemain 1, 1 untuk pemain 2
let gameActive = false; // Status permainan aktif atau tidak
let lastSeedInStore = false; // Apakah biji terakhir jatuh di lumbung
let animationSpeed = 300; // Kecepatan animasi dalam milidetik
let animationInProgress = false; // Status animasi sedang berjalan

// Konstanta
const PLAYER_PITS = 7; // Jumlah lubang per pemain (tidak termasuk lumbung)
const TOTAL_PITS = PLAYER_PITS * 2; // Total lubang (tidak termasuk lumbung)
const SEEDS_PER_PIT = 7; // Jumlah biji awal di setiap lubang
const PLAYER_STORE = [13, 6]; // Indeks lumbung untuk pemain 1 dan 2

// Elemen DOM
const playerTurnElement = document.getElementById('player-turn');
const gameMessageElement = document.getElementById('game-message');
const newGameButton = document.getElementById('newGameBtn');
const themeButton = document.getElementById('themeBtn');
const helpButton = document.getElementById('helpBtn');
const helpModal = document.getElementById('helpModal');
const themeModal = document.getElementById('themeModal');
const closeButtons = document.querySelectorAll('.close');

// Inisialisasi permainan saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    initializeGame();
    setupInstructions();
    setupThemeOptions();
});

// Setup event listener
function setupEventListeners() {
    // Event listener untuk tombol permainan baru
    newGameButton.addEventListener('click', initializeGame);
    
    // Event listener untuk tombol bantuan
    helpButton.addEventListener('click', () => {
        helpModal.style.display = 'block';
    });
    
    // Event listener untuk tombol ganti tampilan
    themeButton.addEventListener('click', () => {
        themeModal.style.display = 'block';
    });
    
    // Event listener untuk tombol tutup pada modal
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            helpModal.style.display = 'none';
            themeModal.style.display = 'none';
        });
    });
    
    // Tutup modal saat mengklik di luar modal
    window.addEventListener('click', (event) => {
        if (event.target === helpModal) {
            helpModal.style.display = 'none';
        }
        if (event.target === themeModal) {
            themeModal.style.display = 'none';
        }
    });
    
    // Event listener untuk lubang-lubang
    setupPitEventListeners();
}

// Setup event listener untuk lubang-lubang
function setupPitEventListeners() {
    // Dapatkan semua elemen lubang
    const pits = document.querySelectorAll('.pit');
    
    // Tambahkan event listener untuk setiap lubang
    pits.forEach(pit => {
        pit.addEventListener('click', () => {
            // Dapatkan indeks lubang dari ID
            const pitId = pit.id;
            const pitIndex = parseInt(pitId.split('-')[1]);
            
            // Cek apakah lubang valid untuk diklik
            if (isValidMove(pitIndex)) {
                makeMove(pitIndex);
            }
        });
    });
}

// Inisialisasi permainan
function initializeGame() {
    // Reset variabel permainan
    board = Array(TOTAL_PITS + 2).fill(0); // +2 untuk lumbung
    currentPlayer = 0;
    gameActive = true;
    lastSeedInStore = false;
    animationInProgress = false;
    
    // Isi lubang dengan biji
    for (let i = 0; i < TOTAL_PITS; i++) {
        if (i !== PLAYER_STORE[0] && i !== PLAYER_STORE[1]) {
            board[i] = SEEDS_PER_PIT;
        }
    }
    
    // Update tampilan
    updateBoardView();
    updateGameStatus();
    
    // Tampilkan pesan permainan dimulai
    displayMessage('Permainan dimulai! Giliran Pemain 1.');
}

// Update tampilan papan permainan
function updateBoardView() {
    // Update jumlah biji di setiap lubang
    for (let i = 0; i < board.length; i++) {
        // Dapatkan elemen yang sesuai
        let element;
        if (i === PLAYER_STORE[0]) {
            element = document.getElementById('store-0');
        } else if (i === PLAYER_STORE[1]) {
            element = document.getElementById('store-1');
        } else {
            element = document.getElementById(`pit-${i}`);
        }
        
        // Update jumlah biji
        if (element) {
            const seedsCountElement = element.querySelector('.seeds-count');
            if (seedsCountElement) {
                seedsCountElement.textContent = board[i];
                
                // Tambahkan visual biji jika belum ada
                updateSeedVisuals(element, board[i]);
            }
        }
    }
}

// Update visual biji
function updateSeedVisuals(container, count) {
    // Hapus visual biji yang ada
    const existingSeeds = container.querySelectorAll('.seed');
    existingSeeds.forEach(seed => seed.remove());
    
    // Tambahkan visual biji baru
    for (let i = 0; i < count; i++) {
        const seed = document.createElement('div');
        seed.className = 'seed';
        
        // Posisi acak dalam container
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 0.4; // 40% dari radius
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
        const x = Math.cos(angle) * distance * (containerWidth / 2);
        const y = Math.sin(angle) * distance * (containerHeight / 2);
        
        seed.style.left = `calc(50% + ${x}px)`;
        seed.style.top = `calc(50% + ${y}px)`;
        
        // Warna acak dari palet
        const colors = ['#8B4513', '#A0522D', '#CD853F', '#D2691E', '#B8860B'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        seed.style.backgroundColor = randomColor;
        
        // Ukuran acak
        const size = 10 + Math.random() * 5;
        seed.style.width = `${size}px`;
        seed.style.height = `${size}px`;
        
        // Rotasi acak
        const rotation = Math.random() * 360;
        seed.style.transform = `rotate(${rotation}deg)`;
        
        container.appendChild(seed);
    }
}

// Animasi pergerakan biji
function animateSeedMovement(fromElement, toElement, count, callback) {
    // Tandai animasi sedang berjalan
    animationInProgress = true;
    
    // Buat array untuk menyimpan biji yang akan dianimasikan
    const animatedSeeds = [];
    
    // Posisi awal dan akhir
    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();
    
    // Buat biji untuk animasi
    for (let i = 0; i < count; i++) {
        const seed = document.createElement('div');
        seed.className = 'seed animated-seed';
        
        // Warna acak dari palet
        const colors = ['#8B4513', '#A0522D', '#CD853F', '#D2691E', '#B8860B'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        seed.style.backgroundColor = randomColor;
        
        // Ukuran acak
        const size = 10 + Math.random() * 5;
        seed.style.width = `${size}px`;
        seed.style.height = `${size}px`;
        
        // Posisi awal (relatif terhadap viewport)
        const startX = fromRect.left + fromRect.width / 2 + (Math.random() - 0.5) * 20;
        const startY = fromRect.top + fromRect.height / 2 + (Math.random() - 0.5) * 20;
        
        seed.style.left = `${startX}px`;
        seed.style.top = `${startY}px`;
        
        // Tambahkan ke body
        document.body.appendChild(seed);
        animatedSeeds.push(seed);
        
        // Animasi dengan delay acak
        setTimeout(() => {
            // Posisi akhir (relatif terhadap viewport)
            const endX = toRect.left + toRect.width / 2 + (Math.random() - 0.5) * 20;
            const endY = toRect.top + toRect.height / 2 + (Math.random() - 0.5) * 20;
            
            // Animasi dengan CSS transitions
            seed.style.transition = `left ${animationSpeed}ms ease-out, top ${animationSpeed}ms ease-out`;
            seed.style.left = `${endX}px`;
            seed.style.top = `${endY}px`;
            
            // Hapus biji setelah animasi selesai
            setTimeout(() => {
                seed.remove();
                
                // Jika ini adalah biji terakhir, panggil callback
                if (i === count - 1) {
                    animationInProgress = false;
                    if (callback) callback();
                }
            }, animationSpeed + 50);
        }, i * 50); // Delay bertahap untuk setiap biji
    }
}

// Update status permainan
function updateGameStatus() {
    playerTurnElement.textContent = `Giliran: Pemain ${currentPlayer + 1}`;
    
    // Highlight lubang pemain yang sedang giliran
    const player1Pits = document.querySelector('.player-1');
    const player2Pits = document.querySelector('.player-2');
    
    if (currentPlayer === 0) {
        player1Pits.classList.add('active-player');
        player2Pits.classList.remove('active-player');
    } else {
        player1Pits.classList.remove('active-player');
        player2Pits.classList.add('active-player');
    }
    
    // Cek apakah permainan berakhir
    checkGameEnd();
}

// Tampilkan pesan
function displayMessage(message) {
    gameMessageElement.textContent = message;
}

// Cek apakah gerakan valid
function isValidMove(pitIndex) {
    // Permainan harus aktif
    if (!gameActive) {
        return false;
    }
    
    // Tidak boleh ada animasi yang sedang berjalan
    if (animationInProgress) {
        return false;
    }
    
    // Lubang harus milik pemain yang sedang giliran
    const playerPits = getPlayerPits(currentPlayer);
    if (!playerPits.includes(pitIndex)) {
        displayMessage('Bukan giliran Anda!');
        return false;
    }
    
    // Lubang tidak boleh kosong
    if (board[pitIndex] === 0) {
        displayMessage('Lubang kosong!');
        return false;
    }
    
    return true;
}

// Dapatkan lubang milik pemain
function getPlayerPits(player) {
    if (player === 0) {
        // Pemain 1: lubang 0-5
        return Array.from({ length: PLAYER_PITS - 1 }, (_, i) => i);
    } else {
        // Pemain 2: lubang 7-12
        return Array.from({ length: PLAYER_PITS - 1 }, (_, i) => i + PLAYER_PITS);
    }
}

// Lakukan gerakan
function makeMove(pitIndex) {
    // Ambil biji dari lubang
    let seeds = board[pitIndex];
    board[pitIndex] = 0;
    
    // Dapatkan elemen lubang asal
    const fromElement = document.getElementById(`pit-${pitIndex}`);
    
    // Update tampilan lubang asal
    updateSeedVisuals(fromElement, 0);
    
    // Distribusikan biji
    let currentPit = pitIndex;
    let seedsToDistribute = seeds;
    
    // Fungsi untuk mendistribusikan satu biji
    const distributeSeed = () => {
        // Pindah ke lubang berikutnya
        currentPit = (currentPit + 1) % board.length;
        
        // Lewati lumbung lawan
        if ((currentPlayer === 0 && currentPit === PLAYER_STORE[1]) ||
            (currentPlayer === 1 && currentPit === PLAYER_STORE[0])) {
            currentPit = (currentPit + 1) % board.length;
        }
        
        // Dapatkan elemen lubang tujuan
        let toElement;
        if (currentPit === PLAYER_STORE[0]) {
            toElement = document.getElementById('store-0');
        } else if (currentPit === PLAYER_STORE[1]) {
            toElement = document.getElementById('store-1');
        } else {
            toElement = document.getElementById(`pit-${currentPit}`);
        }
        
        // Animasi pergerakan biji
        animateSeedMovement(fromElement, toElement, 1, () => {
            // Tambahkan biji ke lubang
            board[currentPit]++;
            seedsToDistribute--;
            
            // Update tampilan
            updateSeedVisuals(toElement, board[currentPit]);
            
            // Cek apakah distribusi selesai
            if (seedsToDistribute > 0) {
                // Masih ada biji, lanjutkan distribusi
                setTimeout(() => {
                    // Update elemen asal untuk animasi berikutnya
                    fromElement = toElement;
                    distributeSeed();
                }, 50);
            } else {
                // Distribusi selesai, cek aturan khusus
                handleDistributionEnd(currentPit);
            }
        });
    };
    
    // Mulai distribusi
    distributeSeed();
}

// Tangani akhir distribusi
function handleDistributionEnd(lastPit) {
    // Cek apakah biji terakhir jatuh di lumbung pemain
    if ((currentPlayer === 0 && lastPit === PLAYER_STORE[0]) ||
        (currentPlayer === 1 && lastPit === PLAYER_STORE[1])) {
        // Pemain mendapat giliran tambahan
        displayMessage(`Pemain ${currentPlayer + 1} mendapat giliran tambahan!`);
        lastSeedInStore = true;
        
        // Update status permainan
        updateGameStatus();
    }
    // Cek apakah biji terakhir jatuh di lubang kosong milik pemain
    else if (board[lastPit] === 1 && isPlayerPit(lastPit, currentPlayer)) {
        // Ambil biji dari lubang seberang
        const oppositePit = getOppositePit(lastPit);
        if (board[oppositePit] > 0) {
            // Dapatkan elemen lubang
            const lastPitElement = document.getElementById(`pit-${lastPit}`);
            const oppositePitElement = document.getElementById(`pit-${oppositePit}`);
            
            // Dapatkan elemen lumbung pemain
            const playerStore = currentPlayer === 0 ? PLAYER_STORE[0] : PLAYER_STORE[1];
            const storeElement = document.getElementById(`store-${currentPlayer}`);
            
            // Ambil biji dari lubang pemain dan lubang seberang
            const capturedSeeds = board[lastPit] + board[oppositePit];
            
            // Animasi pengambilan biji dari lubang seberang
            animateSeedMovement(oppositePitElement, storeElement, board[oppositePit], () => {
                // Animasi pengambilan biji dari lubang terakhir
                animateSeedMovement(lastPitElement, storeElement, board[lastPit], () => {
                    // Update data
                    board[lastPit] = 0;
                    board[oppositePit] = 0;
                    board[playerStore] += capturedSeeds;
                    
                    // Update tampilan
                    updateSeedVisuals(lastPitElement, 0);
                    updateSeedVisuals(oppositePitElement, 0);
                    updateSeedVisuals(storeElement, board[playerStore]);
                    
                    displayMessage(`Pemain ${currentPlayer + 1} mengambil ${capturedSeeds} biji!`);
                    
                    // Ganti giliran
                    currentPlayer = 1 - currentPlayer;
                    lastSeedInStore = false;
                    
                    // Update status permainan
                    updateGameStatus();
                });
            });
        } else {
            // Ganti giliran
            currentPlayer = 1 - currentPlayer;
            lastSeedInStore = false;
            
            // Update status permainan
            updateGameStatus();
        }
    }
    else {
        // Ganti giliran
        currentPlayer = 1 - currentPlayer;
        lastSeedInStore = false;
        
        // Update status permainan
        updateGameStatus();
    }
}

// Cek apakah lubang milik pemain
function isPlayerPit(pitIndex, player) {
    return getPlayerPits(player).includes(pitIndex);
}

// Dapatkan lubang seberang
function getOppositePit(pitIndex) {
    return TOTAL_PITS - 1 - pitIndex;
}

// Cek apakah permainan berakhir
function checkGameEnd() {
    // Cek apakah semua lubang pemain kosong
    const player1Empty = getPlayerPits(0).every(pit => board[pit] === 0);
    const player2Empty = getPlayerPits(1).every(pit => board[pit] === 0);
    
    if (player1Empty || player2Empty) {
        // Permainan berakhir
        gameActive = false;
        
        // Kumpulkan sisa biji
        collectRemainingSeeds();
    }
}

// Kumpulkan sisa biji
function collectRemainingSeeds() {
    // Kumpulkan sisa biji pemain 1
    let player1Seeds = 0;
    let player1Pits = [];
    getPlayerPits(0).forEach(pit => {
        if (board[pit] > 0) {
            player1Seeds += board[pit];
            player1Pits.push(pit);
        }
    });
    
    // Kumpulkan sisa biji pemain 2
    let player2Seeds = 0;
    let player2Pits = [];
    getPlayerPits(1).forEach(pit => {
        if (board[pit] > 0) {
            player2Seeds += board[pit];
            player2Pits.push(pit);
        }
    });
    
    // Animasi pengumpulan biji pemain 1
    if (player1Seeds > 0) {
        const storeElement = document.getElementById('store-0');
        let animationsCompleted = 0;
        
        player1Pits.forEach(pit => {
            const pitElement = document.getElementById(`pit-${pit}`);
            animateSeedMovement(pitElement, storeElement, board[pit], () => {
                animationsCompleted++;
                if (animationsCompleted === player1Pits.length) {
                    // Semua animasi pemain 1 selesai
                    player1Pits.forEach(p => {
                        board[PLAYER_STORE[0]] += board[p];
                        board[p] = 0;
                    });
                    updateSeedVisuals(storeElement, board[PLAYER_STORE[0]]);
                    
                    // Lanjutkan dengan animasi pemain 2
                    collectPlayer2Seeds();
                }
            });
        });
    } else {
        // Tidak ada biji pemain 1, langsung ke pemain 2
        collectPlayer2Seeds();
    }
    
    // Fungsi untuk mengumpulkan biji pemain 2
    function collectPlayer2Seeds() {
        if (player2Seeds > 0) {
            const storeElement = document.getElementById('store-1');
            let animationsCompleted = 0;
            
            player2Pits.forEach(pit => {
                const pitElement = document.getElementById(`pit-${pit}`);
                animateSeedMovement(pitElement, storeElement, board[pit], () => {
                    animationsCompleted++;
                    if (animationsCompleted === player2Pits.length) {
                        // Semua animasi pemain 2 selesai
                        player2Pits.forEach(p => {
                            board[PLAYER_STORE[1]] += board[p];
                            board[p] = 0;
                        });
                        updateSeedVisuals(storeElement, board[PLAYER_STORE[1]]);
                        
                        // Tentukan pemenang
                        determineWinner();
                    }
                });
            });
        } else {
            // Tidak ada biji pemain 2, langsung tentukan pemenang
            determineWinner();
        }
    }
}

// Tentukan pemenang
function determineWinner() {
    const player1Score = board[PLAYER_STORE[0]];
    const player2Score = board[PLAYER_STORE[1]];
    
    if (player1Score > player2Score) {
        displayMessage(`Permainan berakhir! Pemain 1 menang dengan skor ${player1Score}-${player2Score}.`);
        showWinAnimation(0);
    } else if (player2Score > player1Score) {
        displayMessage(`Permainan berakhir! Pemain 2 menang dengan skor ${player2Score}-${player1Score}.`);
        showWinAnimation(1);
    } else {
        displayMessage(`Permainan berakhir! Seri dengan skor ${player1Score}-${player2Score}.`);
    }
}

// Tampilkan animasi kemenangan
function showWinAnimation(player) {
    // Dapatkan elemen lumbung pemenang
    const storeElement = document.getElementById(`store-${player}`);
    
    // Tambahkan kelas untuk animasi
    storeElement.classList.add('winner');
    
    // Buat efek confetti
    createConfetti(player);
}

// Buat efek confetti
function createConfetti(player) {
    // Dapatkan elemen lumbung pemenang
    const storeElement = document.getElementById(`store-${player}`);
    const rect = storeElement.getBoundingClientRect();
    
    // Buat container untuk confetti
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);
    
    // Posisi container di atas lumbung
    confettiContainer.style.position = 'absolute';
    confettiContainer.style.left = `${rect.left + rect.width / 2}px`;
    confettiContainer.style.top = `${rect.top}px`;
    
    // Buat confetti
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', 
                   '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', 
                   '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Properti acak
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 10 + 5;
        const angle = Math.random() * 360;
        
        // Styling
        confetti.style.backgroundColor = color;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.transform = `rotate(${angle}deg)`;
        
        // Animasi
        const animationDuration = Math.random() * 3 + 2;
        const animationDelay = Math.random() * 2;
        
        confetti.style.animation = `confetti-fall ${animationDuration}s ease-in ${animationDelay}s forwards`;
        
        // Tambahkan ke container
        confettiContainer.appendChild(confetti);
    }
    
    // Hapus container setelah animasi selesai
    setTimeout(() => {
        confettiContainer.remove();
    }, 5000);
}

// Setup instruksi cara bermain
function setupInstructions() {
    const instructionsContainer = document.querySelector('.instructions');
    
    if (instructionsContainer) {
        instructionsContainer.innerHTML = `
            <h3>Persiapan</h3>
            <p>Permainan Congklak dimainkan oleh 2 orang dengan papan yang memiliki 14 lubang kecil (7 untuk setiap pemain) dan 2 lubang besar (lumbung) di kedua ujungnya.</p>
            
            <h3>Aturan Permainan</h3>
            <ol>
                <li>Setiap lubang kecil diisi dengan 7 biji.</li>
                <li>Pemain 1 memiliki 7 lubang di baris bawah dan lumbung di kanan.</li>
                <li>Pemain 2 memiliki 7 lubang di baris atas dan lumbung di kiri.</li>
                <li>Pemain yang mendapat giliran memilih salah satu lubang miliknya yang berisi biji.</li>
                <li>Biji dari lubang tersebut diambil dan dibagikan satu per satu ke lubang berikutnya searah jarum jam, termasuk lumbung miliknya, tetapi melewati lumbung lawan.</li>
                <li>Jika biji terakhir jatuh di lumbung miliknya, pemain mendapat giliran tambahan.</li>
                <li>Jika biji terakhir jatuh di lubang kosong miliknya, pemain dapat mengambil semua biji dari lubang seberang milik lawan dan memasukkannya ke lumbung miliknya.</li>
                <li>Permainan berakhir ketika semua lubang milik salah satu pemain kosong.</li>
                <li>Sisa biji yang masih ada di lubang-lubang pemain lainnya dimasukkan ke lumbung pemain tersebut.</li>
                <li>Pemain dengan jumlah biji terbanyak di lumbungnya adalah pemenang.</li>
            </ol>
            
            <h3>Cara Bermain di Aplikasi</h3>
            <ol>
                <li>Klik tombol "Permainan Baru" untuk memulai permainan baru.</li>
                <li>Klik salah satu lubang milik Anda yang berisi biji saat giliran Anda.</li>
                <li>Sistem akan secara otomatis mendistribusikan biji dan menerapkan aturan permainan.</li>
                <li>Gunakan tombol "Ganti Tampilan" untuk mengubah tema permainan.</li>
                <li>Klik tombol "Cara Bermain" kapan saja untuk melihat instruksi ini kembali.</li>
            </ol>
            
            <p>Selamat bermain!</p>
        `;
    }
}

// Setup opsi tema
function setupThemeOptions() {
    const themeOptionsContainer = document.querySelector('.theme-options');
    
    if (themeOptionsContainer) {
        // Definisikan tema-tema yang tersedia
        const themes = [
            { id: 'default', name: 'Klasik', description: 'Tema kayu tradisional' },
            { id: 'modern', name: 'Modern', description: 'Tema minimalis dengan warna-warna cerah' },
            { id: 'nature', name: 'Alam', description: 'Tema dengan warna-warna alami dan tekstur daun' },
            { id: 'royal', name: 'Kerajaan', description: 'Tema mewah dengan warna emas dan ungu' },
            { id: 'dark', name: 'Gelap', description: 'Tema gelap untuk bermain di malam hari' }
        ];
        
        // Buat elemen untuk setiap tema
        themes.forEach(theme => {
            const themeElement = document.createElement('div');
            themeElement.className = 'theme-option';
            themeElement.dataset.theme = theme.id;
            
            themeElement.innerHTML = `
                <h3>${theme.name}</h3>
                <p>${theme.description}</p>
            `;
            
            // Tambahkan event listener
            themeElement.addEventListener('click', () => {
                changeTheme(theme.id);
                themeModal.style.display = 'none';
            });
            
            themeOptionsContainer.appendChild(themeElement);
        });
    }
}

// Fungsi untuk mengubah tema
function changeTheme(themeName) {
    // Hapus kelas tema yang ada
    document.body.classList.remove('theme-default', 'theme-modern', 'theme-nature', 'theme-royal', 'theme-dark');
    
    // Tambahkan kelas tema baru
    document.body.classList.add(`theme-${themeName}`);
    
    // Simpan preferensi tema di localStorage
    localStorage.setItem('congklak-theme', themeName);
    
    // Update variabel CSS sesuai tema
    updateThemeVariables(themeName);
    
    // Tampilkan pesan
    displayMessage(`Tema berubah menjadi: ${themeName}`);
}

// Update variabel CSS sesuai tema
function updateThemeVariables(themeName) {
    const root = document.documentElement;
    
    switch (themeName) {
        case 'modern':
            root.style.setProperty('--primary-color', '#3498db');
            root.style.setProperty('--secondary-color', '#ecf0f1');
            root.style.setProperty('--background-color', '#f9f9f9');
            root.style.setProperty('--text-color', '#2c3e50');
            root.style.setProperty('--pit-color', '#3498db');
            root.style.setProperty('--pit-border', '#2980b9');
            root.style.setProperty('--seed-color', '#e74c3c');
            root.style.setProperty('--seed-highlight', '#c0392b');
            root.style.setProperty('--button-color', '#3498db');
            root.style.setProperty('--button-text', '#fff');
            root.style.setProperty('--button-hover', '#2980b9');
            break;
            
        case 'nature':
            root.style.setProperty('--primary-color', '#27ae60');
            root.style.setProperty('--secondary-color', '#daf7e8');
            root.style.setProperty('--background-color', '#f0f9f4');
            root.style.setProperty('--text-color', '#2c3e50');
            root.style.setProperty('--pit-color', '#27ae60');
            root.style.setProperty('--pit-border', '#219653');
            root.style.setProperty('--seed-color', '#f39c12');
            root.style.setProperty('--seed-highlight', '#d35400');
            root.style.setProperty('--button-color', '#27ae60');
            root.style.setProperty('--button-text', '#fff');
            root.style.setProperty('--button-hover', '#219653');
            break;
            
        case 'royal':
            root.style.setProperty('--primary-color', '#9b59b6');
            root.style.setProperty('--secondary-color', '#f5eef8');
            root.style.setProperty('--background-color', '#f9f5fd');
            root.style.setProperty('--text-color', '#34495e');
            root.style.setProperty('--pit-color', '#9b59b6');
            root.style.setProperty('--pit-border', '#8e44ad');
            root.style.setProperty('--seed-color', '#f1c40f');
            root.style.setProperty('--seed-highlight', '#f39c12');
            root.style.setProperty('--button-color', '#9b59b6');
            root.style.setProperty('--button-text', '#fff');
            root.style.setProperty('--button-hover', '#8e44ad');
            break;
            
        case 'dark':
            root.style.setProperty('--primary-color', '#34495e');
            root.style.setProperty('--secondary-color', '#2c3e50');
            root.style.setProperty('--background-color', '#1a1a1a');
            root.style.setProperty('--text-color', '#ecf0f1');
            root.style.setProperty('--pit-color', '#34495e');
            root.style.setProperty('--pit-border', '#2c3e50');
            root.style.setProperty('--seed-color', '#e74c3c');
            root.style.setProperty('--seed-highlight', '#c0392b');
            root.style.setProperty('--button-color', '#3498db');
            root.style.setProperty('--button-text', '#fff');
            root.style.setProperty('--button-hover', '#2980b9');
            break;
            
        default: // default theme
            root.style.setProperty('--primary-color', '#8b5a2b');
            root.style.setProperty('--secondary-color', '#d2b48c');
            root.style.setProperty('--background-color', '#f5f5dc');
            root.style.setProperty('--text-color', '#333');
            root.style.setProperty('--pit-color', '#a0522d');
            root.style.setProperty('--pit-border', '#654321');
            root.style.setProperty('--seed-color', '#654321');
            root.style.setProperty('--seed-highlight', '#8b4513');
            root.style.setProperty('--button-color', '#8b5a2b');
            root.style.setProperty('--button-text', '#fff');
            root.style.setProperty('--button-hover', '#654321');
            break;
    }
}

// Muat tema dari localStorage saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('congklak-theme');
    if (savedTheme) {
        changeTheme(savedTheme);
    }
});

