// Count-up for stats and bar growth for before/after charts, once, when scrolled into view.
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fmt = function(n, dec, comma){ var s = n.toFixed(dec); return comma ? Number(s).toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec}) : s; };
  function count(el){
    var target = parseFloat(el.dataset.value), dec = parseInt(el.dataset.decimals||'0',10), comma = el.dataset.comma === '1';
    if (reduce || isNaN(target)) return;
    var t0 = null;
    function f(t){ if(t0===null) t0=t; var p=Math.min((t-t0)/1200,1); el.textContent = fmt(target*(1-Math.pow(1-p,3)), dec, comma); if(p<1) requestAnimationFrame(f); }
    el.textContent = fmt(0, dec, comma); requestAnimationFrame(f);
  }
  var targets = document.querySelectorAll('[data-value], .ba');
  if (!('IntersectionObserver' in window)) { targets.forEach(function(el){ el.classList.add('is-in'); }); return; }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (!e.isIntersecting) return;
      var el = e.target;
      if (el.classList.contains('ba')) el.classList.add('is-in'); else count(el);
      io.unobserve(el);
    });
  }, {threshold:.4});
  targets.forEach(function(el){ io.observe(el); });
})();
