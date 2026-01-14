# Permainan Dhakon/Congklak

Permainan tradisional Dhakon (Lampung) atau Congklak (Jawa) yang diimplementasikan menggunakan HTML, CSS, dan JavaScript.

## Deskripsi

Permainan Dhakon/Congklak adalah permainan tradisional Indonesia yang dimainkan di atas papan dengan lubang-lubang yang berisi biji-bijian atau kerang kecil. Permainan ini melatih kemampuan berhitung dan strategi.

Fitur-fitur permainan:
- Papan permainan interaktif dengan animasi
- Fitur Change Appearance untuk mengubah tema permainan
- Instruksi cara bermain yang lengkap dan interaktif
- Sistem giliran pemain dan aturan permainan yang sesuai

## Cara Menjalankan Permainan

1. Pastikan semua file berada dalam struktur direktori yang benar:
   ```
   congklak-game/
   ├── index.html
   ├── css/
   │   ├── style.css
   │   ├── theme-preview.css
   │   └── instructions.css
   ├── js/
   │   ├── script.js
   │   ├── theme-manager.js
   │   └── instructions.js
   └── assets/
       ├── images/
       │   ├── backgrounds/
       │   └── seeds/
   ```

2. Buka file `index.html` di browser web modern (Chrome, Firefox, Safari, Edge).

3. Permainan akan langsung dimulai dengan giliran Pemain 1.

## Cara Bermain

1. Permainan dimainkan oleh 2 orang dengan papan yang memiliki 14 lubang kecil (7 untuk setiap pemain) dan 2 lubang besar (lumbung) di kedua ujungnya.

2. Setiap lubang kecil diisi dengan 7 biji. Lubang besar (lumbung) dibiarkan kosong.

3. Pemain 1 memiliki 7 lubang di baris bawah dan lumbung di kanan.

4. Pemain 2 memiliki 7 lubang di baris atas dan lumbung di kiri.

5. Pemain yang mendapat giliran memilih salah satu lubang miliknya yang berisi biji.

6. Biji dari lubang tersebut diambil dan dibagikan satu per satu ke lubang berikutnya searah jarum jam, termasuk lumbung miliknya, tetapi melewati lumbung lawan.

7. Jika biji terakhir jatuh di lumbung miliknya, pemain mendapat giliran tambahan.

8. Jika biji terakhir jatuh di lubang kosong miliknya, pemain dapat mengambil semua biji dari lubang seberang milik lawan dan memasukkannya ke lumbung miliknya.

9. Permainan berakhir ketika semua lubang milik salah satu pemain kosong.

10. Sisa biji yang masih ada di lubang-lubang pemain lainnya dimasukkan ke lumbung pemain tersebut.

11. Pemain dengan jumlah biji terbanyak di lumbungnya adalah pemenang.

## Fitur Change Appearance

Permainan ini menyediakan beberapa tema tampilan yang dapat dipilih sesuai preferensi:

1. Klasik - Tema kayu tradisional dengan warna coklat alami
2. Modern - Tema minimalis dengan warna-warna cerah dan bersih
3. Alam - Tema dengan warna-warna alami dan tekstur daun
4. Kerajaan - Tema mewah dengan warna emas dan ungu
5. Gelap - Tema gelap untuk bermain di malam hari

Untuk mengubah tema, klik tombol "Ganti Tampilan" dan pilih tema yang diinginkan.

## Teknologi yang Digunakan

- HTML5
- CSS3
- JavaScript (ES6+)

## Kredit

Permainan ini dibuat sebagai implementasi digital dari permainan tradisional Dhakon/Congklak Indonesia.

## Lisensi

Hak Cipta © 2025 Permainan Dhakon/Congklak

