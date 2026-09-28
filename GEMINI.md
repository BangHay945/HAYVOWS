# HAYVOWS CORE RULES & SIGNATURE THEME DNA

File ini adalah pedoman mutlak (*mandatory guidelines*) untuk setiap pengembangan tema, komponen, dan fitur di platform undangan pernikahan digital **Hayvows**. 
Setiap tema yang dibangun harus memiliki standar kualitas tinggi, berkelas, dan memiliki ciri khas yang kuat sehingga tamu langsung mengenali: *"Ini adalah tema Hayvows!"*

---

## 1. THE HAYVOWS SIGNATURE PHILOSOPHY
- **Bukan Sekadar Undangan Web Biasa**: Undangan Hayvows adalah sebuah **pengalaman film sinematik (*Cinematic Wedding Experience*)**.
- **Understated Luxury (Mewah yang Tenang)**: Hindari warna emas kuning terang/neon, efek norak, atau animasi membal/bounce kartun. Kemewahan Hayvows hadir dari keheningan, tipografi berkelas, tata letak majalah editorial, dan transisi halus.
- **Bukan Sekadar Ganti Warna (*No Reskinning*)**: Setiap tema baru harus memiliki konsep arsitektur visual, mekanisme pembuka, dan micro-interaction yang orisinal.

---

## 2. PILAR DESAIN UTAMA (MANDATORY)

### A. Latar Belakang Sinematik Statis (*Fixed Depth Slideshow / Windowing*)
- Section utama (Hero, Waktu Acara/Event, dan Footer) didesain dengan teknik **fixed stationary background slideshow** foto prewedding/galeri dengan cross-fade halus (2 layer cross-dissolve).
- Foto diberi lapisan *translucent dark wash / veil* yang presisi (20% – 50% opacity) agar teks dan countdown tetap terbaca jelas (*legible*), namun foto momen mempelai tetap hidup dan dinamis terlihat saat di-scroll.
- Hindari kotak hitam masif 100% pekat yang menutup keindahan foto latar belakang.

### B. Hierarki Tipografi Gaya Majalah Editorial
- **Heading / Nama Mempelai**: Gunakan font Serif berkualitas tinggi berbobot ringan (*Cormorant Garamond*, *Cinzel*, *Playfair Display*).
- **Label Kategori / Tanggal / Subtitle**: Gunakan font Sans-Serif kapital kecil dengan *letter-spacing* renggang (`tracking-[0.25em]` s/d `tracking-[0.5em]`).
- **Pemisah Garis Rambut (*Hairline Divider*)**: Gunakan garis 1px tipis (`w-8` s/d `w-16`) sebagai penyeimbang arsitektur halaman.
- **Whitespace Bernapas**: Berikan jarak vertikal yang lapang (*generous vertical padding*) untuk menciptakan nuansa tenang dan mahal.

### C. Logika Tombol & Kartu: *From Dark Charcoal to Accent*
- **Kondisi Normal (Default)**:
  - Tombol dan kartu **DILARANG** langsung berwarna emas/aksesoris menyala terang secara default.
  - Gunakan latar gelap pekat/charcoal (`#16171b` / `#121316` / `#141519`) berbalut border halus transparan (`border-white/10` s/d `border-white/15`) dan teks tenang (`#f5f3ef`).
  - Ini menjaga agar foto latar tetap menjadi fokus perhatian dan layout tidak bising.
- **Kondisi Interaktif (Hover / Tap / Active)**:
  - Barulah bertransisi anggun ke warna aksen tema (*Platinum Champagne* `#d4c4b0`, *Rose Champagne*, *Sage Gold*, dll) dengan teks gelap kontras (`#0c0d0e`).
  - Bayangan (*shadow*) halus dan mewah (`shadow-[0_8px_30px_rgba(...,0.35)]`).

### D. Warna Aksen Muted (*Desaturated Luxury*)
- Warna aksen selalu bernuansa mewah yang teredam:
  - *Platinum Champagne* (`#d4c4b0`) bukan `#ffd700` atau kuning pekat.
  - *Platinum Ivory* (`#f5f3ef`) untuk teks utama.
  - *Midnight Charcoal* (`#0c0d0e` / `#121316` / `#16171b`) untuk base gelap.

### E. Pemutar Musik Ikonik (*Audio Interface*)
- Pemutar musik minimalis yang anggun (seperti piringan hitam *Vinyl Disc3* berputar perlahan saat *playing* dan berhenti tenang saat *paused*).
- Tanpa efek ping atau lingkaran kedip yang berlebihan.

---

## 3. STANDAR PERFORMA MOBILE (60 FPS DI ANDROID & IPHONE)
- **Hindari `clip-path` Rumit untuk Animasi Scroll di Mobile**: `clip-path` dinamis sering menyebabkan lag dan gagal muat gambar pada peramban mobile (Android Chrome/WebView).
- **Gunakan GPU Acceleration**: Gunakan `opacity`, `transform: translateZ(0)`, dan `scale` dengan easing `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Viewport Trigger yang Aman**: Gunakan `viewport={{ once: true, amount: 0.05 }}` agar galeri dan kartu langsung termuat segera saat masuk layar tanpa harus di-scroll terlalu jauh.

---

## 4. ELEMEN BRANDING & BACKLINK
- Footer dan Cover wajib memuat backlink resmi ke:
  `https://www.hayvows.com` dengan teks `www.hayvows.com` atau `Hayvows`.

---

## 5. CHECKLIST PENGEMBANGAN TEMA BARU
Sebelum menyelesaikan tema baru, verifikasi poin-poin berikut:
1. [ ] Apakah temanya memiliki sensasi sinematik yang mendalam?
2. [ ] Apakah foto mempelai tetap terlihat cantik di background tanpa terhalang kotak kaku?
3. [ ] Apakah tombol memiliki state default charcoal dan baru menyala saat di-hover/tap?
4. [ ] Apakah sudah diuji di resolusi mobile (Android & iOS) bebas glitch dan 60 FPS?
5. [ ] Apakah form kado/amplop digital, RSVP, dan countdown selaras 100% dengan palet tema?
6. [ ] Apakah backlink footer mengarah ke `www.hayvows.com`?
