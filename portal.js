(function(){
var API="https://script.google.com/macros/s/AKfycbyGN81FycPBNWzCE3sroi-DUiICkEISTRY4SOtZcvdAK-7YOIc3nQMW2OvEk80-l8bZgQ/exec";
var $=function(s,r){return(r||document).querySelector(s)};
var root=$("#px"); if(!root) return;
var S={token:null,peran:null,mitra:null};
try{S.token=sessionStorage.getItem("fz_t");S.peran=sessionStorage.getItem("fz_p")}catch(e){}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function rp(n,u){if(n==null||n==="")return "—";var x=Number(n).toLocaleString("id-ID");return (u==="USD"?"USD ":"Rp ")+x}
var BLN=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
function tgl(s){if(!s)return "—";var m=String(s).match(/^(\d{4})-(\d{2})-(\d{2})/);return m?(+m[3])+" "+BLN[+m[2]-1]+" "+m[1]:esc(s)}
function api(q){
  if(S.token&&!q.token)q.token=S.token;
  return fetch(API,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(q)})
   .then(function(r){return r.json()}).then(function(j){
     if(!j.ok){ if(/Sesi berakhir/.test(j.pesan||"")){keluar(true)} throw new Error(j.pesan||"Gagal") }
     return j}).catch(function(e){ if(e instanceof TypeError) throw new Error("Tidak dapat terhubung. Periksa koneksi internet lalu coba lagi."); throw e });
}
function simpan(j){S.token=j.token;S.peran=j.peran;try{sessionStorage.setItem("fz_t",j.token);sessionStorage.setItem("fz_p",j.peran)}catch(e){}}
function keluar(diam){
  var t=S.token; S.token=S.peran=S.mitra=null; try{sessionStorage.removeItem("fz_t");sessionStorage.removeItem("fz_p")}catch(e){}
  if(t&&!diam)fetch(API,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({aksi:"keluar",token:t})}).catch(function(){});
  masuk(diam?"Sesi berakhir. Silakan masuk lagi.":"");
}
function busy(btn,on,txt){btn.disabled=on;if(on){btn.dataset.t=btn.textContent;btn.textContent="Memeriksa..."}else btn.textContent=txt||btn.dataset.t}

// ---------- LOGIN
function masuk(pesan){
  root.innerHTML='<div class="px-box"><div class="px-tabs" role="tablist"><button id="tj" role="tab">Saya jamaah</button><button id="tm" role="tab">Mitra</button><button id="tt" role="tab">Tim Farfaza</button></div>'
  +'<form id="fj" class="px-form" autocomplete="off"><p class="px-hint">Masukkan nama dan tanggal lahir sesuai paspor untuk melihat kartu jamaah Anda.</p>'
  +'<label>Nama lengkap<input id="jn" required maxlength="120" placeholder="Nama sesuai paspor" autocomplete="name"></label>'
  +'<label>Tanggal lahir<input id="jt" type="date" required max="'+new Date().toISOString().slice(0,10)+'"></label>'
  +'<button class="btn" type="submit">Lihat kartu saya</button><p class="px-err" id="ej" role="alert"></p></form>'
  +'<form id="fm" class="px-form" autocomplete="on" hidden><p class="px-hint">Khusus mitra Farfaza dan akun pusat. Akun diberikan oleh Farfaza.</p>'
  +'<label>Nama akun<input id="ma" required maxlength="80" autocomplete="username" autocapitalize="none" spellcheck="false"></label>'
  +'<label>Kata sandi<input id="ms" type="password" required maxlength="100" autocomplete="current-password"></label>'
  +'<label class="px-chk"><input type="checkbox" id="mt"> Tampilkan kata sandi</label>'
  +'<button class="btn" type="submit">Masuk</button><p class="px-err" id="em" role="alert"></p></form>'
  +'<form id="ft" class="px-form" autocomplete="on" hidden><p class="px-hint">Khusus karyawan Farfaza untuk melihat absensi dan rekap bulanan.</p>'
  +'<label>Nama akun<input id="ta" required maxlength="80" autocomplete="username" autocapitalize="none" spellcheck="false"></label>'
  +'<label>Kata sandi<input id="ts" type="password" required maxlength="100" autocomplete="current-password"></label>'
  +'<button class="btn" type="submit">Masuk</button><p class="px-err" id="et" role="alert"></p></form>'
  +'<p class="px-fine">Data Anda dijaga sesuai UU Pelindungan Data Pribadi. Kartu jamaah tidak menampilkan NIK, paspor, maupun nomor telepon. Lupa data atau sandi? <a href="https://wa.me/6281213711159">Hubungi WhatsApp resmi 0812-1371-1159</a>.</p></div>';
  var fj=$("#fj"),fm=$("#fm"),ft=$("#ft");
  function tab(m){var k=m===true?"mitra":m==="tim"?"tim":"jamaah";fj.hidden=k!=="jamaah";fm.hidden=k!=="mitra";ft.hidden=k!=="tim";
    $("#tj").setAttribute("aria-selected",k==="jamaah");$("#tm").setAttribute("aria-selected",k==="mitra");$("#tt").setAttribute("aria-selected",k==="tim");try{history.replaceState(null,"","#"+k)}catch(e){}}
  $("#tj").onclick=function(){tab(false)};$("#tm").onclick=function(){tab(true)};$("#tt").onclick=function(){tab("tim")};
  tab(location.hash==="#mitra"?true:location.hash==="#tim"?"tim":false);
  if(pesan)(!fm.hidden?$("#em"):!ft.hidden?$("#et"):$("#ej")).textContent=pesan;
  ft.onsubmit=function(e){e.preventDefault();var b=ft.querySelector("button");$("#et").textContent="";busy(b,true);
    api({aksi:"loginTim",akun:$("#ta").value,sandi:$("#ts").value}).then(function(j){simpan(j);S.tim=j.tim;return tim()}).catch(function(er){$("#et").textContent=er.message;busy(b,false)})};
  $("#mt").onchange=function(){$("#ms").type=this.checked?"text":"password"};
  fj.onsubmit=function(e){e.preventDefault();var b=fj.querySelector("button");$("#ej").textContent="";busy(b,true);
    api({aksi:"loginJamaah",nama:$("#jn").value,tglLahir:$("#jt").value}).then(function(j){simpan(j);return api({aksi:"kartu"})}).then(kartu)
    .catch(function(er){$("#ej").textContent=er.message;busy(b,false)})};
  fm.onsubmit=function(e){e.preventDefault();var b=fm.querySelector("button");$("#em").textContent="";busy(b,true);
    api({aksi:"loginMitra",akun:$("#ma").value,sandi:$("#ms").value}).then(function(j){simpan(j);S.mitra=j.mitra;
      if(j.wajibGanti)return wajibGanti(); return beranda()}).catch(function(er){$("#em").textContent=er.message;busy(b,false)})};
}

// ---------- KARTU JAMAAH
function kartuGambar(k){
  return Promise.all([document.fonts.load("600 40px 'EB Garamond'"),document.fonts.load("600 30px 'DM Sans'"),muat("img/logo_farfaza.png")]).then(function(a){
    var W=1011,H=638,c=document.createElement("canvas");c.width=W;c.height=H;var x=c.getContext("2d"),SERIF="'EB Garamond',Georgia,serif",SANS="'DM Sans',Arial,sans-serif",logo=a[2];
    function t(s,px,py,f,col,al){x.font=f;x.fillStyle=col;x.textAlign=al||"left";x.fillText(s,px,py)}
    var g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,"#4B1670");g.addColorStop(1,"#24112F");x.fillStyle=g;x.fillRect(0,0,W,H);
    x.fillStyle="rgba(226,190,106,.12)";x.beginPath();x.arc(W-60,40,260,0,7);x.fill();x.beginPath();x.arc(60,H+40,200,0,7);x.fill();
    x.fillStyle="#fff";rr(x,36,30,190,84,14);x.fill();if(logo){var lh=70,lw=logo.width*lh/logo.height;x.drawImage(logo,46,37,lw,lh)}
    t("KARTU JAMAAH",W-44,72,"600 26px "+SANS,"#E2BE6A","right");t("Gerbang Menuju Baitullah",W-44,104,"italic 600 24px "+SERIF,"#D9C6E2","right");
    t("NOMOR ANGGOTA",44,205,"600 20px "+SANS,"#D9C6E2");t(String(k.nomorAnggota||""),44,262,"600 54px "+SANS,"#E2BE6A");
    var nm=String(k.nama||"").toUpperCase(),fs=50;x.font="600 "+fs+"px "+SERIF;while(x.measureText(nm).width>W-88&&fs>26){fs-=2;x.font="600 "+fs+"px "+SERIF}t(nm,44,358,"600 "+fs+"px "+SERIF,"#fff");
    x.fillStyle="#E2BE6A";x.fillRect(44,384,160,5);
    t("PERJALANAN",44,448,"600 20px "+SANS,"#D9C6E2");t("Berangkat ke-"+(k.berangkat||0),44,500,"600 44px "+SERIF,"#fff");
    if(k.tier){var tw=0;x.font="600 30px "+SANS;tw=x.measureText(String(k.tier)).width+56;t("TINGKAT",W-44,448,"600 20px "+SANS,"#D9C6E2","right");rr(x,W-44-tw,462,tw,56,28);x.fillStyle="#E2BE6A";x.fill();t(String(k.tier),W-44-tw/2,500,"600 30px "+SANS,"#24112F","center")}
    x.fillStyle="rgba(255,255,255,.12)";x.fillRect(0,H-74,W,74);t("farfazatravel.com  ·  @farfazatravel  ·  WA 0812-1371-1159",W/2,H-30,"500 22px "+SANS,"#fff","center");
    return c})}
function kartu(j){
  var k=j.kartu,r=k.riwayat||[];
  root.innerHTML='<div class="px-wrapc"><div class="px-card"><div class="px-ch"><img src="img/logo_farfaza.png" alt="Farfaza" width="120" height="52"><span>KARTU JAMAAH</span></div>'
  +'<div class="px-cn"><small>Nomor Anggota</small><b>'+esc(k.nomorAnggota)+'</b></div><div class="px-nm">'+esc(k.nama)+'</div>'
  +'<div class="px-cr"><div><small>Perjalanan</small><b>Berangkat ke-'+esc(k.berangkat||0)+'</b></div>'+(k.tier?'<div><small>Tingkat</small><b class="px-tier">'+esc(k.tier)+'</b></div>':'')+'</div>'
  +(k.benefit?'<p class="px-ben">'+esc(k.benefit)+'</p>':'')+'<div class="px-gold"></div></div>'
  +'<p class="px-kb"><button class="btn small" id="kd">Unduh gambar kartu</button> <button class="btn ghost small" id="kp">Cetak kartu</button></p><h3>Riwayat keberangkatan</h3>'+(r.length?'<ul class="px-rw">'+r.map(function(x){return '<li><b>'+tgl(x.tanggal)+'</b><span>'+esc([x.jenis,x.program].filter(Boolean).join(" · ")||"Perjalanan")+'</span><em class="px-st '+(x.status==="Berangkat"?"ok":"")+'">'+esc(x.status)+'</em></li>'}).join("")+'</ul>':'<p>Belum ada riwayat keberangkatan tercatat.</p>')
  +'<p class="px-fine">Jika ada data yang tidak sesuai, hubungi <a href="https://wa.me/6281213711159">WhatsApp resmi 0812-1371-1159</a>.</p><p><button class="btn ghost small" id="kl">Keluar</button></p></div>';
  $("#kl").onclick=function(){keluar()};
  $("#kd").onclick=function(){kartuGambar(k).then(function(c){var a=document.createElement("a");a.download="kartu-jamaah-"+String(k.nomorAnggota||"farfaza")+".png";a.href=c.toDataURL("image/png");a.click()})};
  $("#kp").onclick=function(){var w=window.open("","_blank");if(!w){alert("Izinkan pop-up untuk mencetak.");return}kartuGambar(k).then(function(c){w.document.write('<title>Kartu Jamaah Farfaza</title><style>@page{size:A4;margin:12mm}html,body{margin:0}img{width:85.6mm;height:54mm;display:block;border-radius:3mm}p{font:12px Arial;color:#555}</style><img src="'+c.toDataURL("image/png")+'"><p>Ukuran kartu standar (85,6 x 54 mm). Gunting mengikuti tepi gambar.</p>');w.document.close();w.onload=function(){w.print()}})};
}

// ---------- WAJIB GANTI SANDI
function wajibGanti(){
  root.innerHTML='<div class="px-box"><form class="px-form" id="fg"><h3>Buat kata sandi baru</h3><p class="px-hint">Demi keamanan, ganti kata sandi sebelum melanjutkan. Minimal 8 karakter.</p>'
  +'<label>Kata sandi lama<input id="gl" type="password" required autocomplete="current-password"></label><label>Kata sandi baru<input id="gb" type="password" required minlength="8" autocomplete="new-password"></label>'
  +'<button class="btn" type="submit">Simpan</button><p class="px-err" id="eg" role="alert"></p></form></div>';
  $("#fg").onsubmit=function(e){e.preventDefault();var b=e.target.querySelector("button");busy(b,true);
    api({aksi:"gantiSandi",lama:$("#gl").value,baru:$("#gb").value}).then(beranda).catch(function(er){$("#eg").textContent=er.message;busy(b,false)})};
}

// ---------- TIM FARFAZA (absensi)
var HARI=["Min","Sen","Sel","Rab","Kam","Jum","Sab"];
function bulanNama(k){var m=String(k).match(/^(\d{4})-(\d{2})$/);return m?BLN[+m[2]-1]+" "+m[1]:k}
function tglPendek(s){var m=String(s).match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?(+m[3])+" "+BLN[+m[2]-1].slice(0,3):s}
function timKerangka(isi){
  root.innerHTML='<div class="px-dash"><div class="px-top"><b>Tim Farfaza</b><span>'+esc((S.tim&&S.tim.nama)||"")+'</span><button class="btn ghost small" id="tk">Keluar</button></div><div id="pv">'+isi+'</div></div>';
  $("#tk").onclick=function(){keluar()};
}
function tim(bulan,nomor){
  timKerangka('<p class="px-load">Memuat…</p>');
  return api({aksi:"absensi",bulan:bulan||"",nomor:nomor||""}).then(function(j){
    S.tim={nomor:j.nomor,nama:j.nama};var r=j.saya.ringkas,h="";
    h+='<div class="px-bar"><label>Bulan <select id="tb">'+j.daftarBulan.map(function(b){return '<option value="'+b+'"'+(b===j.bulan?' selected':'')+'>'+bulanNama(b)+'</option>'}).join("")+'</select></label>'
      +(j.tim?'<label>Karyawan <select id="tn">'+j.tim.map(function(x){return '<option value="'+esc(x.nomor)+'"'+(x.nomor===j.saya.nomor?' selected':'')+'>'+esc(x.nama)+'</option>'}).join("")+'</select></label>':'')+'</div>';
    h+='<div class="px-nm px-nm2">'+esc(j.saya.nama)+' <small>'+esc(j.saya.nomor)+'</small></div>';
    if(r){h+='<div class="px-stats"><div><b>'+r.hadir+'<small>/'+r.hariKerja+'</small></b><span>Hari hadir</span></div><div><b>'+r.tepatWaktu+'</b><span>Tepat waktu</span></div><div><b>'+r.terlambat+'</b><span>Terlambat'+(r.menitTerlambat?' ('+r.menitTerlambat+' menit)':'')+'</span></div><div><b>'+r.tidakHadir+'</b><span>Tidak hadir</span></div><div><b>'+r.lupaScan+'</b><span>Lupa scan</span></div><div><b>'+r.jamKerja+'</b><span>Jam kerja</span></div></div>'}
    else h+='<p class="px-hint">Belum ada data absen untuk bulan ini.</p>';
    h+='<p class="px-hint">Jadwal masuk '+esc(j.jadwal.masuk)+', pulang '+esc(j.jadwal.pulang)+' (Sabtu '+esc(j.jadwal.pulangSabtu)+'). Hari kerja dihitung dari hari yang dipakai absen oleh tim.</p>';
    var rinci=j.saya.rinci.filter(function(x){return x.status&&!/^Libur/.test(x.status)||x.masuk||x.pulang});
    h+=rinci.length?'<h3>Absen harian</h3>'+tabel(["Tanggal","Masuk","Pulang","Status"],rinci.slice().reverse().map(function(x){
      var cls=x.status==="Tepat waktu"?"ok":x.status==="Tidak hadir"?"bad":"warn";
      return [HARI[x.hari]+", "+tglPendek(x.tgl),x.masuk||"—",x.pulang||"—",'<em class="px-st '+cls+'">'+esc(x.status)+'</em>'+(x.ket?' <small>'+esc(x.ket)+'</small>':'')]})):'';
    if(j.tim){h+='<h3>Rekap tim · '+bulanNama(j.bulan)+'</h3>'+tabel(["Nama","Hadir","Tepat waktu","Terlambat","Tidak hadir","Lupa scan"],j.tim.map(function(x){var y=x.ringkas;
      return [esc(x.nama),y?y.hadir+"/"+y.hariKerja:"—",y?y.tepatWaktu:"—",y?y.terlambat:"—",y?y.tidakHadir:"—",y?y.lupaScan:"—"]}))}
    h+='<details class="px-gs"><summary>Ganti kata sandi</summary><form id="fg2" class="px-form"><label>Kata sandi lama<input id="g1" type="password" required autocomplete="current-password"></label><label>Kata sandi baru (min. 6 karakter)<input id="g2" type="password" required minlength="6" autocomplete="new-password"></label><button class="btn small">Simpan</button><p class="px-err" id="eg2" role="alert"></p></form></details>';
    $("#pv").innerHTML=h;
    $("#tb").onchange=function(){tim(this.value,j.tim?$("#tn").value:"")};
    if(j.tim)$("#tn").onchange=function(){tim($("#tb").value,this.value)};
    $("#fg2").onsubmit=function(e){e.preventDefault();var b=e.target.querySelector("button");busy(b,true);
      api({aksi:"gantiSandi",lama:$("#g1").value,baru:$("#g2").value}).then(function(){$("#eg2").className="px-ok";$("#eg2").textContent="Kata sandi diganti.";busy(b,false,"Simpan");$("#g1").value=$("#g2").value=""}).catch(function(er){$("#eg2").className="px-err";$("#eg2").textContent=er.message;busy(b,false,"Simpan")})};
  }).catch(function(er){$("#pv").innerHTML='<p class="px-err">'+esc(er.message)+'</p>'});
}

// ---------- DASHBOARD STAF
var TABS=[["beranda","Beranda"],["jamaah","Jamaah"],["harga","Harga"],["brosur","Brosur"],["akun","Akun"]];
function kerangka(aktif,isi){
  root.innerHTML='<div class="px-dash"><nav class="px-tabs px-tabs2">'+TABS.map(function(t){return '<button data-t="'+t[0]+'"'+(t[0]===aktif?' aria-selected="true"':'')+'>'+t[1]+'</button>'}).join("")+'</nav><div id="pv">'+isi+'</div></div>';
  root.querySelectorAll(".px-tabs2 button").forEach(function(b){b.onclick=function(){({beranda:beranda,jamaah:jamaah,harga:harga,brosur:brosur,akun:akun})[b.dataset.t]()}});
}
function loading(a){kerangka(a,'<p class="px-load">Memuat…</p>')}
function galat(a,er){kerangka(a,'<p class="px-err">'+esc(er.message)+'</p>')}
function beranda(){
  loading("beranda");
  return api({aksi:"beranda"}).then(function(j){var k=j.kartu;S.mitra=k;
    var peringatan=k.berlakuHabis?'<p class="px-warn">Masa berlaku kemitraan Anda telah lewat ('+tgl(k.berlaku)+'). Hubungi Farfaza untuk perpanjangan.</p>':'';
    var h='<h3>Kartu mitra</h3><div class="px-km"><div id="kmf"></div><div id="kmb"></div></div><p class="px-kb"><button class="btn small" id="kmd1">Unduh depan</button> <button class="btn small" id="kmd2">Unduh belakang</button> <button class="btn ghost small" id="kmp">Cetak kartu</button></p>'
     +(j.kartuJamaah?'<h3>Kartu jamaah</h3><div class="px-km"><div id="kjg" class="px-kj"></div></div><p class="px-kb"><button class="btn small" id="kjd">Unduh kartu jamaah</button> <button class="btn ghost small" id="kjp">Cetak kartu jamaah</button></p>':'')+peringatan;
    if(j.beku)h+='<p class="px-warn">Status mitra Tidak Aktif: riwayat jamaah, harga, dan brosur dibekukan. Hubungi WhatsApp resmi 0812-1371-1159 untuk aktivasi ulang.</p>';
    else{var r=j.rekap;h+='<div class="px-stats"><div><b>'+r.jamaahTercatat+'</b><span>Jamaah tercatat</span></div><div><b>'+r.akanBerangkat+'</b><span>Akan berangkat</span></div></div>';
      var ks=Object.keys(r.umrohPerTanggal||{}).sort().reverse().slice(0,8);
      if(ks.length)h+='<h3>Keberangkatan umrah terbaru</h3><ul class="px-rw">'+ks.map(function(d){return '<li><b>'+tgl(d)+'</b><span>'+r.umrohPerTanggal[d]+' jamaah</span></li>'}).join("")+'</ul>'}
    kerangka("beranda",h);
    var gb={};function ambil(sisi){return gb[sisi]||(gb[sisi]=kartuMitraGambar(k,sisi))}
    ["depan","belakang"].forEach(function(sisi){ambil(sisi).then(function(c){var d=document.createElement("canvas");d.width=c.width;d.height=c.height;d.getContext("2d").drawImage(c,0,0);d.className="px-kmimg";d.setAttribute("role","img");d.setAttribute("aria-label","Kartu mitra "+sisi);var el=$(sisi==="depan"?"#kmf":"#kmb");if(el)el.appendChild(d)})});
    if(j.kartuJamaah){var kj=j.kartuJamaah,pj=kartuGambar(kj);
      pj.then(function(c){var d=document.createElement("canvas");d.width=c.width;d.height=c.height;d.getContext("2d").drawImage(c,0,0);d.className="px-kmimg";d.setAttribute("role","img");d.setAttribute("aria-label","Kartu jamaah");var el=$("#kjg");if(el)el.appendChild(d)});
      $("#kjd").onclick=function(){pj.then(function(c){var a=document.createElement("a");a.download="kartu-jamaah-"+String(kj.nomorAnggota||"farfaza")+".png";a.href=c.toDataURL("image/png");a.click()})};
      $("#kjp").onclick=function(){var w=window.open("","_blank");if(!w){alert("Izinkan pop-up untuk mencetak.");return}pj.then(function(c){w.document.write('<title>Kartu Jamaah Farfaza</title><style>@page{size:A4;margin:12mm}html,body{margin:0}img{width:85.6mm;height:54mm;display:block;border-radius:3mm}p{font:12px Arial;color:#555}</style><img src="'+c.toDataURL("image/png")+'"><p>Ukuran kartu standar (85,6 x 54 mm). Gunting mengikuti tepi gambar.</p>');w.document.close();w.onload=function(){w.print()}})}}
    function unduh(sisi){ambil(sisi).then(function(c){var a=document.createElement("a");a.download="kartu-mitra-"+String(k.kode||"farfaza")+"-"+sisi+".png";a.href=c.toDataURL("image/png");a.click()})}
    $("#kmd1").onclick=function(){unduh("depan")};$("#kmd2").onclick=function(){unduh("belakang")};
    $("#kmp").onclick=function(){var w=window.open("","_blank");if(!w){alert("Izinkan pop-up untuk mencetak.");return}Promise.all([ambil("depan"),ambil("belakang")]).then(function(cs){w.document.write('<title>Kartu Mitra Farfaza</title><style>@page{size:A4;margin:12mm}html,body{margin:0}.r{display:flex;gap:8mm}img{width:85.6mm;height:auto;display:block;border-radius:3mm}p{font:12px Arial;color:#555}</style><div class="r"><img src="'+cs[0].toDataURL("image/png")+'"><img src="'+cs[1].toDataURL("image/png")+'"></div><p>Gunting mengikuti tepi gambar. Laminasi bila perlu.</p>');w.document.close();w.onload=function(){w.print()}})};
    }).catch(function(er){galat("beranda",er)});
}
function jamaah(){
  kerangka("jamaah",'<form id="fc" class="px-search"><input id="cq" placeholder="Cari nama atau nomor anggota (min. 3 huruf)" required minlength="3"><button class="btn small">Cari</button></form><p class="px-hint">Demi pelindungan data, NIK, paspor, dan nomor telepon jamaah tidak ditampilkan.</p><div id="hs"></div>');
  $("#fc").onsubmit=function(e){e.preventDefault();var h=$("#hs");h.innerHTML='<p class="px-load">Mencari…</p>';
    api({aksi:"cari",q:$("#cq").value}).then(function(j){
      h.innerHTML=j.hasil.length?'<div class="px-tw"><table><thead><tr><th>No. Anggota</th><th>Nama</th><th>Terakhir</th><th>Status</th></tr></thead><tbody>'+j.hasil.map(function(x){return '<tr><td>'+esc(x.nomorAnggota)+'</td><td>'+esc(x.nama)+'</td><td>'+tgl(x.tanggal)+(x.program?' · '+esc(x.program):'')+'</td><td>'+esc(x.status||"—")+'</td></tr>'}).join("")+'</tbody></table></div>'+(j.terpotong?'<p class="px-hint">Menampilkan 50 hasil pertama. Persempit pencarian.</p>':''):'<p>Tidak ada hasil.</p>'})
    .catch(function(er){h.innerHTML='<p class="px-err">'+esc(er.message)+'</p>'})};
}
function tabel(h,rows){return '<div class="px-tw"><table><thead><tr>'+h.map(function(x){return '<th>'+x+'</th>'}).join("")+'</tr></thead><tbody>'+rows.map(function(r){return '<tr>'+r.map(function(c){return '<td>'+c+'</td>'}).join("")+'</tr>'}).join("")+'</tbody></table></div>'}
function feeHtml(f){return f&&f.length?'<h3>Fee dan imbalan</h3>'+tabel(["Jenis","Produk","Fee","Catatan"],f.map(function(x){return [esc(x.jenis),esc(x.produk),esc(x.fee),esc(x.catatan)]})):''}
function harga(){
  loading("harga");
  api({aksi:"harga"}).then(function(j){var h='';
    if(j.peran==="manajemen"){
      h+='<h3>Harga pusat dan harga putus</h3>'+tabel(["Program","Musim","Harga pusat","Tier A","Tier B","Tier C"],j.pusat.map(function(x){return [esc(x.program),esc(x.musim),rp(x.pusat,x.mataUang),rp(x.A,x.mataUang),rp(x.B,x.mataUang),rp(x.C,x.mataUang)]}));
      h+='<h3>Mitra Resmi</h3>'+(j.resmi.length?tabel(["Kode","Program","Musim","Override putus","Harga jual"],j.resmi.map(function(x){return [esc(x.kode),esc(x.program),esc(x.musim),rp(x.override),rp(x.jual)]})):'<p>Belum ada.</p>');h+=feeHtml(j.fee);
    }else if(j.peran==="tim"){h+='<h3>Harga pusat</h3>'+tabel(["Program","Musim","Harga"],j.pusat.map(function(x){return [esc(x.program),esc(x.musim),rp(x.pusat,x.mataUang)]}))}
    else if(j.jenis==="Resmi"){
      h+='<h3>Harga Anda</h3>'+(j.resmi.length?tabel(["Program","Musim","Harga putus","Harga jual","Selisih"],j.resmi.map(function(x){return [esc(x.program),esc(x.musim),rp(x.putus,x.mataUang),rp(x.jual,x.mataUang),rp(x.margin,x.mataUang)]})):'<p>Harga belum diatur. Hubungi Farfaza.</p>');
      if(j.haji&&j.haji.length)h+='<h3>Haji</h3>'+tabel(["Program","Musim","Biaya"],j.haji.map(function(x){return [esc(x.program),esc(x.musim),rp(x.pusat,x.mataUang)]}));h+=feeHtml(j.fee);
    }else{
      h+='<h3>Harga travel (harga pusat)</h3>'+tabel(["Program","Musim","Harga"],j.pusat.map(function(x){return [esc(x.program),esc(x.musim),rp(x.pusat,x.mataUang)]}));
      if(j.haji&&j.haji.length)h+='<h3>Haji</h3>'+tabel(["Program","Musim","Biaya"],j.haji.map(function(x){return [esc(x.program),esc(x.musim),rp(x.pusat,x.mataUang)]}));h+=feeHtml(j.fee);
    }
    kerangka("harga",h+'<p class="px-fine">Harga bersifat rahasia dan hanya untuk Anda. Jangan dibagikan ke pihak lain.</p>')}).catch(function(er){galat("harga",er)});
}

// ---------- AKUN & PROFIL
function akun(){
  loading("akun");
  var p=S.peran==="mitra"?api({aksi:"profil"}):Promise.resolve({nama:"",wa:""});
  p.then(function(pr){
    var h='';
    if(S.peran==="mitra")h+='<form id="fp" class="px-form"><h3>Profil untuk brosur</h3><p class="px-hint">Nama dan nomor WhatsApp ini tampil di brosur Anda. Bisa diubah kapan saja.</p><label>Nama tampil<input id="pn" required maxlength="60" value="'+esc(pr.nama)+'"></label><label>Nomor WhatsApp<input id="pw" required inputmode="tel" placeholder="0812xxxxxxxx" value="'+esc(pr.wa)+'"></label><button class="btn small">Simpan profil</button><p class="px-err" id="ep" role="alert"></p></form>';
    h+='<form id="fg" class="px-form"><h3>Ganti kata sandi</h3><label>Kata sandi lama<input id="gl" type="password" required autocomplete="current-password"></label><label>Kata sandi baru (min. 8 karakter)<input id="gb" type="password" required minlength="8" autocomplete="new-password"></label><button class="btn small">Ganti sandi</button><p class="px-err" id="eg" role="alert"></p></form><p><button class="btn ghost small" id="kl">Keluar</button></p>';
    kerangka("akun",h);
    $("#kl").onclick=function(){keluar()};
    if($("#fp"))$("#fp").onsubmit=function(e){e.preventDefault();var b=e.target.querySelector("button");busy(b,true);
      api({aksi:"simpanProfil",nama:$("#pn").value,wa:$("#pw").value}).then(function(j){$("#pw").value=j.wa;$("#ep").className="px-ok";$("#ep").textContent="Tersimpan.";busy(b,false,"Simpan profil")}).catch(function(er){$("#ep").className="px-err";$("#ep").textContent=er.message;busy(b,false,"Simpan profil")})};
    $("#fg").onsubmit=function(e){e.preventDefault();var b=e.target.querySelector("button");busy(b,true);
      api({aksi:"gantiSandi",lama:$("#gl").value,baru:$("#gb").value}).then(function(){$("#eg").className="px-ok";$("#eg").textContent="Kata sandi diganti.";$("#gl").value=$("#gb").value="";busy(b,false,"Ganti sandi")}).catch(function(er){$("#eg").className="px-err";$("#eg").textContent=er.message;busy(b,false,"Ganti sandi")})};
  }).catch(function(er){galat("akun",er)});
}

// ---------- BROSUR
var BR=null,FOTO=[["hero_kaaba.jpg","Ka'bah dan jamaah"],["hero_menara.jpg","Menara jam"],["haram_night.jpg","Masjidil Haram malam"],["jamaah_nabawi.jpg","Masjid Nabawi"],["menara.jpg","Menara Makkah"],["payung.jpg","Payung Nabawi"],["kaaba.jpg","Ka'bah"]];
var TEMA={
 kartu:{n:"Kartu ungu (gaya poster)",lay:"A",pu:"#4B1670",pu2:"#7B35A8",gold:"#C99A2E",gold2:"#F0D27A",pb:["#F6ECFC","#E6D4F3"],pt:"#4B1670",pill:"#FFFFFF"},
 emas:{n:"Kartu emas",lay:"A",pu:"#4B1670",pu2:"#7B35A8",gold:"#C99A2E",gold2:"#F0D27A",pb:["#FBE9A8","#DDAE48"],pt:"#3B1055",pill:"#F6D77A"},
 lengkap1:{n:"Lengkap 1: kolom + foto hotel (gaya Lailatul Qadr)",lay:"C",v:1,hd:"#8E24AA",pu:"#4B1670",pu2:"#7B35A8",gold:"#C99A2E",gold2:"#F0D27A",pb:["#F6ECFC","#E6D4F3"],pt:"#4B1670",pill:"#FFFFFF"},
 lengkap2:{n:"Lengkap 2: harga di atas (gaya Full Ramadhan)",lay:"C",v:2,hd:"#8E24AA",pu:"#4B1670",pu2:"#7B35A8",gold:"#C99A2E",gold2:"#F0D27A",pb:["#F6ECFC","#E6D4F3"],pt:"#4B1670",pill:"#FFFFFF"},
 cerah:{n:"Cerah, banner harga besar",lay:"B",pu:"#4B1670",pu2:"#7B35A8",gold:"#C99A2E",gold2:"#F0D27A",pb:["#F6ECFC","#E6D4F3"],pt:"#4B1670",pill:"#FFFFFF"}};
var HF={},FP=null;
function fontMS(){if(!FP)FP=new Promise(function(r){var l=document.createElement("link");l.rel="stylesheet";l.href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&display=swap";l.onload=r;l.onerror=r;document.head.appendChild(l);setTimeout(r,4000)});return FP.then(function(){return document.fonts.load("800 40px Montserrat")}).catch(function(){})}
var IC={plane:"M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z",
 cal:"M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z",
 pin:"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
 clock:"M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z",
 hotel:"M17 11V3H7v4H3v14h8v-4h2v4h8V11h-4zM7 19H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm4 4H9v-2h2v2zm0-4H9V9h2v2zm0-4H9V5h2v2zm4 8h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm4 12h-2v-2h2v2zm0-4h-2v-2h2v2z",
 check:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
 close:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
 rest:"M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z",
 call:"M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z",
 note:"M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z",
 coin:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.84 3.39h-1.97c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"};
function brosur(level){
  loading("brosur");
  api({aksi:"paketBrosur",level:level||"Pusat"}).then(function(j){BR=j;
    if(!j.pakets.length){kerangka("brosur",'<p class="px-warn">Belum ada paket aktif. Hubungi Farfaza.</p>');return}
    var o=function(a,sel){return a.map(function(x,i){return '<option value="'+i+'"'+(sel===i?' selected':'')+'>'+esc(x)+'</option>'}).join("")};
    var h='<div class="px-bro"><div class="px-form px-bf">'
     +'<label>Paket<select id="fp">'+j.pakets.map(function(x,i){return '<option value="'+i+'">'+esc(x.program+" "+x.hari+" hari · "+x.tanggal)+'</option>'}).join("")+'</select></label>'
     +(S.peran==="manajemen"?'<label>Tier harga<select id="fl">'+["Pusat","A","B","C"].map(function(x){return '<option'+(x===j.level?' selected':'')+'>'+x+'</option>'}).join("")+'</select></label>':'')
     +'<details open><summary>Tampilan</summary><label>Gaya<select id="ft">'+Object.keys(TEMA).map(function(k){return '<option value="'+k+'">'+TEMA[k].n+'</option>'}).join("")+'</select></label>'
     +'<label>Foto utama<select id="ff">'+FOTO.map(function(x,i){return '<option value="'+i+'">'+x[1]+'</option>'}).join("")+'</select></label>'
     +'<label>Foto utama sendiri (opsional)<input type="file" id="fup0" accept="image/*"></label><label>Format<select id="fm2"><option value="a4">A4 lengkap (dengan termasuk / tidak termasuk)</option><option value="ig">Instagram 4:5 (ringkas)</option></select></label>'
     +'<label>Judul besar (hook)<select id="fh">'+o(j.hook.concat(["Tulis sendiri…"]))+'</select></label><input id="fhx" maxlength="60" placeholder="Judul sendiri (maks. 60 huruf)" hidden></details>'
     +'<details open><summary>Program dan harga</summary><div class="px-two"><label>Program<input id="fpr"></label><label>Hari<input id="fhr" inputmode="numeric"></label></div>'
     +'<label>Bintang hotel (1–5)<input id="fbt" inputmode="numeric"></label><label>Tanggal / periode berangkat<input id="ftg"></label>'
     +'<label>Harga Quad/Quint (Rp)<input id="fq" inputmode="numeric"'+(j.bisaUbahHarga?'':' readonly')+'></label><div class="px-two"><label>Triple<input id="ft3" inputmode="numeric"'+(j.bisaUbahHarga?'':' readonly')+'></label><label>Double<input id="fd2" inputmode="numeric"'+(j.bisaUbahHarga?'':' readonly')+'></label></div>'
     +(j.bisaUbahHarga?'':'<p class="px-hint">Harga mengikuti harga resmi Farfaza dan tidak dapat diubah.</p>')+'</details>'
     +'<details><summary>Hotel dan pesawat</summary><label>Maskapai<input id="fma"></label><label>Berangkat dari<input id="fko"></label>'
     +'<div class="px-two"><label>Hotel Makkah<input id="fmk"></label><label>Malam<input id="fmkm" inputmode="numeric"></label></div><div class="px-two"><label>Jarak ke Masjidil Haram<input id="fmkj"></label><label>Bintang<input id="fmkb" inputmode="numeric"></label></div>'
     +'<div class="px-two"><label>Hotel Madinah<input id="fmd"></label><label>Malam<input id="fmdm" inputmode="numeric"></label></div><div class="px-two"><label>Jarak ke Masjid Nabawi<input id="fmdj"></label><label>Bintang<input id="fmdb" inputmode="numeric"></label></div>'
     +'<label>Foto hotel Makkah (opsional)<input type="file" id="fup1" accept="image/*"></label><label>Foto hotel Madinah (opsional)<input type="file" id="fup2" accept="image/*"></label><label>Foto hotel tambahan (opsional)<input type="file" id="fup3" accept="image/*"></label><p class="px-hint">Tanpa unggahan, kartu hotel memakai foto suasana Masjidil Haram dan Masjid Nabawi.</p><div class="px-two"><label>Hotel tambahan (judul)<input id="fhj" placeholder="mis. Hotel Turki"></label><label>Nama hotel<input id="fhn"></label></div></details>'
     +'<details><summary>Termasuk / tidak termasuk</summary><label>Paket termasuk (satu per baris)<textarea id="fin" rows="7"></textarea></label><label>Tidak termasuk (satu per baris)<textarea id="fex" rows="5"></textarea></label></details>'
     +'<details><summary>Konten gaya Lengkap (opsional)</summary><label>Label di foto (pisahkan dengan |)<input id="flb" placeholder="mis. LEBARAN DI MAKKAH | 2X JUMAT"></label><label>Kalimat pembuka (strip ungu)<input id="ftl" placeholder="mis. Raih keberkahan 10 malam terakhir"></label><label>Destinasi ziarah (satu per baris)<textarea id="fzi" rows="4"></textarea></label><label>Bonus gratis (satu per baris)<textarea id="fbl" rows="4"></textarea></label><label>Persyaratan (satu per baris)<textarea id="fsy" rows="5"></textarea></label></details>'
     +'<details><summary>Pendaftaran dan kontak</summary><div class="px-two"><label>DP (Rp)<input id="fdp"></label><label>Periode pendaftaran<input id="fdf"></label></div><label>Bonus / perlengkapan<input id="fbo"></label><label>Catatan kecil<input id="fct"></label>'
     +'<label>Nama<input id="fnm" maxlength="60"></label><label>Nomor WhatsApp<input id="fwa" inputmode="tel" placeholder="0812xxxxxxxx"></label></details>'
     +'<div class="px-btns"><button class="btn small" id="bd">Unduh gambar</button><button class="btn ghost small" id="bp">Cetak / simpan PDF (A4)</button></div></div>'
     +'<div class="px-prev"><canvas id="bc" width="540" height="764"></canvas></div></div>';
    kerangka("brosur",h);
    var V=function(id,v){$("#"+id).value=v==null?"":v};
    function isi(i){var x=BR.pakets[i];V("fpr",x.program);V("fhr",x.hari);V("fbt",x.bintang);V("ftg",x.tanggal);V("fq",x.harga.quad);V("ft3",x.harga.triple);V("fd2",x.harga.double);V("fma",x.maskapai);V("fko",x.kota);
      V("fmk",x.makkah.nama);V("fmkm",x.makkah.malam);V("fmkj",x.makkah.jarak);V("fmkb",x.makkah.bintang);V("fmd",x.madinah.nama);V("fmdm",x.madinah.malam);V("fmdj",x.madinah.jarak);V("fmdb",x.madinah.bintang);
      V("flb",x.label);V("ftl",x.tagline);V("fzi",(x.ziarah||[]).join("\n"));V("fbl",(x.bonusL||[]).join("\n"));if(x.syarat&&x.syarat.length)V("fsy",x.syarat.join("\n"));V("fhj",x.tambahan.judul);V("fhn",x.tambahan.nama);V("fin",x.termasuk.join("\n"));V("fex",x.tidak.join("\n"));V("fdp",x.dp);V("fdf",x.daftar);V("fbo",x.bonus);V("fct",x.catatan);
      var hi=BR.hook.indexOf(x.judul);if(hi>=0){V("fh",hi);$("#fhx").hidden=true}else if(x.judul){V("fh",BR.hook.length);V("fhx",x.judul);$("#fhx").hidden=false}}
    V("fnm",j.nama);V("fwa",j.wa);V("fsy","Paspor asli, nama minimal 2 kata, masa berlaku minimal 1 tahun\nFotocopy KTP dan KK\nPas foto berwarna 4x6 sebanyak 2 lembar\nBuku vaksin meningitis dan polio");isi(0);
    var go=function(){var d=baca();gambar($("#bc"),$("#fm2").value==="ig"?540:540,$("#fm2").value==="ig"?675:764,d)};
    $("#fp").onchange=function(){isi(+this.value);go()};
    if($("#fl"))$("#fl").onchange=function(){brosur(this.value)};
    $("#fh").onchange=function(){$("#fhx").hidden=+this.value!==BR.hook.length;go()};
    root.querySelectorAll(".px-bf input,.px-bf textarea,.px-bf select").forEach(function(e){if(e.id!=="fp"&&e.id!=="fl"){e.oninput=go;e.onchange=go}});
    function ambil(id,key){$("#"+id).onchange=function(){var f=this.files[0];if(!f){delete HF[key];go();return}var r=new FileReader();r.onload=function(){var i=new Image();i.onload=function(){var z=Math.min(1,1400/Math.max(i.width,i.height)),cv=document.createElement("canvas");cv.width=Math.round(i.width*z);cv.height=Math.round(i.height*z);cv.getContext("2d").drawImage(i,0,0,cv.width,cv.height);HF[key]=cv.toDataURL("image/jpeg",.86);go()};i.src=r.result};r.readAsDataURL(f)}}
    ambil("fup0","hero");ambil("fup1","mk");ambil("fup2","md");ambil("fup3","tb");
    function ukuran(W){return $("#fm2").value==="ig"?[W,Math.round(W*1.25)]:[W,Math.round(W*1.4142)]}
    $("#bd").onclick=function(){var z=ukuran(1080),c=document.createElement("canvas");c.width=z[0];c.height=z[1];gambar(c,z[0],z[1],baca()).then(function(){var a=document.createElement("a");a.download="brosur-farfaza.png";a.href=c.toDataURL("image/png");a.click()})};
    $("#bp").onclick=function(){var w=window.open("","_blank");if(!w){alert("Izinkan pop-up untuk mencetak.");return}var c=document.createElement("canvas");c.width=1654;c.height=2339;var d=baca();d.mode="a4";gambar(c,1654,2339,d).then(function(){
      w.document.write('<title>Brosur Farfaza</title><style>@page{size:A4;margin:0}html,body{margin:0}img{width:210mm;height:297mm;display:block}</style><img src="'+c.toDataURL("image/png")+'">');w.document.close();w.onload=function(){w.print()}})};
    go()}).catch(function(er){galat("brosur",er)});
}
function angka(v){var s=String(v==null?"":v).replace(/[^\d]/g,"");return s?+s:null}
function baris(v){return String(v||"").split("\n").map(function(x){return x.trim()}).filter(Boolean)}
function baca(){
  var g=function(i){return $("#"+i).value.trim()},hi=+$("#fh").value,hook=hi>=BR.hook.length?(g("fhx")||"Berangkat bareng Farfaza"):BR.hook[hi];
  return{mode:$("#fm2").value,tema:TEMA[$("#ft").value],foto:HF.hero||("img/"+FOTO[+$("#ff").value][0]),up:{mk:HF.mk,md:HF.md,tb:HF.tb},judul:hook,program:g("fpr"),hari:angka(g("fhr")),bintang:angka(g("fbt")),tanggal:g("ftg"),
   quad:angka(g("fq")),triple:angka(g("ft3")),dbl:angka(g("fd2")),maskapai:g("fma"),kota:g("fko"),
   mk:{nama:g("fmk"),malam:angka(g("fmkm")),jarak:g("fmkj"),b:angka(g("fmkb"))},md:{nama:g("fmd"),malam:angka(g("fmdm")),jarak:g("fmdj"),b:angka(g("fmdb"))},tb:{judul:g("fhj"),nama:g("fhn")},
   inc:baris($("#fin").value),exc:baris($("#fex").value),dp:g("fdp"),daftar:g("fdf"),bonus:g("fbo"),catatan:g("fct"),label:g("flb"),tagline:g("ftl"),ziarah:baris($("#fzi").value),bonusL:baris($("#fbl").value),syarat:baris($("#fsy").value),nama:g("fnm"),wa:waShow(g("fwa")),rekening:BR.rekening};
}
function wa62(v){var d=String(v||"").replace(/\D/g,"");if(d.indexOf("0")===0)d="62"+d.slice(1);return d}
function waShow(v){var d=wa62(v);if(d.indexOf("62")!==0)return v;var n="0"+d.slice(2);return n.replace(/^(\d{4})(\d{4})(\d*)$/,function(m,a,b,c){return a+"-"+b+(c?"-"+c:"")})}
function bungkus(ctx,t,maxW){var w=String(t).split(" "),l="",o=[];w.forEach(function(x){var n=l?l+" "+x:x;if(ctx.measureText(n).width>maxW&&l){o.push(l);l=x}else l=n});if(l)o.push(l);return o}
function muat(src){return new Promise(function(r){var i=new Image();i.onload=function(){r(i)};i.onerror=function(){r(null)};i.src=src})}
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}

// ---- kartu mitra (depan/belakang), desain dari canvas "Kartu Mitra Farfaza"
function kartuMitraGambar(k,sisi){
  return Promise.all([document.fonts.load("700 30px 'EB Garamond'"),document.fonts.load("600 20px 'DM Sans'"),muat("img/logo_farfaza.png")]).then(function(a){
    var S=2,W=540,H=856,c=document.createElement("canvas");c.width=W*S;c.height=H*S;var x=c.getContext("2d");x.scale(S,S);
    var SERIF="'EB Garamond',Georgia,serif",SANS="'DM Sans',Arial,sans-serif",logo=a[2],UNGU="#8E0A80",GELAP="#5E0755",EMAS="#E8C766",TINTA="#2A1029",ABU="#5C4A5A";
    function t(s,px,py,f,col,al,ls){x.font=f;x.fillStyle=col;x.textAlign=al||"left";if("letterSpacing" in x)x.letterSpacing=(ls||0)+"px";x.fillText(s,px,py);if("letterSpacing" in x)x.letterSpacing="0px"}
    function bungkus(s,maxW,f){x.font=f;var w=String(s).split(/\s+/),l=[],cur="";w.forEach(function(k2){var tc=cur?cur+" "+k2:k2;if(x.measureText(tc).width>maxW&&cur){l.push(cur);cur=k2}else cur=tc});if(cur)l.push(cur);return l}
    function para(s,px,py,maxW,f,col,lh){var L=bungkus(s,maxW,f);L.forEach(function(q,i){t(q,px,py+i*lh,f,col)});return py+L.length*lh}
    function logoBox(cx,y,bw,bh){var bg="#fff";try{if(logo){var tc=document.createElement("canvas");tc.width=tc.height=4;var tx=tc.getContext("2d");tx.drawImage(logo,0,0,4,4);var px=tx.getImageData(0,0,1,1).data;if(px[3]>200)bg="rgb("+px[0]+","+px[1]+","+px[2]+")"}}catch(e){}x.fillStyle=bg;rr(x,cx-bw/2,y,bw,bh,12);x.fill();if(logo){var lh=bh-14,lw=logo.width*lh/logo.height;if(lw>bw-24){lw=bw-24;lh=logo.height*lw/logo.width}x.drawImage(logo,cx-lw/2,y+(bh-lh)/2,lw,lh)}}
    x.fillStyle="#fff";x.fillRect(0,0,W,H);
    var ref=/referensi/i.test(k.jenis||"");
    if(sisi==="belakang"){
      x.fillStyle=UNGU;x.fillRect(0,0,W,96);logoBox(W/2,16,230,64);x.fillStyle=GELAP;x.fillRect(0,96,W,12);
      x.fillStyle="#FBF5FA";rr(x,40,138,460,ref?236:206,14);x.fill();x.lineWidth=3;x.strokeStyle=UNGU;x.stroke();
      t("PERHATIAN",60,172,"700 20px "+SANS,UNGU,"left",1);
      var y=para("Pembayaran sah apabila telah diterima PT. Farah Faza Astatama di rekening resmi di bawah ini. Pastikan Anda menerima bukti penerimaan dari Farfaza dan Nomor Anggota dengan tanggal keberangkatan; cek melalui tautan di website farfazatravel.com.",60,202,420,"500 16px "+SANS,TINTA,22);
      if(ref)para("Mitra Referensi tidak berwenang menerima pembayaran jamaah dalam bentuk apa pun.",60,y+6,420,"500 14px "+SANS,ABU,20);
      var by=ref?412:382;
      t("REKENING RESMI",40,by,"700 13px "+SANS,"#6B5568","left",2);
      t("Bank Mandiri KCP Jakarta Kramat (IDR)",40,by+28,"500 15px "+SANS,ABU);t("123-00-3000-000-6",40,by+56,"700 24px "+SANS,TINTA,"left",1);
      t("Bank Syariah Indonesia (USD)",40,by+90,"500 15px "+SANS,ABU);t("700134228",40,by+118,"700 24px "+SANS,TINTA,"left",1);
      t("a.n. PT. Farah Faza Astatama",40,by+148,"700 16px "+SANS,TINTA);
      x.fillStyle="#E2D3E0";x.fillRect(40,by+170,460,1);
      t("CEK MITRA, NOMOR ANGGOTA & PEMBAYARAN",40,by+198,"700 13px "+SANS,"#6B5568","left",1.5);
      t("WhatsApp  0812-1371-1159",40,by+226,"600 18px "+SANS,TINTA);t("Web  farfazatravel.com",40,by+252,"600 18px "+SANS,TINTA);
      para("Jl. Kramat II No. 59, Kwitang, Senen, Jakarta Pusat",40,by+278,460,"500 15px "+SANS,ABU,20);
      para("Kartu ini milik PT. Farah Faza Astatama. Bila ditemukan, mohon hubungi nomor di atas. Kartu tidak berlaku apabila status mitra tidak aktif atau dicabut.",40,H-110,270,"500 12.5px "+SANS,ABU,17);
      x.fillStyle=TINTA;x.fillRect(330,H-88,170,1.5);t("Direktur Operasional",415,H-68,"600 13px "+SANS,TINTA,"center");
      x.fillStyle=UNGU;x.fillRect(0,H-18,W,18);x.fillStyle=EMAS;x.fillRect(0,H-21,W,3);
      return c}
    // depan
    x.fillStyle=UNGU;x.fillRect(0,0,W,210);logoBox(W/2,30,270,88);x.fillStyle=GELAP;x.fillRect(0,210,W,28);
    x.fillStyle=EMAS;x.fillRect(100,168,34,2);x.fillRect(W-134,168,34,2);t("KARTU MITRA",W/2+3,176,"700 20px "+SANS,"#fff","center",6);
    var cy=300;
    if(k.wilayah){t(String(k.wilayah),W/2,cy,"500 17px "+SANS,ABU,"center");cy+=14}
    var nm=String(k.nama||"").toUpperCase(),fs=34,L;do{L=bungkus(nm,W-80,"700 "+fs+"px "+SERIF);fs-=2}while(L.length>2&&fs>20);fs+=2;
    L=bungkus(nm,W-80,"700 "+fs+"px "+SERIF);cy+=38;L.forEach(function(q,i){t(q,W/2,cy+i*(fs+8),"700 "+fs+"px "+SERIF,TINTA,"center")});cy+=(L.length-1)*(fs+8);
    var lab=(/mitra/i.test(k.jenis||"")?k.jenis:"Mitra "+(k.jenis||"")).toUpperCase().trim();x.font="700 17px "+SANS;if("letterSpacing" in x)x.letterSpacing="2px";var pw=x.measureText(lab).width+44;if("letterSpacing" in x)x.letterSpacing="0px";
    cy+=34;x.fillStyle=ref?UNGU:EMAS;rr(x,W/2-pw/2,cy,pw,38,19);x.fill();t(lab,W/2+1,cy+26,"700 17px "+SANS,ref?"#fff":"#3B0A36","center",2);
    cy+=96;x.fillStyle="#E2D3E0";x.fillRect(40,cy-34,460,1);
    t("KODE MITRA",W/2,cy,"600 13px "+SANS,"#6B5568","center",2);t(String(k.kode||""),W/2,cy+54,"700 52px "+SANS,UNGU,"center",1);
    var ada=!!k.berlaku;
    t("STATUS",ada?150:W/2,cy+104,"600 13px "+SANS,"#6B5568","center",2);t(String(k.status||""),ada?150:W/2,cy+132,"700 22px "+SANS,TINTA,"center");
    if(ada){t("BERLAKU SAMPAI",W-150,cy+104,"600 13px "+SANS,"#6B5568","center",2);t(tgl(k.berlaku),W-150,cy+132,"700 22px "+SANS,k.berlakuHabis?"#B3261E":TINTA,"center")}
    x.fillStyle="#F6EEF5";x.fillRect(0,H-64,W,64);x.fillStyle=EMAS;x.fillRect(0,H-64,W,3);
    t("PT. Farah Faza Astatama",W/2,H-36,"700 14px "+SANS,"#4A3247","center");t("Izin PPIU No. U.139/2020  ·  Izin PIHK No. 772/2019",W/2,H-16,"500 12.5px "+SANS,"#4A3247","center");
    return c})}
function cover(c,im,x,y,w,h){if(!im){c.fillStyle="#3A1A47";c.fillRect(x,y,w,h);return}var s=Math.max(w/im.width,h/im.height),sw=w/s,sh=h/s;c.drawImage(im,(im.width-sw)/2,(im.height-sh)/2*0.7,sw,sh,x,y,w,h)}
var LGC=null;
function clearBg(im){if(LGC&&LGC.src===im.src)return LGC.c;var t=document.createElement("canvas");t.width=im.width;t.height=im.height;var q=t.getContext("2d");q.drawImage(im,0,0);var dt=q.getImageData(0,0,t.width,t.height),p=dt.data;for(var i=0;i<p.length;i+=4){var m=Math.min(p[i],p[i+1],p[i+2]);if(m>232)p[i+3]=0;else if(m>200)p[i+3]=Math.round((232-m)/32*255)}q.putImageData(dt,0,0);LGC={src:im.src,c:t};return t}
var gambarId=0;
function money(v){var n=Number(String(v==null?"":v).replace(/\D/g,""));return n?"Rp"+n.toLocaleString("id-ID"):String(v||"")}
function gambar(c,W,H,d){
  var my=++gambarId;
  return Promise.all([fontMS(),document.fonts.load("italic 700 60px 'EB Garamond'"),document.fonts.load("700 60px 'EB Garamond'"),document.fonts.load("500 30px 'DM Sans'"),document.fonts.load("600 30px 'DM Sans'"),
    muat("img/logo_farfaza.png"),d.foto?muat(d.foto):Promise.resolve(null),muat("img/brosur_road30.png"),muat(d.up.mk||"img/haram_night.jpg"),muat(d.up.md||"img/jamaah_nabawi.jpg"),d.up.tb?muat(d.up.tb):Promise.resolve(null)]).then(function(a){
    if(c.id==="bc"&&my!==gambarId)return;
    c.width=W;c.height=H;var ctx=c.getContext("2d"),k=W/1080,T=d.tema,a4=d.mode==="a4",logo=a[5],hero=a[6],r30=a[7],img={mk:a[8],md:a[9],tb:a[10]};
    var SERIF="'EB Garamond',Georgia,serif",SANS="'DM Sans',Arial,sans-serif",MON="'Montserrat','DM Sans',Arial,sans-serif";
    var M=36*k,CW=W-2*M,gap=14*k,PU="#4B1670",INK="#2A1238";
    function tx(t,x,y,f,col,al){ctx.font=f;ctx.fillStyle=col;ctx.textAlign=al||"left";ctx.fillText(t,x,y)}
    function fitF(t,maxW,wt,fam,size,min){var s=size;ctx.font=wt+" "+s+"px "+fam;while(ctx.measureText(t).width>maxW&&s>min){s-=1*k;ctx.font=wt+" "+s+"px "+fam}return s}
    function ell(t,maxW){if(ctx.measureText(t).width<=maxW)return t;while(t.length>1&&ctx.measureText(t+"…").width>maxW)t=t.slice(0,-1);return t+"…"}
    function ico(n,x,y,s,col){ctx.save();ctx.translate(x,y);ctx.scale(s/24,s/24);ctx.fillStyle=col;ctx.fill(new Path2D(IC[n]));ctx.restore()}
    function grad(x0,y0,x1,y1,st){var g=ctx.createLinearGradient(x0,y0,x1,y1);st.forEach(function(s,i){g.addColorStop(st.length>1?i/(st.length-1):0,s)});return g}
    function badge(n,x,y,s){rr(ctx,x,y,s,s,s*0.28);ctx.fillStyle=grad(x,y,x+s,y+s,[T.pu2,T.pu]);ctx.fill();ico(n,x+s*0.2,y+s*0.2,s*0.6,"#fff")}
    function pillHead(x,y,w,h,t,n){rr(ctx,x,y,w,h,h/2);ctx.fillStyle=grad(x,y,x+w,y,[T.pu,T.pu2]);ctx.fill();ico(n,x+h*0.26,y+h*0.2,h*0.6,T.gold2);var s=fitF(t,w-h*1.25,"800",MON,h*0.4,11*k);tx(t,x+h*0.98,y+h*0.5+s*0.35,"800 "+s+"px "+MON,"#fff")}
    function card(x,y,w,h){ctx.save();ctx.shadowColor="rgba(75,22,112,.2)";ctx.shadowBlur=26*k;ctx.shadowOffsetY=6*k;rr(ctx,x,y,w,h,26*k);ctx.fillStyle="#fff";ctx.fill();ctx.restore();rr(ctx,x,y,w,h,26*k);ctx.strokeStyle="rgba(123,53,168,.14)";ctx.lineWidth=2*k;ctx.stroke()}
    function stars(n){return n?"★".repeat(Math.min(5,n)):""}
    function goldBar(x,y,w,h){rr(ctx,x,y,w,h,h/2);ctx.fillStyle=grad(x,y,x+w,y,[T.gold,T.gold2,"rgba(240,210,122,.2)"]);ctx.fill()}
    function headTxt(maxW,start,min,maxL){var hl=String(d.judul||"").toUpperCase(),fs=start,ls;for(;;){ctx.font="800 "+fs+"px "+MON;ls=bungkus(ctx,hl,maxW);var over=ls.some(function(t){return ctx.measureText(t).width>maxW});if((ls.length>maxL||over)&&fs>min)fs-=3*k;else break}return{ls:ls,fs:fs}}
    function lst(items,x,y,maxY,mark,col,lh,fsz,aw){var cap=Math.max(1,Math.floor((maxY-y)/lh)),sh=items.length>cap?items.slice(0,cap-1):items;
      sh.forEach(function(t,i){var yy=y+i*lh+lh*0.7;if(mark==="ok")ico("check",x,yy-lh*0.62,lh*0.7,col);else{ctx.beginPath();ctx.arc(x+lh*0.35,yy-lh*0.27,lh*0.34,0,7);ctx.fillStyle=col;ctx.fill();ico("close",x+lh*0.17,yy-lh*0.45,lh*0.36,"#fff")}
        fitF(t,aw-lh*0.95,"500",SANS,fsz,17*k);var tt=ell(t,aw-lh*0.95);tx(tt,x+lh*0.95,yy,ctx.font,INK)});
      if(items.length>cap){tx("dan "+(items.length-cap+1)+" lainnya…",x+lh*0.95,y+sh.length*lh+lh*0.7,"italic 500 "+fsz+"px "+SANS,"#6B5A78");sh.length++}return y+sh.length*lh}
    function social(y,h,dark,pad){var P=pad||0;var wt=d.wa||"0812-1371-1159",it=[["ig","@farfazatravel"],["wa",wt,d.nama],["tt","@farfaza_travel"],["fb","Farfaza Astatama Tour"]],s=Math.min(h*0.9,52*k),fs=26*k,tot=0,col=dark?"#FFFFFF":INK;
      function w(){tot=0;it.forEach(function(x){ctx.font="600 "+fs+"px "+SANS;x.w=s+10*k+ctx.measureText(x[1]).width;tot+=x.w});return tot}
      while(w()>CW-2*P-30*k&&fs>14*k)fs-=1*k;var sp=(CW-2*P-tot)/3,x=M+P,cy=y+h/2;
      it.forEach(function(q){var ix=x,iy=cy-s/2,r=s/2;
        if(q[0]==="ig"){rr(ctx,ix,iy,s,s,s*0.3);ctx.fillStyle=grad(ix,iy+s,ix+s,iy,["#F9CE34","#EE2A7B","#6228D7"]);ctx.fill();ctx.strokeStyle="#fff";ctx.lineWidth=s*0.07;rr(ctx,ix+s*0.2,iy+s*0.2,s*0.6,s*0.6,s*0.18);ctx.stroke();ctx.beginPath();ctx.arc(ix+r,iy+r,s*0.14,0,7);ctx.stroke();ctx.beginPath();ctx.arc(ix+s*0.68,iy+s*0.32,s*0.04,0,7);ctx.fillStyle="#fff";ctx.fill()}
        else if(q[0]==="wa"){ctx.beginPath();ctx.arc(ix+r,iy+r,r,0,7);ctx.fillStyle="#25D366";ctx.fill();ico("call",ix+s*0.22,iy+s*0.22,s*0.56,"#fff")}
        else if(q[0]==="tt"){ctx.beginPath();ctx.arc(ix+r,iy+r,r,0,7);ctx.fillStyle="#111";ctx.fill();ico("note",ix+s*0.24,iy+s*0.22,s*0.54,"#fff")}
        else{ctx.beginPath();ctx.arc(ix+r,iy+r,r,0,7);ctx.fillStyle="#1877F2";ctx.fill();tx("f",ix+r,iy+s*0.78,"800 "+s*0.78+"px Arial","#fff","center")}
        var tx0=ix+s+10*k;ctx.font="600 "+fs+"px "+SANS;
        if(q[2]){ctx.font="600 "+fs*0.62+"px "+SANS;var nm=ell(String(q[2]).toUpperCase(),ctx.measureText(q[1]).width*1.3+10*k);tx(nm,tx0,cy-fs*0.18,"600 "+fs*0.62+"px "+SANS,dark?"#F0D27A":"#7B35A8");tx(q[1],tx0,cy+fs*0.8,"600 "+fs+"px "+SANS,col)}
        else tx(q[1],tx0,cy+fs*0.35,"600 "+fs+"px "+SANS,col);x+=q.w+sp})}
    function discl(y,h,dark){rr(ctx,M,y,CW,h,Math.min(h/2,32*k));ctx.fillStyle=dark?"rgba(255,255,255,.14)":"#EADCF5";ctx.fill();var r=Math.min(20*k,h*0.3),cx=M+16*k+r,cy=y+h/2;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.fillStyle=dark?T.gold2:PU;ctx.fill();tx("!",cx,cy+r*0.45,"800 "+r*1.4+"px "+SANS,dark?PU:"#fff","center");
      var tw=CW-(cx+r+14*k-M)-16*k,t1=d.catatan||"Program dan harga dapat berubah sesuai kondisi.",col=dark?"#fff":INK,tcx=cx+r+14*k;
      if(d.rekening){fitF(t1,tw,"500",SANS,20*k,13*k);tx(ell(t1,tw),tcx,cy-4*k,ctx.font,col);var t2="Pembayaran hanya ke rekening resmi: "+d.rekening;fitF(t2,tw,"600",SANS,19*k,12*k);tx(ell(t2,tw),tcx,cy+24*k,ctx.font,dark?T.gold2:PU)}
      else{fitF(t1,tw,"500",SANS,21*k,13*k);tx(ell(t1,tw),tcx,cy+7*k,ctx.font,col)}}
    function kepala(){
      var lh=64*k;if(logo){var lw=logo.width*lh/logo.height;ctx.drawImage(clearBg(logo),M,14*k,lw,lh)}
      if(r30){var rh=60*k,rw=r30.width*rh/r30.height;ctx.save();ctx.shadowColor="rgba(255,255,255,.95)";ctx.shadowBlur=14*k;ctx.drawImage(r30,W-M-rw,16*k,rw,rh);ctx.drawImage(r30,W-M-rw,16*k,rw,rh);ctx.restore()}
      var iz="Izin Umroh (PPIU) No. U.139/2020  •  Izin Haji (PIHK) No. 772/2019";fitF(iz,CW,"600",SANS,15*k,10*k);tx(iz,M,14*k+lh+24*k,ctx.font,"#5A4670","left")}
    function photoMask(im,px,py,pw,ph){var t=document.createElement("canvas");t.width=Math.max(2,Math.round(pw));t.height=Math.max(2,Math.round(ph));var tc=t.getContext("2d");cover(tc,im,0,0,t.width,t.height);tc.globalCompositeOperation="destination-in";
      var g1=tc.createLinearGradient(0,0,t.width*0.62,0);g1.addColorStop(0,"rgba(0,0,0,0)");g1.addColorStop(1,"rgba(0,0,0,1)");tc.fillStyle=g1;tc.fillRect(0,0,t.width,t.height);
      var g2=tc.createLinearGradient(0,0,0,t.height);g2.addColorStop(0,"rgba(0,0,0,1)");g2.addColorStop(0.7,"rgba(0,0,0,1)");g2.addColorStop(1,"rgba(0,0,0,0)");tc.fillStyle=g2;tc.fillRect(0,0,t.width,t.height);ctx.drawImage(t,px,py)}
    var inc=d.inc.slice(),exc=d.exc.slice(),hs=[];
    if(d.mk.nama)hs.push({k:"mk",lab:"Makkah",h:d.mk,j:"Masjidil Haram"});if(d.md.nama)hs.push({k:"md",lab:"Madinah",h:d.md,j:"Masjid Nabawi"});if(d.tb.nama)hs.push({k:"tb",lab:d.tb.judul||"Hotel",h:{nama:d.tb.nama},j:""});
    var qv=d.quad||d.triple||d.dbl,ql=d.quad?"Quad":(d.triple?"Triple":"Double"),extra=[];if(d.quad&&d.triple)extra.push(["Triple",d.triple]);if((d.quad||d.triple)&&d.dbl)extra.push(["Double",d.dbl]);
    var chips=[];if(d.dp)chips.push("DP "+money(d.dp));if(d.daftar)chips.push("Daftar: "+d.daftar);if(d.bonus)chips.push("Gratis "+d.bonus);
    function chipRow(y,h){var fs=21*k,pad=22*k,tot;function w(){tot=0;chips.forEach(function(t){ctx.font="700 "+fs+"px "+SANS;tot+=ctx.measureText(t).width+2*pad+10*k});return tot-10*k}while(w()>CW&&fs>13*k)fs-=1*k;var x=M;
      chips.forEach(function(t,i){ctx.font="700 "+fs+"px "+SANS;var tw=ctx.measureText(t).width+2*pad;rr(ctx,x,y,tw,h,h/2);ctx.fillStyle=i===chips.length-1&&d.bonus?grad(x,y,x+tw,y,[T.gold2,T.gold]):"#fff";ctx.fill();ctx.strokeStyle=T.gold;ctx.lineWidth=2*k;ctx.stroke();tx(t,x+pad,y+h/2+fs*0.35,"700 "+fs+"px "+SANS,PU);x+=tw+10*k})}

    function layA(){
      ctx.fillStyle=grad(0,0,0,H,["#FFFFFF","#F6EEFB","#EADBF5"]);ctx.fillRect(0,0,W,H);
      ctx.fillStyle="rgba(123,53,168,.11)";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(W*0.5,0);ctx.bezierCurveTo(W*0.3,H*0.05,W*0.1,H*0.1,0,H*0.27);ctx.closePath();ctx.fill();
      ctx.fillStyle="rgba(123,53,168,.08)";ctx.beginPath();ctx.moveTo(0,H*0.82);ctx.bezierCurveTo(W*0.3,H*0.74,W*0.65,H*0.92,W,H*0.8);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();ctx.fill();
      var h=headTxt(CW*0.58,104*k,44*k,3),ls=h.ls,fs=h.fs,y0=132*k,yH=y0+ls.length*fs*1.0,pillY=yH+30*k,pH=68*k;
      var pt=("UMROH "+d.program).toUpperCase().trim(),ps=fitF(pt,CW*0.6-76*k,"800",MON,44*k,22*k),pW=ctx.measureText(pt).width+76*k;
      var yS=pillY+pH+44*k,sub=[d.hari?d.hari+" HARI":"",d.maskapai?d.maskapai.toUpperCase():""].filter(Boolean).join(" • "),yD=yS+(d.tanggal?42*k:0),yEnd=(d.tanggal?yD:yS)+30*k;
      var chipY=yEnd;if(chips.length)yEnd+=46*k+18*k;
      if(hero)photoMask(hero,W*0.42,0,W*0.58,Math.min(yEnd+10*k,H*0.52));else{ctx.fillStyle="rgba(123,53,168,.12)";ctx.fillRect(W*0.5,0,W*0.5,yEnd*0.8)}
      kepala();
      ctx.save();ctx.shadowColor="rgba(255,255,255,.95)";ctx.shadowBlur=26*k;ls.forEach(function(t,i){var pur=(i%2===1)||ls.length===1;ctx.font="800 "+fs+"px "+MON;ctx.textAlign="left";ctx.fillStyle=pur?grad(M,0,M+CW*0.5,0,[T.pu2,PU]):"#14091C";ctx.fillText(t,M,y0+fs*(i+0.82));ctx.fillText(t,M,y0+fs*(i+0.82))});ctx.restore();
      goldBar(M,yH+8*k,200*k,9*k);
      rr(ctx,M,pillY,pW,pH,pH/2);ctx.fillStyle=grad(M,pillY,M+pW,pillY,[PU,T.pu2]);ctx.fill();tx(pt,M+pW/2,pillY+pH/2+ps*0.36,"800 "+ps+"px "+MON,T.pill,"center");
      if(sub){var ss=fitF(sub,CW*0.62,"800",MON,36*k,20*k);tx(sub,M,yS,"800 "+ss+"px "+MON,T.pu2)}
      if(d.tanggal){var ds=fitF(d.tanggal.toUpperCase(),CW*0.62,"800",MON,32*k,18*k);tx(d.tanggal.toUpperCase(),M,yD,"800 "+ds+"px "+MON,"#14091C")}
      if(chips.length)chipRow(chipY,46*k);
      var cy=yEnd,discH=(d.rekening?90:66)*k,footH=80*k,cardsH=H-cy-gap-discH-12*k-footH-12*k,cw=(CW-2*gap)/3,hh=54*k,pad=12*k;
      if(cardsH<300*k)cardsH=300*k;
      // PROGRAM
      var x1=M;card(x1,cy,cw,cardsH);pillHead(x1+pad,cy+pad,cw-2*pad,hh,"PROGRAM","cal");
      var rows=[["cal","Keberangkatan:",d.tanggal],["pin","Start:",d.kota],["plane","Maskapai:",d.maskapai],["clock","Durasi:",d.hari?d.hari+" Hari":""]].filter(function(r){return r[2]});
      var ry=cy+pad+hh+8*k,rh=Math.min(126*k,(cardsH-(ry-cy)-pad)/Math.max(rows.length,1));
      rows.forEach(function(r,i){var yy=ry+i*rh,bs=Math.min(58*k,rh*0.6);badge(r[0],x1+16*k,yy+(rh-bs)/2,bs);var t0=x1+16*k+bs+12*k,aw=cw-(t0-x1)-12*k,vs=25*k,vl;
        for(;;){ctx.font="800 "+vs+"px "+MON;vl=bungkus(ctx,r[2],aw);if((vl.length>2||vl.some(function(t){return ctx.measureText(t).width>aw}))&&vs>14*k)vs-=1*k;else break}
        var blockH=17*k+6*k+vl.length*vs*1.12,by=yy+(rh-blockH)/2;tx(r[1],t0,by+15*k,"500 "+18*k+"px "+SANS,"#6B5A78");vl.forEach(function(t,j){tx(t,t0,by+17*k+6*k+vs*(0.95+j*1.12),"800 "+vs+"px "+MON,PU)});
        if(i<rows.length-1){ctx.fillStyle="rgba(201,154,46,.45)";ctx.fillRect(x1+16*k,yy+rh,cw-32*k,2*k)}});
      // HOTEL
      var x2=M+cw+gap;card(x2,cy,cw,cardsH);pillHead(x2+pad,cy+pad,cw-2*pad,hh,d.bintang?"HOTEL BINTANG "+d.bintang:"HOTEL","hotel");
      var top=cy+pad+hh+10*k,bot=cy+cardsH-pad;
      if(!hs.length)tx("Hotel: hubungi kami",x2+cw/2,(top+bot)/2,"600 "+22*k+"px "+SANS,"#6B5A78","center");
      else{var hb=Math.min(300*k,(bot-top-(hs.length-1)*10*k)/hs.length);hs.forEach(function(q,i){var bx=x2+pad,bw=cw-2*pad,by=top+i*(hb+10*k);ctx.save();rr(ctx,bx,by,bw,hb,18*k);ctx.clip();
          if(img[q.k])cover(ctx,img[q.k],bx,by,bw,hb);else{ctx.fillStyle=grad(bx,by,bx+bw,by+hb,[T.pu2,PU]);ctx.fillRect(bx,by,bw,hb);ico("hotel",bx+bw/2-hb*0.2,by+hb*0.12,hb*0.4,"rgba(255,255,255,.35)")}
          var pH2=Math.min(hb*0.7,(q.h.jarak?106:80)*k);ctx.fillStyle="rgba(255,255,255,.95)";ctx.fillRect(bx,by+hb-pH2,bw,pH2);ctx.restore();
          var py=by+hb-pH2,l1=q.lab+(q.h.malam?" • "+q.h.malam+" Malam":"");var s1=fitF(l1,bw-80*k,"600",SANS,19*k,12*k);tx(l1,bx+14*k,py+26*k,"600 "+s1+"px "+SANS,T.pu2);if(q.h.b)tx(stars(q.h.b),bx+bw-12*k,py+26*k,"600 "+18*k+"px "+SANS,T.gold,"right");
          var s2=fitF(q.h.nama,bw-28*k,"800",MON,27*k,13*k);tx(q.h.nama,bx+14*k,py+26*k+s2*1.25,"800 "+s2+"px "+MON,PU);
          if(q.h.jarak&&q.j){var jt=q.h.jarak+" ke "+q.j;fitF(jt,bw-28*k,"500",SANS,17*k,11*k);tx(jt,bx+14*k,py+26*k+s2*1.25+22*k,ctx.font,"#6B5A78")}})}
      // HARGA
      var x3=M+2*(cw+gap);card(x3,cy,cw,cardsH);pillHead(x3+pad,cy+pad,cw-2*pad,hh,"HARGA PAKET","coin");
      var bx3=x3+pad,bw3=cw-2*pad,by3=cy+pad+hh+10*k,bh=(qv?(extra.length?122+extra.length*26:118):70)*k;
      rr(ctx,bx3,by3,bw3,bh,20*k);ctx.fillStyle=grad(bx3,by3,bx3,by3+bh,T.pb);ctx.fill();if(T.lay==="A"&&T.pill!=="#FFFFFF"){ctx.strokeStyle=T.gold;ctx.lineWidth=3*k;ctx.stroke()}
      if(qv){tx("Mulai",bx3+16*k,by3+28*k,"600 "+19*k+"px "+SANS,T.pt);var numT=Number(qv).toLocaleString("id-ID"),ns=fitF("Rp"+numT,bw3-28*k,"800",MON,44*k,22*k);tx("Rp"+numT,bx3+14*k,by3+28*k+ns*1.05,"800 "+ns+"px "+MON,T.pt);tx("/ pax • "+ql,bx3+16*k,by3+28*k+ns*1.05+24*k,"600 "+19*k+"px "+SANS,T.pt);
        var ey=by3+28*k+ns*1.05+24*k;extra.forEach(function(e,i){var yy=ey+26*k+i*26*k;tx(e[0],bx3+16*k,yy,"500 "+17*k+"px "+SANS,"#5A4668");tx("Rp"+Number(e[1]).toLocaleString("id-ID"),bx3+bw3-14*k,yy,"700 "+19*k+"px "+MON,T.pt,"right")})}
      else tx("Hubungi kami",bx3+bw3/2,by3+bh/2+8*k,"700 "+26*k+"px "+MON,T.pt,"center");
      var ly=by3+bh+10*k;goldBar(bx3,ly,bw3,5*k);var ty=ly+36*k;tx("Harga termasuk:",bx3+4*k,ty,"800 "+22*k+"px "+MON,T.pu2);
      var lh=(a4?30:29)*k,y4=ty+8*k,bot3=cy+cardsH-pad,aw3=bw3-4*k;
      if(inc.length){var exr=(a4&&exc.length)?(Math.min(exc.length,3)+2)*lh+10*k:0;y4=lst(inc,bx3+4*k,y4,bot3-exr,"ok",T.pu2,lh,20*k,aw3)}
      if(a4&&exc.length&&bot3-y4>lh*3){y4+=10*k;tx("Tidak termasuk:",bx3+4*k,y4+22*k,"800 "+22*k+"px "+MON,"#A8322F");lst(exc,bx3+4*k,y4+34*k,bot3,"x","#C0453F",lh,19*k,aw3)}
      discl(cy+cardsH+12*k,discH,false);social(H-footH-6*k,footH,false);
    }

    function layB(){
      ctx.fillStyle=grad(0,0,0,H,["#D8C7F4","#EEE5FB","#FFFFFF"]);ctx.fillRect(0,0,W,H);
      var pH=H*0.43;function curve(){ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(W,0);ctx.lineTo(W,pH-70*k);ctx.bezierCurveTo(W*0.72,pH+14*k,W*0.34,pH-16*k,0,pH+44*k);ctx.closePath()}
      ctx.save();curve();ctx.clip();if(hero)cover(ctx,hero,0,0,W,pH+60*k);else{ctx.fillStyle="#B9A0DC";ctx.fillRect(0,0,W,pH+60*k)}
      var wg=ctx.createLinearGradient(0,0,W*0.8,0);wg.addColorStop(0,"rgba(255,255,255,.98)");wg.addColorStop(0.5,"rgba(255,255,255,.9)");wg.addColorStop(0.8,"rgba(255,255,255,.35)");wg.addColorStop(1,"rgba(255,255,255,0)");ctx.fillStyle=wg;ctx.fillRect(0,0,W,pH+60*k);ctx.restore();
      ctx.save();curve();ctx.lineWidth=6*k;ctx.strokeStyle=grad(0,0,W,0,[T.gold,T.gold2,T.gold]);ctx.clip();ctx.beginPath();ctx.moveTo(W,pH-70*k);ctx.bezierCurveTo(W*0.72,pH+14*k,W*0.34,pH-16*k,0,pH+44*k);ctx.stroke();ctx.restore();
      kepala();
      var h=headTxt(CW*0.62,128*k,50*k,3),ls=h.ls,fs=h.fs,y=150*k;ctx.textAlign="left";ctx.save();ctx.shadowColor="rgba(255,255,255,.95)";ctx.shadowBlur=22*k;
      ls.forEach(function(t,i){var kick=ls.length>=3&&i===0,s=kick?fs*0.55:fs,fam=SERIF;ctx.font=(kick?"italic ":"")+"700 "+s+"px "+fam;var tt=kick?t.charAt(0)+t.slice(1).toLowerCase():t;if(kick){tt=t.toLowerCase().replace(/(^|\s)\S/g,function(m){return m.toUpperCase()})}
        var by=y+s*0.85;ctx.font=(kick?"italic ":"")+"700 "+s+"px "+fam;var gold=(!kick&&(ls.length>=3?i===1:i===0));ctx.fillStyle=gold?grad(M,by-s*0.8,M,by,[T.gold2,T.gold,"#8A5E0F"]):PU;ctx.fillText(kick?tt:t,M,by);y+=s*(kick?0.8:0.92)});ctx.restore();
      y+=14*k;if(d.program){tx("Umroh "+d.program,M,y+30*k,"italic 600 "+42*k+"px "+SERIF,PU);y+=52*k}
      var cyh=66*k,cx=M;if(d.hari){var ht=d.hari+" HARI",hs2=fitF(ht,300*k,"800",MON,38*k,20*k),hw=ctx.measureText(ht).width+cyh*1.3;rr(ctx,cx,y,hw,cyh,cyh/2);ctx.fillStyle=grad(cx,y,cx+hw,y,[PU,T.pu2]);ctx.fill();ico("cal",cx+cyh*0.25,y+cyh*0.2,cyh*0.6,T.gold2);tx(ht,cx+cyh*1.0,y+cyh/2+hs2*0.36,"800 "+hs2+"px "+MON,"#fff");cx+=hw+12*k}
      if(d.tanggal){var dt=d.tanggal.toUpperCase(),dsz=fitF(dt,W-M-cx-cyh*1.2,"800",MON,34*k,16*k),dw=ctx.measureText(dt).width+cyh*1.3;rr(ctx,cx,y,dw,cyh,cyh/2);ctx.fillStyle="#fff";ctx.fill();ctx.strokeStyle=T.gold;ctx.lineWidth=2*k;ctx.stroke();ico("cal",cx+cyh*0.25,y+cyh*0.2,cyh*0.6,PU);tx(dt,cx+cyh*1.0,y+cyh/2+dsz*0.36,"800 "+dsz+"px "+MON,"#14091C")}
      y+=cyh+(chips.length?14*k:0);if(chips.length){chipRow(y,44*k);y+=44*k}y+=26*k;
      // banner harga
      var bw=Math.min(CW,CW*0.7),bh=(qv?(extra.length?250:200):120)*k;ctx.save();ctx.shadowColor="rgba(75,22,112,.35)";ctx.shadowBlur=26*k;ctx.shadowOffsetY=8*k;rr(ctx,M,y,bw,bh,40*k);ctx.fillStyle=grad(M,y,M+bw,y+bh,[T.pu2,PU]);ctx.fill();ctx.restore();rr(ctx,M,y,bw,bh,40*k);ctx.strokeStyle=grad(M,y,M+bw,y,[T.gold2,T.gold,T.gold2]);ctx.lineWidth=4*k;ctx.stroke();
      if(qv){tx("MULAI",M+36*k,y+50*k,"italic 700 "+34*k+"px "+SERIF,T.gold2);var nt="Rp"+Number(qv).toLocaleString("id-ID"),ns=fitF(nt,bw-72*k,"800",MON,82*k,30*k);tx(nt,M+34*k,y+50*k+ns*0.95,"800 "+ns+"px "+MON,"#fff");
        var ly=y+50*k+ns*0.95+38*k;ctx.fillStyle=T.gold2;ctx.fillRect(M+34*k,ly-9*k,50*k,3*k);tx("/ ORANG • "+ql.toUpperCase(),M+100*k,ly,"800 "+28*k+"px "+MON,"#fff");
        if(extra.length){var et=extra.map(function(e){return e[0]+" Rp"+Number(e[1]).toLocaleString("id-ID")}).join("    ");fitF(et,bw-72*k,"600",SANS,23*k,13*k);tx(et,M+36*k,ly+44*k,ctx.font,"#F0D27A")}}
      else tx("Hubungi kami untuk harga",M+bw/2,y+bh/2+12*k,"700 "+36*k+"px "+SERIF,"#fff","center");
      y+=bh+30*k;
      // fitur
      var ft=[];if(d.maskapai)ft.push(["plane",d.maskapai]);if(d.bintang)ft.push(["hotel","Hotel bintang "+d.bintang]);
      hs.forEach(function(q){ft.push(["pin",q.lab+": "+q.h.nama+(q.h.malam?" ("+q.h.malam+" malam)":"")])});
      var mk=inc.filter(function(t){return/makan/i.test(t)})[0];if(mk)ft.push(["rest","Makan sesuai program"]);ft=ft.slice(0,5);
      var fH=140*k;if(ft.length){var fw=CW/ft.length;ft.forEach(function(f,i){var fx=M+i*fw;if(i>0){ctx.fillStyle="rgba(201,154,46,.6)";ctx.fillRect(fx,y+8*k,2*k,fH-16*k)}
          ico(f[0],fx+fw/2-26*k,y,52*k,PU);var s=19*k,l;for(;;){ctx.font="700 "+s+"px "+MON;l=bungkus(ctx,f[1],fw-18*k);if((l.length>3||l.some(function(t){return ctx.measureText(t).width>fw-14*k}))&&s>12*k)s-=1*k;else break}
          l.slice(0,3).forEach(function(t,j){tx(t,fx+fw/2,y+78*k+j*s*1.2,"700 "+s+"px "+MON,PU,"center")})});y+=fH+8*k}
      // bawah
      var footH=128*k,fy=H-footH,discH=(d.rekening?90:64)*k,dy=fy-discH-6*k;
      var rem=dy-y-14*k;
      if(rem>130*k&&(inc.length||exc.length)){var two=a4&&exc.length,cwd=two?(CW-gap)/2:CW,lh2=30*k;
        card(M,y,cwd,rem);tx("Harga termasuk:",M+22*k,y+38*k,"800 "+22*k+"px "+MON,T.pu2);
        if(two){lst(inc,M+22*k,y+52*k,y+rem-10*k,"ok",T.pu2,lh2,19*k,cwd-44*k);card(M+cwd+gap,y,cwd,rem);tx("Tidak termasuk:",M+cwd+gap+22*k,y+38*k,"800 "+22*k+"px "+MON,"#A8322F");lst(exc,M+cwd+gap+22*k,y+52*k,y+rem-10*k,"x","#C0453F",lh2,19*k,cwd-44*k)}
        else{var half=Math.ceil(inc.length/2);var colw=(cwd-60*k)/2;var cap2=Math.floor((rem-62*k)/lh2),i1=inc.slice(0,Math.min(cap2,half)),i2=inc.slice(i1.length,i1.length+cap2);lst(i1,M+22*k,y+52*k,y+rem-10*k,"ok",T.pu2,lh2,18*k,colw);lst(i2,M+22*k+colw+16*k,y+52*k,y+rem-10*k,"ok",T.pu2,lh2,18*k,colw)}}
      discl(dy,discH,false);
      ctx.beginPath();ctx.moveTo(0,fy+26*k);ctx.bezierCurveTo(W*0.3,fy-12*k,W*0.7,fy+52*k,W,fy+8*k);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();ctx.fillStyle=grad(0,fy,W,H,[PU,T.pu2,PU]);ctx.fill();
      ctx.beginPath();ctx.moveTo(0,fy+26*k);ctx.bezierCurveTo(W*0.3,fy-12*k,W*0.7,fy+52*k,W,fy+8*k);ctx.lineWidth=4*k;ctx.strokeStyle=grad(0,0,W,0,[T.gold,T.gold2,T.gold]);ctx.stroke();
      social(fy+36*k,footH-48*k,true);
    }

    function layC(){
      var v2=T.v===2,HD=T.hd||"#8E24AA",GR="#E6E1EF",lhC=27*k,fsC=18*k,hh=42*k;
      ctx.fillStyle=grad(0,0,0,H,["#F4EEFA","#FFFFFF","#FFFFFF"]);ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(123,53,168,.05)";ctx.lineWidth=2*k;for(var gx=-40*k;gx<W;gx+=90*k){for(var gy=0;gy<H;gy+=104*k){var ox=((gy/(104*k))%2)?45*k:0;ctx.beginPath();for(var q=0;q<6;q++){var an=Math.PI/3*q+Math.PI/6,px=gx+ox+30*k*Math.cos(an)+30*k,py2=gy+30*k*Math.sin(an)+30*k;q?ctx.lineTo(px,py2):ctx.moveTo(px,py2)}ctx.closePath();ctx.stroke()}}
      kepala();
      var words=String(d.judul||"").split(/\s+/).filter(Boolean),cut=Math.max(1,Math.round(words.length*0.4)),sz=124*k,one=words.join(" "),lines;
      ctx.font="700 "+sz+"px "+SERIF;while(ctx.measureText(one).width>CW&&sz>72*k){sz-=3*k;ctx.font="700 "+sz+"px "+SERIF}
      if(ctx.measureText(one).width<=CW)lines=[words];else{var half=Math.ceil(words.length/2);lines=[words.slice(0,half),words.slice(half)];sz=100*k;for(;;){ctx.font="700 "+sz+"px "+SERIF;if(lines.every(function(l){return ctx.measureText(l.join(" ")).width<=CW})||sz<=50*k)break;sz-=3*k}}
      var ty=108*k,wi=0;
      lines.forEach(function(l,li){ctx.font="700 "+sz+"px "+SERIF;var sp=ctx.measureText(" ").width,tw=ctx.measureText(l.join(" ")).width,x=(W-tw)/2,by=ty+sz*0.8+li*sz*0.95;
        l.forEach(function(w){ctx.font="700 "+sz+"px "+SERIF;var ww=ctx.measureText(w).width,gold=wi<cut;ctx.textAlign="left";ctx.fillStyle=gold?(v2?"#F2C200":grad(0,by-sz*0.8,0,by,["#C99A2E","#8A6A1F"])):grad(x,0,x+ww,0,[PU,"#A01CB8"]);ctx.fillText(w,x,by);x+=ww+sp;wi++})});
      var yy=ty+sz*0.8+(lines.length-1)*sz*0.95+32*k;
      if(v2){rr(ctx,M,yy,CW,14*k,7*k);ctx.fillStyle="#C9CDD8";ctx.fill()}
      else{rr(ctx,M,yy+8*k,CW*0.56,14*k,7*k);ctx.fillStyle="#C9CDD8";ctx.fill();if(d.tanggal){if("letterSpacing" in ctx)ctx.letterSpacing=(5*k)+"px";var dsz=fitF(d.tanggal.toUpperCase(),CW*0.4,"500",SANS,30*k,16*k);tx(d.tanggal.toUpperCase(),W-M,yy+26*k,"500 "+dsz+"px "+SANS,PU,"right");if("letterSpacing" in ctx)ctx.letterSpacing="0px"}}
      var py=yy+(v2?36*k:44*k),phh=Math.round(H*(a4?0.225:0.235));
      ctx.save();ctx.beginPath();ctx.moveTo(M,py);ctx.lineTo(W-M,py);var bj=py+phh-10*k,nstep=0;ctx.lineTo(W-M,bj);for(var x=W-M;x>=M;x-=22*k){nstep++;ctx.lineTo(x,bj-(Math.sin(nstep*1.7)*7+Math.sin(nstep*0.5)*6+6)*k)}ctx.lineTo(M,bj);ctx.closePath();ctx.clip();
      if(hero)cover(ctx,hero,M,py,CW,phh+12*k);else{ctx.fillStyle="#B9A0DC";ctx.fillRect(M,py,CW,phh)}ctx.restore();
      var rp=v2?[(d.tanggal||"").toUpperCase(),d.label]:String(d.label||"").split("|");rp=rp.map(function(t){return String(t||"").trim()}).filter(Boolean);
      if(rp.length){var rx=M+CW*0.2,rh=54*k;rp.slice(0,2).forEach(function(t,i){var s=fitF(t.toUpperCase(),CW*0.4,"500",SANS,28*k,13*k),w=ctx.measureText(t.toUpperCase()).width+44*k;ctx.fillStyle=i?"#6B1B8C":HD;ctx.fillRect(rx,py,w,rh);tx(t.toUpperCase(),rx+22*k,py+rh/2+s*0.35,"500 "+s+"px "+SANS,"#fff");rx+=w})}
      var yb=py+phh+22*k,g2=28*k,Lw=Math.round((CW-g2)*0.58),Rw=CW-g2-Lw,Lx=M,Rx=M+Lw+g2,fh=60*k,fy=H-16*k-fh,bodyBot=fy-48*k;
      function head(x,y,w,t,icon,h){h=h||hh;ctx.fillStyle=HD;ctx.fillRect(x,y,w,h);var s=fitF(t,w-(icon?h+16*k:24*k),"500",SANS,h*0.42,11*k);if(icon){ico(icon,x+10*k,y+h*0.17,h*0.66,"#fff");tx(t,x+h+6*k,y+h/2+s*0.35,"500 "+s+"px "+SANS,"#fff")}else tx(t,x+w/2,y+h/2+s*0.35,"500 "+s+"px "+SANS,"#fff","center")}
      function lbox(x,y,w,t,icon,items,mark,col,h){head(x,y,w,t,icon);ctx.fillStyle=GR;ctx.fillRect(x,y+hh,w,h-hh);if(items.length)lst(items,x+14*k,y+hh+9*k,y+h-6*k,mark,col,lhC,fsC,w-24*k);return y+h}
      function need(n,cap){return hh+16*k+Math.min(n,cap||99)*lhC}
      function stat(x,y,w,t,val){head(x,y,w,t,null,36*k);ctx.fillStyle=GR;ctx.fillRect(x,y+36*k,w,56*k);if("letterSpacing" in ctx)ctx.letterSpacing=(3*k)+"px";var s=fitF(val,w-20*k,"500",SANS,34*k,16*k);tx(val,x+w/2,y+36*k+28*k+s*0.36,"500 "+s+"px "+SANS,INK,"center");if("letterSpacing" in ctx)ctx.letterSpacing="0px"}
      function bar(x,y,w,t,h){ctx.fillStyle=HD;ctx.fillRect(x,y,w,h);ctx.font="500 "+17*k+"px "+SANS;var ln=h>=50*k?bungkus(ctx,t,w-24*k).slice(0,2):[t];if(ln.length>1){ln.forEach(function(q,i){tx(q,x+w/2,y+h/2+(i-0.5)*20*k+6*k,ctx.font,"#fff","center")});return}var s=fitF(t,w-24*k,"500",SANS,18*k,10*k);tx(t,x+w/2,y+h/2+s*0.35,"500 "+s+"px "+SANS,"#fff","center")}
      var priceT=qv?Number(qv).toLocaleString("id-ID"):"-",startT=[d.kota?"START "+d.kota.toUpperCase():"",d.maskapai?"PESAWAT "+d.maskapai.toUpperCase():""].filter(Boolean).join("  |  "),exT=extra.map(function(e){return e[0].toUpperCase()+" "+Number(e[1]).toLocaleString("id-ID")}).join("   •   "),
        dft=[];if(d.dp)dft.push("DP "+money(d.dp));if(d.daftar)dft.push("Daftar: "+d.daftar);
      var bl=d.bonusL.length?d.bonusL:(d.bonus?d.bonus.split(/\s*,\s*/):[]),syarat=d.syarat;
      // kolom kiri
      var ly=yb;
      function kiriBawah(){var exH=exc.length?need(exc.length,4):0,syH=(a4&&syarat.length)?need(syarat.length,4):0,avl=bodyBot-ly,incNeed=need(inc.length||1,12);if(syH&&avl-incNeed-(exH?exH+12*k:0)<syH+12*k)syH=0;var incH=Math.max(110*k,avl-(exH?exH+12*k:0)-(syH?syH+12*k:0));
        if(inc.length||!exc.length){ly=lbox(Lx,ly,Lw,"HARGA PAKET SUDAH TERMASUK","check",inc,"ok",HD,incH)+12*k}
        if(exH){ly=lbox(Lx,ly,Lw,"HARGA PAKET TIDAK TERMASUK","close",exc,"x","#C0453F",exH)+12*k}
        if(syH){ly=lbox(Lx,ly,Lw,"PERSYARATAN","check",syarat,"ok",HD,syH)+12*k}}
      // kolom kanan
      var ry=yb;
      function hotelFoto(q,x,y,w,h,tag){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();if(img[q.k])cover(ctx,img[q.k],x,y,w,h);else{ctx.fillStyle=grad(x,y,x+w,y+h,[T.pu2,PU]);ctx.fillRect(x,y,w,h);ico("hotel",x+w/2-h*0.2,y+h*0.25,h*0.4,"rgba(255,255,255,.35)")}ctx.restore();return}
      if(!v2){
        if(d.tagline){bar(Lx,ly,Lw,String(d.tagline).toUpperCase(),40*k);ly+=40*k+12*k}
        var zl=[["DESTINASI ZIARAH",d.ziarah],["BONUS GRATIS",bl]].filter(function(z){return z[1].length});
        if(zl.length){var bw2=(Lw-(zl.length-1)*14*k)/zl.length,n=Math.min(5,Math.max.apply(null,zl.map(function(z){return z[1].length}))),h2=need(n);zl.forEach(function(z,i){lbox(Lx+i*(bw2+14*k),ly,bw2,z[0],null,z[1],"ok",HD,h2)});ly+=h2+12*k}
        kiriBawah();
        var w1=Math.round(Rw*0.4),w2=Rw-w1-12*k;stat(Rx,ry,w1,"PROGRAM",d.hari?d.hari+" HARI":"-");stat(Rx+w1+12*k,ry,w2,"HARGA PAKET "+ql.toUpperCase(),priceT);ry+=92*k+10*k;
        if(exT){ctx.fillStyle=GR;ctx.fillRect(Rx,ry,Rw,38*k);var es=fitF(exT,Rw-20*k,"500",SANS,17*k,10*k);tx(exT,Rx+Rw/2,ry+19*k+es*0.35,"500 "+es+"px "+SANS,INK,"center");ry+=38*k+10*k}
        if(startT){bar(Rx,ry,Rw,startT,40*k);ry+=40*k+10*k}
        if(dft.length){ry=lbox(Rx,ry,Rw,"PENDAFTARAN","cal",dft,"ok",HD,need(dft.length))+10*k}
        head(Rx,ry,Rw,"INFO LEBIH LANJUT HUBUNGI","call");ctx.fillStyle=GR;ctx.fillRect(Rx,ry+hh,Rw,48*k);var ct=(d.nama?d.nama.toUpperCase()+"  •  ":"")+(d.wa||"0812-1371-1159"),cs=fitF(ct,Rw-20*k,"700",MON,22*k,11*k);tx(ct,Rx+Rw/2,ry+hh+24*k+cs*0.35,"700 "+cs+"px "+MON,INK,"center");ry+=hh+48*k+12*k;
        var rem=bodyBot-ry;if(hs.length&&rem>80*k){var hb=Math.min(190*k,(rem-(hs.length-1)*10*k)/hs.length);hs.forEach(function(q,i){var by=ry+i*(hb+10*k);hotelFoto(q,Rx,by,Rw,hb);var tag=q.k==="mk"?"MAK":q.k==="md"?"MAD":"HTL",tw=56*k,nm=(q.h.nama+(q.h.b?"  "+stars(q.h.b):"")).toUpperCase(),ns=fitF(nm,Rw*0.7,"500",SANS,18*k,10*k),nw=ctx.measureText(nm).width+36*k;ctx.fillStyle=HD;ctx.fillRect(Rx+Rw-tw-nw,by,nw,36*k);tx(nm,Rx+Rw-tw-nw+18*k,by+18*k+ns*0.35,"500 "+ns+"px "+SANS,"#fff");ctx.fillStyle="#6B1B8C";ctx.fillRect(Rx+Rw-tw,by,tw,36*k);tx(tag,Rx+Rw-tw/2,by+18*k+6*k,"500 "+17*k+"px "+SANS,"#fff","center");
          if(q.h.malam||q.h.jarak){var inf=[q.h.malam?q.h.malam+" malam":"",q.h.jarak?q.h.jarak:""].filter(Boolean).join(" • ");fitF(inf,Rw-24*k,"500",SANS,16*k,10*k);var iw=ctx.measureText(inf).width+24*k;ctx.fillStyle="rgba(255,255,255,.92)";ctx.fillRect(Rx,by+hb-30*k,iw,30*k);tx(inf,Rx+12*k,by+hb-9*k,ctx.font,INK)}})}
      }else{
        var w1b=Math.round(Lw*0.5),w2b=Lw-w1b-12*k;stat(Lx,ly,w1b,"PAKET "+ql.toUpperCase(),priceT);stat(Lx+w1b+12*k,ly,w2b,"PROGRAM",d.hari?d.hari+" HARI":"-");ly+=92*k+10*k;
        if(exT){ctx.fillStyle=GR;ctx.fillRect(Lx,ly,Lw,38*k);var es2=fitF(exT,Lw-20*k,"500",SANS,17*k,10*k);tx(exT,Lx+Lw/2,ly+19*k+es2*0.35,"500 "+es2+"px "+SANS,INK,"center");ly+=38*k+10*k}
        if(startT){bar(Lx,ly,Lw,startT,40*k);ly+=40*k+12*k}
        kiriBawah();
        if(d.tagline){bar(Rx,ry,Rw,String(d.tagline).toUpperCase(),56*k);ry+=56*k+10*k}
        if(dft.length){ry=lbox(Rx,ry,Rw,"PENDAFTARAN","cal",dft,"ok",HD,need(dft.length))+10*k}
        var hubH=hh+48*k,zH=d.ziarah.length?need(d.ziarah.length,5):0,bH=bl.length?need(bl.length,4):0;
        var avail=bodyBot-ry-hubH-12*k-(zH?zH+10*k:0)-(bH?bH+10*k:0);
        if(hs.length&&avail>90*k){var hb2=Math.min(210*k,avail),cwd=(Rw-(hs.length>1?10*k:0))/Math.min(2,hs.length);hs.slice(0,2).forEach(function(q,i){var bx=Rx+i*(cwd+10*k),tag=q.k==="mk"?"MAK":q.k==="md"?"MAD":"HTL";ctx.fillStyle=HD;ctx.fillRect(bx,ry,cwd,34*k);ctx.fillStyle="#6B1B8C";ctx.fillRect(bx,ry,52*k,34*k);tx(tag,bx+26*k,ry+17*k+6*k,"500 "+16*k+"px "+SANS,"#fff","center");var nm=q.h.nama.toUpperCase(),ns=fitF(nm,cwd-52*k-16*k,"500",SANS,17*k,10*k);tx(nm,bx+52*k+10*k,ry+17*k+ns*0.35,"500 "+ns+"px "+SANS,"#fff");hotelFoto(q,bx,ry+34*k,cwd,hb2-34*k)});ry+=hb2+10*k}
        if(zH){ry=lbox(Rx,ry,Rw,"DESTINASI WISATA ZIARAH","pin",d.ziarah,"ok",HD,zH)+10*k}
        if(bH){ry=lbox(Rx,ry,Rw,"BONUS GRATIS","check",bl,"ok",HD,bH)+10*k}
        ry=Math.max(ry,bodyBot-hubH);head(Rx,ry,Rw,"INFO LEBIH LANJUT HUBUNGI","call");ctx.fillStyle=GR;ctx.fillRect(Rx,ry+hh,Rw,48*k);var ct2=(d.nama?d.nama.toUpperCase()+"  •  ":"")+(d.wa||"0812-1371-1159"),cs2=fitF(ct2,Rw-20*k,"700",MON,22*k,11*k);tx(ct2,Rx+Rw/2,ry+hh+24*k+cs2*0.35,"700 "+cs2+"px "+MON,INK,"center");
      }
      var nt=d.catatan||"Program dan harga dapat berubah sewaktu-waktu sesuai kondisi.";fitF(nt,CW,"500",SANS,17*k,11*k);tx(ell(nt,CW),W/2,fy-(d.rekening?28:14)*k,ctx.font,"#6B5A78","center");
      if(d.rekening){var rk="Pembayaran hanya ke rekening resmi: "+d.rekening;fitF(rk,CW,"600",SANS,16*k,10*k);tx(ell(rk,CW),W/2,fy-9*k,ctx.font,PU,"center")}
      ctx.fillStyle=HD;ctx.fillRect(M,fy,CW,fh);social(fy,fh,true,16*k);
    }
    (T.lay==="B"?layB:T.lay==="C"?layC:layA)();
  });
}

// ---------- MULAI
if(S.token){ (S.peran==="jamaah"?api({aksi:"kartu"}).then(kartu):S.peran==="karyawan"?tim():beranda()).catch(function(){masuk()}) } else masuk();
})();
