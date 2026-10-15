// Menupunkter med klassen "local-only" (Noter) vises kun lokalt:
// på localhost eller når siden åbnes direkte som fil
if (['localhost', '127.0.0.1', '[::1]', ''].includes(location.hostname)) {
  document.documentElement.classList.add('is-local');

  // Online viser GitHub Pages siderne uden .html (fx /om). Lokalt findes kun
  // filerne, så her sættes .html på igen, og forsiden peger på index.html.
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href]').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === '/') link.setAttribute('href', 'index.html');
      else if (/^[a-z]+(#.*)?$/.test(href)) link.setAttribute('href', href.replace(/^([a-z]+)/, '$1.html'));
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', function () {
    const open = mobileMenu.classList.toggle('open');
    hamburger.textContent = open ? '✕' : '☰';
  });

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      hamburger.textContent = '☰';
    });
  });
});
