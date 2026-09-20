(() => {
  const reel = document.querySelector('#hollywood-reel');
  if (!reel) return;
  const video = reel.querySelector('video');
  const toggle = reel.querySelector('[data-reel-toggle]');
  const scene = reel.querySelector('[data-reel-scene]');
  const clips = [
    { name: 'Ocean', file: 'ocean' },
    { name: 'River', file: 'river-loop' },
    { name: 'Cabin', file: 'cabin-snow-loop' }
  ];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let visible = false;
  let pausedByUser = reducedMotion.matches;
  let failures = 0;
  video.muted = true;
  video.defaultMuted = true;
  const label = () => {
    toggle.textContent = pausedByUser ? 'Play' : 'Pause';
    toggle.setAttribute('aria-label', `${pausedByUser ? 'Play' : 'Pause'} Hollywood video loop`);
  };
  const load = () => {
    const clip = clips[index];
    video.poster = `/assets/hollywood/${clip.file}.jpg`;
    video.src = `/assets/hollywood/${clip.file}.mp4`;
    scene.textContent = clip.name;
  };
  const sync = () => {
    label();
    if (visible && !document.hidden && !pausedByUser) {
      if (!video.getAttribute('src')) load();
      video.muted = true;
      video.play().catch(() => {
        if (visible && !document.hidden && !pausedByUser && video.paused) {
          pausedByUser = true;
          label();
        }
      });
    } else video.pause();
  };
  video.addEventListener('ended', () => {
    index = (index + 1) % clips.length;
    load();
    sync();
  });
  video.addEventListener('playing', () => { failures = 0; });
  video.addEventListener('error', () => {
    failures += 1;
    if (failures >= clips.length) {
      pausedByUser = true;
      scene.textContent = 'Preview unavailable';
      label();
      return;
    }
    index = (index + 1) % clips.length;
    load();
    sync();
  });
  toggle.addEventListener('click', () => {
    pausedByUser = !pausedByUser;
    if (!pausedByUser && video.error) { failures = 0; load(); }
    sync();
  });
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    sync();
  }, { threshold: 0.15 }).observe(reel);
  document.addEventListener('visibilitychange', sync);
  reducedMotion.addEventListener('change', () => {
    pausedByUser = reducedMotion.matches;
    sync();
  });
  label();
})();
