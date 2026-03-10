# Hướng Dẫn Cấu Hình Báo Cáo Tổng Hợp

## Tổng Quan

Project hiện hỗ trợ 2 cách lưu báo cáo:

1. **Báo cáo riêng lẻ** (cũ): Tạo file Google Sheets mới cho mỗi báo cáo
2. **Báo cáo tổng hợp** (mới): Lưu tất cả báo cáo vào 1 file Google Sheets chung

## Bước 1: Chuẩn Bị File Google Sheets Tổng Hợp

Bạn đã tạo file tại: https://docs.google.com/spreadsheets/d/1iGFLo9XVFQrJ_AGaR9KH9d3Pr2rkKmEo/edit

### Cấu trúc cột (11 cột):

| STT | Ngày mua | Người mua | Buổi | Số lượng người | Giá tiền chi cho mỗi người | Tên hàng hóa | Thành tiền | Tổng tiền mua | Tiền dư/thiếu | Ghi chú |
|-----|----------|-----------|------|----------------|---------------------------|--------------|------------|---------------|---------------|---------|

## Bước 2: Cấu Hình Google Apps Script

### 2.1. Thêm Script Property

1. Mở Google Apps Script editor
2. Vào **Project Settings** (biểu tượng bánh răng)
3. Scroll xuống **Script Properties**
4. Thêm property mới:
   - **Property**: `CONSOLIDATED_SHEET_ID`
   - **Value**: `1iGFLo9XVFQrJ_AGaR9KH9d3Pr2rkKmEo`

### 2.2. Copy Code Mới

1. Copy toàn bộ nội dung file `gas/Code.gs`
2. Paste vào Google Apps Script editor (thay thế code cũ)
3. Save (Ctrl+S)

### 2.3. Redeploy

1. Nhấn **Deploy** → **Manage deployments**
2. Chọn deployment hiện tại → **Edit**
3. **Version**: Chọn **New version**
4. **Deploy**

## Bước 3: Cấu Hình Environment Variables

### 3.1. File .env.local

Thêm dòng sau vào file `.env.local`:

```env
NEXT_PUBLIC_CONSOLIDATED_SHEET_ID=1iGFLo9XVFQrJ_AGaR9KH9d3Pr2rkKmEo
```

### 3.2. Vercel (Production)

1. Vào Vercel Dashboard
2. Chọn project
3. Vào **Settings** → **Environment Variables**
4. Thêm biến mới:
   - **Name**: `NEXT_PUBLIC_CONSOLIDATED_SHEET_ID`
   - **Value**: `1iGFLo9XVFQrJ_AGaR9KH9d3Pr2rkKmEo`
5. Redeploy project

## Bước 4: Test

### 4.1. Test Local

```bash
npm run dev
```

1. Chọn chế độ **"Báo cáo tổng hợp"**
2. Điền thông tin:
   - Buổi: Sáng/Trưa/Chiều
   - Số lượng người: VD: 14
   - Giá/người: VD: 30000
3. Thêm món hàng
4. Nhấn "Lưu báo cáo"
5. Kiểm tra file Google Sheets xem có dòng mới không

### 4.2. Test Production

Sau khi deploy lên Vercel, test tương tự như local.

## Cách Hoạt Động

### Báo Cáo Riêng Lẻ (Cũ)
- Tạo file Google Sheets mới mỗi lần
- Có layout đẹp với bảng, borders
- Phù hợp để in hoặc gửi riêng lẻ

### Báo Cáo Tổng Hợp (Mới)
- Thêm 1 dòng vào file chung
- STT tự động tăng
- Tính toán:
  - **Tổng tiền mua**: Tổng giá các món hàng
  - **Tổng tiền (SL × Giá)**: Số người × Giá/người
  - **Tiền dư/thiếu**: Tổng tiền (SL × Giá) - Tổng tiền mua
    - Màu xanh: Dư tiền
    - Màu đỏ: Thiếu tiền
- **Tên hàng hóa**: Gộp tất cả món vào 1 ô
  - Format: `1. Cam (10.000 ₫), 2. Thịt bò (50.000 ₫), ...`

## Form Nhập Liệu

### Báo Cáo Tổng Hợp Có Thêm:

1. **Buổi**: Dropdown (Sáng/Trưa/Chiều)
2. **Số lượng người**: Input số
3. **Giá/người**: Input số tiền
4. **Hiển thị tổng dự kiến**: `14 người × 30.000 ₫ = 420.000 ₫`

### Không Cần:
- Dropdown "Loại báo cáo" (chỉ có ở chế độ cũ)

## Troubleshooting

### Lỗi: "CONSOLIDATED_SHEET_ID not configured"
- Kiểm tra Script Properties trong Google Apps Script
- Đảm bảo đã thêm `CONSOLIDATED_SHEET_ID`

### Lỗi: "Spreadsheet not found"
- Kiểm tra ID có đúng không
- Đảm bảo Google Apps Script có quyền truy cập file

### Dữ liệu không hiển thị
- Kiểm tra sheet đầu tiên trong file
- Kiểm tra console log trong browser (F12)

## Lưu Ý

- Cả 2 chế độ đều hoạt động độc lập
- Nếu báo cáo mới lỗi, vẫn có thể dùng báo cáo cũ
- Có thể chuyển đổi giữa 2 chế độ bất kỳ lúc nào
- Dữ liệu localStorage vẫn được lưu cho cả 2 chế độ
