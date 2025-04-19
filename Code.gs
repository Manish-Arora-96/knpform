function doGet(e) {
  // Default to index.html
  var page = e.parameter.page || 'index';
  // Sanitize: only allow known filenames
  var allowed = ['index', 'KnitPlanOrder', 'FABRICPRODENTRY'];
  if (allowed.indexOf(page) === -1) {
    page = 'index';
  }
  return HtmlService
    .createHtmlOutputFromFile(page)
    .setTitle(page === 'index' ? 'KPO Form Hub' : 'KPO - ' + page);
}



function submitData(formData) {
  // Open your target spreadsheet using its ID.
  var ss = SpreadsheetApp.openById("16FroMGa1yt-sJBh-Wd0FSqNTlny7fe9LwJzoRYxOLMI");
  var sheet = ss.getSheetByName("Knitting Details");
  
  // Prepare the data rows (each row will contain the submitted fields plus the global values).
  var rows = formData.rowsData.map(function(row) {
    return [
      row.srNo,
      row.knittingOrderNo,
      row.dyPlanNumber,
      row.refArticleNumber,
      row.color,
      row.fabricQuality,
      row.greyGSM,
      row.mcNos,
      row.qtyToKnit,
      row.rolls,
      formData.globalData.knpNo,    // Global KNP NO inserted for each row
      formData.globalData.orderDate   // Global Date inserted for each row
    ];
  });
  
  // Append rows using a batch operation.
  var startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, rows.length, rows[0].length).setValues(rows);
  
  return "Data submitted successfully!";
}

function checkDuplicateKnpNo(knpNo) {
  // Open the target spreadsheet and get the sheet.
  var ss = SpreadsheetApp.openById("16FroMGa1yt-sJBh-Wd0FSqNTlny7fe9LwJzoRYxOLMI");
  var sheet = ss.getSheetByName("Knitting Details");
  
  // Assume that the global KNP NO is stored in column 11.
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return false; // No data yet.
  
  // Get the values in column 11 (global KNP NO) from row 2 to the last row.
  var data = sheet.getRange(2, 11, lastRow - 1, 1).getValues();
  
  // Flatten the 2D array and check if any value matches knpNo.
  return data.flat().some(function(val) {
    return String(val).trim() === knpNo;
  });
}
function submitChallanData(formData) {
  var ss    = SpreadsheetApp.openById("16FroMGa1yt-sJBh-Wd0FSqNTlny7fe9LwJzoRYxOLMI");
  var sheet = ss.getSheetByName("FABRIC PROD ENTRY");
  
  // Build a 2D array of values
  var rows = formData.rowsData.map(function(r) {
    return [
      r.srNo,
      r.date,
      r.rollEndTime,
      r.shift,
      r.operator,
      r.rollNo,
      r.weight,
      r.count,
      r.blend,
      r.colour,
      r.lotNos,
      r.fabricDescription,
      r.gsmOnMc,
      r.remarks
    ];
  });
  
  if (rows.length) {
    var start = sheet.getLastRow()+1;
    sheet.getRange(start,1,rows.length, rows[0].length).setValues(rows);
  }
  return "Challan data submitted!";
}
