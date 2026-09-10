//⬇️ Indsæt din Google Apps Script URL her (efter du har deployed)
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzgXAYbDKbIT7gQLuhq3Tg1HdPO330n3tjfnHQ7zA5MS0LYee60NrjaP73g2N5Gdq_X/exec";

document.getElementById('signupForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const btn = this.querySelector('button');
  btn.textContent = 'Sender...';
  btn.disabled = true;

  const data = {
    name:  this.name.value.trim(),
    email: this.email.value.trim(),
    phone: this.phone.value.trim(),
  };

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    btn.textContent = '✦ Du er tilmeldt – velkommen! ✦';
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
