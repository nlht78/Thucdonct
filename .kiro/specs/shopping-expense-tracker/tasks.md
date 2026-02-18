# Kế Hoạch Triển Khai: Web App Quản Lý Chi Tiêu Mua Sắm

## Tổng Quan

Triển khai ứng dụng web quản lý chi tiêu mua sắm bằng Next.js 14+ với TypeScript, tích hợp Google Apps Script để lưu trữ báo cáo lên Google Sheets và Google Drive. Ứng dụng sử dụng Local Storage để lưu trữ tạm thời và Google OAuth 2.0 để xác thực.

## Tasks

- [x] 1. Thiết lập cấu trúc dự án và cấu hình cơ bản
  - Khởi tạo Next.js 14+ project với TypeScript và App Router
  - Cài đặt và cấu hình Tailwind CSS
  - Cài đặt các dependencies: fast-check, jest, @testing-library/react, msw
  - Tạo cấu trúc thư mục: app/, lib/, types/, __tests__/
  - Thiết lập file .env.local với biến môi trường
  - Cấu hình Jest và React Testing Library
  - _Requirements: 6.1, 6.2_

- [x] 2. Định nghĩa TypeScript types và interfaces
  - Tạo file types/index.ts với các interfaces: ShoppingItem, ShoppingSession, SaveReportRequest, SaveReportResponse
  - Định nghĩa validation error types
  - Định nghĩa auth state types
  - _Requirements: 1.1, 3.1, 7.1_

- [ ] 3. Implement validation module
  - [x] 3.1 Tạo lib/validation.ts với ValidationService
    - Implement validateItemName(): kiểm tra tên không rỗng, không chỉ whitespace, tối đa 200 ký tự
    - Implement validatePrice(): kiểm tra giá là số dương, nhỏ hơn 1 tỷ
    - Implement validateItemList(): kiểm tra danh sách trước khi lưu
    - _Requirements: 1.2, 1.3_
  
  - [ ]* 3.2 Viết property test cho validation
    - **Property 2: Validation từ chối giá không hợp lệ**
    - **Validates: Requirements 1.2**
  
  - [ ]* 3.3 Viết property test cho validation tên
    - **Property 3: Validation từ chối tên rỗng**
    - **Validates: Requirements 1.3**
  
  - [ ]* 3.4 Viết unit tests cho validation edge cases
    - Test giá biên: 0, 999,999,999, 1,000,000,000
    - Test ký tự đặc biệt trong tên
    - Test độ dài tên: 1, 200, 201 ký tự
    - _Requirements: 1.2, 1.3_

- [ ] 4. Implement formatting utilities
  - [x] 4.1 Tạo lib/formatting.ts với các hàm format
    - Implement formatCurrency(): format số theo VN (1.000.000 ₫)
    - Implement formatDate(): format ngày theo dd/mm/yyyy
    - Implement formatDateTime(): format ngày giờ theo dd/mm/yyyy HH:MM
    - _Requirements: 5.2, 5.3_
  
  - [ ]* 4.2 Viết property test cho formatCurrency
    - **Property 10: Format số tiền theo chuẩn Việt Nam**
    - **Validates: Requirements 5.2**
  
  - [ ]* 4.3 Viết property test cho formatDate
    - **Property 11: Format ngày giờ theo chuẩn Việt Nam**
    - **Validates: Requirements 5.3**
  
  - [ ]* 4.4 Viết unit tests cho formatting edge cases
    - Test số đặc biệt: 0, 1, 999, 1000, 1000000
    - Test ngày đặc biệt: 01/01/2024, 31/12/2024, 29/02/2024
    - _Requirements: 5.2, 5.3_

- [ ] 5. Implement Local Storage module
  - [x] 5.1 Tạo lib/storage.ts với StorageService
    - Implement saveItems(): lưu danh sách món hàng vào Local Storage
    - Implement getItems(): đọc danh sách từ Local Storage
    - Implement clearItems(): xóa tất cả dữ liệu
    - Implement saveSessionTime() và getSessionTime()
    - Xử lý lỗi: QuotaExceededError, JSON parse errors, Local Storage disabled
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [ ]* 5.2 Viết property test cho Local Storage round-trip
    - **Property 13: Local Storage round-trip bảo toàn dữ liệu**
    - **Validates: Requirements 8.1, 8.2**
  
  - [ ]* 5.3 Viết unit tests cho Local Storage errors
    - Test Local Storage không available
    - Test dữ liệu corrupt
    - Test QuotaExceededError
    - _Requirements: 8.1, 8.2_

- [-] 6. Checkpoint - Kiểm tra các modules cơ bản
  - Đảm bảo tất cả tests pass, hỏi user nếu có thắc mắc

- [ ] 7. Implement item management logic
  - [x] 7.1 Tạo custom hook useShoppingItems
    - State management cho danh sách món hàng
    - Implement addItem(): thêm món hàng mới với UUID
    - Implement updateItem(): cập nhật thông tin món hàng
    - Implement deleteItem(): xóa món hàng
    - Implement clearAll(): xóa tất cả món hàng
    - Implement calculateTotal(): tính tổng chi phí
    - Tích hợp với StorageService để auto-save
    - _Requirements: 1.1, 1.4, 1.5, 2.1, 2.2, 8.1_
  
  - [ ]* 7.2 Viết property test cho addItem
    - **Property 1: Thêm món hàng hợp lệ làm tăng danh sách**
    - **Validates: Requirements 1.1, 1.4**
  
  - [ ]* 7.3 Viết property test cho calculateTotal
    - **Property 4: Tổng chi phí luôn bằng tổng của tất cả món hàng**
    - **Validates: Requirements 1.5, 2.1, 2.2**
  
  - [ ]* 7.4 Viết property test cho deleteItem
    - **Property 5: Xóa món hàng loại bỏ nó khỏi danh sách**
    - **Validates: Requirements 2.1**
  
  - [ ]* 7.5 Viết property test cho updateItem
    - **Property 6: Chỉnh sửa món hàng cập nhật thông tin**
    - **Validates: Requirements 2.2**
  
  - [ ]* 7.6 Viết property test cho clearAll
    - **Property 15: Xóa tất cả làm rỗng danh sách**
    - **Validates: Requirements 8.4**
  
  - [ ]* 7.7 Viết unit tests cho edge cases
    - Test thêm vào danh sách rỗng
    - Test xóa món hàng cuối cùng
    - Test update món hàng không tồn tại
    - _Requirements: 1.1, 2.1, 2.2_

- [ ] 8. Implement Google OAuth authentication
  - [x] 8.1 Tạo lib/googleAuth.ts với GoogleAuthService
    - Implement initialize(): khởi tạo Google OAuth client
    - Implement signIn(): xử lý đăng nhập
    - Implement signOut(): xử lý đăng xuất
    - Implement isAuthenticated(): kiểm tra trạng thái
    - Implement getAccessToken(): lấy token hiện tại
    - Xử lý token expiration và refresh
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [ ]* 8.2 Viết unit tests cho authentication flows
    - Test successful login
    - Test token expiration
    - Test permission denial
    - Test logout
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 9. Implement Google Apps Script client
  - [x] 9.1 Tạo lib/gasClient.ts với GASClient
    - Implement saveReport(): gửi request đến Google Apps Script
    - Xử lý timeout (30s)
    - Xử lý retry logic
    - Parse và validate response
    - Xử lý các error codes: 400, 401, 500
    - _Requirements: 3.1, 3.4, 3.5_
  
  - [ ]* 9.2 Viết property test cho request payload
    - **Property 8: Dữ liệu gửi đến API đầy đủ và đúng format**
    - **Validates: Requirements 3.1**
  
  - [ ]* 9.3 Viết unit tests cho API client
    - Test với mock successful response
    - Test với mock error responses
    - Test timeout handling
    - Test retry logic
    - _Requirements: 3.1, 3.4, 3.5_

- [ ] 10. Implement UI components - ItemForm
  - [x] 10.1 Tạo app/components/ItemForm.tsx
    - Form với inputs: tên món hàng, giá
    - Tích hợp ValidationService
    - Hiển thị lỗi validation bằng tiếng Việt
    - Hỗ trợ Enter để submit
    - Reset form sau khi thêm thành công
    - Styling với Tailwind CSS
    - _Requirements: 1.1, 1.2, 1.3, 5.1_
  
  - [ ]* 10.2 Viết unit tests cho ItemForm
    - Test submit với Enter key
    - Test validation errors display
    - Test form reset
    - _Requirements: 1.1, 1.2, 1.3_

- [ ] 11. Implement UI components - ItemList
  - [x] 11.1 Tạo app/components/ItemList.tsx
    - Bảng hiển thị: STT, Tên món hàng, Giá, Hành động
    - Inline editing cho tên và giá
    - Nút xóa với confirmation
    - Format giá theo VN
    - Responsive design cho mobile
    - Empty state khi không có món hàng
    - _Requirements: 1.4, 2.1, 2.2, 5.1, 5.2_
  
  - [ ]* 11.2 Viết unit tests cho ItemList
    - Test render empty state
    - Test render với nhiều items
    - Test inline editing
    - Test delete confirmation
    - _Requirements: 1.4, 2.1, 2.2_

- [ ] 12. Implement UI components - Summary
  - [x] 12.1 Tạo app/components/Summary.tsx
    - Hiển thị số lượng món hàng
    - Hiển thị tổng chi phí với format VN
    - Highlight tổng chi phí
    - Styling với Tailwind CSS
    - _Requirements: 1.5, 5.1, 5.2_
  
  - [ ]* 12.2 Viết unit tests cho Summary
    - Test hiển thị đúng tổng
    - Test hiển thị số lượng items
    - Test format currency
    - _Requirements: 1.5, 5.2_

- [ ] 13. Implement UI components - AuthButton
  - [x] 13.1 Tạo app/components/AuthButton.tsx
    - Hiển thị "Đăng nhập với Google" khi chưa auth
    - Hiển thị email và "Đăng xuất" khi đã auth
    - Tích hợp GoogleAuthService
    - Xử lý loading states
    - Styling với Tailwind CSS
    - _Requirements: 7.1, 7.4, 5.1_
  
  - [ ]* 13.2 Viết unit tests cho AuthButton
    - Test authenticated state
    - Test unauthenticated state
    - Test login flow
    - Test logout flow
    - _Requirements: 7.1, 7.4_

- [ ] 14. Implement UI components - SaveButton
  - [x] 14.1 Tạo app/components/SaveButton.tsx
    - Nút "Lưu báo cáo"
    - Disable khi danh sách rỗng hoặc chưa auth
    - Loading spinner khi đang lưu
    - Tích hợp GASClient
    - Hiển thị toast notification (success/error)
    - Xóa Local Storage sau khi lưu thành công
    - _Requirements: 3.1, 3.4, 3.5, 8.3, 5.1_
  
  - [ ]* 14.2 Viết property test cho Local Storage clearing
    - **Property 14: Lưu thành công xóa Local Storage**
    - **Validates: Requirements 8.3**
  
  - [ ]* 14.3 Viết unit tests cho SaveButton
    - Test disabled states
    - Test loading state
    - Test success flow
    - Test error handling
    - _Requirements: 3.1, 3.4, 3.5_

- [~] 15. Checkpoint - Kiểm tra tất cả components
  - Đảm bảo tất cả tests pass, hỏi user nếu có thắc mắc

- [ ] 16. Implement main page
  - [x] 16.1 Tạo app/page.tsx
    - Layout chính của ứng dụng
    - Tích hợp tất cả components: AuthButton, ItemForm, ItemList, Summary, SaveButton
    - Sử dụng useShoppingItems hook
    - Khôi phục dữ liệu từ Local Storage khi mount
    - Responsive layout
    - _Requirements: 1.1, 1.4, 1.5, 2.1, 2.2, 2.3, 8.2, 5.1_
  
  - [ ]* 16.2 Viết property test cho UI re-render
    - **Property 7: Thay đổi state kích hoạt re-render UI**
    - **Validates: Requirements 2.3**
  
  - [ ]* 16.3 Viết property test cho text tiếng Việt
    - **Property 12: Tất cả text UI sử dụng tiếng Việt**
    - **Validates: Requirements 5.1**

- [ ] 17. Tạo root layout và metadata
  - [x] 17.1 Cập nhật app/layout.tsx
    - Thiết lập font hỗ trợ tiếng Việt
    - Metadata: title, description bằng tiếng Việt
    - Global styles
    - _Requirements: 5.1, 5.4_

- [ ] 18. Implement Google Apps Script
  - [x] 18.1 Tạo file Code.gs cho Google Apps Script
    - Implement doPost(): nhận POST request từ frontend
    - Implement createReport(): tạo báo cáo trên Google Sheets
    - Implement exportToPDF(): xuất PDF và lưu vào Drive
    - Implement formatCurrency(): format số tiền theo VN
    - Validate access token
    - Xử lý errors và trả về JSON response
    - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 4.4, 7.2_
  
  - [ ]* 18.2 Viết property test cho báo cáo
    - **Property 9: Báo cáo chứa đầy đủ thông tin bắt buộc**
    - **Validates: Requirements 3.3, 4.4**
  
  - [ ]* 18.3 Viết property test cho PDF export
    - **Property 17: PDF được tạo khi flag exportPDF = true**
    - **Validates: Requirements 4.1, 4.2**

- [ ] 19. Cấu hình deployment
  - [x] 19.1 Thiết lập Vercel deployment
    - Tạo vercel.json nếu cần
    - Cấu hình environment variables trên Vercel dashboard
    - Thiết lập build settings
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [x] 19.2 Deploy Google Apps Script
    - Deploy GAS as Web App
    - Cấu hình Script Properties: DRIVE_FOLDER_ID, SPREADSHEET_ID
    - Thiết lập permissions
    - Lấy Web App URL
    - _Requirements: 3.1, 4.2, 6.4_
  
  - [x] 19.3 Tạo file README.md
    - Hướng dẫn cài đặt và chạy local
    - Hướng dẫn deploy lên Vercel
    - Hướng dẫn cấu hình Google Apps Script
    - Hướng dẫn thiết lập OAuth credentials
    - _Requirements: 6.1, 6.2, 6.3_

- [ ]* 20. Integration tests
  - [ ]* 20.1 Viết integration test cho luồng hoàn chỉnh
    - Test: thêm items → lưu → xóa Local Storage
    - Test: login → save → logout
    - _Requirements: 1.1, 3.1, 7.1, 8.3_
  
  - [ ]* 20.2 Viết integration test cho error recovery
    - Test: network error → retry → success
    - Test: token expiration → re-auth → success
    - _Requirements: 3.5, 7.4_
  
  - [ ]* 20.3 Viết property test cho authentication
    - **Property 16: Chỉ user đã xác thực mới gọi được API**
    - **Validates: Requirements 7.2**

- [~] 21. Checkpoint cuối - Kiểm tra toàn bộ hệ thống
  - Đảm bảo tất cả tests pass
  - Kiểm tra coverage >= 90%
  - Kiểm tra tất cả 17 properties đã có tests
  - Hỏi user nếu có thắc mắc

## Ghi Chú

- Tasks đánh dấu `*` là optional và có thể bỏ qua để có MVP nhanh hơn
- Mỗi task tham chiếu đến requirements cụ thể để dễ truy vết
- Các checkpoint đảm bảo validation từng bước
- Property tests validate tính đúng đắn tổng quát với 100+ iterations
- Unit tests validate các trường hợp cụ thể và edge cases
- Tất cả UI text phải bằng tiếng Việt
- Sử dụng TypeScript cho type safety
- Tất cả property tests phải có comment tag: **Feature: shopping-expense-tracker, Property {number}: {property_text}**
