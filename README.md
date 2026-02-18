# Shopping Expense Tracker

Ứng dụng quản lý chi tiêu mua sắm với tích hợp Google Sheets.

## Tính Năng

- ✅ Nhập tên người dùng và bắt đầu sử dụng (không cần đăng nhập)
- ✅ Thêm/xóa món hàng đã mua
- ✅ Tính tổng chi phí tự động
- ✅ Lưu báo cáo vào localStorage
- ✅ Tự động tạo báo cáo Google Sheets
- ✅ Xem lịch sử các báo cáo đã lưu

## Cài Đặt

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd <your-repo-name>
npm install
```

### 2. Cấu Hình Environment Variables

Copy file `.env.example` thành `.env.local`:

```bash
cp .env.example .env.local
```

Cập nhật các giá trị trong `.env.local`:

```env
NEXT_PUBLIC_GAS_WEB_APP_URL=your_google_apps_script_url
NEXT_PUBLIC_GAS_API_KEY=your_api_key
```

### 3. Cấu Hình Google Apps Script

Xem hướng dẫn chi tiết trong file `SETUP_GUIDE.md`

### 4. Chạy Development Server

```bash
npm run dev
```

Mở http://localhost:3000

## Deploy Lên Vercel

### 1. Push Code Lên GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Import Vào Vercel

1. Truy cập https://vercel.com/dashboard
2. Click "Add New" > "Project"
3. Import repository của bạn
4. Thêm Environment Variables:
   - `NEXT_PUBLIC_GAS_WEB_APP_URL`
   - `NEXT_PUBLIC_GAS_API_KEY`
5. Click "Deploy"

## Cấu Trúc Project

```
├── app/
│   ├── api/save-report/     # API route để gọi Google Apps Script
│   ├── components/          # React components
│   └── page.tsx            # Main page
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
├── types/                   # TypeScript types
├── gas/                     # Google Apps Script code
└── __tests__/              # Unit tests
```

## Bảo Mật

- ✅ `.env.local` đã được thêm vào `.gitignore`
- ✅ API key được lưu trong environment variables
- ✅ Google Apps Script sử dụng API key authentication
- ⚠️ **QUAN TRỌNG**: Không commit file `.env.local` lên Git

## Hỗ Trợ

Xem thêm:
- `SETUP_GUIDE.md` - Hướng dẫn cài đặt chi tiết
- `GAS_DEPLOYMENT_GUIDE.md` - Hướng dẫn deploy Google Apps Script
- `DEPLOYMENT.md` - Hướng dẫn deploy lên Vercel

## License

MIT
