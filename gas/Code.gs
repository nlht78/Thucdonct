/**
 * Google Apps Script - Shopping Expense Tracker Backend
 * Xử lý việc tạo báo cáo trên Google Sheets và xuất PDF lên Google Drive
 */

/**
 * Xử lý OPTIONS request (CORS preflight)
 * Google Apps Script tự động xử lý CORS khi deploy với "Anyone"
 */
function doOptions(e) {
  return ContentService.createTextOutput('');
}

/**
 * Nhận GET request từ frontend
 * @param {Object} e - Event object
 * @returns {TextOutput} JSON response
 */
function doGet(e) {
  try {
    // Kiểm tra nếu là request tạo báo cáo
    if (e.parameter.action === 'createReport') {
      // Validate API key
      const apiKey = e.parameter.apiKey;
      const scriptProperties = PropertiesService.getScriptProperties();
      const validApiKey = scriptProperties.getProperty('API_KEY');
      
      if (!apiKey || apiKey !== validApiKey) {
        return createJsonResponse({
          success: false,
          error: 'Unauthorized: Invalid or missing API key'
        }, 401);
      }
      
      // Parse data từ query parameter
      const requestData = JSON.parse(e.parameter.data);
      
      // Validate required fields
      if (!requestData.userName) {
        return createJsonResponse({
          success: false,
          error: 'Bad Request: userName is required'
        }, 400);
      }
      
      if (!requestData.items || !Array.isArray(requestData.items)) {
        return createJsonResponse({
          success: false,
          error: 'Bad Request: items array is required'
        }, 400);
      }
      
      if (!requestData.timestamp) {
        return createJsonResponse({
          success: false,
          error: 'Bad Request: timestamp is required'
        }, 400);
      }
      
      if (typeof requestData.totalAmount !== 'number') {
        return createJsonResponse({
          success: false,
          error: 'Bad Request: totalAmount must be a number'
        }, 400);
      }
      
      // Tạo báo cáo trên Google Sheets
      const sheetResult = createReport(requestData);
      
      if (!sheetResult.success) {
        return createJsonResponse({
          success: false,
          error: sheetResult.error
        }, 500);
      }
      
      const response = {
        success: true,
        sheetUrl: sheetResult.url
      };
      
      // Không tạo PDF nữa - chỉ tạo Google Sheets
      
      return createJsonResponse(response, 200);
    }
    
    // Default response cho health check
    return createJsonResponse({
      success: true,
      message: 'Shopping Expense Tracker API is running',
      timestamp: new Date().toISOString()
    }, 200);
    
  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());
    return createJsonResponse({
      success: false,
      error: 'Internal Server Error: ' + error.message
    }, 500);
  }
}

/**
 * Nhận POST request từ frontend
 * @param {Object} e - Event object chứa request data
 * @returns {TextOutput} JSON response
 */
function doPost(e) {
  try {
    // Parse request body
    const requestData = JSON.parse(e.postData.contents);
    
    // Validate API key (simple authentication thay vì OAuth)
    const apiKey = e.parameter.api_key || requestData.apiKey;
    const scriptProperties = PropertiesService.getScriptProperties();
    const validApiKey = scriptProperties.getProperty('API_KEY');
    
    if (!apiKey || apiKey !== validApiKey) {
      return createJsonResponse({
        success: false,
        error: 'Unauthorized: Invalid or missing API key'
      }, 401);
    }
    
    // Validate required fields
    if (!requestData.userName) {
      return createJsonResponse({
        success: false,
        error: 'Bad Request: userName is required'
      }, 400);
    }
    
    if (!requestData.items || !Array.isArray(requestData.items)) {
      return createJsonResponse({
        success: false,
        error: 'Bad Request: items array is required'
      }, 400);
    }
    
    if (!requestData.timestamp) {
      return createJsonResponse({
        success: false,
        error: 'Bad Request: timestamp is required'
      }, 400);
    }
    
    if (typeof requestData.totalAmount !== 'number') {
      return createJsonResponse({
        success: false,
        error: 'Bad Request: totalAmount must be a number'
      }, 400);
    }
    
    // Tạo báo cáo trên Google Sheets
    const sheetResult = createReport(requestData);
    
    if (!sheetResult.success) {
      return createJsonResponse({
        success: false,
        error: sheetResult.error
      }, 500);
    }
    
    const response = {
      success: true,
      sheetUrl: sheetResult.url
    };
    
    // Xuất PDF nếu được yêu cầu
    if (requestData.exportPDF === true) {
      const pdfResult = exportToPDF(sheetResult.spreadsheetId, sheetResult.sheetId, requestData.userName);
      
      if (pdfResult.success) {
        response.pdfUrl = pdfResult.url;
      } else {
        // PDF export failed nhưng vẫn trả về success với sheet URL
        Logger.log('PDF export failed: ' + pdfResult.error);
      }
    }
    
    return createJsonResponse(response, 200);
    
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return createJsonResponse({
      success: false,
      error: 'Internal Server Error: ' + error.message
    }, 500);
  }
}

/**
 * Tạo báo cáo trên Google Sheets
 * @param {Object} data - Dữ liệu báo cáo
 * @returns {Object} Result object với success, url, spreadsheetId, sheetId
 */
function createReport(data) {
  try {
    const scriptProperties = PropertiesService.getScriptProperties();
    const folderId = scriptProperties.getProperty('DRIVE_FOLDER_ID');
    
    // Tạo tên file với userName và timestamp
    const timestamp = new Date(data.timestamp);
    const fileName = 'Báo Cáo - ' + data.userName + ' - ' + formatDateForFileName(timestamp);
    
    // Tạo Spreadsheet mới cho mỗi báo cáo
    const spreadsheet = SpreadsheetApp.create(fileName);
    const spreadsheetId = spreadsheet.getId();
    
    // Di chuyển vào folder nếu có DRIVE_FOLDER_ID
    if (folderId) {
      try {
        const file = DriveApp.getFileById(spreadsheetId);
        const folder = DriveApp.getFolderById(folderId);
        // Xóa khỏi root folder
        const parents = file.getParents();
        while (parents.hasNext()) {
          const parent = parents.next();
          parent.removeFile(file);
        }
        // Thêm vào folder đích
        folder.addFile(file);
      } catch (moveError) {
        Logger.log('Warning: Could not move spreadsheet to folder: ' + moveError.toString());
      }
    }
    
    // Lấy sheet đầu tiên và đổi tên
    const sheet = spreadsheet.getSheets()[0];
    sheet.setName('Báo Cáo Chi Tiêu');
    
    // Ghi header
    sheet.getRange('A1:F1').merge();
    sheet.getRange('A1').setValue('BÁO CÁO CHI TIÊU MUA SẮM')
      .setFontWeight('bold')
      .setHorizontalAlignment('center')
      .setFontSize(14);
    
    // Ghi thông tin người dùng và ngày giờ
    sheet.getRange('A2:F2').merge();
    sheet.getRange('A2').setValue('Người mua: ' + data.userName + ' | Ngày: ' + formatDateTime(timestamp))
      .setFontStyle('italic')
      .setHorizontalAlignment('center');
    
    // Row 3 trống
    
    // Ghi header bảng
    const headerRange = sheet.getRange('A4:F4');
    headerRange.setValues([['Buổi', 'Tên hàng', 'ĐVT', 'Số lượng', 'Giá lẻ', 'Thành tiền']]);
    headerRange.setFontWeight('bold')
      .setBackground('#e0e0e0')
      .setHorizontalAlignment('center');
    
    // Ghi dữ liệu món hàng theo buổi
    let currentRow = 5;
    
    // Buổi SÁNG (để trống)
    sheet.getRange(currentRow, 1).setValue('SÁNG')
      .setFontWeight('bold')
      .setVerticalAlignment('top');
    currentRow++;
    
    // Buổi TRƯA
    const truaStartRow = currentRow;
    sheet.getRange(currentRow, 1).setValue('Trưa')
      .setFontWeight('bold')
      .setVerticalAlignment('top');
    
    // Ghi các món hàng vào buổi Trưa
    data.items.forEach((item, index) => {
      sheet.getRange(currentRow, 2).setValue((index + 1) + '. ' + item.name);
      sheet.getRange(currentRow, 3).setValue(''); // ĐVT - để trống
      sheet.getRange(currentRow, 4).setValue(''); // Số lượng - để trống
      sheet.getRange(currentRow, 5).setValue(''); // Giá lẻ - để trống
      sheet.getRange(currentRow, 6).setValue(formatCurrency(item.price)); // Thành tiền
      currentRow++;
    });
    
    // Merge cell "Trưa" theo số món hàng
    if (data.items.length > 0) {
      sheet.getRange(truaStartRow, 1, data.items.length, 1).merge();
    }
    
    // Buổi CHIỀU (để trống)
    sheet.getRange(currentRow, 1).setValue('Chiều')
      .setFontWeight('bold')
      .setVerticalAlignment('top');
    currentRow++;
    
    // Ghi tổng cộng
    sheet.getRange(currentRow, 1, 1, 5).merge();
    sheet.getRange(currentRow, 1).setValue('Tổng tiền')
      .setFontWeight('bold')
      .setHorizontalAlignment('right');
    sheet.getRange(currentRow, 6).setValue(formatCurrency(data.totalAmount))
      .setFontWeight('bold')
      .setFontColor('#ff0000');
    
    // Format borders cho bảng
    const tableRange = sheet.getRange(4, 1, currentRow - 3, 6);
    tableRange.setBorder(true, true, true, true, true, true);
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, 6);
    
    // Set column widths
    sheet.setColumnWidth(1, 80);  // Buổi
    sheet.setColumnWidth(2, 250); // Tên hàng
    sheet.setColumnWidth(3, 60);  // ĐVT
    sheet.setColumnWidth(4, 80);  // Số lượng
    sheet.setColumnWidth(5, 100); // Giá lẻ
    sheet.setColumnWidth(6, 120); // Thành tiền
    
    return {
      success: true,
      url: spreadsheet.getUrl() + '#gid=' + sheet.getSheetId(),
      spreadsheetId: spreadsheetId,
      sheetId: sheet.getSheetId()
    };
    
  } catch (error) {
    Logger.log('Error in createReport: ' + error.toString());
    return {
      success: false,
      error: 'Failed to create report: ' + error.message
    };
  }
}

/**
 * Xuất sheet thành PDF và lưu vào Google Drive
 * @param {string} spreadsheetId - ID của spreadsheet
 * @param {number} sheetId - ID của sheet
 * @param {string} userName - Tên người dùng
 * @returns {Object} Result object với success, url
 */
function exportToPDF(spreadsheetId, sheetId, userName) {
  try {
    const scriptProperties = PropertiesService.getScriptProperties();
    const folderId = scriptProperties.getProperty('DRIVE_FOLDER_ID');
    
    if (!folderId) {
      return {
        success: false,
        error: 'DRIVE_FOLDER_ID not configured in Script Properties'
      };
    }
    
    // Kiểm tra folder tồn tại
    let folder;
    try {
      folder = DriveApp.getFolderById(folderId);
    } catch (error) {
      return {
        success: false,
        error: 'Drive folder not found or no access'
      };
    }
    
    // Tạo tên file PDF với tên người dùng
    const timestamp = new Date();
    const fileName = userName + '_Chi_Tieu_' + formatDateForFileName(timestamp) + '.pdf';
    
    // Export PDF từ Google Sheets
    const url = 'https://docs.google.com/spreadsheets/d/' + spreadsheetId + '/export' +
                '?format=pdf' +
                '&gid=' + sheetId +
                '&portrait=true' +
                '&size=A4' +
                '&fitw=true';
    
    const token = ScriptApp.getOAuthToken();
    const response = UrlFetchApp.fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    
    const pdfBlob = response.getBlob().setName(fileName);
    const pdfFile = folder.createFile(pdfBlob);
    
    return {
      success: true,
      url: pdfFile.getUrl()
    };
    
  } catch (error) {
    Logger.log('Error in exportToPDF: ' + error.toString());
    return {
      success: false,
      error: 'Failed to export PDF: ' + error.message
    };
  }
}

/**
 * Format số tiền theo định dạng Việt Nam
 * @param {number} amount - Số tiền
 * @returns {string} Số tiền đã format (VD: "1.000.000 ₫")
 */
function formatCurrency(amount) {
  if (typeof amount !== 'number') {
    return '0 ₫';
  }
  
  // Format với dấu chấm ngăn cách hàng nghìn
  const formatted = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return formatted + ' ₫';
}

/**
 * Format ngày giờ theo định dạng Việt Nam
 * @param {Date} date - Date object
 * @returns {string} Ngày giờ đã format (VD: "25/12/2024 14:30")
 */
function formatDateTime(date) {
  const day = padZero(date.getDate());
  const month = padZero(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  
  return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
}

/**
 * Format ngày cho tên sheet
 * @param {Date} date - Date object
 * @returns {string} Tên sheet (VD: "25-12-2024_14-30")
 */
function formatDateForSheetName(date) {
  const day = padZero(date.getDate());
  const month = padZero(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  
  return day + '-' + month + '-' + year + '_' + hours + '-' + minutes;
}

/**
 * Format ngày cho tên file
 * @param {Date} date - Date object
 * @returns {string} Tên file (VD: "18-02-2026 15h30")
 */
function formatDateForFileName(date) {
  const day = padZero(date.getDate());
  const month = padZero(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  
  return day + '-' + month + '-' + year + ' ' + hours + 'h' + minutes;
}

/**
 * Thêm số 0 phía trước nếu số < 10
 * @param {number} num - Số cần format
 * @returns {string} Số đã format
 */
function padZero(num) {
  return num < 10 ? '0' + num : num.toString();
}

/**
 * Tạo JSON response
 * @param {Object} data - Response data
 * @param {number} statusCode - HTTP status code
 * @returns {TextOutput} JSON response
 */
function createJsonResponse(data, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Note: Apps Script Web Apps không hỗ trợ set status code trực tiếp
  // Status code được truyền trong response body để client xử lý
  if (statusCode !== 200) {
    data.statusCode = statusCode;
  }
  
  return output;
}
