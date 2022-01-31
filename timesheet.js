var emailAddress = "spark131008@gmail.com"

function onEdit(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  //checks that we're on the correct sheet.
  if( sheet.getSheetName() == 'Timesheet Program' || 'Cash Payment Tracker') { 
    var selectedCell = ss.getActiveCell();
    //checks the column to ensure it is on the one we want to cause the date to appear.
    if( selectedCell.getColumn() == 2) { 
      var dateTimeCell1 = selectedCell.offset(0,1);
      dateTimeCell1.setValue(new Date());
      var dateTimeCell2 = selectedCell.offset(0,-1);
      dateTimeCell2.setValue(new Date());
      }
  }
}

function sendEmail(e) {
      if (emailAddress) {
      MailApp.sendEmail({
        to: String(emailAddress),
        subject: "Contact form submitted",
        // replyTo: String(mailData.email), // This is optional and reliant on your form actually collecting a field named `email`
        htmlBody: "formatMailBody(mailData, dataOrder)"
      });
    }
}