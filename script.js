const content = document.getElementById("content");
const materiButtons = document.querySelectorAll("nav.levels button");
const progressFill = document.getElementById("progress-fill");
const materiInfo = document.getElementById("materi-info");

let progressData = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };


let skor = 0;
let streak = 0;
let speakCount = 0;

// === Audio Feedback ===
const soundBenar = new Audio("sounds/correct.mp3");
const soundSalah = new Audio("sounds/wrong.mp3");


const materi = {
  1: `<div id="materi1-container"></div>`, // Pengenalan Huruf
  2: `<h2>🔈 Pengenalan Bunyi</h2>`,
  3: `<h2>🧩 Penggabungan Suku Kata</h2>`,
  4: `<h2>📖 Membaca Kata Sederhana</h2>`,
  5: `<h2>📝 Membaca Kalimat Sederhana</h2>`,
  6: `<h2>❓ Tanya Jawab</h2>`
};

function resetStatus() {
  console.log("🔄 Reset semua status...");

  skor = 0;
  streak = 0;
  speakCount = 0;
  progressData = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

  // reset tampilan progress bar dan panel status
  const progressFill = document.getElementById("progress-fill");
  if (progressFill) progressFill.style.width = "0%";

  const scoreEl = document.getElementById("score");
  const streakEl = document.getElementById("streak");
  const speakEl = document.getElementById("speak-count");
  if (scoreEl) scoreEl.textContent = "0";
  if (streakEl) streakEl.textContent = "0";
  if (speakEl) speakEl.textContent = "0";
  
  const btnUcap = document.querySelector(".btn-ucap");
	if (btnUcap) {
	  btnUcap.disabled = false;
	  btnUcap.style.opacity = "1";
	  btnUcap.style.cursor = "pointer";
	  btnUcap.textContent = "🎙️ Ucapkan";
	}

}


function playSoundBenar() {
  const ctx = new AudioContext();
  const o = ctx.createOscillator();
  const g = ctx.createGain();

  o.type = "sine";
  o.frequency.value = 700; // nada tinggi positif
  o.connect(g);
  g.connect(ctx.destination);
  g.gain.setValueAtTime(0.2, ctx.currentTime);
  o.start();
  o.stop(ctx.currentTime + 0.25);
}

function playSoundSalah() {
  const ctx = new AudioContext();
  const o = ctx.createOscillator();
  const g = ctx.createGain();

  o.type = "square";
  o.frequency.value = 200; // nada rendah negatif
  o.connect(g);
  g.connect(ctx.destination);
  g.gain.setValueAtTime(0.2, ctx.currentTime);
  o.start();
  o.stop(ctx.currentTime + 0.25);
}

function restartAnimation(element, className) {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}

function tampilkanMateri(id) {
  const content = document.getElementById("content");
  const materiInfo = document.getElementById("materi-info");
  const progressFill = document.getElementById("progress-fill");
  const buttons = document.querySelectorAll("nav.levels button");

  // Hilangkan status aktif di semua tombol
  buttons.forEach(btn => btn.classList.remove("active"));
  const aktif = document.querySelector(`[data-materi="${id}"]`);
  if (aktif) aktif.classList.add("active");

  // Animasi keluar
  content.classList.remove("show");
  resetStatus();


  setTimeout(() => {
    // Masukkan konten materi ke halaman
    content.innerHTML = materi[id];

    // Update teks dan progress bar
    materiInfo.textContent = `Materi ${id}: ${aktif ? aktif.querySelector(".title").textContent : ""}`;
    progressFill.style.width = "0%";

    // Animasi masuk
    requestAnimationFrame(() => {
      content.classList.add("show");
    });

    // Jika materi ke-1, panggil game huruf
    if (id == 1) {
		setTimeout(() => mulaiMateri1(), 200);
	}
	if (id == 2) {
		setTimeout(() => mulaiMateri2(), 200);
	}
	if (id == 3) {
		setTimeout(() => mulaiMateri3(), 200);
	}
	if (id == 4) {
		setTimeout(() => mulaiMateri4(), 200);
	}
	if (id == 5) {
		setTimeout(() => mulaiMateri5(), 200);
	}
	if (id == 6) {
		setTimeout(() => mulaiMateri6(), 200);
	}

	
  }, 200);
}



// --- Ganti Materi ---
materiButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    materiButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const id = btn.dataset.materi;
    const title = btn.querySelector(".title").textContent;

    content.innerHTML = materi[id];
    materiInfo.textContent = `Materi ${id}: ${title}`;
    progressFill.style.width = progressData[id] + "%";
//    document.querySelector(".level").textContent = id;
  });
});

materiButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.materi;
    tampilkanMateri(id);
  });
});

// Saat pertama kali halaman dibuka, tampilkan Materi 1
window.addEventListener("DOMContentLoaded", () => {
  tampilkanMateri(1);
});


// --- Progress per materi ---
function tambahProgress(id) {
  if (progressData[id] < 100) {
    progressData[id] += 20;
    progressFill.style.width = progressData[id] + "%";
  }
}

// --- Suara ---
function dengarSuara(huruf) {
  const utter = new SpeechSynthesisUtterance(huruf);
  utter.lang = "id-ID";
  speechSynthesis.speak(utter);

  let id = document.querySelector("nav button.active").dataset.materi;
  tambahProgress(id);
}

// --- Background huruf bergerak pelan ---
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawBackground();
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function drawBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const colors = [
    "#ff4d6d", "#ff9f1c", "#2ec4b6", "#3a86ff",
    "#8338ec", "#ff006e", "#06d6a0", "#ffd166"
  ];

  const gridSize = 120;
  const offset = 40;

  for (let y = gridSize / 2; y < canvas.height; y += gridSize) {
    for (let x = gridSize / 2; x < canvas.width; x += gridSize) {
      const char = letters[Math.floor(Math.random() * letters.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const fontSize = Math.random() * 30 + 30; // ukuran huruf 30–60px
      ctx.font = `bold ${fontSize}px Poppins, Arial, sans-serif`;
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.25;
      ctx.fillText(
        char,
        x + (Math.random() * offset - offset / 2),
        y + (Math.random() * offset - offset / 2)
      );
    }
  }
  ctx.globalAlpha = 1;
}

// === Update Panel Status ===
function updateStatusPanel() {
  const scoreEl = document.getElementById("score");
  const streakEl = document.getElementById("streak");
  const speakEl = document.getElementById("speak-count");

  scoreEl.textContent = skor;
  streakEl.textContent = streak;
  speakEl.textContent = speakCount;

  // Efek animasi kecil saat berubah
  [scoreEl, streakEl, speakEl].forEach(el => {
    el.classList.remove("updated");
    void el.offsetWidth; // reset animasi agar bisa diputar ulang
    el.classList.add("updated");
  });
}

// ==================== MATERI 1: HURUF & SUARA ====================

const hurufList = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
let totalHuruf = hurufList.length; // 26 huruf total
let hurufUrut = [];
let hurufSekarang = "";
let indexSoal = 0;

function mulaiMateri1() {
  const container = document.getElementById("materi1-container");
  if (!container) return;

  container.innerHTML = `
    <div class="materi1">
      <h3>🅰️ Mengenal Huruf & Suara</h3>
	  <div id="tipeHuruf" class="tipe-huruf">Huruf Vokal</div>
      <div class="huruf-utama" id="hurufUtama">A</div>
      <div class="tombol-aksi">
        <button class="btn-dengar" onclick="dengarSuaraHuruf()">🔊 Dengar Suara</button>
        <button class="btn-ucap" onclick="mulaiUcap()">🎙️ Ucapkan</button>
      </div>
      <p id="feedback">Klik huruf yang sama!</p>
      <div class="pilihan-huruf" id="pilihanHuruf"></div>
    </div>
  `;

  indexSoal = 0;
  skor = 0;
  acakHuruf();
}

function acakHuruf() {
  hurufUrut = hurufList.sort(() => Math.random() - 0.5);
  tampilkanSoal();
}

function tampilkanSoal() {
  hurufSekarang = hurufUrut[indexSoal];

  // tentukan apakah huruf utama ditampilkan besar atau kecil
  const isLower = Math.random() < 0.5;
  const tampilHuruf = isLower ? hurufSekarang.toLowerCase() : hurufSekarang.toUpperCase();

  // simpan format tampilannya supaya bisa disamakan di pilihan
  const formatHuruf = isLower ? "lower" : "upper";

  document.getElementById("hurufUtama").textContent = tampilHuruf;
  document.getElementById("feedback").textContent = "Klik huruf yang sama!";

  // === Tentukan huruf vokal / konsonan ===
  const vokal = ["A", "I", "U", "E", "O"];
  const tipeHuruf = document.getElementById("tipeHuruf");
  if (vokal.includes(hurufSekarang)) {
    tipeHuruf.textContent = "Huruf Vokal";
    tipeHuruf.style.background = "#fef9c3";
    tipeHuruf.style.color = "#ca8a04";
  } else {
    tipeHuruf.textContent = "Huruf Konsonan";
    tipeHuruf.style.background = "#e0f2fe";
    tipeHuruf.style.color = "#1d4ed8";
  }

  updateProgress();

  // buat pilihan acak
  const pilihanDasar = buatPilihan(hurufSekarang);
  const pilihan = pilihanDasar.map(h =>
    formatHuruf === "lower" ? h.toLowerCase() : h.toUpperCase()
  );

  const container = document.getElementById("pilihanHuruf");
  container.innerHTML = "";
  pilihan.forEach(h => {
    const btn = document.createElement("button");
    btn.textContent = h;
    btn.onclick = () => periksaJawaban(h);
    container.appendChild(btn);
  });
  
  // Aktifkan kembali tombol ucap saat soal baru muncul
	// Aktifkan kembali tombol ucap saat soal baru muncul
	const btnUcap = document.querySelector(".btn-ucap");
	if (btnUcap) {
	  btnUcap.disabled = false;
	  btnUcap.style.opacity = "1";
	  btnUcap.style.cursor = "pointer";
	  btnUcap.textContent = "🎙️ Ucapkan";
	}
	
recognizedOnce = false;

  aturUkuranKotak();
}




function buatPilihan(benar) {
  let pilihan = [benar];
  while (pilihan.length < 6) {
    let huruf = hurufList[Math.floor(Math.random() * hurufList.length)];
    if (!pilihan.includes(huruf)) pilihan.push(huruf);
  }
  return pilihan.sort(() => Math.random() - 0.5);
}

function playAnimation(el, animationClass) {
  if (!el) return;
  el.classList.remove(animationClass);
  void el.offsetWidth; // reflow paksa browser "melupakan" animasi sebelumnya
  el.classList.add(animationClass);

  // otomatis hapus class setelah animasi selesai
  el.addEventListener("animationend", () => {
    el.classList.remove(animationClass);
  }, { once: true });
}


function periksaJawaban(jawaban) {
  const feedback = document.getElementById("feedback");
  const hurufUtama = document.getElementById("hurufUtama");

  if (!hurufUtama) return;

  // Samakan kapitalisasi saat membandingkan
  if (jawaban.toUpperCase() === hurufSekarang.toUpperCase()) {
    feedback.textContent = "Benar! 🎉";
    feedback.style.color = "#22c55e";

    skor += 10;
    streak++;

    playSoundBenar();
    playAnimation(hurufUtama, "bounce"); // animasi benar

    updateStatusPanel();
    updateProgress();

    setTimeout(() => {
      indexSoal++;
      if (indexSoal < hurufUrut.length) {
        tampilkanSoal();
      } else {
        feedback.textContent = "Selesai! Hebat sekali! 🌟";
        updateProgress(true);
      }
    }, 800);

  } else {
    feedback.textContent = "Coba lagi!";
    feedback.style.color = "#ef4444";

    streak = 0; // reset streak jika salah
    playSoundSalah();
    playAnimation(hurufUtama, "shake");

    updateStatusPanel();
  }
}





function dengarSuaraHuruf() {
  const utter = new SpeechSynthesisUtterance(hurufSekarang);
  utter.lang = "id-ID";
  speechSynthesis.speak(utter);
}



let recognition = null;
let isRecognitionStarted = false;
let recognizedOnce = false; // untuk mencegah deteksi ganda


const ejaanHurufID = {
  A: "A",
  B: "BE",
  C: "CE",
  D: "DE",
  E: "E",
  F: "EF",
  G: "GE",
  H: "HA",
  I: "I",
  J: "JE",
  K: "KA",
  L: "EL",
  M: "EM",
  N: "EN",
  O: "O",
  P: "PE",
  Q: "KIU",
  R: "ER",
  S: "ES",
  T: "TE",
  U: "U",
  V: "VE",
  W: "WE",
  X: "IKS",
  Y: "YE",
  Z: "ZED"
};

function setupRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Browser kamu belum mendukung fitur pengenalan suara 🎤. Coba gunakan Google Chrome!");
    return;
  }

  recognition = new SpeechRecognition();

  try {
    recognition.lang = "id-ID";
  } catch {
    recognition.lang = "en-US";
  }

  recognition.continuous = true;        // tetap mendengar
  recognition.interimResults = true;    // tangkap hasil sementara
  recognition.maxAlternatives = 1;

  const feedback = document.getElementById("feedback");

	recognition.onresult = (event) => {
	  if (recognizedOnce) return; // ⛔ hanya proses 1x
	  let hasil = "";
	  for (let i = event.resultIndex; i < event.results.length; i++) {
		hasil += event.results[i][0].transcript;
	  }
	  hasil = hasil.toLowerCase().trim();

	  const feedback = document.getElementById("feedback");
	  const btnUcap = document.querySelector(".btn-ucap");
	  const aktif = document.querySelector("nav.levels button.active");
	  const materiId = aktif ? aktif.dataset.materi : "1";

	  let target = "";
	  if (materiId == "1" && hurufSekarang) target = hurufSekarang.toLowerCase();
	  if (materiId == "2" && bunyiSekarang) target = bunyiSekarang.toLowerCase();
	  if (materiId == "3" && kataSekarang) target = kataSekarang.toLowerCase();
	  if (materiId == "4" && kalimatSekarang) target = kalimatSekarang.toLowerCase();
	  if (materiId == "5" && kalimatPanjangSekarang) target = kalimatPanjangSekarang.toLowerCase();

	  let cocok = false;

	  /* ======================================================
		 MATERI 1 — Pengenalan Huruf Tunggal
		 ====================================================== */
	  if (materiId == "1") {
		const targetEjaan = ejaanHurufID[target.toUpperCase()]?.toLowerCase() || "";
		const hasilBersih = hasil.replace(/\s+/g, "").replace(/[^a-z]/g, "");
		const simHuruf = similarity(hasilBersih, target);
		const simEjaan = similarity(hasilBersih, targetEjaan);

		cocok =
		  hasilBersih === target ||
		  hasilBersih === targetEjaan ||
		  hasilBersih.includes(target) ||
		  hasilBersih.includes(targetEjaan) ||
		  simHuruf > 0.6 ||
		  simEjaan > 0.6;
	  }

	  /* ======================================================
		 MATERI 2 — Pengenalan Bunyi Gabungan
		 ====================================================== */
	  if (materiId == "2" || materiId == "3") {
		let hasilBunyi = hasil
		  .toLowerCase()
		  .replace(/[^a-z]/g, "")
		  .replace(/\s+/g, "")
		  .replace(/h+$/g, "")
		  .replace(/^m+/, "")
		  .replace(/(.)\1{1,}/g, "$1")
		  .trim();

		const simBunyi = similarity(hasilBunyi, target);

		cocok =
		  hasilBunyi === target ||
		  hasilBunyi.includes(target) ||
		  target.includes(hasilBunyi) ||
		  simBunyi > 0.6;
	  }
	  
	  /* ======================================================
		   MATERI 4 — Kalimat Sederhana
		   ====================================================== */
		// 🔸 Materi 4: kalimat sederhana (2–3 kata)
if (materiId == "4") {
  const hasilKalimat = hasil
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const targetKalimat = target
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const simKalimat = similarity(hasilKalimat, targetKalimat);

  // Hitung berapa banyak kata cocok
  const hasilKata = hasilKalimat.split(" ");
  const targetKata = targetKalimat.split(" ");
  let cocokKata = hasilKata.filter(k => targetKata.includes(k)).length;
  const rasioCocok = cocokKata / targetKata.length;

  // Harus mirip minimal 80% atau similarity > 0.8
  cocok = simKalimat > 0.8 || rasioCocok >= 0.8;
}

// 🔸 Materi 5: kalimat panjang (≥ 4 kata)
if (materiId == "5") {
  const hasilKalimat = hasil
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const targetKalimat = target
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const simKalimat = similarity(hasilKalimat, targetKalimat);

  // Hitung rasio kata yang cocok
  const hasilKata = hasilKalimat.split(" ");
  const targetKata = targetKalimat.split(" ");
  let cocokKata = hasilKata.filter(k => targetKata.includes(k)).length;
  const rasioCocok = cocokKata / targetKata.length;

  // Untuk kalimat panjang, toleransi sedikit tapi tetap ketat
  cocok = simKalimat > 0.75 || rasioCocok >= 0.7;
}



	  /* ======================================================
		 HASIL AKHIR
		 ====================================================== */
	  if (cocok) {
		recognizedOnce = true;
		feedback.textContent = "Benar pengucapannya! 🥳";
		feedback.style.color = "#22c55e";
		speakCount++;
		playSoundBenar();
		updateStatusPanel();

		if (btnUcap) {
		  btnUcap.disabled = true;
		  btnUcap.style.opacity = "0.6";
		  btnUcap.style.cursor = "not-allowed";
		  btnUcap.textContent = "✅ Sudah Benar";
		}

		recognition._stoppedBecauseCorrect = true;
		recognition.stop();
		isRecognitionStarted = false;
		console.log(`🔚 Recognition berhenti setelah benar [${materiId}]`);
		return;
	  }

	  if (hasil !== "") {
		feedback.textContent = `Kamu bilang: "${hasil}" 😅`;
		feedback.style.color = "#ef4444";
		playSoundSalah();
	  }
	};





  recognition.onerror = (event) => {
    console.error("❌ Error:", event.error);
    feedback.textContent = "Ups, tidak terdengar apa pun 😅";
    feedback.style.color = "#ef4444";
  };

  recognition.onend = () => {
  console.log("🔚 Recognition selesai");
  isRecognitionStarted = false;

  // Jika sesi berhenti karena pengucapan benar → tidak restart
  if (recognition._stoppedBecauseCorrect) {
    recognition._stoppedBecauseCorrect = false; // reset
    return;
  }

  // Jika user tekan ulang tombol dan ingin restart
  if (recognition._restartAfterStop) {
    recognition._restartAfterStop = false;
    console.log("🔁 Mulai ulang recognition setelah stop sebelumnya...");
    mulaiUcap(); // panggil ulang fungsi dengan aman
  } else {
    const feedback = document.getElementById("feedback");
    if (feedback.textContent === "🎙️ Mendengarkan...") {
      feedback.textContent = "Tidak terdengar suara 😅";
      feedback.style.color = "#ef4444";
    }
  }
};

}

// =================== PHONETIC MATCH UNTUK HURUF ===================

// Fungsi untuk menghitung kemiripan string (Levenshtein Distance sederhana)
function similarity(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  const matrix = [];

  // Inisialisasi
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  // Hitung jarak
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // ganti
          matrix[i][j - 1] + 1,     // tambah
          matrix[i - 1][j] + 1      // hapus
        );
      }
    }
  }

  const distance = matrix[b.length][a.length];
  const maxLen = Math.max(a.length, b.length);
  return 1 - distance / maxLen; // hasil 0–1
}


function mulaiUcap() {
  const feedback = document.getElementById("feedback");
  const btnUcap = document.querySelector(".btn-ucap");

  if (!recognition) setupRecognition();

  // Kalau masih aktif, hentikan dulu, nanti otomatis mulai ulang lewat onend
  if (isRecognitionStarted) {
    console.log("🛑 Recognition sedang aktif, dihentikan dulu...");
    recognition.stop();
    // tandai agar setelah stop boleh restart
    recognition._restartAfterStop = true;
    return;
  }

  // Jalankan pengenalan suara
  feedback.textContent = "🎙️ Mendengarkan...";
  feedback.style.color = "#1d4ed8";

  try {
    recognition._restartAfterStop = false; // reset flag
    recognition.start();
    isRecognitionStarted = true;
    console.log("🎤 Recognition dimulai...");
  } catch (err) {
    console.warn("⚠️ Tidak bisa memulai recognition:", err);
    feedback.textContent = "Ups! Mikrofon belum siap 😅";
    feedback.style.color = "#ef4444";
  }
}




function updateProgress(complete = false) {
  const progressFill = document.getElementById("progress-fill");
  const materiInfo = document.getElementById("materi-info");

  if (!progressFill || !materiInfo) return;

  const totalHuruf = hurufList.length; // 26
  const current = complete ? totalHuruf : indexSoal + 1;
  const percentage = complete ? 100 : Math.round((current / totalHuruf) * 100);

  progressFill.style.width = percentage + "%";
  materiInfo.textContent = `Materi 1: Pengenalan Huruf — Huruf ke-${current} dari ${totalHuruf}`;

  // Tambah sparkle saat penuh
  if (percentage === 100) tambahSparkle();
}

function tambahSparkle() {
  const track = document.querySelector(".progress-track");
  if (!track) return;

  const sparkleContainer = document.createElement("div");
  sparkleContainer.classList.add("sparkle");
  track.appendChild(sparkleContainer);

  // Buat beberapa titik cahaya acak
  for (let i = 0; i < 12; i++) {
    const spark = document.createElement("div");
    spark.classList.add("spark");
    spark.style.left = Math.random() * 100 + "%";
    spark.style.animationDelay = (Math.random() * 0.4).toFixed(2) + "s";
    sparkleContainer.appendChild(spark);
  }

  // Hapus setelah animasi selesai
  setTimeout(() => sparkleContainer.remove(), 1200);
}

const bunyiList = [
  // Bunyi Gabungan Huruf (Suku Kata)
  "ba", "mi", "tu", "ke", "so", "le", "ju", "ni", "co", "da",

  // Bunyi Gabungan Huruf (Vokal Rangkap)
  "ai", "ue", "ie", "au", "ia", "oi", "ei", "ou", "eu", "ui",

  // Bunyi Gabungan (Konsonan Rangkap)
  "kh", "ng", "ny", "sy",

  // Bunyi Gabungan (Vokal - Konsonan)
  "as", "in", "om", "ur", "es", "op", "ar", "is", "uf", "en"
];

// ==================== MATERI 2: PENGENALAN BUNYI ====================

let bunyiUrut = [];
let bunyiSekarang = "";
let indexBunyi = 0;

function mulaiMateri2() {
  const content = document.getElementById("content");
  if (!content) return;

  content.innerHTML = `
    <div class="materi2">
      <h3>🔈 Pengenalan Bunyi Gabungan Huruf</h3>
      <div id="kategoriBunyi" class="tipe-huruf">Kategori Bunyi</div>
      <div class="huruf-utama" id="bunyiUtama">ba</div>
      <div class="tombol-aksi">
        <button class="btn-dengar" onclick="dengarSuaraBunyi()">🔊 Dengar Suara</button>
        <button class="btn-ucap" onclick="mulaiUcap()">🎙️ Ucapkan</button>
      </div>
      <p id="feedback">Klik bunyi yang sama!</p>
      <div class="pilihan-huruf" id="pilihanBunyi"></div>
    </div>
  `;

  indexBunyi = 0;
  skor = 0;
  acakBunyi();
}

function acakBunyi() {
  bunyiUrut = bunyiList.sort(() => Math.random() - 0.5);
  tampilkanSoalBunyi();
}

function tampilkanSoalBunyi() {
  bunyiSekarang = bunyiUrut[indexBunyi];
  document.getElementById("bunyiUtama").textContent = bunyiSekarang;
  document.getElementById("feedback").textContent = "Klik bunyi yang sama!";

  // Tentukan kategori bunyi
  const kategoriEl = document.getElementById("kategoriBunyi");
  kategoriEl.textContent = getKategoriBunyi(bunyiSekarang);

  updateProgressBunyi();

  // buat pilihan acak
  const pilihan = buatPilihanBunyi(bunyiSekarang);
  const container = document.getElementById("pilihanBunyi");
  container.innerHTML = "";
  pilihan.forEach(b => {
    const btn = document.createElement("button");
    btn.textContent = b;
    btn.onclick = () => periksaJawabanBunyi(b);
    container.appendChild(btn);
  });

  // reset tombol ucap
  const btnUcap = document.querySelector(".btn-ucap");
  if (btnUcap) {
    btnUcap.disabled = false;
    btnUcap.style.opacity = "1";
    btnUcap.style.cursor = "pointer";
    btnUcap.textContent = "🎙️ Ucapkan";
  }
  
  recognizedOnce = false;
  aturUkuranKotak();

}

function buatPilihanBunyi(benar) {
  let pilihan = [benar];
  while (pilihan.length < 6) {
    let random = bunyiList[Math.floor(Math.random() * bunyiList.length)];
    if (!pilihan.includes(random)) pilihan.push(random);
  }
  return pilihan.sort(() => Math.random() - 0.5);
}

function periksaJawabanBunyi(jawaban) {
  const feedback = document.getElementById("feedback");
  const bunyiUtama = document.getElementById("bunyiUtama");

  if (!bunyiUtama) return;

  if (jawaban.toLowerCase() === bunyiSekarang.toLowerCase()) {
    feedback.textContent = "Benar! 🎉";
    feedback.style.color = "#22c55e";

    skor += 10;
    streak++;

    playSoundBenar();
    playAnimation(bunyiUtama, "bounce");

    updateStatusPanel();
    updateProgressBunyi();

    setTimeout(() => {
      indexBunyi++;
      if (indexBunyi < bunyiUrut.length) {
        tampilkanSoalBunyi();
      } else {
        feedback.textContent = "Selesai! Hebat sekali! 🌟";
        updateProgressBunyi(true);
      }
    }, 800);
  } else {
    feedback.textContent = "Coba lagi!";
    feedback.style.color = "#ef4444";

    streak = 0;
    playSoundSalah();
    playAnimation(bunyiUtama, "shake");

    updateStatusPanel();
  }
}

function dengarSuaraBunyi() {
  const utter = new SpeechSynthesisUtterance(bunyiSekarang);
  utter.lang = "id-ID";
  utter.rate = 0.8;  // sedikit lebih lambat
  utter.pitch = 1.0;
  speechSynthesis.speak(utter);
}


function getKategoriBunyi(b) {
  const sukuKata = ["ba","mi","tu","ke","so","le","ju","ni","co","da"];
  const vokalRangkap = ["ai","ue","ie","au","ia","oi","ei","ou","eu","ui"];
  const konsonanRangkap = ["kh","ng","ny","sy"];
  const vokalKonsonan = ["as","in","om","ur","es","op","ar","is","uf","en"];

  if (sukuKata.includes(b)) return "Suku Kata";
  if (vokalRangkap.includes(b)) return "Vokal Rangkap";
  if (konsonanRangkap.includes(b)) return "Konsonan Rangkap";
  if (vokalKonsonan.includes(b)) return "Vokal - Konsonan";
  return "Bunyi Gabungan";
}

function updateProgressBunyi(complete = false) {
  const progressFill = document.getElementById("progress-fill");
  const materiInfo = document.getElementById("materi-info");

  if (!progressFill || !materiInfo) return;

  const total = bunyiList.length;
  const current = complete ? total : indexBunyi + 1;
  const percentage = complete ? 100 : Math.round((current / total) * 100);

  progressFill.style.width = percentage + "%";
  materiInfo.textContent = `Materi 2: Pengenalan Bunyi — Soal ke-${current} dari ${total}`;

  if (percentage === 100) tambahSparkle();
}

const kataList = [
  // === Suku Kata ===
  "batu", "meja", "tuku", "keji", "sapu", "leca", "juri", "dari", "kutu", "kaki",

  // === Vokal Rangkap ===
  "pandai", "harimau", "amboi", "pulau", "kerbau", "tupai", "rantai", "aduhai", "melambai", "pakai",

  // === Konsonan Rangkap ===
  "khusus", "nyamuk", "syukur", "telinga", "syarat", "ngantuk", "bangun", "nyiram", "nyanyi", "banyak",

  // === KVK-KVK ===
  "gembok", "kulkas", "wortel", "bantal", "mantel", "limbah", "bantah", "intel", "mentah", "lombok",

  // === KV-KV-KV ===
  "boneka", "kelapa", "sepeda", "gurita", "mukena", "kereta", "menara",

  // === KVK-KV ===
  "garpu", "kursi", "pintu", "tempe", "panda",

  // === KV-KVKK ===
  "burung", "kacang", "terong", "kerang", "bawang"
];

// ==================== MATERI 3: PENGGABUNGAN SUKU KATA ====================

let kataUrut = [];
let kataSekarang = "";
let indexKata = 0;

function mulaiMateri3() {
  const content = document.getElementById("content");
  if (!content) return;

  content.innerHTML = `
    <div class="materi3">
      <h3>📖 Penggabungan Suku Kata</h3>
      <div id="kategoriKata" class="tipe-huruf">Kategori</div>
      <div class="huruf-utama" id="kataUtama">Batu</div>
      <div class="tombol-aksi">
        <button class="btn-dengar" onclick="dengarSuaraKata()">🔊 Dengar Suara</button>
        <button class="btn-ucap" onclick="mulaiUcap()">🎙️ Ucapkan</button>
      </div>
      <p id="feedback">Klik kata yang sama!</p>
      <div class="pilihan-huruf" id="pilihanKata"></div>
    </div>
  `;

  indexKata = 0;
  skor = 0;
  acakKata();
}

function acakKata() {
  kataUrut = kataList.sort(() => Math.random() - 0.5);
  tampilkanSoalKata();
}

function tampilkanSoalKata() {
  kataSekarang = kataUrut[indexKata];
  document.getElementById("kataUtama").textContent = kataSekarang;
  document.getElementById("feedback").textContent = "Klik kata yang sama!";
  document.getElementById("kategoriKata").textContent = getKategoriKata(kataSekarang);

  updateProgressKata();

  // buat pilihan acak
  const pilihan = buatPilihanKata(kataSekarang);
  const container = document.getElementById("pilihanKata");
  container.innerHTML = "";
  pilihan.forEach(k => {
    const btn = document.createElement("button");
    btn.textContent = k;
    btn.onclick = () => periksaJawabanKata(k);
    container.appendChild(btn);
  });

  recognizedOnce = false; // reset flag pengucapan
  const btnUcap = document.querySelector(".btn-ucap");
  if (btnUcap) {
    btnUcap.disabled = false;
    btnUcap.style.opacity = "1";
    btnUcap.style.cursor = "pointer";
    btnUcap.textContent = "🎙️ Ucapkan";
  }
  
aturUkuranKotak();  
}

function buatPilihanKata(benar) {
  let pilihan = [benar];
  while (pilihan.length < 6) {
    let random = kataList[Math.floor(Math.random() * kataList.length)];
    if (!pilihan.includes(random)) pilihan.push(random);
  }
  return pilihan.sort(() => Math.random() - 0.5);
}

function periksaJawabanKata(jawaban) {
  const feedback = document.getElementById("feedback");
  const kataUtama = document.getElementById("kataUtama");

  if (jawaban.toLowerCase() === kataSekarang.toLowerCase()) {
    feedback.textContent = "Benar! 🎉";
    feedback.style.color = "#22c55e";
    skor += 10;
    streak++;
    playSoundBenar();
    playAnimation(kataUtama, "bounce");
    updateStatusPanel();
    updateProgressKata();

    setTimeout(() => {
      indexKata++;
      if (indexKata < kataUrut.length) {
        tampilkanSoalKata();
      } else {
        feedback.textContent = "Selesai! Hebat sekali! 🌟";
        updateProgressKata(true);
      }
    }, 800);
  } else {
    feedback.textContent = "Coba lagi!";
    feedback.style.color = "#ef4444";
    streak = 0;
    playSoundSalah();
    playAnimation(kataUtama, "shake");
    updateStatusPanel();
  }
}

function getKategoriKata(kata) {
  const sukuKata = ["batu","meja","tuku","keji","sapu","leca","juri","dari","kutu","kaki"];
  const vokalRangkap = ["pandai","harimau","amboi","pulau","kerbau","tupai","rantai","aduhai","melambai","pakai"];
  const konsonanRangkap = ["khusus","nyamuk","syukur","telinga","syarat","ngantuk","bangun","nyiram","nyanyi","banyak"];
  const kvkkvk = ["gembok","kulkas","wortel","bantal","mantel","limbah","bantah","intel","mentah","lombok"];
  const kvkvkv = ["boneka","kelapa","sepeda","gurita","mukena","kereta","menara"];
  const kvkkv = ["garpu","kursi","pintu","tempe","panda"];
  const kvkvkk = ["burung","kacang","terong","kerang","bawang"];

  if (sukuKata.includes(kata)) return "Suku Kata";
  if (vokalRangkap.includes(kata)) return "Vokal Rangkap";
  if (konsonanRangkap.includes(kata)) return "Konsonan Rangkap";
  if (kvkkvk.includes(kata)) return "KVK-KVK";
  if (kvkvkv.includes(kata)) return "KV-KV-KV";
  if (kvkkv.includes(kata)) return "KVK-KV";
  if (kvkvkk.includes(kata)) return "KV-KVKK";
  return "Kata Sederhana";
}

function updateProgressKata(complete = false) {
  const progressFill = document.getElementById("progress-fill");
  const materiInfo = document.getElementById("materi-info");
  const total = kataList.length;
  const current = complete ? total : indexKata + 1;
  const percent = Math.round((current / total) * 100);
  progressFill.style.width = percent + "%";
  materiInfo.textContent = `Materi 3: Penggabungan Suku Kata — Soal ke-${current} dari ${total}`;
}

// Sesuaikan ukuran kotak berdasarkan panjang teks
aturUkuranKotak();

function aturUkuranKotak() {
  const kotak = document.querySelector(".huruf-utama");
  if (!kotak) return;
  const teks = kotak.textContent.trim();
  const panjang = teks.length;

  // Hitung lebar dinamis
  let baseWidth = 150;
  let extra = panjang * 25;
  let width = Math.min(baseWidth + extra, window.innerWidth * 0.9);
  kotak.style.width = width + "px";

  // Sesuaikan ukuran font berdasarkan panjang teks
  if (panjang <= 2) {
    kotak.style.fontSize = "clamp(60px, 8vw, 90px)";
  } else if (panjang <= 5) {
    kotak.style.fontSize = "clamp(50px, 6vw, 80px)";
  } else if (panjang <= 8) {
    kotak.style.fontSize = "clamp(40px, 5vw, 70px)";
  } else {
    kotak.style.fontSize = "clamp(30px, 4vw, 60px)";
  }
}

// ================================
// 🔊 DENGAR SUARA UNTUK MATERI 3
// ================================
function dengarSuaraKata() {
  const kataEl = document.getElementById("kataUtama");
  if (!kataEl) {
    console.warn("❗ Tidak ada elemen kataUtama di halaman.");
    return;
  }

  const kata = kataEl.textContent.trim();
  if (!kata) return;

  const utter = new SpeechSynthesisUtterance(kata);
  utter.lang = "id-ID";          // Bahasa Indonesia
  utter.rate = 0.9;              // Kecepatan bicara (lebih lambat biar jelas)
  utter.pitch = 1;               // Nada normal
  utter.volume = 1;              // Volume penuh

  // Jika suara tersedia, pilih yang berbahasa Indonesia
  const voices = window.speechSynthesis.getVoices();
  const indoVoice = voices.find(v => v.lang === "id-ID");
  if (indoVoice) utter.voice = indoVoice;

  window.speechSynthesis.cancel(); // hentikan bicara sebelumnya
  window.speechSynthesis.speak(utter);

  console.log(`🔊 Mengucapkan kata: ${kata}`);
}

// ==================== MATERI 4: KALIMAT SEDERHANA DENGAN EMOJI ====================

const kalimatList = [
  "Masak Nasi",
  "Buku Baru",
  "Sepak Bola",
  "Jalan Kaki",
  "Balap Karung",
  "Siti sedang berjalan",
  "Ibu masak nasi",
  "Buku Siti baru",
  "Dayu suka berenang",
  "Kenzo senang belajar"
];

// 🖼️ Daftar emoji ilustrasi untuk setiap kalimat
const kalimatEmoji = {
  "Masak Nasi": "🍚👩‍🍳",
  "Buku Baru": "📘✨",
  "Sepak Bola": "⚽🏃‍♂️",
  "Jalan Kaki": "🚶‍♂️👣",
  "Balap Karung": "🏃‍♂️🥇👜",
  "Siti sedang berjalan": "🚶‍♀️😊",
  "Ibu masak nasi": "👩‍🍳🍛",
  "Buku Siti baru": "📖👧✨",
  "Dayu suka berenang": "🏊‍♀️🌊",
  "Kenzo senang belajar": "👦📚😁"
};

let kalimatUrut = [];
let kalimatSekarang = "";
let indexKalimat = 0;

function mulaiMateri4() {
  const content = document.getElementById("content");
  if (!content) return;

  content.innerHTML = `
    <div class="materi4">
      <h3>📝 Membaca Kalimat Sederhana</h3>
      <div id="kategoriKalimat" class="tipe-huruf">Kalimat</div>
      <div class="huruf-utama" id="kalimatUtama">🍚👩‍🍳</div>
      <div class="tombol-aksi">
        <button class="btn-dengar" onclick="dengarSuaraKalimat()">🔊 Dengar Kalimat</button>
        <button class="btn-ucap" onclick="mulaiUcap()">🎙️ Ucapkan</button>
      </div>
      <p id="feedback">Pilih kalimat yang sesuai dengan gambar!</p>
      <div class="pilihan-huruf" id="pilihanKalimat"></div>
    </div>
  `;

  indexKalimat = 0;
  skor = 0;
  acakKalimat();
}

function acakKalimat() {
  kalimatUrut = kalimatList.sort(() => Math.random() - 0.5);
  tampilkanSoalKalimat();
}

function tampilkanSoalKalimat() {
  kalimatSekarang = kalimatUrut[indexKalimat];
  const emoji = kalimatEmoji[kalimatSekarang] || "❓";

  // 🪄 tampilkan emoji di kotak besar dan teks soal di keterangan kecil
  document.getElementById("kalimatUtama").textContent = emoji;
  document.getElementById("kategoriKalimat").textContent = kalimatSekarang;
  document.getElementById("feedback").textContent = "Pilih kalimat yang sesuai dengan gambar!";

  updateProgressKalimat();

  const pilihan = buatPilihanKalimat(kalimatSekarang);
  const container = document.getElementById("pilihanKalimat");
  container.innerHTML = "";
  pilihan.forEach(k => {
    const btn = document.createElement("button");
    btn.textContent = k;
    btn.onclick = () => periksaJawabanKalimat(k);
    container.appendChild(btn);
  });

  recognizedOnce = false;
  const btnUcap = document.querySelector(".btn-ucap");
  if (btnUcap) {
    btnUcap.disabled = false;
    btnUcap.style.opacity = "1";
    btnUcap.style.cursor = "pointer";
    btnUcap.textContent = "🎙️ Ucapkan";
  }

  aturUkuranKotak();
}

function buatPilihanKalimat(benar) {
  let pilihan = [benar];
  while (pilihan.length < 6) {
    let random = kalimatList[Math.floor(Math.random() * kalimatList.length)];
    if (!pilihan.includes(random)) pilihan.push(random);
  }
  return pilihan.sort(() => Math.random() - 0.5);
}

function periksaJawabanKalimat(jawaban) {
  const feedback = document.getElementById("feedback");
  const kalimatUtama = document.getElementById("kalimatUtama");

  if (jawaban.toLowerCase() === kalimatSekarang.toLowerCase()) {
    feedback.textContent = "Benar! 🎉";
    feedback.style.color = "#22c55e";
    skor += 10;
    streak++;
    playSoundBenar();
    playAnimation(kalimatUtama, "bounce");
    updateStatusPanel();
    updateProgressKalimat();

    setTimeout(() => {
      indexKalimat++;
      if (indexKalimat < kalimatUrut.length) {
        tampilkanSoalKalimat();
      } else {
        feedback.textContent = "Selesai! Hebat sekali! 🌟";
        updateProgressKalimat(true);
      }
    }, 800);
  } else {
    feedback.textContent = "Coba lagi!";
    feedback.style.color = "#ef4444";
    streak = 0;
    playSoundSalah();
    playAnimation(kalimatUtama, "shake");
    updateStatusPanel();
  }
}

function updateProgressKalimat(complete = false) {
  const progressFill = document.getElementById("progress-fill");
  const materiInfo = document.getElementById("materi-info");
  const total = kalimatList.length;
  const current = complete ? total : indexKalimat + 1;
  const percent = Math.round((current / total) * 100);
  progressFill.style.width = percent + "%";
  materiInfo.textContent = `Materi 4: Kalimat Sederhana — Soal ke-${current} dari ${total}`;
}

function dengarSuaraKalimat() {
  const kalimat = kalimatSekarang;
  if (!kalimat) return;

  const utter = new SpeechSynthesisUtterance(kalimat);
  utter.lang = "id-ID";
  utter.rate = 0.9;
  utter.pitch = 1;
  utter.volume = 1;

  const voices = window.speechSynthesis.getVoices();
  const indoVoice = voices.find(v => v.lang === "id-ID");
  if (indoVoice) utter.voice = indoVoice;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
  console.log(`🔊 Mengucapkan kalimat: ${kalimat}`);
}

// ==================== MATERI 5: KALIMAT PANJANG DENGAN EMOJI ====================

const kalimatPanjangList = [
  "Olahraga penting untuk tubuh kita",
  "Ada dua tim dalam pertandingan",
  "Bola warna merah milik kenzo",
  "Kita akan makan bersama di restoran",
  "Kenzo sangat senang membaca buku"
];

// 🖼️ Daftar emoji ilustrasi kalimat panjang
const kalimatPanjangEmoji = {
  "Olahraga penting untuk tubuh kita": "🏃‍♂️💪🥗",
  "Ada dua tim dalam pertandingan": "⚽🤝🏆",
  "Bola warna merah milik kenzo": "🔴⚽👦",
  "Kita akan makan bersama di restoran": "🍽️👨‍👩‍👧‍👦🍝",
  "Kenzo sangat senang membaca buku": "👦📚😁"
};

let kalimatPanjangUrut = [];
let kalimatPanjangSekarang = "";
let indexKalimatPanjang = 0;

function mulaiMateri5() {
  const content = document.getElementById("content");
  if (!content) return;

  content.innerHTML = `
    <div class="materi5">
      <h3>📖 Membaca Kalimat Panjang</h3>
      <div id="kategoriKalimatPanjang" class="tipe-huruf">Kalimat</div>
      <div class="huruf-utama" id="kalimatPanjangUtama">🏃‍♂️💪🥗</div>
      <div class="tombol-aksi">
        <button class="btn-dengar" onclick="dengarSuaraKalimatPanjang()">🔊 Dengar Kalimat</button>
        <button class="btn-ucap" onclick="mulaiUcap()">🎙️ Ucapkan</button>
      </div>
      <p id="feedback">Pilih kalimat yang sesuai dengan gambar!</p>
      <div class="pilihan-huruf" id="pilihanKalimatPanjang"></div>
    </div>
  `;

  indexKalimatPanjang = 0;
  skor = 0;
  acakKalimatPanjang();
}

function acakKalimatPanjang() {
  kalimatPanjangUrut = kalimatPanjangList.sort(() => Math.random() - 0.5);
  tampilkanSoalKalimatPanjang();
}

function tampilkanSoalKalimatPanjang() {
  kalimatPanjangSekarang = kalimatPanjangUrut[indexKalimatPanjang];
  const emoji = kalimatPanjangEmoji[kalimatPanjangSekarang] || "❓";

  document.getElementById("kalimatPanjangUtama").textContent = emoji;
  document.getElementById("kategoriKalimatPanjang").textContent = kalimatPanjangSekarang;
  document.getElementById("feedback").textContent = "Pilih kalimat yang sesuai dengan gambar!";

  updateProgressKalimatPanjang();

  const pilihan = buatPilihanKalimatPanjang(kalimatPanjangSekarang);
  const container = document.getElementById("pilihanKalimatPanjang");
  container.innerHTML = "";
  pilihan.forEach(k => {
    const btn = document.createElement("button");
    btn.textContent = k;
    btn.onclick = () => periksaJawabanKalimatPanjang(k);
    container.appendChild(btn);
  });

  recognizedOnce = false;
  const btnUcap = document.querySelector(".btn-ucap");
  if (btnUcap) {
    btnUcap.disabled = false;
    btnUcap.style.opacity = "1";
    btnUcap.style.cursor = "pointer";
    btnUcap.textContent = "🎙️ Ucapkan";
  }

  aturUkuranKotak();
}

function buatPilihanKalimatPanjang(benar) {
  let pilihan = [benar];
  while (pilihan.length < 5) {
    let random = kalimatPanjangList[Math.floor(Math.random() * kalimatPanjangList.length)];
    if (!pilihan.includes(random)) pilihan.push(random);
  }
  return pilihan.sort(() => Math.random() - 0.5);
}

function periksaJawabanKalimatPanjang(jawaban) {
  const feedback = document.getElementById("feedback");
  const emojiBox = document.getElementById("kalimatPanjangUtama");

  if (jawaban.toLowerCase() === kalimatPanjangSekarang.toLowerCase()) {
    feedback.textContent = "Benar! 🎉";
    feedback.style.color = "#22c55e";
    skor += 10;
    streak++;
    playSoundBenar();
    playAnimation(emojiBox, "bounce");
    updateStatusPanel();
    updateProgressKalimatPanjang();

    setTimeout(() => {
      indexKalimatPanjang++;
      if (indexKalimatPanjang < kalimatPanjangUrut.length) {
        tampilkanSoalKalimatPanjang();
      } else {
        feedback.textContent = "Selesai! Hebat sekali! 🌟";
        updateProgressKalimatPanjang(true);
      }
    }, 800);
  } else {
    feedback.textContent = "Coba lagi!";
    feedback.style.color = "#ef4444";
    streak = 0;
    playSoundSalah();
    playAnimation(emojiBox, "shake");
    updateStatusPanel();
  }
}

function updateProgressKalimatPanjang(complete = false) {
  const progressFill = document.getElementById("progress-fill");
  const materiInfo = document.getElementById("materi-info");
  const total = kalimatPanjangList.length;
  const current = complete ? total : indexKalimatPanjang + 1;
  const percent = Math.round((current / total) * 100);
  progressFill.style.width = percent + "%";
  materiInfo.textContent = `Materi 5: Kalimat Panjang — Soal ke-${current} dari ${total}`;
}

function dengarSuaraKalimatPanjang() {
  const kalimat = kalimatPanjangSekarang;
  if (!kalimat) return;

  const utter = new SpeechSynthesisUtterance(kalimat);
  utter.lang = "id-ID";
  utter.rate = 0.9;
  utter.pitch = 1;
  utter.volume = 1;

  const voices = window.speechSynthesis.getVoices();
  const indoVoice = voices.find(v => v.lang === "id-ID");
  if (indoVoice) utter.voice = indoVoice;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
  console.log(`🔊 Mengucapkan kalimat: ${kalimat}`);
}

// ==================== MATERI 6: TANYA JAWAB CERITA (VERSI OUTLINE QA) ====================

const ceritaList = [
  {
    emoji: "🐶🍖",
    teks: "Anjing bernama Budi sedang makan tulang di halaman. Dia sangat senang karena tulangnya besar dan lezat.",
    pertanyaan: "Siapa nama anjing dalam cerita?",
    pilihan: ["Budi", "Mimi", "Dodi", "Cici"],
    jawaban: "Budi"
  },
  {
    emoji: "🐱🥛☀️",
    teks: "Kucing Mimi minum susu setiap pagi. Susu itu diberikan oleh Ibu di mangkuk biru.",
    pertanyaan: "Kapan Mimi minum susu?",
    pilihan: ["Pagi", "Siang", "Sore", "Malam"],
    jawaban: "Pagi"
  },
  {
    emoji: "🌸🌼🏫",
    teks: "Di taman sekolah ada banyak bunga berwarna merah dan kuning. Anak-anak suka bermain di sana.",
    pertanyaan: "Apa warna bunga di taman?",
    pilihan: ["Pink dan Orange", "Biru dan Hijau", "Putih dan Ungu", "Merah dan Kuning"],
    jawaban: "Merah dan Kuning"
  },
  {
    emoji: "📚✏️👧",
    teks: "Ani membaca buku cerita di perpustakaan. Dia menggunakan pensil untuk mencatat kata-kata baru.",
    pertanyaan: "Di mana Ani membaca buku?",
    pilihan: ["Rumah", "Perpustakaan", "Taman", "Kelas"],
    jawaban: "Perpustakaan"
  },
  {
    emoji: "🚗👨‍👧🏠",
    teks: "Ayah pulang kerja dengan mobil merah. Mobil itu diparkir di depan rumah yang berpagar putih.",
    pertanyaan: "Apa warna mobil Ayah?",
    pilihan: ["Merah", "Putih", "Biru", "Hitam"],
    jawaban: "Merah"
  }
];

let indexCerita = 0;

function mulaiMateri6() {
  const content = document.getElementById("content");
  if (!content) return;

  content.innerHTML = `
    <div class="materi6">
      <h3>❓ Tanya Jawab Cerita</h3>

      <!-- Kotak cerita putih -->
      <div class="cerita-box">
        <div class="emoji-cerita" id="emojiCerita">🐶🍖</div>
        <p id="teksCerita" class="teks-cerita">Anjing bernama Budi sedang makan tulang di halaman. Dia sangat senang karena tulangnya besar dan lezat.</p>
      </div>

      <!-- Kotak pertanyaan & pilihan — hanya outline -->
      <div class="qa-box">
        <div class="pertanyaan-box">
          <h4 id="teksPertanyaan">Siapa nama anjing dalam cerita?</h4>
        </div>

        <p id="feedback" class="feedback"></p>

        <div class="pilihan-jawaban" id="pilihanJawaban"></div>
      </div>
    </div>
  `;

  indexCerita = 0;
  tampilkanSoalCerita();
}

function tampilkanSoalCerita() {
  const data = ceritaList[indexCerita];
  document.getElementById("emojiCerita").textContent = data.emoji;
  document.getElementById("teksCerita").textContent = data.teks;
  document.getElementById("teksPertanyaan").textContent = data.pertanyaan;
  document.getElementById("feedback").textContent = "";

  const container = document.getElementById("pilihanJawaban");
  container.innerHTML = "";

  // buat tombol pilihan — dua kolom di CSS
  data.pilihan.forEach(p => {
    const btn = document.createElement("button");
    btn.className = "jawab-btn";
    btn.textContent = p;
    btn.onclick = () => periksaJawabanCerita(p, btn);
    container.appendChild(btn);
  });

  updateProgressCerita();
}

function periksaJawabanCerita(jawaban, btnEl) {
  const data = ceritaList[indexCerita];
  const feedback = document.getElementById("feedback");
  const container = document.getElementById("pilihanJawaban");
  const allButtons = Array.from(container.querySelectorAll("button"));

  // disable semua tombol sementara supaya tidak double-click
  allButtons.forEach(b => b.disabled = true);

  if (jawaban === data.jawaban) {
    feedback.textContent = "Benar! 🎉";
    feedback.style.color = "#16a34a";
    playSoundBenar();

    // beri tanda hijau pada tombol yang ditekan
    if (btnEl) btnEl.classList.add("correct");

    setTimeout(() => {
      indexCerita++;
      if (indexCerita < ceritaList.length) {
        tampilkanSoalCerita();
      } else {
        feedback.textContent = "Selesai! Hebat sekali! 🌟";
        // reset atau tampilkan tampilan akhir sesuai kebutuhan
      }
    }, 900);

  } else {
    feedback.textContent = "Coba lagi!";
    feedback.style.color = "#ef4444";
    playSoundSalah();

    // beri tanda merah pada tombol yang salah dan re-enable lainnya
    if (btnEl) btnEl.classList.add("incorrect");

    // setelah delay, kembalikan tombol ke keadaan semula dan enable lagi
    setTimeout(() => {
      allButtons.forEach(b => {
        b.disabled = false;
        b.classList.remove("incorrect");
      });
      feedback.textContent = "";
    }, 900);
  }

  updateProgressCerita();
}

function updateProgressCerita() {
  const progressFill = document.getElementById("progress-fill");
  const materiInfo = document.getElementById("materi-info");
  const total = ceritaList.length;
  const current = Math.min(indexCerita + 1, total);
  const percent = Math.round((current / total) * 100);
  if (progressFill) progressFill.style.width = percent + "%";
  if (materiInfo) materiInfo.textContent = `Materi 6: Tanya Jawab Cerita — Soal ke-${current} dari ${total}`;
}
