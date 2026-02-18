import { ShoppingItem, ShoppingSession, ErrorType, AppError } from '@/types';

/**
 * StorageService - Quản lý Local Storage cho ứng dụng
 * Requirements: 8.1, 8.2, 8.3
 */

// Storage keys
const STORAGE_KEYS = {
  ITEMS: 'shopping_items',
  SESSION_TIME: 'shopping_session_time',
} as const;

/**
 * Kiểm tra xem Local Storage có khả dụng không
 */
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Tạo AppError cho lỗi storage
 */
function createStorageError(message: string, details?: string): AppError {
  return {
    type: ErrorType.STORAGE_ERROR,
    message,
    details,
    retryable: false,
  };
}

/**
 * StorageService - Các phương thức quản lý Local Storage
 */
export const StorageService = {
  /**
   * Lưu danh sách món hàng vào Local Storage
   * Requirements: 8.1
   * 
   * @param items - Danh sách món hàng cần lưu
   * @throws {AppError} Nếu Local Storage không khả dụng hoặc đầy
   */
  saveItems(items: ShoppingItem[]): void {
    if (!isLocalStorageAvailable()) {
      throw createStorageError(
        'Chế độ riêng tư: Dữ liệu sẽ không được lưu tạm',
        'Local Storage is not available'
      );
    }

    try {
      const session: ShoppingSession = {
        items,
        startTime: this.getSessionTime() || new Date().toISOString(),
        lastModified: new Date().toISOString(),
      };

      const serialized = JSON.stringify(session);
      localStorage.setItem(STORAGE_KEYS.ITEMS, serialized);
    } catch (error) {
      // Xử lý QuotaExceededError
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        throw createStorageError(
          'Bộ nhớ trình duyệt đã đầy. Vui lòng xóa dữ liệu cũ',
          'QuotaExceededError: Local Storage is full'
        );
      }

      throw createStorageError(
        'Không thể lưu dữ liệu',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  },

  /**
   * Đọc danh sách món hàng từ Local Storage
   * Requirements: 8.2
   * 
   * @returns Danh sách món hàng, hoặc mảng rỗng nếu không có dữ liệu
   */
  getItems(): ShoppingItem[] {
    if (!isLocalStorageAvailable()) {
      return [];
    }

    try {
      const serialized = localStorage.getItem(STORAGE_KEYS.ITEMS);
      
      if (!serialized) {
        return [];
      }

      const session: ShoppingSession = JSON.parse(serialized);
      
      // Validate dữ liệu
      if (!session.items || !Array.isArray(session.items)) {
        console.warn('Invalid session data, clearing storage');
        this.clearItems();
        return [];
      }

      return session.items;
    } catch (error) {
      // Xử lý JSON parse errors
      console.error('Failed to parse storage data:', error);
      
      // Xóa dữ liệu corrupt
      this.clearItems();
      
      throw createStorageError(
        'Dữ liệu cũ không hợp lệ. Đã xóa và bắt đầu mới',
        error instanceof Error ? error.message : 'JSON parse error'
      );
    }
  },

  /**
   * Xóa tất cả dữ liệu món hàng khỏi Local Storage
   * Requirements: 8.3
   */
  clearItems(): void {
    if (!isLocalStorageAvailable()) {
      return;
    }

    try {
      localStorage.removeItem(STORAGE_KEYS.ITEMS);
      localStorage.removeItem(STORAGE_KEYS.SESSION_TIME);
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw createStorageError(
        'Không thể xóa dữ liệu',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  },

  /**
   * Lưu thời gian bắt đầu phiên mua sắm
   * Requirements: 8.1
   * 
   * @param time - Thời gian ISO 8601
   */
  saveSessionTime(time: string): void {
    if (!isLocalStorageAvailable()) {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEYS.SESSION_TIME, time);
    } catch (error) {
      console.error('Failed to save session time:', error);
      // Không throw error vì đây không phải chức năng quan trọng
    }
  },

  /**
   * Lấy thời gian bắt đầu phiên mua sắm
   * Requirements: 8.2
   * 
   * @returns Thời gian ISO 8601, hoặc null nếu không có
   */
  getSessionTime(): string | null {
    if (!isLocalStorageAvailable()) {
      return null;
    }

    try {
      return localStorage.getItem(STORAGE_KEYS.SESSION_TIME);
    } catch (error) {
      console.error('Failed to get session time:', error);
      return null;
    }
  },
};
