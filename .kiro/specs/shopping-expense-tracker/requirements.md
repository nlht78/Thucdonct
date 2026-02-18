# Tài Liệu Yêu Cầu - Web App Quản Lý Chi Tiêu Mua Sắm

## Giới Thiệu

Web app quản lý chi tiêu mua sắm là một ứng dụng web đơn giản giúp người dùng ghi chú các món hàng đã mua (đặc biệt khi đi chợ), tính toán tổng chi phí, và xuất báo cáo chi tiết dưới dạng Google Sheets hoặc PDF lưu trữ trên Google Drive. Ứng dụng được thiết kế để dễ sử dụng, có thể deploy nhanh chóng lên Vercel, và hoàn toàn sử dụng tiếng Việt.

## Thuật Ngữ

- **Hệ_Thống**: Web app quản lý chi tiêu mua sắm
- **Người_Dùng**: Người sử dụng ứng dụng để ghi chép chi tiêu
- **Món_Hàng**: Một mặt hàng được mua với tên và giá
- **Phiên_Mua_Sắm**: Một lần đi mua sắm bao gồm nhiều món hàng
- **Báo_Cáo**: Tài liệu tổng hợp chi tiết các món hàng đã mua
- **Google_Apps_Script**: Dịch vụ của Google để tương tác với Google Sheets và Drive
- **Google_Drive**: Dịch vụ lưu trữ đám mây của Google
- **Google_Sheets**: Ứng dụng bảng tính trực tuyến của Google

## Yêu Cầu

### Yêu Cầu 1: Nhập Thông Tin Món Hàng

**User Story:** Là người dùng, tôi muốn nhập nhiều món hàng cùng giá của chúng, để tôi có thể ghi chép đầy đủ các mặt hàng đã mua trong một lần đi chợ.

#### Tiêu Chí Chấp Nhận

1. WHEN Người_Dùng nhập tên món hàng và giá, THE Hệ_Thống SHALL thêm món hàng vào danh sách hiện tại
2. WHEN Người_Dùng nhập giá không hợp lệ (không phải số hoặc số âm), THE Hệ_Thống SHALL hiển thị thông báo lỗi và không thêm món hàng
3. WHEN Người_Dùng nhập tên món hàng trống, THE Hệ_Thống SHALL hiển thị thông báo lỗi và không thêm món hàng
4. THE Hệ_Thống SHALL hiển thị danh sách tất cả các món hàng đã nhập với tên và giá
5. THE Hệ_Thống SHALL tự động tính và hiển thị tổng chi phí của tất cả các món hàng

### Yêu Cầu 2: Chỉnh Sửa và Xóa Món Hàng

**User Story:** Là người dùng, tôi muốn chỉnh sửa hoặc xóa món hàng đã nhập, để tôi có thể sửa lỗi hoặc loại bỏ các mục không chính xác.

#### Tiêu Chí Chấp Nhận

1. WHEN Người_Dùng chọn xóa một món hàng, THE Hệ_Thống SHALL loại bỏ món hàng khỏi danh sách và cập nhật tổng chi phí
2. WHEN Người_Dùng chỉnh sửa thông tin món hàng, THE Hệ_Thống SHALL cập nhật thông tin và tính lại tổng chi phí
3. WHEN danh sách món hàng thay đổi, THE Hệ_Thống SHALL cập nhật giao diện ngay lập tức

### Yêu Cầu 3: Xuất Báo Cáo Lên Google Sheets

**User Story:** Là người dùng, tôi muốn lưu danh sách mua sắm lên Google Sheets, để tôi có thể lưu trữ và xem lại các lần mua sắm trước đó.

#### Tiêu Chí Chấp Nhận

1. WHEN Người_Dùng nhấn nút lưu, THE Hệ_Thống SHALL gửi dữ liệu đến Google_Apps_Script
2. WHEN Google_Apps_Script nhận được dữ liệu, THE Google_Apps_Script SHALL tạo hoặc cập nhật Google_Sheets với cấu trúc báo cáo chi tiết
3. THE Báo_Cáo SHALL bao gồm ngày giờ, danh sách món hàng (tên và giá), và tổng chi phí
4. WHEN việc lưu thành công, THE Hệ_Thống SHALL hiển thị thông báo xác nhận cho Người_Dùng
5. WHEN việc lưu thất bại, THE Hệ_Thống SHALL hiển thị thông báo lỗi rõ ràng

### Yêu Cầu 4: Xuất PDF và Lưu Vào Google Drive

**User Story:** Là người dùng, tôi muốn tự động xuất báo cáo dưới dạng PDF và lưu vào thư mục Google Drive, để tôi có thể dễ dàng in hoặc chia sẻ báo cáo.

#### Tiêu Chí Chấp Nhận

1. WHERE tính năng xuất PDF được kích hoạt, WHEN Người_Dùng lưu dữ liệu, THE Google_Apps_Script SHALL tạo file PDF từ dữ liệu báo cáo
2. WHERE tính năng lưu Drive được cấu hình, THE Google_Apps_Script SHALL lưu file PDF vào thư mục Google_Drive đã chỉ định
3. THE Báo_Cáo PDF SHALL có định dạng dễ đọc và có thể in ngay
4. THE Báo_Cáo PDF SHALL bao gồm tiêu đề, ngày giờ, bảng chi tiết món hàng, và tổng chi phí
5. WHEN file PDF được tạo thành công, THE Hệ_Thống SHALL trả về link hoặc thông báo xác nhận

### Yêu Cầu 5: Giao Diện Người Dùng Tiếng Việt

**User Story:** Là người dùng Việt Nam, tôi muốn giao diện hoàn toàn bằng tiếng Việt, để tôi có thể sử dụng ứng dụng một cách tự nhiên và dễ hiểu.

#### Tiêu Chí Chấp Nhận

1. THE Hệ_Thống SHALL hiển thị tất cả nhãn, nút bấm, và thông báo bằng tiếng Việt
2. THE Hệ_Thống SHALL hiển thị số tiền theo định dạng Việt Nam (dấu phẩy ngăn cách hàng nghìn)
3. THE Hệ_Thống SHALL hiển thị ngày giờ theo định dạng Việt Nam (dd/mm/yyyy)
4. THE Hệ_Thống SHALL sử dụng font chữ hỗ trợ tốt tiếng Việt có dấu

### Yêu Cầu 6: Triển Khai Lên Vercel

**User Story:** Là người phát triển, tôi muốn ứng dụng có thể deploy dễ dàng lên Vercel, để tôi có thể đưa ứng dụng lên production nhanh chóng.

#### Tiêu Chí Chấp Nhận

1. THE Hệ_Thống SHALL được xây dựng với cấu trúc tương thích với Vercel
2. THE Hệ_Thống SHALL bao gồm các file cấu hình cần thiết cho Vercel deployment
3. WHEN deploy lên Vercel, THE Hệ_Thống SHALL hoạt động đầy đủ chức năng mà không cần cấu hình thêm
4. THE Hệ_Thống SHALL sử dụng biến môi trường cho các thông tin nhạy cảm (API keys, folder IDs)

### Yêu Cầu 7: Xác Thực và Bảo Mật

**User Story:** Là người dùng, tôi muốn dữ liệu của tôi được bảo mật, để chỉ tôi mới có thể truy cập và lưu trữ thông tin mua sắm của mình.

#### Tiêu Chí Chấp Nhận

1. WHEN Người_Dùng truy cập ứng dụng lần đầu, THE Hệ_Thống SHALL yêu cầu xác thực với Google Account
2. THE Hệ_Thống SHALL chỉ cho phép truy cập Google_Sheets và Google_Drive của Người_Dùng đã xác thực
3. THE Hệ_Thống SHALL sử dụng OAuth 2.0 để xác thực an toàn
4. WHEN phiên làm việc hết hạn, THE Hệ_Thống SHALL yêu cầu Người_Dùng đăng nhập lại

### Yêu Cầu 8: Lưu Trữ Tạm Thời

**User Story:** Là người dùng, tôi muốn dữ liệu nhập vào được lưu tạm thời trên trình duyệt, để tôi không mất dữ liệu nếu vô tình tắt trang hoặc reload.

#### Tiêu Chí Chấp Nhận

1. WHEN Người_Dùng nhập món hàng, THE Hệ_Thống SHALL tự động lưu vào Local_Storage
2. WHEN Người_Dùng mở lại ứng dụng, THE Hệ_Thống SHALL khôi phục dữ liệu từ Local_Storage
3. WHEN Người_Dùng lưu thành công lên Google_Sheets, THE Hệ_Thống SHALL xóa dữ liệu tạm trong Local_Storage
4. WHERE Người_Dùng muốn bắt đầu phiên mua sắm mới, THE Hệ_Thống SHALL cung cấp nút xóa toàn bộ dữ liệu hiện tại
