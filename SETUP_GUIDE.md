# Hướng Dẫn Cài Đặt - Shopping Expense Tracker

## Tổng Quan

Ứng dụng này cho phép người dùng:
- ✅ Nhập tên và bắt đầu sử dụng (không cần đăng nhập)
- ✅ Quản lý danh sách mua sắm
- ✅ Lưu báo cáo lên Google Sheets và xuất PDF
- ✅ Xem lịch sử báo cáo đã lưu

## Bước 1: Cài Đặt Dependencies

```bash
npm install
```

## Bước 2: Cấu Hình Google Apps Script

### 2.1 Tạo Google Apps Script Project

1. Truy cập https://script.google.com
2. Click **"New Project"**
3. Đổi tên: **"Shopping Expense Tracker API"**
4. Copy toàn bộ nội dung từ file `gas/Code.gs` vào editor
5. Lưu (Ctrl+S)

### 2.2 Tạo API Key

1. Tạo một chuỗi ngẫu nhiên làm API key (ví dụ: `my-secret-key-12345`)
2. Lưu lại để dùng ở bước sau

### 2.3 Cấu Hình Script Properties

1. Click biểu tượng **bánh răng** (⚙️) - "Project Settings"
2. Scroll xuống **"Script Properties"**
3. Click **"Add script property"**
4. Thêm các properties sau:

| Property | Value | Mô tả |
|----------|-------|-------|
| `API_KEY` | `my-secret-key-12345` | API key bạn vừa tạo |
| `DRIVE_FOLDER_ID` | ID của folder Drive | Folder để lưu PDF |
| `SPREADSHEET_ID` | (Optional) | ID của Sheets có sẵn |

**Cách lấy DRIVE_FOLDER_ID:**
- Tạo folder trong Google Drive
- Mở folder, URL có dạng: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
- Copy phần `FOLDER_ID_HERE`

### 2.4 Deploy as Web App

1. Click **"Deploy"** > **"New deployment"**
2. Click biểu tượng **bánh răng**, chọn **"Web app"**
3. Cấu hình:
   - **Description**: `Production v1`
   - **Execute as**: **Me**
   - **Who has access**: **Anyone**
4. Click **"Deploy"**
5. Authorize application khi được yêu cầu
6. Copy **Web App URL** (dạng: `https://script.google.com/macros/s/xxx/exec`)

**LƯU Ý QUAN TRỌNG**: Nếu bạn đã deploy trước đó và cần update code:
1. Click **"Deploy"** > **"Manage deployments"**
2. Click biểu tượng **bút chì** (✏️) bên cạnh deployment hiện tại
3. Chọn **"New version"** trong dropdown "Version"
4. Click **"Deploy"**
5. Web App URL sẽ giữ nguyên

## Bước 3: Cấu Hình Frontend

### 3.1 Tạo file .env.local

```bash
cp .env.example .env.local
```

### 3.2 Cập nhật .env.local

```env
# Web App URL từ Google Apps Script
NEXT_PUBLIC_GAS_WEB_APP_URL=https://script.google.com/macros/s/xxx/exec

# API Key (phải giống với API_KEY trong Script Properties)
NEXT_PUBLIC_GAS_API_KEY=my-secret-key-12345
```

## Bước 4: Chạy Ứng Dụng

```bash
npm run dev
```

Mở http://localhost:3000

## Bước 5: Sử Dụng

1. Nhập tên của bạn khi mở ứng dụng lần đầu
2. Thêm các món hàng đã mua
3. Click **"Lưu báo cáo"** để:
   - Lưu vào localStorage (xem trong lịch sử)
   - Tạo báo cáo trên Google Sheets
   - Xuất PDF vào Google Drive
4. Click **"Xem lịch sử báo cáo"** để xem các báo cáo đã lưu
5. Click **"Mở Google Sheets"** hoặc **"Mở PDF"** để xem file

## Deploy Lên Vercel

### 1. Push code lên GitHub

```bash
git add .
git commit -m "Setup shopping expense tracker"
git push
```

### 2. Import vào Vercel

1. Truy cập https://vercel.com/dashboard
2. Click **"Add New"** > **"Project"**
3. Import repository của bạn

### 3. Cấu Hình Environment Variables

Trong Vercel project settings, thêm:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_GAS_WEB_APP_URL` | Your Web App URL |
| `NEXT_PUBLIC_GAS_API_KEY` | Your API Key |

### 4. Deploy

Click **"Deploy"** và đợi build hoàn tất.

## Bảo Mật

### API Key

- API key được dùng để xác thực request từ frontend đến Google Apps Script
- Không commit API key vào Git
- Chỉ chia sẻ API key với người có quyền truy cập

### Google Apps Script

- Deploy với "Who has access: Anyone" để frontend có thể gọi
- Bảo mật bằng API key validation
- Chỉ account deploy script mới có quyền ghi vào Sheets/Drive

## Troubleshooting

### Lỗi CORS: "No 'Access-Control-Allow-Origin' header"

**Nguyên nhân**: Google Apps Script chưa được cập nhật với code mới có CORS headers

**Giải pháp**:
1. Mở Google Apps Script editor
2. Copy toàn bộ code từ `gas/Code.gs` (đã có CORS headers)
3. Paste vào editor, lưu
4. Redeploy: "Deploy" > "Manage deployments" > Click ✏️ > "New version" > "Deploy"
5. Đợi vài giây để deployment hoàn tất
6. Thử lại

### Lỗi: "Unauthorized: Invalid or missing API key"

**Nguyên nhân**: API key không khớp

**Giải pháp**:
1. Kiểm tra `NEXT_PUBLIC_GAS_API_KEY` trong `.env.local`
2. Kiểm tra `API_KEY` trong Script Properties
3. Đảm bảo 2 giá trị giống hệt nhau

### Lỗi: "Chưa cấu hình Google Apps Script URL"

**Nguyên nhân**: Chưa set `NEXT_PUBLIC_GAS_WEB_APP_URL`

**Giải pháp**:
1. Kiểm tra file `.env.local`
2. Restart development server: `npm run dev`

### Lỗi: "Drive folder not found"

**Nguyên nhân**: DRIVE_FOLDER_ID không đúng

**Giải pháp**:
1. Verify DRIVE_FOLDER_ID trong Script Properties
2. Kiểm tra folder tồn tại trong Drive
3. Kiểm tra account deploy script có quyền truy cập folder

## Tính Năng

### Lưu Trữ

- **Local**: Dữ liệu tạm thời trong localStorage
- **Cloud**: Báo cáo lưu trên Google Sheets + PDF trong Drive
- **Lịch sử**: Xem lại các báo cáo đã lưu

### Báo Cáo

- **Google Sheets**: Bảng tính với format đẹp
- **PDF**: File PDF có thể in hoặc chia sẻ
- **Tên file**: Bao gồm tên người dùng và timestamp

### UI

- **Tiếng Việt**: Toàn bộ giao diện
- **Responsive**: Hoạt động tốt trên mobile
- **Toast notifications**: Thông báo thành công/lỗi

## Liên Hệ

Nếu gặp vấn đề, kiểm tra:
1. Console logs trong browser (F12)
2. Execution logs trong Google Apps Script editor
3. File README.md để biết thêm chi tiết
