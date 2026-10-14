// =====================================================
// INDSÆT DENNE KODE I GOOGLE APPS SCRIPT
// Den sender spørgsmål fra hjemmesiden direkte til din Gmail.
//
// Sådan gør du:
// 1. Gå til script.google.com og klik "Nyt projekt"
// 2. Slet al eksisterende kode og indsæt dette
// 3. Klik på "Implementer" → "Ny implementering"
// 4. Klik på tandhjulet og vælg type: "Webapp"
// 5. Sæt "Udfør som" til: Mig
// 6. Sæt "Hvem har adgang" til: Alle
// 7. Klik "Implementer", giv tilladelse (Google advarer om en "ikke-bekræftet app" –
//    det er dit eget script: klik "Avanceret" → "Gå til projektet")
// 8. Kopier URL'en til webappen (slutter på /exec) og indsæt den i kontakt.js
// =====================================================

function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  // Spam-fælde: det skjulte felt udfyldes kun af robotter
  if (data._honey) return svar({ result: "success" });

  var linjer = [
    "Navn: " + (data.name || ""),
    "E-mail: " + (data.email || ""),
    "Telefon: " + (data.phone || "–"),
    "Handler om: " + (data.treatment || "–"),
    "",
    data.message || ""
  ];

  MailApp.sendEmail({
    to: Session.getEffectiveUser().getEmail(),
    replyTo: data.email || undefined,
    subject: "Nyt spørgsmål fra Kærlighedsfabrikken – " + (data.name || "uden navn"),
    body: linjer.join("\n")
  });

  return svar({ result: "success" });
}

function svar(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
