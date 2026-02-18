import type { ValidationResult, PriceValidationResult, ShoppingItem } from '@/types';

/**
 * ValidationService - Xử lý validation cho dữ liệu món hàng
 * Requirements: 1.2, 1.3
 */
export const ValidationService = {
  /**
   * Validate tên món hàng
   * Requirements: 1.3
   * 
   * Quy tắc:
   * - Không được rỗng sau khi trim
   * - Không được chỉ chứa khoảng trắng
   * - Tối đa 200 ký tự
   * 
   * @param name - Tên món hàng cần validate
   * @returns ValidationResult với valid = true nếu hợp lệ, hoặc error message nếu không hợp lệ
   */
  validateItemName(name: string): ValidationResult {
    // Kiểm tra null/undefined
    if (name === null || name === undefined) {
      return {
        valid: false,
        error: 'Vui lòng nhập tên món hàng',
      };
    }

    // Trim và kiểm tra rỗng
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      return {
        valid: false,
        error: 'Vui lòng nhập tên món hàng',
      };
    }

    // Kiểm tra độ dài tối đa
    if (trimmedName.length > 200) {
      return {
        valid: false,
        error: 'Tên món hàng không được vượt quá 200 ký tự',
      };
    }

    return { valid: true };
  },

  /**
   * Validate giá món hàng
   * Requirements: 1.2
   * 
   * Quy tắc:
   * - Phải là số
   * - Phải lớn hơn 0
   * - Phải nhỏ hơn 1 tỷ (1,000,000,000)
   * 
   * @param price - Giá cần validate (có thể là string từ input hoặc number)
   * @returns PriceValidationResult với valid = true và value nếu hợp lệ, hoặc error message nếu không hợp lệ
   */
  validatePrice(price: string | number): PriceValidationResult {
    // Kiểm tra null/undefined/empty string
    if (price === null || price === undefined || price === '') {
      return {
        valid: false,
        error: 'Vui lòng nhập giá',
      };
    }

    // Parse thành số
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;

    // Kiểm tra có phải số hợp lệ không
    if (isNaN(numPrice)) {
      return {
        valid: false,
        error: 'Giá phải là số',
      };
    }

    // Kiểm tra số dương
    if (numPrice <= 0) {
      return {
        valid: false,
        error: 'Giá phải là số dương',
      };
    }

    // Kiểm tra giới hạn trên (1 tỷ)
    if (numPrice >= 1000000000) {
      return {
        valid: false,
        error: 'Giá không được vượt quá 1 tỷ đồng',
      };
    }

    return {
      valid: true,
      value: numPrice,
    };
  },

  /**
   * Validate danh sách món hàng trước khi lưu
   * Requirements: 1.2, 1.3
   * 
   * Kiểm tra:
   * - Danh sách không rỗng
   * - Tất cả món hàng có tên và giá hợp lệ
   * - Tất cả món hàng có id duy nhất
   * 
   * @param items - Danh sách món hàng cần validate
   * @returns ValidationResult với valid = true nếu hợp lệ, hoặc error message nếu không hợp lệ
   */
  validateItemList(items: ShoppingItem[]): ValidationResult {
    // Kiểm tra danh sách rỗng
    if (!items || items.length === 0) {
      return {
        valid: false,
        error: 'Vui lòng thêm ít nhất một món hàng',
      };
    }

    // Kiểm tra từng món hàng
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // Kiểm tra có id không
      if (!item.id) {
        return {
          valid: false,
          error: `Món hàng thứ ${i + 1} thiếu ID`,
        };
      }

      // Validate tên
      const nameValidation = this.validateItemName(item.name);
      if (!nameValidation.valid) {
        return {
          valid: false,
          error: `Món hàng thứ ${i + 1}: ${nameValidation.error}`,
        };
      }

      // Validate giá
      const priceValidation = this.validatePrice(item.price);
      if (!priceValidation.valid) {
        return {
          valid: false,
          error: `Món hàng thứ ${i + 1}: ${priceValidation.error}`,
        };
      }
    }

    // Kiểm tra id duy nhất
    const ids = items.map(item => item.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      return {
        valid: false,
        error: 'Có món hàng bị trùng ID',
      };
    }

    return { valid: true };
  },
};
