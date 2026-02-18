# Hướng Dẫn Triển Khai Lên Vercel

## Yêu Cầu Trước Khi Triển Khai

1. Tài khoản Vercel (đăng ký miễn phí tại [vercel.com](https://vercel.com))
2. Google Cloud Project với OAuth 2.0 credentials
3. Google Apps Script đã được deploy
4. Repository GitHub/GitLab/Bitbucket (khuyến nghị)

## Bước 1: Chuẩn Bị Google OAuth 2.0

### 1.1 Tạo OAuth 2.0 Client ID

1. Truy cập [Google Cloud Console](https://console.cloud.google.com)
2. Chọn hoặc tạo project mới
3. Vào **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Chọn **Web application**
6. Thêm **Authorized JavaScript origins**:
   - `http://localhost:3000` (cho development)
   - `https://your-app-name.vercel.app` (cho production)
7. Thêm **Authorized redirect URIs**:
   - `http://localhost:3000` (cho development)
   - `https://your-app-name.vercel.app` (cho production)
8. Lưu lại **Client ID**

### 1.2 Kích Hoạt APIs

Trong Google Cloud Console, kích hoạt các APIs sau:
- Google Sheets API
- Google Drive API

## Bước 2: Deploy Google Apps Script

### 2.1 Tạo Script Project

1. Truy cập [Google Apps Script](https://script.google.com)
2. Tạo project mới
3. Copy nội dung từ `gas/Code.gs` vào editor
4. Lưu project với tên "Shopping Expense Tracker Backend"

### 2.2 Cấu Hình Script Properties

1. Trong Apps Script editor, vào **Project Settings**
2. Scroll xuống **Script Properties**
3. Thêm các properties sau:
   - `DRIVE_FOLDER_ID`: ID của folder Google Drive để lưu PDF
   - `SPREADSHEET_ID`: (Optional) ID của Google Sheets để lưu báo cáo

**Cách lấy DRIVE_FOLDER_ID**:
- Tạo folder trong Google Drive
- Mở folder, URL sẽ có dạng: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
- Copy phần `FOLDER_ID_HERE`

### 2.3 Deploy Script

1. Click **Deploy** > **New deployment**
2. Chọn type: **Web app**
3. Cấu hình:
   - **Description**: "Production deployment"
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. Copy **Web app URL** (dạng: `https://script.google.com/macros/s/SCRIPT_ID/exec`)
6. Authorize ứng dụng khi được yêu cầu

## Bước 3: Triển Khai Lên Vercel

### 3.1 Import Project

**Cách 1: Từ Git Repository (Khuyến nghị)**

1. Push code lên GitHub/GitLab/Bitbucket
2. Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **Add New** > **Project**
4. Import repository của bạn
5. Vercel sẽ tự động detect Next.js framework

**Cách 2: Deploy Trực Tiếp**

1. Cài đặt Vercel CLI: `npm i -g vercel`
2. Trong thư mục project, chạy: `vercel`
3. Làm theo hướng dẫn để link project

### 3.2 Cấu Hình Environment Variables

Trong Vercel Dashboard:

1. Vào project settings
2. Chọn tab **Environment Variables**
3. Thêm các biến sau:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Your Google OAuth Client ID | Production, Preview, Development |
| `NEXT_PUBLIC_GAS_WEB_APP_URL` | Your Google Apps Script Web App URL | Production, Preview, Development |

**Lưu ý**: 
- Các biến có prefix `NEXT_PUBLIC_` sẽ được expose ra client-side
- Đảm bảo không commit các giá trị thực vào Git

### 3.3 Cấu Hình Build Settings

Vercel sẽ tự động detect Next.js, nhưng bạn có thể verify:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

Các settings này đã được cấu hình trong `vercel.json`.

### 3.4 Deploy

1. Click **Deploy**
2. Vercel sẽ build và deploy ứng dụng
3. Sau khi hoàn tất, bạn sẽ nhận được URL production

## Bước 4: Cập Nhật OAuth Redirect URIs

Sau khi có URL production từ Vercel:

1. Quay lại [Google Cloud Console](https://console.cloud.google.com)
2. Vào **APIs & Services** > **Credentials**
3. Chọn OAuth 2.0 Client ID đã tạo
4. Thêm production URL vào:
   - **Authorized JavaScript origins**: `https://your-app-name.vercel.app`
   - **Authorized redirect URIs**: `https://your-app-name.vercel.app`
5. Lưu thay đổi

## Bước 5: Kiểm Tra Deployment

### 5.1 Checklist Kiểm Tra

- [ ] Ứng dụng load thành công tại URL production
- [ ] Nút "Đăng nhập với Google" hoạt động
- [ ] Có thể thêm, sửa, xóa món hàng
- [ ] Tổng chi phí tính đúng
- [ ] Có thể lưu báo cáo lên Google Sheets
- [ ] PDF được tạo và lưu vào Google Drive (nếu bật)
- [ ] Tất cả text hiển thị bằng tiếng Việt
- [ ] Số tiền format đúng (1.000.000 ₫)
- [ ] Ngày giờ format đúng (dd/mm/yyyy)

### 5.2 Kiểm Tra Console

Mở Developer Console (F12) và kiểm tra:
- Không có errors trong Console tab
- Network requests thành công (status 200)
- Local Storage hoạt động đúng

## Troubleshooting

### Lỗi: "Redirect URI mismatch"

**Nguyên nhân**: OAuth redirect URI chưa được cấu hình đúng

**Giải pháp**:
1. Kiểm tra URL trong Google Cloud Console
2. Đảm bảo URL khớp chính xác (không có trailing slash)
3. Đợi vài phút để Google cập nhật

### Lỗi: "Failed to fetch" khi lưu

**Nguyên nhân**: Google Apps Script URL không đúng hoặc script chưa deploy

**Giải pháp**:
1. Verify `NEXT_PUBLIC_GAS_WEB_APP_URL` trong Vercel
2. Kiểm tra Google Apps Script đã deploy với "Anyone" access
3. Test script URL trực tiếp trong browser

### Lỗi: Build failed trên Vercel

**Nguyên nhân**: Dependencies hoặc TypeScript errors

**Giải pháp**:
1. Chạy `npm run build` locally để kiểm tra
2. Fix tất cả TypeScript errors
3. Đảm bảo tất cả dependencies trong `package.json`
4. Redeploy

### Lỗi: Environment variables không hoạt động

**Nguyên nhân**: Biến môi trường chưa được set hoặc không có prefix `NEXT_PUBLIC_`

**Giải pháp**:
1. Verify biến trong Vercel Dashboard
2. Đảm bảo có prefix `NEXT_PUBLIC_` cho client-side variables
3. Redeploy sau khi thêm biến mới

## Continuous Deployment

### Tự Động Deploy Từ Git

Khi connect với Git repository, Vercel sẽ tự động:
- Deploy mỗi khi push lên branch `main` (production)
- Tạo preview deployment cho mỗi pull request
- Chạy build checks trước khi merge

### Preview Deployments

Mỗi pull request sẽ có preview URL riêng:
- Test changes trước khi merge
- Share với team để review
- Tự động xóa sau khi merge

## Monitoring và Logs

### Xem Logs

1. Vào Vercel Dashboard
2. Chọn project
3. Tab **Deployments** > chọn deployment
4. Tab **Logs** để xem build và runtime logs

### Analytics

Vercel cung cấp analytics miễn phí:
- Page views
- Top pages
- Visitors
- Performance metrics

Vào tab **Analytics** trong project dashboard.

## Bảo Mật

### Best Practices

1. **Không commit secrets**: Không bao giờ commit `.env.local` vào Git
2. **Sử dụng Environment Variables**: Lưu tất cả secrets trong Vercel
3. **HTTPS Only**: Vercel tự động enforce HTTPS
4. **OAuth Scopes**: Chỉ request quyền cần thiết
5. **Regular Updates**: Cập nhật dependencies thường xuyên

### Rotate Credentials

Nếu credentials bị lộ:
1. Tạo OAuth Client ID mới trong Google Cloud
2. Deploy Google Apps Script mới
3. Cập nhật Environment Variables trong Vercel
4. Redeploy

## Custom Domain (Optional)

### Thêm Domain Riêng

1. Trong Vercel Dashboard, vào project settings
2. Tab **Domains**
3. Click **Add Domain**
4. Nhập domain của bạn (vd: `shopping.yourdomain.com`)
5. Cấu hình DNS records theo hướng dẫn
6. Vercel tự động cấp SSL certificate

### Cập Nhật OAuth

Sau khi thêm custom domain:
1. Thêm domain vào Google Cloud Console OAuth settings
2. Cập nhật Authorized JavaScript origins và redirect URIs

## Rollback

Nếu deployment mới có vấn đề:

1. Vào **Deployments** tab
2. Tìm deployment trước đó hoạt động tốt
3. Click **...** > **Promote to Production**
4. Deployment cũ sẽ được restore ngay lập tức

## Chi Phí

### Vercel Free Tier

- Unlimited deployments
- 100 GB bandwidth/month
- Automatic HTTPS
- Preview deployments
- Analytics

Đủ cho hầu hết personal projects và small teams.

### Nâng Cấp

Nếu cần:
- Nhiều bandwidth hơn
- Team collaboration features
- Advanced analytics
- Priority support

Xem [Vercel Pricing](https://vercel.com/pricing) để biết thêm chi tiết.

## Hỗ Trợ

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Google Apps Script Docs**: https://developers.google.com/apps-script

## Tóm Tắt Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Deploy to Vercel (nếu dùng CLI)
vercel

# Deploy to production
vercel --prod
```

## Checklist Hoàn Chỉnh

- [ ] Google OAuth 2.0 Client ID đã tạo
- [ ] Google Sheets API và Drive API đã kích hoạt
- [ ] Google Apps Script đã deploy
- [ ] Script Properties đã cấu hình (DRIVE_FOLDER_ID)
- [ ] Code đã push lên Git repository
- [ ] Project đã import vào Vercel
- [ ] Environment variables đã set trong Vercel
- [ ] Build settings đã verify
- [ ] Deployment thành công
- [ ] OAuth redirect URIs đã cập nhật với production URL
- [ ] Ứng dụng hoạt động đầy đủ chức năng
- [ ] Tests đã pass
- [ ] Documentation đã cập nhật

Chúc mừng! Ứng dụng của bạn đã sẵn sàng trên production! 🎉
