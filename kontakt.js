// ⬇️ Dit telefonnummer, delt op i stykker, så spam-robotter ikke kan læse det i koden.
// Skriv fx ["12", "34", "56", "78"] for 12 34 56 78. Står den tom, vises telefon-linjen ikke.
const TELEFON = ["31", "65", "87", "39"];

if (TELEFON.length) {
  const link = document.getElementById('phoneLink');
  link.textContent = TELEFON.join(' ');
  link.href = 'tel:+45' + TELEFON.join('');
  document.getElementById('contactPhone').hidden = false;
}

//⬇️ Indsæt URL'en til din Google Apps Script-webapp her (slutter på /exec – se google-apps-script.js).
// Scriptet sender spørgsmålet direkte til din Gmail.
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxv166m7fpOcIWVIO-CQ21eJVLBvPMQZhIsBulaWSPAxnaMr1BdQVpyyl1h7Hngy99Lng/exec";

document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const btn = this.querySelector('button');

  if (!APPS_SCRIPT_URL) {
    btn.textContent = 'Formularen er ikke koblet til endnu';
    btn.style.background = '#8b2c2c';
    btn.style.color = 'white';
    return;
  }

  btn.textContent = 'Sender...';
  btn.disabled = true;

  const data = {
    name:      this.name.value.trim(),
    email:     this.email.value.trim(),
    phone:     this.phone.value.trim(),
    treatment: this.treatment.value,
    message:   this.message.value.trim(),
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

    btn.textContent = '✦ Tak – jeg vender tilbage ✦';
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
