// Desktop drop-downs, the slide-out drawer with expandable lists, the text bubble, and the request form.
(() => {
  document.querySelectorAll('.dd-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const li = btn.closest('.dd');
      const open = !li.classList.contains('open');
      document.querySelectorAll('.dd.open').forEach((o) => { o.classList.remove('open'); o.querySelector('.dd-btn').setAttribute('aria-expanded', 'false'); });
      li.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.dd')) document.querySelectorAll('.dd.open').forEach((o) => { o.classList.remove('open'); o.querySelector('.dd-btn').setAttribute('aria-expanded', 'false'); }); });

  const drawer = document.getElementById('drawer');
  const scrim = document.querySelector('.scrim');
  const menuBtn = document.querySelector('.menu-btn');
  const setDrawer = (open) => {
    drawer.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('locked', open);
    if (open) { scrim.hidden = false; requestAnimationFrame(() => scrim.classList.add('show')); drawer.querySelector('.drawer-close').focus(); }
    else { scrim.classList.remove('show'); setTimeout(() => { if (!drawer.classList.contains('open')) scrim.hidden = true; }, 250); menuBtn.focus(); }
  };
  menuBtn.addEventListener('click', () => setDrawer(true));
  drawer.querySelector('.drawer-close').addEventListener('click', () => setDrawer(false));
  scrim.addEventListener('click', () => setDrawer(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && drawer.classList.contains('open')) setDrawer(false); });
  drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => { if (a.getAttribute('href').includes('#')) setDrawer(false); }));
  drawer.querySelectorAll('.dsub-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const list = document.getElementById(btn.getAttribute('aria-controls'));
      const open = list.hidden;
      list.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  const bubble = document.getElementById('bubble');
  try { if (sessionStorage.getItem('bubble') === 'closed') bubble.hidden = true; } catch (e) {}
  document.getElementById('bubble-close').addEventListener('click', () => {
    bubble.hidden = true;
    try { sessionStorage.setItem('bubble', 'closed'); } catch (e) {}
  });

  document.querySelectorAll('form[data-form]').forEach((form) => {
    const done = form.nextElementSibling;
    const status = form.querySelector('.form-status');
    const button = form.querySelector('button[type="submit"]');
    const label = button.textContent;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (form.hasAttribute('data-preview')) {
        done.querySelector('strong').textContent = 'This is a preview.';
        done.querySelector('p').textContent = 'Once the site is live, requests like this come straight to you.';
        form.hidden = true;
        done.hidden = false;
        return;
      }
      button.disabled = true;
      button.textContent = 'Sending…';
      status.textContent = '';
      try {
        const response = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() });
        if (!response.ok) throw new Error('Status ' + response.status);
        form.hidden = true;
        done.hidden = false;
      } catch (error) {
        status.textContent = "Your request didn't send. Check your connection, or give us a call.";
        button.disabled = false;
        button.textContent = label;
      }
    });
  });
})();
