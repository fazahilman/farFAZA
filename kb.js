(function(){var el=document.getElementById("kb");if(!el)return;
var BLN=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function hariIni(){var n=new Date(Date.now()+7*3600000);return Date.UTC(n.getUTCFullYear(),n.getUTCMonth(),n.getUTCDate())}
function ke(s){var m=String(s).match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?Date.UTC(+m[1],+m[2]-1,+m[3]):NaN}
function tgl(s){var m=String(s).match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?(+m[3])+" "+BLN[+m[2]-1]+" "+m[1]:s}
function mk(a){if(!a.logo)return '';return ' <img class="kb-mk" src="'+esc(a.logo)+'" alt="'+esc(a.maskapai||'Maskapai')+'" onerror="this.remove()"> '}
function kartu(peran,o){
  if(!o)return '<div class="kb-p kb-p0"><div class="kb-av"><span>?</span></div><div><small>'+peran+'</small><b>Segera diumumkan</b></div></div>';
  var ini=esc(String(o.nama||"?").replace(/^\s*(bu|ibu|pak|bapak|dr\.?|ustadz|ust\.?|h\.?)\s+/i,"").charAt(0).toUpperCase());
  var av=o.foto?'<div class="kb-av has" style="background-image:url('+esc(o.foto)+')" role="img" aria-label="'+esc(o.nama)+'"></div>':'<div class="kb-av"><span>'+ini+'</span></div>';
  return '<div class="kb-p">'+av+'<div><small>'+peran+'</small><b>'+esc(o.nama)+'</b>'+(o.domisili?'<em>'+esc(o.domisili)+'</em>':'')+'</div></div>'}
fetch("jadwal.json?v="+Math.floor(Date.now()/3600000)).then(function(r){return r.json()}).then(function(L){
  var h=hariIni(),a=null;
  L.map(function(x){x._t=ke(x.tanggal);return x}).filter(function(x){return x._t===x._t&&h>=x._t-14*864e5&&h<=x._t+(x.hari||10)*864e5}).sort(function(p,q){return p._t-q._t}).some(function(x){a=x;return true});
  if(!a)return;
  var d=Math.round((a._t-h)/864e5),st=d>0?"Keberangkatan terdekat":d===0?"Hari ini ada keberangkatan":"Jamaah kami sedang dalam perjalanan",
      ket=d>1?d+" hari lagi":d===1?"Besok":d===0?"Hari ini":"Hari ke-"+(1-d)+" perjalanan";
  el.querySelector("#kb-st").textContent=st;el.querySelector("#kb-kode").textContent=a.kode||"";
  el.querySelector("#kb-i").innerHTML='<b>'+esc(tgl(a.tanggal))+'</b>'+mk(a)+' · <span class="kb-ket">'+esc(ket)+'</span>';
  var mm=String(a.tanggal).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  el.querySelector("#kb-d").innerHTML='<span class="kb-dn">'+(+mm[3])+'</span><span class="kb-dm">'+BLN[+mm[2]-1]+' '+mm[1]+'<small>'+mk(a)+esc(ket)+'</small></span>';
  el.querySelector("#kb-g").innerHTML=kartu("Tour Leader",a.tl)+kartu("Mutawif",a.mutawif);
  el.hidden=false}).catch(function(){})})();
