function output(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var requestData = JSON.parse(e.postData.contents || "{}");
    var action = requestData.action;

    switch(action) {

      case "login":
        return output({
          status: "success",
          message: "Login uğurlu",
          token: Utilities.getUuid()
        });

      case "createOrder":
        var newID = generateID(
          requestData.sheetName,
          requestData.userId,
          requestData.prefix
        );

        appendToSheet(
          requestData.sheetName,
          [requestData.userId, newID, requestData.details, new Date()]
        );

        return output({
          status: "success",
          orderId: newID
        });

      case "createNewOrder":
        return output(saveNewOrderToSheet(requestData));

      default:
        return output({
          status: "error",
          message: "Naməlum action"
        });
    }

  } catch(error) {
    return output({
      status: "error",
      message: error.toString()
    });
  }
}

function saveNewOrderToSheet(request) {
  try {

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Orders");

    if (!sheet) {
      return {
        status: "error",
        message: "Orders sheet tapılmadı"
      };
    }

    var customerID = request.customerID || "650001";
    var data = request.data || {};

    var orderID =
      data.orderID ||
      ("YL-" + customerID + "-" + new Date().getTime());

    var status = "Aktiv";

    var row = [
      customerID,
      orderID,
      data.fromCity || "",
      data.toCity || "",
      data.customerName || "",
      data.phone || "",
      data.cargoType || "",
      data.weight || "",
      data.price || "",
      data.notes || "-",
      status,
      new Date()
    ];

    sheet.appendRow(row);

    return {
      status: "success",
      orderID: orderID,
      message: "Sifariş əlavə edildi"
    };

  } catch(error) {
    return {
      status: "error",
      message: error.toString()
    };
  }
}
