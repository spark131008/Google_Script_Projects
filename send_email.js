// if you want to store your email server-side (hidden), uncomment the next line
var TO_ADDRESS = "info.skypick@gmail.com";

function record_data() {
  try {
    // select the 'responses' sheet by default
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = "2022";
    var sheet = doc.getSheetByName(sheetName);
    var date = new Date();
    var today_date =
      date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getFullYear();
    var today_minus_fifteen_days = new Date(
      date.getTime() - 20 * 24 * 60 * 60 * 1000
    ); // notify me 20 days prior
    var today_minus_fifteen_days_formatted =
      today_minus_fifteen_days.getMonth() +
      1 +
      "-" +
      today_minus_fifteen_days.getDate() +
      "-" +
      today_minus_fifteen_days.getFullYear();
    // Logger.log(today_minus_fifteen_days_formatted)

    var header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    // Logger.log(header)
    var exp_date_index = header.indexOf("Service Exp. Date");
    var six_month_check_point_index = header.indexOf("6-month check point");
    // Logger.log(exp_date_index)
    // Logger.log(six_month_check_point_index)
    var rows = sheet
      .getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn())
      .getValues();
    // Logger.log(rows)

    var email_to_be_sent_list = [];
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var exp_date = "";
      var check_point_date = "";
      if (String(row[exp_date_index]).includes("n/a")) {
      } else {
        exp_date =
          row[exp_date_index].getMonth() +
          1 +
          "-" +
          row[exp_date_index].getDate() +
          "-" +
          row[exp_date_index].getFullYear();

        // Reformatting the Service Exp. Date into MM-DD-YYYY to make it more readable
        row[exp_date_index] = exp_date;
      }
      if (String(row[six_month_check_point_index]).includes("n/a")) {
      } else {
        check_point_date =
          row[six_month_check_point_index].getMonth() +
          1 +
          "-" +
          row[six_month_check_point_index].getDate() +
          "-" +
          row[six_month_check_point_index].getFullYear();

        // Reformatting the 6-month Check Point into MM-DD-YYYY to make it more readable
        row[six_month_check_point_index] = check_point_date;
      }
      // Logger.log(exp_date)
      // Logger.log(check_point_date)
      if (
        exp_date === today_minus_fifteen_days_formatted ||
        check_point_date === today_minus_fifteen_days_formatted
      ) {
        // Reformatting the Service Start Date into MM-DD-YYYY to make it more readable
        row[header.indexOf("Service Start Date")] =
          row[header.indexOf("Service Start Date")].getMonth() +
          1 +
          "-" +
          row[header.indexOf("Service Start Date")].getDate() +
          "-" +
          row[header.indexOf("Service Start Date")].getFullYear();

        // Adding records to the list - only records that the conditions are met
        email_to_be_sent_list.push([header, row]);
      }
    }
    Logger.log(email_to_be_sent_list);
    return email_to_be_sent_list;
  } catch (error) {
    Logger.log(error);
  }
}

function doPost() {
  try {
    var records = record_data();

    if (records) {
      var numb_of_emails = records.length;
      Logger.log(String(numb_of_emails) + " email(s) to send!");
      for (var i = 0; i < numb_of_emails; i++) {
        var res = records[i];
        var mail_fields = res[0];
        var mail_body = res[1];
        var zipped_content = mail_fields.map((value, index) => [
          value,
          mail_body[index],
        ]);
        var formatted_content = formatMailBody(zipped_content);
        Logger.log(zipped_content);

        // send email if to address is set
        if (TO_ADDRESS) {
          MailApp.sendEmail({
            to: String(TO_ADDRESS),
            subject: "TV Registration Renewal Alert",
            // replyTo: String(mailData.email), // This is optional and reliant on your form actually collecting a field named `email`
            htmlBody: formatted_content,
          });
        }
      }
    } else {
      Logger.log("No emails to send");
    }
    return ContentService.createTextOutput( // return json success results
      JSON.stringify({ result: "success", data: "Sent Successfully" })
    )
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // if error return this
    Logger.log(error);
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", error: error })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function formatMailBody(zipped_arry) {
  var result = "";

  // loop over all keys in the ordered form data
  for (var i = 0; i < zipped_arry.length; i++) {
    var [key, value] = zipped_arry[i];
    result +=
      "<h4 style='text-transform: capitalize; margin-bottom: 0'>" +
      key +
      "</h4><div>" +
      sanitizeInput(value) +
      "</div>";
    // for every key, concatenate an `<h4 />`/`<div />` pairing of the key name and its value,
    // and append it to the `result` string created at the start.
  }
  // Logger.log(result)
  return result; // once the looping is done, `result` will be one long string to put in the email body
}

function sanitizeInput(rawInput) {
  var placeholder = HtmlService.createHtmlOutput(" ");
  placeholder.appendUntrusted(rawInput);

  return placeholder.getContent();
}
