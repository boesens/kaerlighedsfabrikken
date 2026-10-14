// Faste noter står i noter.html. Noter skrevet på siden, hvilke noter der er
// markeret som udført, og rækkefølgen gemmes i browserens localStorage – kun
// på denne enhed og i denne browser.
document.addEventListener('DOMContentLoaded', function () {
  const KEY = 'behandler-noter';
  const DONE_KEY = 'behandler-noter-udfoert';
  const ORDER_KEY = 'behandler-noter-raekkefoelge';
  const form = document.getElementById('noteForm');
  const input = document.getElementById('noteText');
  const list = document.getElementById('noteList');

  function load(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  }

  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      alert('Ændringen kunne ikke gemmes i denne browser');
    }
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function textButton(className, label, onClick) {
    const btn = document.createElement('button');
    btn.className = className;
    btn.type = 'button';
    btn.textContent = label;
    btn.addEventListener('click', onClick);
    return btn;
  }

  // Tilføjer "Markér som udført"-knap (og evt. "Slet") til en note
  function addActions(el, id, onDelete) {
    const done = load(DONE_KEY).includes(id);
    el.classList.toggle('done', done);

    const actions = document.createElement('div');
    actions.className = 'note-actions';
    actions.append(textButton('note-done', done ? 'Fortryd udført' : 'Markér som udført', function () {
      const ids = load(DONE_KEY).filter(function (d) { return d !== id; });
      if (!done) ids.push(id);
      save(DONE_KEY, ids);
      render();
    }));
    if (onDelete) actions.append(textButton('note-delete', 'Slet', onDelete));
    el.append(actions);
  }

  // Håndtag til at trække noten op eller ned (virker med både mus og finger)
  function addHandle(el) {
    const handle = document.createElement('button');
    handle.className = 'note-handle';
    handle.type = 'button';
    handle.textContent = '⠿';
    handle.title = 'Træk for at flytte noten';
    handle.setAttribute('aria-label', 'Træk for at flytte noten');

    // Lytter på hele dokumentet: noten flyttes i DOM'en undervejs, og det
    // ville afbryde et træk, der kun var bundet til selve håndtaget
    handle.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      el.classList.add('dragging');
      document.body.classList.add('note-dragging');

      function onMove(ev) {
        const others = Array.from(list.querySelectorAll('.note:not(.dragging)'));
        // Sæt noten ind før den første note, hvis midte ligger under markøren
        const next = others.find(function (other) {
          const box = other.getBoundingClientRect();
          return ev.clientY < box.top + box.height / 2;
        }) || null;
        if (el.nextElementSibling !== next) list.insertBefore(el, next);
      }

      function onUp() {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        document.removeEventListener('pointercancel', onUp);
        el.classList.remove('dragging');
        document.body.classList.remove('note-dragging');
        saveOrder();
      }

      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
      document.addEventListener('pointercancel', onUp);
    });

    el.prepend(handle);
  }

  function saveOrder() {
    save(ORDER_KEY, Array.from(list.querySelectorAll('.note')).map(function (el) { return el.dataset.id; }));
  }

  function render() {
    list.querySelectorAll('.note.local, .note-actions, .note-handle').forEach(function (el) { el.remove(); });

    // Faste noter fra noter.html
    list.querySelectorAll('.note[data-id]').forEach(function (el) {
      addActions(el, el.dataset.id);
    });

    // Nyeste først, oven over de faste noter
    load(KEY).forEach(function (note) {
      const el = document.createElement('article');
      el.className = 'note local';
      el.dataset.id = note.date;

      const date = document.createElement('p');
      date.className = 'note-date';
      date.textContent = formatDate(note.date);

      const text = document.createElement('p');
      text.className = 'note-text';
      text.textContent = note.text;

      el.append(date, text);
      addActions(el, note.date, function () {
        if (!confirm('Slet denne note?')) return;
        save(KEY, load(KEY).filter(function (n) { return n.date !== note.date; }));
        save(DONE_KEY, load(DONE_KEY).filter(function (d) { return d !== note.date; }));
        render();
        saveOrder();
      });
      list.prepend(el);
    });

    // Brug den gemte rækkefølge; noter uden plads i den (nye) bliver øverst
    const order = load(ORDER_KEY);
    const els = Array.from(list.querySelectorAll('.note'));
    const known = els.filter(function (el) { return order.includes(el.dataset.id); });
    known.sort(function (a, b) { return order.indexOf(a.dataset.id) - order.indexOf(b.dataset.id); });
    known.forEach(function (el) { list.append(el); });

    list.querySelectorAll('.note').forEach(addHandle);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    const notes = load(KEY);
    notes.push({ date: new Date().toISOString(), text: text });
    save(KEY, notes);
    input.value = '';
    render();
  });

  render();
});
