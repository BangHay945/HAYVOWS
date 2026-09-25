export interface WhatsAppPreset {
  id: string;
  name: string;
  badge: string;
  icon: string;
  description: string;
  template: string;
}

export const WHATSAPP_PRESETS: WhatsAppPreset[] = [
  {
    id: "formal",
    name: "Formal / Nasional",
    badge: "FORMAL",
    icon: "📋",
    description: "Bahasa baku, santun, dan terhormat. Sangat cocok untuk tamu umum, rekan kerja, atasan, dan relasi bisnis.",
    template: `Kepada Yth.
Bapak/Ibu/Saudara/i: *{nama}*

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara resepsi pernikahan kami:

💍 *{mempelai}*

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu bagi kedua mempelai.

Informasi lengkap mengenai waktu acara, lokasi venue, serta konfirmasi kehadiran (RSVP) dapat diakses melalui tautan undangan digital berikut:
🔗 {link}

Atas kehadiran dan doa restu Bapak/Ibu/Saudara/i, kami ucapkan terima kasih yang sebesar-besarnya.

Hormat kami yang berbahagia,
*{mempelai}* & Keluarga`,
  },
  {
    id: "islami",
    name: "Nuansa Islami",
    badge: "ISLAMI",
    icon: "🌙",
    description: "Salam islami, bismillah, kutipan surat QS. Ar-Rum: 21, doa sakinah mawaddah warahmah.",
    template: `Assalamu'alaikum Warahmatullahi Wabarakatuh

Bismillahirrohmanirrohim.
Maha Suci Allah SWT yang telah menciptakan makhluk-Nya berpasang-pasangan.

_“Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.” (QS. Ar-Rum: 21)_

Kepada Yth.
Bapak/Ibu/Saudara/i: *{nama}*

Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri walimatul 'ursy pernikahan kami:

💍 *{mempelai}*

Doa restu serta kehadiran Bapak/Ibu/Saudara/i merupakan kehormatan dan kebahagiaan yang sangat besar bagi kami.

Detail waktu, lokasi acara, dan konfirmasi kehadiran (RSVP) dapat diakses melalui tautan undangan resmi berikut:
🔗 {link}

Semoga Allah SWT membalas segala kebaikan dan doa restu Bapak/Ibu/Saudara/i.
Wassalamu'alaikum Warahmatullahi Wabarakatuh.

Salam ta'dzim & doa kami,
*{mempelai}* & Keluarga`,
  },
  {
    id: "kristiani",
    name: "Nuansa Kristiani",
    badge: "KRISTIANI",
    icon: "✝️",
    description: "Salam damai Kristus, firman Tuhan Matius 19:6, dan persekutuan ikrar pernikahan kudus.",
    template: `Shalom, Salam Sejahtera dalam Kasih Tuhan Yesus Kristus

_“Demikianlah mereka bukan lagi dua, melainkan satu. Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia.” (Matius 19:6)_

Kepada Yth.
Bapak/Ibu/Saudara/i: *{nama}*

Atas kasih karunia, berkat, dan penyertaan Tuhan Yang Maha Pengasih, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk bersama-sama menyaksikan dan memberkati ikrar suci pernikahan kami:

💍 *{mempelai}*

Kehadiran dan doa restu Bapak/Ibu/Saudara/i menjadi berkat yang sangat berharga bagi langkah awal kami dalam membangun mahligai rumah tangga yang berkenan di hadapan-Nya.

Rangkaian acara, panduan ibadah pemberkatan, lokasi, dan konfirmasi kehadiran (RSVP) dapat diakses melalui tautan berikut:
🔗 {link}

Terima kasih atas kasih dan dukungan yang senantiasa menyertai kami. Kiranya damai sejahtera Tuhan selalu menyertai kita sekalian.

Salam kasih & hormat kami,
*{mempelai}*`,
  },
  {
    id: "kasual",
    name: "Kasual & Sahabat",
    badge: "KASUAL",
    icon: "🎉",
    description: "Gaya santai, ceria, dan akrab khusus untuk teman sebaya, sahabat tongkrongan, rekan kerja akrab, dan bestie.",
    template: `Halo {nama}! 👋✨

Good news! Akhirnya momen yang ditunggu-tunggu tiba juga, we’re officially getting married! 🥂💍

*{mempelai}*

Pernikahan kami tentu terasa belum lengkap tanpa kehadiran kamu. Kami mengundang kamu untuk ikut kumpul, makan-makan bareng, dan seru-seruan di hari spesial kami!

Untuk info rundown acara, panduan navigasi Google Maps, galeri foto, dan konfirmasi kehadiran (RSVP), langsung klik link di bawah ya:
🔗 {link}

Simpan tanggalnya ya dan jangan sampai kelewatan! Can't wait to see you and celebrate together! 🥳💃

Warm hugs & love,
*{mempelai}*`,
  },
  {
    id: "jawa",
    name: "Adat Jawa (Krama Inggil)",
    badge: "JAWA",
    icon: "🪷",
    description: "Basa Jawi krama inggil ingkang santun tumrap sedherek sepuh, sanak kadang, kaliyan para pinisepuh.",
    template: `Nuwun sewu, katur dhumateng Panjenenganipun
Bpk/Ibu/Sedherek: *{nama}*

Kanthi hangayubagya saha hangajab berkahing Gusti Ingkang Maha Agung, keparenga kula sakulawarga ngaturi rawuh panjenengan wonten ing pahargyan dhauping putra-putri kami:

💍 *{mempelai}*

Rawuh saha donga pangestu panjenengan sedaya dados kabingahan tumrap kula sakulawarga ingkang nembe ngadhahi hajat punika.

Serat ulem digital saha katrangan jangkep babagan wedal sarta papan pahargyan saged dipun bikak lumantar tautan punika:
🔗 {link}

Matur nuwun sanget awit kawigatosan, rawuh, saha sih tresna donga pangestunipun.

Atur taklim kula sakulawarga,
*{mempelai}*`,
  },
];
