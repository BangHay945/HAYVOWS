# 🎬 HAYVOWS SIGNATURE THEME DNA & BLUEPRINT MASTER
*Pedoman Standar Emas Pembuatan Tema Undangan Digital Hayvows*

Dokumen ini adalah pedoman desain (*design bible*) dan standar pengembangan teknis untuk setiap tema baru yang dikembangkan di Hayvows. Tujuannya adalah agar **setiap undangan yang dilihat orang memiliki "jiwa" dan kelas yang khas**, sehingga siapa pun yang melihatnya akan langsung mengenali:  
> *"Ini undangan dari Hayvows — bukan sekadar web undangan biasa, tapi karya film sinematik!"*

---

## 🏛️ 1. FILOSOFI DASAR: THE HAYVOWS FEEL

| Bukan Hayvows ❌ | Hayvows Signature Standard ✨ |
| :--- | :--- |
| Template kaku berkotak-kotak tebal | Majalah editorial elegan melayang di atas foto |
| Emas kuning murni / warna neon silau | *Desaturated luxury* (*Platinum Champagne*, *Warm Slate*, *Blush Taupe*) |
| Background putih/gelap polos statis | *Fixed depth slideshow* foto mempelai yang bergerak lembut di latar |
| Tombol langsung menyala terang di mana-mana | Tombol *charcoal frosted* tenang, baru menyala aksen saat di-hover/tap |
| Animasi membal / bounce kartun | Gerakan lambat, berbobot, dan halus (*slow cubic-bezier cinematic easing*) |
| Sekadar ganti warna (*reskin*) | Konsep arsitektur, pembuka, dan micro-interaction yang orisinal |

---

## 📐 2. PILAR ARSITEKTUR TEMA HAYVOWS

### Pilar 1: Latar Belakang Sinematik Statis (*Fixed Depth Slideshow*)
- **Konsep**: Menghadirkan efek jendela bioskop (*windowing effect*). Foto prewedding/galeri diposisikan `fixed` di latar belakang dengan sistem 2-layer crossfade (berganti mulus setiap 4–5 detik).
- **Overlay Transparan Presisi**: Section Hero, Hari Pernikahan (Event), dan Footer menggunakan lapisan gradasi gelap semi-transparan (20% – 50% opacity). Foto momen mempelai tetap terlihat jelas di balik teks, menciptakan kedalaman 3 dimensi tanpa mengorbankan keterbacaan (*legibility*).

### Pilar 2: Hierarki Tipografi Gaya Majalah Editorial
- **Kombinasi Huruf**:
  - *Serif Elegan* berbobot ringan (*Cormorant Garamond*, *Playfair*, *Cinzel*) untuk nama mempelai, ayat suci, dan heading utama.
  - *Sans-Serif Kapital Bersih* (*Montserrat*, *Plus Jakarta Sans*, *Syne*) dengan spasi huruf renggang (*tracking* 0.25em – 0.5em) untuk label kategori, waktu, dan navigasi.
- **Hairline Dividers**: Garis rambut tipis 1px (`w-8` hingga `w-16`) sebagai penyeimbang arsitektur halaman.
- **Spasi Lapang (*Breathing Whitespace*)**: Ruang kosong vertikal yang murah hati memberi kesan hening, sakral, dan mewah.

### Pilar 3: Perlakuan Tombol & Kartu (*From Charcoal to Accent*)
- **State Default (Normal)**:
  - Tombol dan kartu tidak boleh langsung berwarna mencolok.
  - Gunakan latar gelap charcoal (`#141519` / `#16171b`) berbalut border halus semi-transparan (`white/10` atau `white/15`) dan teks warna ivory lembut (`#f5f3ef`).
  - Ini menjaga agar foto latar tetap menjadi pusat keindahan dan tidak tertutup kotak kaku.
- **State Interaktif (Hover / Tap / Active)**:
  - Barulah bertransisi anggun ke warna aksen tema (*Platinum Champagne* `#d4c4b0`, *Rose Champagne*, *Champagne Moss*, dll) dengan teks gelap kontras (`#0c0d0e`).
  - Dilengkapi bayangan lembut mewah (*ambient shadow*).

### Pilar 4: Audio Player Piringan Hitam (*The Iconic Vinyl Player*)
- Pemutar musik berbentuk piringan hitam (*Vinyl Disc3*) berputar lambat dan mulus (10–12 detik per putaran) saat lagu diputar, dan berhenti tenang saat di-jeda.
- Ikon audio menyatu dengan gaya tombol tema (charcoal border + aksen hover).

### Pilar 5: Performa 60 FPS Mobile-First (Bebas Lag di Android & iPhone)
- **Hindari `clip-path` Rumit**: Di peramban mobile (khususnya Android WebView/Chrome), animasi `clip-path` inset dinamis sering memicu stutter (patah-patah) dan gambar gagal muat.
- **Wajib GPU Acceleration**: Gunakan `opacity`, `transform: translateZ(0)`, dan `scale` dengan easing `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Viewport Sensor Ringan**: Pasang `viewport={{ once: true, amount: 0.05 }}` agar galeri langsung termuat begitu menyentuh layar tanpa menunggu di-scroll penuh.

---

## 💡 3. BLUEPRINT & INOVASI UNTUK TEMA-TEMA BARU (NEXT TEMPLATES)
*Agar setiap tema baru memiliki kepribadian unik dan tidak terasa sekadar "ganti warna", gunakan variasi arsitektur berikut:*

### Konsep A: "The Film Premiere" (Sinematik Bioskop Layar Lebar)
- **Karakter**: Sensasi gala premiere film romantis eksklusif.
- **Rasio Layar**: Format ultra-wide 21:9 (*Cinemascope visual framing*).
- **Mekanisme Pembuka**: *VIP Premiere E-Ticket* dengan barcode, nomor kursi reserved, dan animasi sobek tiket (*torn ticket transition*).
- **Gaya Timeline**: Dinamai seperti babak film (*Act I: The Encounter*, *Act II: The Promise*, *Act III: The Eternity*).
- **Audio Interface**: Audio visualizer bar tipis ala studio film profesional.

### Konsep B: "Modern Atelier / Art Gallery" (Kontemporer Arsitektural)
- **Karakter**: Pameran seni modern kelas dunia, minimalis, dan sangat bersih.
- **Tata Letak**: *Asymmetric Split-screen* di mana sisi kiri adalah foto vertikal penuh dan sisi kanan adalah narasi yang mengalir independen.
- **Mekanisme Pembuka**: Diafragma lensa (*camera aperture iris reveal*) atau bingkai *passe-partout* galeri lukisan.
- **Gaya Tipografi**: Font *Didot / Modern Display Serif* berbobot kontras tebal-tipis tinggi dengan inisial monogram raksasa semi-transparan di latar.
- **Interaksi Galeri**: Foto dengan caption kurasi ala museum seni kontemporer.

### Konsep C: "The Vintage Chronicle" (Naskah Romansa Abadi)
- **Karakter**: Nuansa surat cinta bersejarah, puitis, dan hangat.
- **Mekanisme Pembuka**: Amplop surat cinta eksklusif dengan stempel cap lilin 3D (*Wax Seal Stamp*). Saat ditekan, segel lilin terbuka dengan animasi retak halus.
- **Interaksi Galeri**: *Polaroid Stack* di mana foto galeri seperti tumpukan foto fisik di atas meja kayu yang bisa di-swipe atau digeser satu per satu.
- **Gaya Tipografi**: Sentuhan font tanda tangan kaligrafi autentik (*handcrafted signature*) yang teranimasi seperti ditulis dengan pena emas di atas foto.

---

## 🔗 4. BRANDING & BACKLINK
- Setiap tema wajib menyertakan backlink rapi yang mengarah ke:
  `https://www.hayvows.com` dengan teks tampilan `www.hayvows.com` atau `Hayvows`.
- Diletakkan di bagian footer bawah dan opening cover tanpa mengganggu keindahan desain.

---

## 📋 5. QUALITY ASSURANCE (QA) CHECKLIST
Sebelum merilis tema baru ke produksi:
- [ ] **Sinematik**: Apakah ada rasa magis/sinematik yang kuat saat pertama kali dibuka?
- [ ] **Latar Belakang**: Apakah foto galeri mempelai terlihat hidup di latar belakang tanpa tertutup kotak masif?
- [ ] **Interaksi Tombol**: Apakah tombol berlatar charcoal secara default dan baru menyala saat di-hover/tap?
- [ ] **Performa Ponsel**: Apakah sudah diuji di HP Android & iPhone tanpa animasi patah-patah?
- [ ] **Responsif & Kompatibel**: Apakah form kado, QR E-Pass, RSVP dropdown & manual count, dan countdown berfungsi sempurna?
- [ ] **Backlink**: Apakah backlink mengarah ke `https://www.hayvows.com`?
