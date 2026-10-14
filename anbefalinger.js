// Sender anbefalingen til din Gmail via samme Google Apps Script som kontaktformularen.
// Den kommer ikke automatisk på siden: du sætter den selv ind i anbefalinger.html.
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxv166m7fpOcIWVIO-CQ21eJVLBvPMQZhIsBulaWSPAxnaMr1BdQVpyyl1h7Hngy99Lng/exec";

document.getElementById('reviewForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const btn = this.querySelector('button');
  btn.textContent = 'Sender...';
  btn.disabled = true;

  const data = {
    name:      this.name.value.trim(),
    email:     this.email.value.trim(),
    treatment: 'ANBEFALING – ' + this.treatment.value,
    message:   'ANBEFALING TIL HJEMMESIDEN\n'
             + 'Må vises som: ' + this.name.value.trim() + '\n'
             + 'Samtykke til visning: Ja\n\n'
             + this.message.value.trim(),
    _honey:    this._honey.value,
  };

  try {
    // text/plain undgår browserens forhåndstjek, som Apps Script ikke svarer på
    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.result !== 'success') throw new Error('Ikke sendt');

    btn.textContent = '✦ Tusind tak for din anbefaling ✦';
    btn.style.background = '#1a7a6e';
    btn.style.color = 'white';
    this.reset();
  } catch {
    btn.textContent = 'Noget gik galt – prøv igen';
    btn.style.background = '#8b2c2c';
    btn.style.color = 'white';
    btn.disabled = false;
  }
});
