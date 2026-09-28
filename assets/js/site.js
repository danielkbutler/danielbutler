// Micro-interactions. Vanilla JS, one IntersectionObserver, no dependencies.
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cards = document.querySelectorAll('.card');
  var nums = document.querySelectorAll('[data-value]');
  var bars = document.querySelectorAll('.ba');

  // No IO support or reduced motion: show everything in its final state.
  if (reduce || !('IntersectionObserver' in window)) {
    cards.forEach(function(el){ el.classList.add('is-in'); });
    bars.forEach(function(el){ el.classList.add('is-in'); });
    return;
  }

  // 4. Stagger: delay each card by its position within its own grid (max 3 steps).
  cards.forEach(function(el){
    var i = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.style.setProperty('--d', (i % 3) * 90 + 'ms');
  });

  // 1. Count-up. Width is locked to the final value first, so the text
  // changing never moves surrounding content (no layout shift).
  function fmt(n, dec, comma){
    return comma ? n.toLocaleString('en-US', {minimumFractionDigits:dec, maximumFractionDigits:dec}) : n.toFixed(dec);
  }
  function count(el, width){
    var target = parseFloat(el.dataset.value), dec = +el.dataset.decimals || 0, comma = el.dataset.comma === '1';
    if (isNaN(target)) return;
    el.style.display = 'inline-block';
    el.style.minWidth = width + 'px';
    var t0 = 0;
    function step(t){
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / 1200, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * e, dec, comma);
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = fmt(0, dec, comma);
    requestAnimationFrame(step);
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (!e.isIntersecting) return;
      var el = e.target;
      if (el.hasAttribute('data-value')) count(el, e.boundingClientRect.width); // rect comes free with the entry: no forced layout
      else el.classList.add('is-in');
      io.unobserve(el);
    });
  }, {threshold: 0.2, rootMargin: '0px 0px -8% 0px'});

  cards.forEach(function(el){ io.observe(el); });
  nums.forEach(function(el){ io.observe(el); });
  bars.forEach(function(el){ io.observe(el); });
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
