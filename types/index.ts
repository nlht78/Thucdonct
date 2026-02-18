// ============================================================================
// Core Data Types
// ============================================================================

/**
 * Đại diện cho một món hàng trong danh sách mua sắm
 * Requirements: 1.1, 3.1
 */
export interface ShoppingItem {
  /** UUID v4 duy nhất */
  id: string;
  /** Tên món hàng (1-200 ký tự, không rỗng sau khi trim) */
  name: string;
  /** Giá (> 0, < 1,000,000,000) */
  price: number;
  /** Thời gian tạo (ISO 8601 timestamp) */
  createdAt: string;
}

/**
 * Đại diện cho một phiên mua sắm (lưu trong Local Storage)
 * Requirements: 8.1, 8.2
 */
export interface ShoppingSession {
  /** Danh sách món hàng */
  items: ShoppingItem[];
  /** Thời gian bắt đầu phiên (ISO 8601) */
  startTime: string;
  /** Thời gian chỉnh sửa cuối (ISO 8601) */
  lastModified: string;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

/**
 * Dữ liệu gửi đến Google Apps Script để lưu báo cáo
 * Requirements: 3.1
 */
export interface SaveReportRequest {
  /** Danh sách món hàng */
  items: ShoppingItem[];
  /** Thời gian tạo báo cáo (ISO 8601) */
  timestamp: string;
  /** Tổng chi phí */
  totalAmount: number;
  /** Có xuất PDF không */
  exportPDF: boolean;
}

/**
 * Response từ Google Apps Script sau khi lưu báo cáo
 * Requirements: 3.1, 3.4, 3.5
 */
export interface SaveReportResponse {
  /** Thành công hay không */
  success: boolean;
  /** URL của Google Sheet (nếu thành công) */
  sheetUrl?: string;
  /** URL của PDF (nếu exportPDF = true) */
  pdfUrl?: string;
  /** Thông báo lỗi (nếu thất bại) */
  error?: string;
}

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Kết quả validation cho tên món hàng
 * Requirements: 1.3
 */
export interface ValidationResult {
  /** Validation có thành công không */
  valid: boolean;
  /** Thông báo lỗi (nếu không hợp lệ) */
  error?: string;
}

/**
 * Kết quả validation cho giá với giá trị đã parse
 * Requirements: 1.2
 */
export interface PriceValidationResult extends ValidationResult {
  /** Giá trị số đã parse (nếu hợp lệ) */
  value?: number;
}

/**
 * Lỗi validation cho form nhập món hàng
 * Requirements: 1.2, 1.3
 */
export interface ItemFormErrors {
  /** Lỗi tên món hàng */
  name?: string;
  /** Lỗi giá */
  price?: string;
}

// ============================================================================
// Authentication Types
// ============================================================================

/**
 * Thông tin người dùng đã xác thực
 * Requirements: 7.1
 */
export interface AuthUser {
  /** Email của người dùng */
  email: string;
  /** Access token để gọi API */
  accessToken: string;
  /** Thời gian hết hạn token (ISO 8601) */
  expiresAt: string;
}

/**
 * Trạng thái xác thực
 * Requirements: 7.1, 7.4
 */
export interface AuthState {
  /** Đã xác thực hay chưa */
  isAuthenticated: boolean;
  /** Thông tin người dùng (nếu đã xác thực) */
  user: AuthUser | null;
  /** Đang trong quá trình xác thực */
  isLoading: boolean;
  /** Lỗi xác thực (nếu có) */
  error: string | null;
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Loại lỗi có thể xảy ra trong ứng dụng
 */
export enum ErrorType {
  /** Lỗi validation dữ liệu */
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  /** Lỗi xác thực */
  AUTH_ERROR = 'AUTH_ERROR',
  /** Lỗi kết nối mạng */
  NETWORK_ERROR = 'NETWORK_ERROR',
  /** Lỗi từ API */
  API_ERROR = 'API_ERROR',
  /** Lỗi Local Storage */
  STORAGE_ERROR = 'STORAGE_ERROR',
  /** Lỗi không xác định */
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Lỗi ứng dụng với thông tin chi tiết
 */
export interface AppError {
  /** Loại lỗi */
  type: ErrorType;
  /** Thông báo lỗi hiển thị cho người dùng (tiếng Việt) */
  message: string;
  /** Chi tiết lỗi kỹ thuật (cho logging) */
  details?: string;
  /** Có thể retry không */
  retryable: boolean;
}

// ============================================================================
// Component Props Types
// ============================================================================

/**
 * Props cho ItemForm component
 * Requirements: 1.1
 */
export interface ItemFormProps {
  /** Callback khi thêm món hàng thành công */
  onAddItem: (item: ShoppingItem) => void;
}

/**
 * Props cho ItemList component
 * Requirements: 1.4, 2.1, 2.2
 */
export interface ItemListProps {
  /** Danh sách món hàng */
  items: ShoppingItem[];
  /** Callback khi cập nhật món hàng */
  onUpdateItem: (id: string, item: Partial<ShoppingItem>) => void;
  /** Callback khi xóa món hàng */
  onDeleteItem: (id: string) => void;
}

/**
 * Props cho Summary component
 * Requirements: 1.5
 */
export interface SummaryProps {
  /** Danh sách món hàng để tính tổng */
  items: ShoppingItem[];
}

/**
 * Props cho SaveButton component
 * Requirements: 3.1, 3.4, 3.5
 */
export interface SaveButtonProps {
  /** Danh sách món hàng cần lưu */
  items: ShoppingItem[];
  /** Callback khi lưu thành công */
  onSaveSuccess: () => void;
  /** Callback khi lưu thất bại */
  onSaveError: (error: string) => void;
}

/**
 * Props cho AuthButton component
 * Requirements: 7.1, 7.4
 */
export interface AuthButtonProps {
  /** Callback khi đăng nhập thành công */
  onAuthSuccess?: (user: AuthUser) => void;
  /** Callback khi đăng xuất */
  onSignOut?: () => void;
}
