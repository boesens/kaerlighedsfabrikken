// Menupunkter med klassen "local-only" (Noter) vises kun lokalt:
// på localhost eller når siden åbnes direkte som fil
if (['localhost', '127.0.0.1', '[::1]', ''].includes(location.hostname)) {
  document.documentElement.classList.add('is-local');
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
