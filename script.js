// ==========================================
// STATE GLOBAL
// ==========================================
var LINK_QRIS = "https://cdn.phototourl.com/member/2026-10-05-11f09f57-90d6-421f-80a1-bc4282d6e739.jpg";
var paketPilih = "";
var hargaTeks = "";
var qrisCountdown = null;
var lockCountdown = null;
var sedangLockOrder = false;
var DURASI_QRIS = 15 * 60;
var DURASI_LOCK = 60;

var KEY_LOCK = 'wahyuLockUntil_v4';
var KEY_ORDER = 'wahyuOrderId_v4';

// ==========================================
// NAVIGASI HALAMAN
// ==========================================
function bukaHalaman(nama){
  var beranda = document.getElementById('halamanBeranda');
  var tentang = document.getElementById('halamanTentang');
  var navB = document.getElementById('navBeranda');
  var navT = document.getElementById('navTentang');

  if(nama === 'beranda'){
    beranda.classList.remove('hidden');
    tentang.classList.add('hidden');
    navB.classList.add('active');
    navT.classList.remove('active');
  } else if(nama === 'tentang'){
    beranda.classList.add('hidden');
    tentang.classList.remove('hidden');
    navT.classList.add('active');
    navB.classList.remove('active');
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// HELPER LOCALSTORAGE
// ==========================================
function simpanLokal(k, v){ try { localStorage.setItem(k, v); } catch(e){} }
function ambilLokal(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
function hapusLokal(k){ try { localStorage.removeItem(k); } catch(e){} }

// ==========================================
// CEK KONTAK
// ==========================================
function cekKontak(){
 var nama = document.getElementById('nama').value.trim();
 var wa = document.getElementById('wa').value.trim();
 if(paketPilih === "") return;
 if(nama !== "" && wa !== ""){
  document.getElementById('tombolOrderBox').classList.remove('hidden');
  document.getElementById('notifError').classList.add('hidden');
 } else {
  document.getElementById('tombolOrderBox').classList.add('hidden');
 }
}

// ==========================================
// NOTIF ERROR
// ==========================================
function tampilkanError(){
 var notif = document.getElementById('notifError');
 notif.classList.remove('hidden');
 setTimeout(function(){ notif.classList.add('hidden'); }, 4000);
}

// ==========================================
// NOTIF BANNER
// ==========================================
function tampilkanNotifSekali(nama, paket, harga){
  var marquee = document.getElementById('marqueeNotif');
  marquee.className = 'text-white font-bold text-sm w-full';
  void marquee.offsetWidth;
  marquee.innerHTML = '<span class="text-[#93c5fd]">' + nama + '</span> membeli ' + paket + ' <span class="text-[#93c5fd]">' + harga + '</span>';
  marquee.className = 'text-white font-bold text-sm w-full marquee-once';
}

// ==========================================
// FORMAT MENIT:DETIK
// ==========================================
function formatMenitDetik(t){
  var m = Math.floor(t / 60);
  var d = t % 60;
  return (m < 10 ? '0' : '') + m + ':' + (d < 10 ? '0' : '') + d;
}

// ==========================================
// PILIH PAKET
// ==========================================
function pilihPaket(namaPaket, harga){

  if(sedangLockOrder === true){
    document.getElementById('popupOrder').classList.remove('hidden');
    if(!lockCountdown) mulaiTimerLock();
    return;
  }

  paketPilih = namaPaket;
  hargaTeks = harga;

  var semua = document.querySelectorAll('.paket');
  for(var i = 0; i < semua.length; i++){
    semua[i].className = 'paket mt-3 border p-4 rounded-2xl flex justify-between items-center';
  }

  var idTerpilih = "p1";
  if(namaPaket === "PAKET 2 - 1 HARI") idTerpilih = "p2";
  if(namaPaket === "PAKET 3 - 2 HARI") idTerpilih = "p3";
  document.getElementById(idTerpilih).className = 'paket mt-3 border-2 border-blue-600 bg-blue-50 p-4 rounded-2xl flex justify-between items-center';

  var nama = document.getElementById('nama').value.trim();
  var wa = document.getElementById('wa').value.trim();

  if(nama === "" || wa === ""){
    document.getElementById('tombolOrderBox').classList.add('hidden');
    tampilkanError();
  } else {
    document.getElementById('tombolOrderBox').classList.remove('hidden');
  }
}

// ==========================================
// ORDER SEKARANG
// ==========================================
function orderSekarang(){
  if(sedangLockOrder === true){
    document.getElementById('popupOrder').classList.remove('hidden');
    if(!lockCountdown) mulaiTimerLock();
    return;
  }

  var nama = document.getElementById('nama').value.trim();
  var wa = document.getElementById('wa').value.trim();

  if(paketPilih === ""){ alert('Pilih paket dulu ya!'); return; }
  if(nama === "" || wa === ""){
    tampilkanError();
    document.getElementById('tombolOrderBox').classList.add('hidden');
    return;
  }

  document.getElementById('notifError').classList.add('hidden');
  document.getElementById('imgQris').src = LINK_QRIS;
  document.getElementById('nominalQris').innerText = hargaTeks;
  document.getElementById('qrisPopup').classList.remove('hidden');

  mulaiTimerQris();
}

// ==========================================
// TIMER QRIS
// ==========================================
function mulaiTimerQris(){
  var sisa = DURASI_QRIS;
  document.getElementById('qrisTimer').innerText = formatMenitDetik(sisa);

  if(qrisCountdown) clearInterval(qrisCountdown);

  qrisCountdown = setInterval(function(){
    sisa--;
    if(sisa < 0) sisa = 0;
    document.getElementById('qrisTimer').innerText = formatMenitDetik(sisa);

    if(sisa <= 0){
      clearInterval(qrisCountdown);
      qrisCountdown = null;
      document.getElementById('qrisPopup').classList.add('hidden');
      paketPilih = "";
      hargaTeks = "";
      document.getElementById('tombolOrderBox').classList.add('hidden');
    }
  }, 1000);
}

// ==========================================
// TUTUP QRIS
// ==========================================
function tutupQris(){
  if(qrisCountdown) clearInterval(qrisCountdown);
  qrisCountdown = null;
  document.getElementById('qrisPopup').classList.add('hidden');
  paketPilih = "";
  hargaTeks = "";
  document.getElementById('tombolOrderBox').classList.add('hidden');
}

// ==========================================
// KONFIRMASI TF
// ==========================================
function konfirmasiTF(){
  var nama = document.getElementById('nama').value.trim();
  if(nama === ""){ tampilkanError(); return; }

  if(qrisCountdown) clearInterval(qrisCountdown);
  qrisCountdown = null;
  document.getElementById('qrisPopup').classList.add('hidden');

  var namaTampil = nama.charAt(0) + '***' + nama.charAt(nama.length - 1);
  var paketTampil = paketPilih.replace('PAKET ', 'Paket ').replace(' - ', ' ');
  tampilkanNotifSekali(namaTampil, paketTampil, hargaTeks);

  var orderId = '#JK-' + Math.floor(Math.random() * 900000 + 10000);

  document.getElementById('idOrder').innerText = orderId;
  document.getElementById('paketStruk').innerText = paketPilih;
  document.getElementById('namaStruk').innerText = nama;
  document.getElementById('totalStruk').innerText = hargaTeks;
  document.getElementById('tglStruk').innerText = new Date().toLocaleString('id-ID') + ' WIB';

  document.getElementById('strukPopup').classList.remove('hidden');

  sedangLockOrder = true;
  document.getElementById('popupOrderId').innerText = orderId;

  var selesai = Date.now() + (DURASI_LOCK * 1000);
  simpanLokal(KEY_LOCK, selesai);
  simpanLokal(KEY_ORDER, orderId);
}

// ==========================================
// TUTUP STRUK
// ==========================================
function tutupStruk(){
  document.getElementById('strukPopup').classList.add('hidden');
}

// ==========================================
// TIMER LOCK
// ==========================================
function mulaiTimerLock(){
  var popup = document.getElementById('popupOrder');
  var timerText = document.getElementById('timerText');

  popup.classList.remove('hidden');

  if(lockCountdown) clearInterval(lockCountdown);

  var selesai = parseInt(ambilLokal(KEY_LOCK) || '0', 10);
  var sisa = Math.max(0, Math.round((selesai - Date.now()) / 1000));

  timerText.innerText = formatMenitDetik(sisa);

  lockCountdown = setInterval(function(){
    sisa--;
    if(sisa < 0) sisa = 0;
    timerText.innerText = formatMenitDetik(sisa);

    if(sisa <= 0){
      clearInterval(lockCountdown);
      lockCountdown = null;
      popup.classList.add('hidden');
      sedangLockOrder = false;

      hapusLokal(KEY_LOCK);
      hapusLokal(KEY_ORDER);

      paketPilih = "";
      hargaTeks = "";
      document.getElementById('tombolOrderBox').classList.add('hidden');

      var semua = document.querySelectorAll('.paket');
      for(var i = 0; i < semua.length; i++){
        semua[i].className = 'paket mt-3 border p-4 rounded-2xl flex justify-between items-center';
      }
      document.getElementById('p1').className = 'paket mt-3 border-2 border-blue-600 bg-blue-50 p-4 rounded-2xl flex justify-between items-center';
    }
  }, 1000);
}

// ==========================================
// CEK SAAT HALAMAN DIBUKA
// ==========================================
function cekStatusSaatBuka(){
  sedangLockOrder = false;

  var selesai = parseInt(ambilLokal(KEY_LOCK) || '0', 10);
  var orderId = ambilLokal(KEY_ORDER) || '';

  if(selesai && selesai > Date.now()){
    sedangLockOrder = true;
    document.getElementById('popupOrderId').innerText = orderId;
    mulaiTimerLock();
  } else {
    hapusLokal(KEY_LOCK);
    hapusLokal(KEY_ORDER);
  }
}

window.addEventListener('load', cekStatusSaatBuka);

// ==========================================
// WA ADMIN
// ==========================================
function waAdmin(){
 var pesan =
  'Halo Admin Wahyu%0A' +
  'Saya sudah Transfer via QRIS%0A%0A' +
  'Order: ' + document.getElementById('idOrder').innerText + '%0A' +
  'Paket: ' + paketPilih + '%0A' +
  'Nama: ' + document.getElementById('nama').value + '%0A' +
  'No WA: ' + document.getElementById('wa').value + '%0A' +
  'Metode: QRIS Wahyu Store Subang%0A' +
  'Total: ' + hargaTeks + '%0A' +
  'Status: Sudah Transfer ✓';
 window.open('https://wa.me/62895401139306?text=' + pesan, '_blank');
}