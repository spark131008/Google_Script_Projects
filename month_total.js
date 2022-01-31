function monthlyTotal() {
    //First, get to the active spreadsheet
    const activeSpreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  
    //Second, get to the active sheet.
    const activeSheet = activeSpreadSheet.getActiveSheet();
  
    if(activeSheet.getName() === 'Cash Payment Tracker'){
      const dateAndAmountColumns = activeSheet.getRange('A3:B').getValues().filter(v => !v.includes(''));
      for(let i = 1; i <= 12; i++){
        let sum = 0;
        let monthSetter = i > 0 && i < 10 ? `0${i}` : `${i}`;
  
        for(let j = 0; j < dateAndAmountColumns.length; j++){
          let getMnth = dateAndAmountColumns[j][0];
          let newDate = Utilities.formatDate(getMnth, Session.getScriptTimeZone(), 'MM-YYYY');
            if(newDate.substring(0, 2) == monthSetter){
              sum += parseInt(dateAndAmountColumns[j][1]);
            }
        }
  
        let cell = activeSheet.getRange(`${String.fromCharCode('F'.charCodeAt()+i)}4:${String.fromCharCode('F'.charCodeAt()+i)}4`);
        cell.setValue(sum);
  
      }
      
    }
  
  }