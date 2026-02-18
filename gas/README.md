# Google Apps Script - Hướng Dẫn Triển Khai

## Giới Thiệu

File `Code.gs` chứa backend logic để xử lý việc tạo báo cáo chi tiêu trên Google Sheets và xuất PDF lên Google Drive.

## Các Chức Năng

### 1. `doPost(e)`
- Nhận POST request từ frontend
- Validate access token
- Validate request data
- Gọi `createReport()` để tạo báo cáo
- Tùy chọn gọi `exportToPDF()` nếu `exportPDF = true`
- Trả về JSON response

### 2. `createReport(data)`
- Tạo hoặc mở Google Spreadsheet
- Tạo sheet mới với tên là timestamp
- Ghi header, ngày giờ, bảng món hàng, tổng cộng
- Format cells (bold, colors, borders)
- Trả về URL của sheet

### 3. `exportToPDF(spreadsheetId, sheetId)`
- Export sheet thành PDF
- Lưu PDF vào thư mục Google Drive đã chỉ định
- Trả về URL của file PDF

### 4. `formatCurrency(amount)`
- Format số tiền theo định dạng Việt Nam
- VD: 1000000 → "1.000.000 ₫"

## Hướng Dẫn Triển Khai

### Bước 1: Tạo Google Apps Script Project

1. Truy cập https://script.google.com
2. Nhấn "New Project"
3. Đổi tên project thành "Shopping Expense Tracker Backend"
4. Copy toàn bộ nội dung file `Code.gs` vào editor
5. Lưu project (Ctrl+S hoặc File > Save)

### Bước 2: Cấu Hình Script Properties

1. Trong Apps Script editor, nhấn "Project Settings" (biểu tượng bánh răng)
2. Scroll xuống "Script Properties"
3. Nhấn "Add script property"
4. Thêm các properties sau:

**DRIVE_FOLDER_ID** (Bắt buộc nếu muốn xuất PDF):
- Tạo một thư mục trong Google Drive để lưu PDF
- Mở thư mục đó, copy ID từ URL
- URL format: `https://drive.google.com/drive/folders/[FOLDER_ID]`
- Paste FOLDER_ID vào value

**SPREADSHEET_ID** (Tùy chọn):
- Nếu muốn sử dụng spreadsheet có sẵn, copy ID từ URL
- URL format: `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`
- Nếu không set, script sẽ tự động tạo spreadsheet mới

### Bước 3: Deploy as Web App

1. Nhấn "Deploy" > "New deployment"
2. Nhấn biểu tượng bánh răng bên cạnh "Select type"
3. Chọn "Web app"
4. Cấu hình:
   - **Description**: "Shopping Expense Tracker API"
   - **Execute as**: "Me" (your account)
   - **Who has access**: "Anyone" (để frontend có thể gọi)
5. Nhấn "Deploy"
6. Authorize app (cho phép truy cập Google Sheets và Drive)
7. Copy **Web App URL** (format: `https://script.google.com/macros/s/[DEPLOYMENT_ID]/exec`)

### Bước 4: Cấu Hình Frontend

Thêm Web App URL vào file `.env.local` của Next.js app:

```
NEXT_PUBLIC_GAS_WEB_APP_URL=https://script.google.com/macros/s/[DEPLOYMENT_ID]/exec
```

## API Endpoint

### POST Request

**URL**: Web App URL từ deployment

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "accessToken": "ya29.xxx...",
  "items": [
    {
      "id": "uuid-1",
      "name": "Cà chua",
      "price": 20000,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": "uuid-2",
      "name": "Thịt heo",
      "price": 150000,
      "createdAt": "2024-01-15T10:31:00.000Z"
    }
  ],
  "timestamp": "2024-01-15T10:35:00.000Z",
  "totalAmount": 170000,
  "exportPDF": true
}
```

**Response (Success)**:
```json
{
  "success": true,
  "sheetUrl": "https://docs.google.com/spreadsheets/d/xxx/edit#gid=123",
  "pdfUrl": "https://drive.google.com/file/d/xxx/view"
}
```

**Response (Error)**:
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

## Error Codes

- **400**: Bad Request - Missing or invalid request data
- **401**: Unauthorized - Invalid or missing access token
- **500**: Internal Server Error - Server-side error

## Testing

### Test với curl:

```bash
curl -X POST "https://script.google.com/macros/s/[DEPLOYMENT_ID]/exec" \
  -H "Content-Type: application/json" \
  -d '{
    "accessToken": "YOUR_ACCESS_TOKEN",
    "items": [
      {"id": "1", "name": "Test Item", "price": 10000, "createdAt": "2024-01-15T10:00:00.000Z"}
    ],
    "timestamp": "2024-01-15T10:00:00.000Z",
    "totalAmount": 10000,
    "exportPDF": false
  }'
```

### Test với Postman:

1. Tạo POST request với URL là Web App URL
2. Set header `Content-Type: application/json`
3. Paste JSON body vào Body tab (chọn raw)
4. Thay `YOUR_ACCESS_TOKEN` bằng token thật từ Google OAuth
5. Send request

## Lưu Ý

1. **Access Token**: Frontend phải gửi valid Google OAuth access token với scopes:
   - `https://www.googleapis.com/auth/spreadsheets`
   - `https://www.googleapis.com/auth/drive.file`

2. **CORS**: Google Apps Script Web Apps tự động xử lý CORS, không cần cấu hình thêm

3. **Timeout**: Apps Script có giới hạn execution time 6 phút cho Web Apps

4. **Rate Limiting**: Google có rate limits cho Apps Script API calls

5. **Permissions**: Account deploy script phải có quyền write vào Drive folder

## Troubleshooting

### Lỗi "Unauthorized"
- Kiểm tra access token có hợp lệ không
- Kiểm tra token có đủ scopes không
- Token có thể đã hết hạn, cần refresh

### Lỗi "Drive folder not found"
- Kiểm tra DRIVE_FOLDER_ID trong Script Properties
- Kiểm tra account có quyền truy cập folder không

### Lỗi "Failed to create report"
- Kiểm tra SPREADSHEET_ID (nếu có) có hợp lệ không
- Kiểm tra account có quyền write vào spreadsheet không

### PDF không được tạo
- Kiểm tra DRIVE_FOLDER_ID đã được set chưa
- Kiểm tra permissions của folder
- Xem logs trong Apps Script editor (View > Logs)

## Cập Nhật Deployment

Khi thay đổi code:

1. Lưu thay đổi trong Apps Script editor
2. Nhấn "Deploy" > "Manage deployments"
3. Nhấn biểu tượng bút chì bên cạnh deployment hiện tại
4. Chọn "New version" trong dropdown "Version"
5. Nhấn "Deploy"

Web App URL sẽ giữ nguyên, không cần cập nhật frontend.
