(function(){document.querySelectorAll('.ddn').forEach(function(d){var b=d.querySelector('.ddb');
function set(o){d.classList.toggle('open',o);b.setAttribute('aria-expanded',o)}
b.addEventListener('click',function(e){e.stopPropagation();document.querySelectorAll('.ddn.open').forEach(function(x){if(x!==d){x.classList.remove('open');x.querySelector('.ddb').setAttribute('aria-expanded',false)}});set(!d.classList.contains('open'))});
document.addEventListener('click',function(e){if(!d.contains(e.target))set(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false)})})})();
