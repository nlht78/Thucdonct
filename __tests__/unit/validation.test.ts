import { ValidationService } from '@/lib/validation';
import type { ShoppingItem } from '@/types';

describe('ValidationService', () => {
  describe('validateItemName', () => {
    it('should accept valid names', () => {
      const result = ValidationService.validateItemName('Cà chua');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty string', () => {
      const result = ValidationService.validateItemName('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Vui lòng nhập tên món hàng');
    });

    it('should reject whitespace-only string', () => {
      const result = ValidationService.validateItemName('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Vui lòng nhập tên món hàng');
    });

    it('should reject names longer than 200 characters', () => {
      const longName = 'a'.repeat(201);
      const result = ValidationService.validateItemName(longName);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Tên món hàng không được vượt quá 200 ký tự');
    });

    it('should accept name with exactly 200 characters', () => {
      const name200 = 'a'.repeat(200);
      const result = ValidationService.validateItemName(name200);
      expect(result.valid).toBe(true);
    });

    it('should accept name with 1 character', () => {
      const result = ValidationService.validateItemName('a');
      expect(result.valid).toBe(true);
    });
  });

  describe('validatePrice', () => {
    it('should accept valid positive number', () => {
      const result = ValidationService.validatePrice(100000);
      expect(result.valid).toBe(true);
      expect(result.value).toBe(100000);
    });

    it('should accept valid positive string number', () => {
      const result = ValidationService.validatePrice('50000');
      expect(result.valid).toBe(true);
      expect(result.value).toBe(50000);
    });

    it('should reject zero', () => {
      const result = ValidationService.validatePrice(0);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Giá phải là số dương');
    });

    it('should reject negative number', () => {
      const result = ValidationService.validatePrice(-100);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Giá phải là số dương');
    });

    it('should reject non-numeric string', () => {
      const result = ValidationService.validatePrice('abc');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Giá phải là số');
    });

    it('should reject empty string', () => {
      const result = ValidationService.validatePrice('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Vui lòng nhập giá');
    });

    it('should reject price >= 1 billion', () => {
      const result = ValidationService.validatePrice(1000000000);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Giá không được vượt quá 1 tỷ đồng');
    });

    it('should accept price just below 1 billion', () => {
      const result = ValidationService.validatePrice(999999999);
      expect(result.valid).toBe(true);
      expect(result.value).toBe(999999999);
    });
  });

  describe('validateItemList', () => {
    const validItem: ShoppingItem = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Cà chua',
      price: 20000,
      createdAt: '2024-01-01T00:00:00.000Z',
    };

    it('should accept valid item list', () => {
      const result = ValidationService.validateItemList([validItem]);
      expect(result.valid).toBe(true);
    });

    it('should reject empty list', () => {
      const result = ValidationService.validateItemList([]);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Vui lòng thêm ít nhất một món hàng');
    });

    it('should reject item with invalid name', () => {
      const invalidItem = { ...validItem, name: '' };
      const result = ValidationService.validateItemList([invalidItem]);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Món hàng thứ 1');
    });

    it('should reject item with invalid price', () => {
      const invalidItem = { ...validItem, price: -100 };
      const result = ValidationService.validateItemList([invalidItem]);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Món hàng thứ 1');
    });

    it('should reject items with duplicate IDs', () => {
      const item2 = { ...validItem };
      const result = ValidationService.validateItemList([validItem, item2]);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Có món hàng bị trùng ID');
    });

    it('should accept multiple valid items', () => {
      const item2 = { ...validItem, id: '223e4567-e89b-12d3-a456-426614174000' };
      const result = ValidationService.validateItemList([validItem, item2]);
      expect(result.valid).toBe(true);
    });
  });
});
