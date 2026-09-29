// Rail illustrations need the distance from the first step box to the last.
(function(){
  var rails = document.querySelectorAll('.rail');
  if (!rails.length) return;
  function measure(){
    rails.forEach(function(r){
      var n = r.querySelectorAll('.step__num'); if (n.length < 2) return;
      r.style.setProperty('--rail-h', (n[n.length-1].getBoundingClientRect().top - n[0].getBoundingClientRect().top) + 'px');
    });
  }
  measure();
  if (document.fonts) document.fonts.ready.then(measure);
  if ('ResizeObserver' in window) { var q; var ro = new ResizeObserver(function(){ cancelAnimationFrame(q); q = requestAnimationFrame(measure); }); rails.forEach(function(r){ ro.observe(r); }); }
})();

// Micro-interactions. Vanilla JS, IntersectionObserver only, no dependencies.
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cards = document.querySelectorAll('.card');
  var nums = document.querySelectorAll('[data-value]');
  var once = document.querySelectorAll('.ba, .chart, .pager, .flight');
  var serps = document.querySelectorAll('.serp');

  if (reduce || !('IntersectionObserver' in window)) {
    [cards, once, serps].forEach(function(list){ list.forEach(function(el){ el.classList.add('is-in'); }); });
    return;
  }

  cards.forEach(function(el){
    var i = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.style.setProperty('--d', (i % 3) * 90 + 'ms');
  });

  function fmt(n, dec, comma){
    return comma ? n.toLocaleString('en-US', {minimumFractionDigits:dec, maximumFractionDigits:dec}) : n.toFixed(dec);
  }
  // 1. Count-up with the width locked to the final value (no layout shift).
  function count(el, width){
    var target = parseFloat(el.dataset.value), dec = +el.dataset.decimals || 0, comma = el.dataset.comma === '1';
    if (isNaN(target)) return;
    el.style.display = 'inline-block';
    el.style.minWidth = width + 'px';
    var t0 = 0;
    requestAnimationFrame(function step(t){
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / 1200, 1);
      el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)), dec, comma);
      if (p < 1) requestAnimationFrame(step);
    });
    el.textContent = fmt(0, dec, comma);
  }
  // Rank counters run from data-from to data-to.
  function tween(el, dur, dec, delay){
    var from = +el.dataset.from, to = +el.dataset.to, t0 = 0;
    setTimeout(function(){
      requestAnimationFrame(function step(t){
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = (from + (to - from) * e).toFixed(dec);
        if (p < 1) requestAnimationFrame(step);
      });
    }, delay || 0);
  }

  // Search-result illustrations: type the query (blinking caret), then play.
  serps.forEach(function(s){
    var q = s.querySelector('.serp__q'), rk = s.querySelector('.serp__rk--client');
    if (q) { s._q = q.textContent; q.textContent = ''; }
    if (rk) rk.textContent = rk.dataset.from;
    s._pushed = s.querySelectorAll('.sc-row .serp__rk');
    s._pushed.forEach(function(p){ p.dataset.end = p.textContent; p.textContent = p.dataset.start; });
  });
  function play(s){
    var q = s.querySelector('.serp__q'), i = 0, text = s._q || '';
    function go(){
      s.classList.add('is-in');
      var rk = s.querySelector('.serp__rk--client');
      if (rk) tween(rk, 1500, 0, 300);
      if (s._pushed.length) setTimeout(function(){ s._pushed.forEach(function(p){ p.textContent = p.dataset.end; }); }, 1300);
    }
    if (!q || !text) return go();
    (function tick(){
      q.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(tick, 40 + Math.random() * 45); else setTimeout(go, 350);
    })();
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (!e.isIntersecting) return;
      var el = e.target;
      if (el.hasAttribute('data-value')) count(el, e.boundingClientRect.width);
      else if (el.classList.contains('serp')) play(el);
      else {
        el.classList.add('is-in');
        if (el.classList.contains('pager')) { var pn = el.querySelector('.pager__num'); pn.textContent = pn.dataset.from; tween(pn, 1800, 1, 200); }
      }
      io.unobserve(el);
    });
  }, {threshold: 0.2, rootMargin: '0px 0px -8% 0px'});

  [cards, nums, once, serps].forEach(function(list){ list.forEach(function(el){ io.observe(el); }); });

  // Header illustrations loop only while on screen.
  var loops = document.querySelectorAll('.horizon');
  if (loops.length) {
    var lio = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ e.target.classList.toggle('is-playing', e.isIntersecting); });
    });
    loops.forEach(function(el){ lio.observe(el); });
  }
})();

// Email links: many PCs have no default mail app, so mailto: does nothing.
// Copy the address and confirm on screen, then still try to open the mail app.
(function(){
  var toast;
  function show(msg){
    if(!toast){ toast=document.createElement('div'); toast.className='toast'; toast.setAttribute('role','status'); document.body.appendChild(toast); }
    toast.textContent=msg; toast.classList.add('is-on');
    clearTimeout(toast._t); toast._t=setTimeout(function(){ toast.classList.remove('is-on'); }, 3200);
  }
  document.addEventListener('click', function(e){
    var a=e.target.closest && e.target.closest('a[href^="mailto:"]'); if(!a) return;
    var email=a.getAttribute('href').replace('mailto:','').split('?')[0];
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(email).then(function(){ show('Email copied: '+email); }, function(){ show(email); });
    } else { show(email); }
  });
})();
