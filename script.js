(function(){
  // legacy anchor links from the old single-page holding.html (#about, #history, #brands, #contact, #directions)
  // point them at the new pages so old bookmarks/shares keep working
  var legacyAnchors = {
    '#about': 'about.html',
    '#history': 'about.html#history',
    '#directions': 'about.html#directions',
    '#brands': 'about.html#brands',
    '#contact': 'contacts.html'
  };
  if (document.body.getAttribute('data-page') === 'home' && legacyAnchors[location.hash]) {
    location.replace(legacyAnchors[location.hash]);
  }

  var els = document.querySelectorAll('.reveal');
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:0.12});
  els.forEach(function(el){ io.observe(el); });

  var historyScene = document.querySelector('.history-scroll');
  var historyTrack = document.querySelector('.history-scroll .timeline');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mobileHistory = window.matchMedia('(max-width: 560px)');
  var historyTicking = false;

  function updateHistoryTrack(){
    historyTicking = false;
    if(!historyScene || !historyTrack){ return; }
    if(reduceMotion.matches || mobileHistory.matches){
      historyTrack.style.transform = 'none';
      return;
    }
    var rect = historyScene.getBoundingClientRect();
    var sceneScroll = Math.max(1, historyScene.offsetHeight - window.innerHeight);
    var progress = Math.min(1, Math.max(0, -rect.top / sceneScroll));
    var sidePadding = window.innerWidth < 820 ? 40 : 64;
    var maxMove = Math.max(0, historyTrack.scrollWidth - window.innerWidth + sidePadding);
    historyTrack.style.transform = 'translate3d(' + (-progress * maxMove) + 'px,0,0)';
  }

  function requestHistoryUpdate(){
    if(!historyTicking){
      historyTicking = true;
      requestAnimationFrame(updateHistoryTrack);
    }
  }

  if (historyScene && historyTrack) {
    window.addEventListener('scroll', requestHistoryUpdate, {passive:true});
    window.addEventListener('resize', updateHistoryTrack);
    reduceMotion.addEventListener('change', updateHistoryTrack);
    mobileHistory.addEventListener('change', updateHistoryTrack);
    updateHistoryTrack();
  }

  document.querySelectorAll('.product-rail').forEach(function(rail){
    var track = rail.querySelector('.product-track');
    var wrap = rail.closest('section');
    if (!track || !wrap) { return; }
    var prev = wrap.querySelector('.product-prev');
    var next = wrap.querySelector('.product-next');

    function scrollProducts(direction){
      var firstSlide = track.querySelector('.product-slide');
      var gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 20;
      var amount = firstSlide ? firstSlide.offsetWidth + gap : track.clientWidth * 0.8;
      track.scrollBy({left: direction * amount, behavior: 'smooth'});
    }

    prev && prev.addEventListener('click', function(){ scrollProducts(-1); });
    next && next.addEventListener('click', function(){ scrollProducts(1); });
  });
})();
