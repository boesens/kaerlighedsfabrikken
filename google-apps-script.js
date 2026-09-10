// =====================================================
// INDSÆT DENNE KODE I GOOGLE APPS SCRIPT
// Sådan gør du:
// 1. Åbn dit Google Sheet
// 2. Klik på "Udvidelser" → "Apps Script"
// 3. Slet al eksisterende kode og indsæt dette
// 4. Klik på "Deploy" → "New deployment"
// 5. Vælg type: "Web app"
// 6. Sæt "Execute as" til: Me
// 7. Sæt "Who has access" til: Anyone
// 8. Klik "Deploy" og kopier URL'en du får
// 9. Indsæt URL'en i script.js (se kommentar der)
// =====================================================

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Sæt kolonneoverskrifter hvis arket er tomt
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Tidspunkt", "Navn", "E-mail", "Telefon"]);
    sheet.getRange(1, 1, 1, 4).setFontWeight("bold");
  }

  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date().toLocaleString("da-DK"),
    data.name  || "",
    data.email || "",
    data.phone || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
