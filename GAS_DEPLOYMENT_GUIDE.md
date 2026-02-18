# Hướng Dẫn Deploy Google Apps Script - Chi Tiết Từng Bước

## Tổng Quan

Tài liệu này hướng dẫn chi tiết cách deploy Google Apps Script (GAS) cho ứng dụng Shopping Expense Tracker. Đây là **manual deployment task** - bạn cần thực hiện các bước sau theo thứ tự.

## Yêu Cầu

- Tài khoản Google
- File `gas/Code.gs` đã được tạo (✅ đã có)
- Quyền truy cập Google Drive và Google Sheets

---

## BƯỚC 1: Tạo Google Apps Script Project

### 1.1 Truy cập Google Apps Script

1. Mở trình duyệt và truy cập: **https://script.google.com**
2. Đăng nhập bằng tài khoản Google của bạn

### 1.2 Tạo Project Mới

1. Click nút **"New Project"** (góc trên bên trái)
2. Một project mới sẽ được tạo với tên mặc định "Untitled project"

### 1.3 Đổi Tên Project

1. Click vào tên "Untitled project" ở góc trên bên trái
2. Đổi tên thành: **"Shopping Expense Tracker Backend"**
3. Click **OK** để lưu

### 1.4 Copy Code

1. Xóa code mặc định trong editor (function myFunction() {...})
2. Mở file `gas/Code.gs` trong project của bạn
3. Copy **TOÀN BỘ** nội dung file
4. Paste vào Apps Script editor
5. Nhấn **Ctrl+S** (hoặc **Cmd+S** trên Mac) để lưu
6. Hoặc click **File > Save**

✅ **Checkpoint**: Editor hiện có ~400 dòng code với các functions: doPost, createReport, exportToPDF, etc.

---


## BƯỚC 2: Cấu Hình Script Properties

Script Properties là nơi lưu trữ các biến cấu hình như folder ID và spreadsheet ID.

### 2.1 Tạo Google Drive Folder (cho PDF)

1. Mở **Google Drive**: https://drive.google.com
2. Click **New** > **Folder**
3. Đặt tên folder: **"Shopping Expense Reports"** (hoặc tên bạn muốn)
4. Click **Create**
5. Mở folder vừa tạo
6. Nhìn vào URL trên thanh địa chỉ, nó sẽ có dạng:
   ```
   https://drive.google.com/drive/folders/1a2B3c4D5e6F7g8H9i0J
   ```
7. **Copy phần ID** (phần sau `/folders/`): `1a2B3c4D5e6F7g8H9i0J`
8. Lưu ID này lại, bạn sẽ cần nó ở bước tiếp theo

### 2.2 Thêm Script Properties

1. Quay lại Apps Script editor
2. Click biểu tượng **bánh răng** (⚙️) bên trái - "Project Settings"
3. Scroll xuống phần **"Script Properties"**
4. Click nút **"Add script property"**

### 2.3 Thêm DRIVE_FOLDER_ID

1. Trong hộp thoại:
   - **Property**: Nhập `DRIVE_FOLDER_ID`
   - **Value**: Paste folder ID bạn đã copy ở bước 2.1
2. Click **"Save script property"**

### 2.4 Thêm SPREADSHEET_ID (Tùy chọn)

**Lưu ý**: Bước này là **TÙY CHỌN**. Nếu bạn không thêm, script sẽ tự động tạo spreadsheet mới.

Nếu bạn muốn sử dụng một Google Sheets có sẵn:

1. Tạo hoặc mở Google Sheets bạn muốn dùng
2. Copy Spreadsheet ID từ URL:
   ```
   https://docs.google.com/spreadsheets/d/1X2Y3Z4A5B6C7D8E9F0G/edit
   ```
   ID là phần: `1X2Y3Z4A5B6C7D8E9F0G`
3. Click **"Add script property"** lần nữa
4. Nhập:
   - **Property**: `SPREADSHEET_ID`
   - **Value**: Paste spreadsheet ID
5. Click **"Save script property"**

✅ **Checkpoint**: Bạn có ít nhất 1 script property (DRIVE_FOLDER_ID), có thể có 2 nếu thêm SPREADSHEET_ID.

---


## BƯỚC 3: Deploy as Web App

### 3.1 Bắt Đầu Deployment

1. Quay lại editor (click biểu tượng **<>** bên trái)
2. Click nút **"Deploy"** ở góc trên bên phải
3. Chọn **"New deployment"**

### 3.2 Chọn Type

1. Click biểu tượng **bánh răng** (⚙️) bên cạnh "Select type"
2. Chọn **"Web app"**

### 3.3 Cấu Hình Deployment

Điền các thông tin sau:

1. **Description**: Nhập `Production deployment v1` (hoặc mô tả bạn muốn)

2. **Execute as**: Chọn **"Me (your-email@gmail.com)"**
   - Điều này có nghĩa script sẽ chạy với quyền của bạn

3. **Who has access**: Chọn **"Anyone"**
   - ⚠️ **QUAN TRỌNG**: Phải chọn "Anyone" để frontend có thể gọi API
   - Script vẫn an toàn vì có validate access token

4. Click nút **"Deploy"**

### 3.4 Authorize Application

Lần đầu tiên deploy, Google sẽ yêu cầu bạn authorize:

1. Một popup sẽ xuất hiện: **"Authorization required"**
2. Click **"Authorize access"**
3. Chọn tài khoản Google của bạn
4. Bạn sẽ thấy màn hình: **"Google hasn't verified this app"**
   - Đây là bình thường vì đây là script của bạn
5. Click **"Advanced"** (ở góc dưới bên trái)
6. Click **"Go to Shopping Expense Tracker Backend (unsafe)"**
7. Review các permissions:
   - See, edit, create, and delete all your Google Sheets spreadsheets
   - See, edit, create, and delete all of your Google Drive files
8. Click **"Allow"**

### 3.5 Copy Web App URL

1. Sau khi authorize, bạn sẽ thấy màn hình **"Deployment successfully created"**
2. Bạn sẽ thấy **"Web app URL"** có dạng:
   ```
   https://script.google.com/macros/s/AKfycbx...xyz123/exec
   ```
3. Click nút **"Copy"** bên cạnh URL
4. **LƯU URL NÀY LẠI** - bạn sẽ cần nó cho frontend

✅ **Checkpoint**: Bạn có Web App URL đã được copy vào clipboard.

### 3.6 Đóng Dialog

Click **"Done"** để đóng dialog.

---


## BƯỚC 4: Thiết Lập Permissions

### 4.1 Kiểm Tra Permissions

Script đã được authorize ở bước 3.4, nhưng hãy verify:

1. Trong Apps Script editor, click **"Project Settings"** (⚙️)
2. Scroll xuống phần **"Google Cloud Platform (GCP) Project"**
3. Bạn sẽ thấy project ID

### 4.2 Verify Drive Folder Access

1. Quay lại Google Drive: https://drive.google.com
2. Tìm folder "Shopping Expense Reports" bạn đã tạo
3. Right-click folder > **"Share"**
4. Đảm bảo tài khoản của bạn có quyền **"Editor"** hoặc **"Owner"**

✅ **Checkpoint**: Script có đầy đủ permissions để truy cập Sheets và Drive.

---

## BƯỚC 5: Lấy Web App URL và Cập Nhật Frontend

### 5.1 Lấy Lại URL (nếu cần)

Nếu bạn quên copy URL ở bước 3.5:

1. Trong Apps Script editor, click **"Deploy"**
2. Chọn **"Manage deployments"**
3. Bạn sẽ thấy danh sách deployments
4. Copy **"Web app URL"** từ deployment mới nhất

### 5.2 Cập Nhật .env.local

1. Mở file `.env.local` trong project Next.js của bạn
2. Tìm dòng:
   ```
   NEXT_PUBLIC_GAS_WEB_APP_URL=
   ```
3. Paste Web App URL vào:
   ```
   NEXT_PUBLIC_GAS_WEB_APP_URL=https://script.google.com/macros/s/AKfycbx...xyz123/exec
   ```
4. Lưu file

### 5.3 Restart Development Server

Nếu bạn đang chạy `npm run dev`:

1. Dừng server (Ctrl+C)
2. Chạy lại: `npm run dev`
3. Environment variable mới sẽ được load

✅ **Checkpoint**: Frontend đã có Web App URL để gọi API.

---


## BƯỚC 6: Test Deployment

### 6.1 Test Với Apps Script Editor

1. Trong Apps Script editor, click **"Deploy"** > **"Test deployments"**
2. Copy **"Web app URL"** từ test deployment
3. Mở URL trong browser
4. Bạn sẽ thấy error (bình thường) vì đây là POST endpoint

### 6.2 Test Với curl (Optional)

Nếu bạn có curl, test với command sau:

```bash
curl -X POST "YOUR_WEB_APP_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "accessToken": "test",
    "items": [{"id":"1","name":"Test","price":10000,"createdAt":"2024-01-01T00:00:00Z"}],
    "timestamp": "2024-01-01T00:00:00Z",
    "totalAmount": 10000,
    "exportPDF": false
  }'
```

Thay `YOUR_WEB_APP_URL` bằng URL thực của bạn.

**Expected response**: Error về invalid token (đây là đúng, vì chưa có token thật)

### 6.3 Test Với Frontend

Cách tốt nhất là test trực tiếp với ứng dụng:

1. Chạy `npm run dev`
2. Mở http://localhost:3000
3. Đăng nhập với Google
4. Thêm vài món hàng
5. Click "Lưu báo cáo"
6. Kiểm tra:
   - ✅ Thông báo "Lưu thành công"
   - ✅ Google Sheets được tạo/cập nhật
   - ✅ PDF được tạo trong Drive folder (nếu bật exportPDF)

---

## BƯỚC 7: Verify Kết Quả

### 7.1 Kiểm Tra Google Sheets

1. Truy cập Google Sheets: https://docs.google.com/spreadsheets/
2. Tìm spreadsheet "Báo Cáo Chi Tiêu Mua Sắm"
3. Mở spreadsheet
4. Verify:
   - ✅ Sheet mới với tên là timestamp (VD: "25-12-2024_14-30")
   - ✅ Header: "BÁO CÁO CHI TIÊU MUA SẮM"
   - ✅ Ngày giờ đúng format: "Ngày: 25/12/2024 14:30"
   - ✅ Bảng có header: STT | Tên món hàng | Giá
   - ✅ Dữ liệu món hàng đầy đủ
   - ✅ Tổng cộng đúng và màu đỏ

### 7.2 Kiểm Tra Google Drive

1. Truy cập folder "Shopping Expense Reports" trong Drive
2. Verify:
   - ✅ File PDF mới với tên dạng: "Chi_Tieu_20241225_143000.pdf"
   - ✅ Mở PDF, nội dung giống với Google Sheets
   - ✅ PDF có thể in được

### 7.3 Kiểm Tra Logs (nếu có lỗi)

Nếu có vấn đề:

1. Trong Apps Script editor, click **"Executions"** (biểu tượng đồng hồ bên trái)
2. Xem danh sách executions gần đây
3. Click vào execution để xem logs chi tiết
4. Tìm error messages màu đỏ

---


## Troubleshooting

### Lỗi: "Authorization required"

**Nguyên nhân**: Script chưa được authorize

**Giải pháp**:
1. Quay lại Bước 3.4
2. Authorize lại application
3. Redeploy nếu cần

### Lỗi: "Drive folder not found"

**Nguyên nhân**: DRIVE_FOLDER_ID không đúng hoặc không có quyền

**Giải pháp**:
1. Verify DRIVE_FOLDER_ID trong Script Properties
2. Kiểm tra folder tồn tại trong Drive
3. Kiểm tra bạn có quyền truy cập folder

### Lỗi: "Spreadsheet not found"

**Nguyên nhân**: SPREADSHEET_ID không đúng (nếu có set)

**Giải pháp**:
1. Xóa SPREADSHEET_ID trong Script Properties
2. Script sẽ tự tạo spreadsheet mới
3. Hoặc verify SPREADSHEET_ID đúng

### Lỗi: "Invalid access token"

**Nguyên nhân**: Frontend gửi token không hợp lệ

**Giải pháp**:
1. Kiểm tra Google OAuth đã setup đúng chưa
2. Verify NEXT_PUBLIC_GOOGLE_CLIENT_ID trong .env.local
3. Đăng xuất và đăng nhập lại

### Lỗi: "Failed to create PDF"

**Nguyên nhân**: Không có quyền export hoặc folder không tồn tại

**Giải pháp**:
1. Verify DRIVE_FOLDER_ID
2. Kiểm tra permissions của folder
3. Xem logs trong Apps Script editor (Executions)

### Script không chạy khi gọi từ frontend

**Nguyên nhân**: CORS hoặc deployment settings

**Giải pháp**:
1. Verify "Who has access" = "Anyone"
2. Kiểm tra Web App URL đúng trong .env.local
3. Redeploy script
4. Clear browser cache và thử lại

---

## Cập Nhật Deployment

Khi bạn thay đổi code trong `gas/Code.gs`:

### Cách 1: New Version (Khuyến nghị)

1. Cập nhật code trong Apps Script editor
2. Lưu (Ctrl+S)
3. Click **"Deploy"** > **"Manage deployments"**
4. Click biểu tượng **bút chì** (✏️) bên cạnh deployment hiện tại
5. Trong dropdown **"Version"**, chọn **"New version"**
6. Nhập description cho version mới
7. Click **"Deploy"**

**Lưu ý**: Web App URL giữ nguyên, không cần cập nhật frontend.

### Cách 2: New Deployment

1. Cập nhật code
2. Click **"Deploy"** > **"New deployment"**
3. Làm theo Bước 3
4. **Lưu ý**: URL mới sẽ khác, cần cập nhật .env.local

---

## Checklist Hoàn Thành

Đánh dấu ✅ khi hoàn thành:

- [ ] Đã tạo Google Apps Script project
- [ ] Đã copy code từ gas/Code.gs vào editor
- [ ] Đã tạo Drive folder và lấy DRIVE_FOLDER_ID
- [ ] Đã thêm DRIVE_FOLDER_ID vào Script Properties
- [ ] (Optional) Đã thêm SPREADSHEET_ID vào Script Properties
- [ ] Đã deploy as Web App với settings:
  - Execute as: Me
  - Who has access: Anyone
- [ ] Đã authorize application với Sheets và Drive permissions
- [ ] Đã copy Web App URL
- [ ] Đã cập nhật NEXT_PUBLIC_GAS_WEB_APP_URL trong .env.local
- [ ] Đã restart development server
- [ ] Đã test và verify:
  - Google Sheets được tạo đúng
  - PDF được tạo trong Drive folder
  - Format tiếng Việt đúng
  - Tổng chi phí tính đúng

---

## Thông Tin Tham Khảo

### Script Properties Cần Thiết

| Property | Required | Description | Example |
|----------|----------|-------------|---------|
| `DRIVE_FOLDER_ID` | ✅ Yes | ID của folder Drive để lưu PDF | `1a2B3c4D5e6F7g8H9i0J` |
| `SPREADSHEET_ID` | ❌ No | ID của Sheets (tự tạo nếu không có) | `1X2Y3Z4A5B6C7D8E9F0G` |

### Deployment Settings

- **Execute as**: Me (your-email@gmail.com)
- **Who has access**: Anyone
- **Type**: Web app

### Required Permissions

- Google Sheets API: Read/Write
- Google Drive API: Read/Write/Create files

### Web App URL Format

```
https://script.google.com/macros/s/[DEPLOYMENT_ID]/exec
```

---

## Liên Hệ và Hỗ Trợ

Nếu gặp vấn đề:

1. Kiểm tra **Executions** logs trong Apps Script editor
2. Xem **Console** logs trong browser (F12)
3. Đọc lại hướng dẫn từ đầu
4. Tham khảo:
   - [Google Apps Script Documentation](https://developers.google.com/apps-script)
   - [gas/README.md](./gas/README.md) - Chi tiết về API
   - [DEPLOYMENT.md](./DEPLOYMENT.md) - Hướng dẫn deploy toàn bộ app

---

## Hoàn Thành! 🎉

Chúc mừng! Bạn đã deploy thành công Google Apps Script backend.

**Next Steps**:
1. Test đầy đủ các chức năng
2. Deploy frontend lên Vercel (xem DEPLOYMENT.md)
3. Cập nhật OAuth redirect URIs với production URL

**Lưu ý**: Đây là manual deployment task. Mỗi lần thay đổi code, bạn cần update version theo hướng dẫn ở phần "Cập Nhật Deployment".
