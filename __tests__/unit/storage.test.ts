/**
 * Unit tests cho StorageService
 * Requirements: 8.1, 8.2, 8.3
 */

import { StorageService } from '@/lib/storage';
import { ShoppingItem, ErrorType } from '@/types';

describe('StorageService', () => {
  // Mock localStorage
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    // Reset localStorage mock trước mỗi test
    localStorageMock = {};

    // Mock localStorage methods
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => localStorageMock[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          localStorageMock[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete localStorageMock[key];
        }),
        clear: jest.fn(() => {
          localStorageMock = {};
        }),
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveItems', () => {
    it('should save items to localStorage', () => {
      const items: ShoppingItem[] = [
        {
          id: '1',
          name: 'Cà chua',
          price: 20000,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          name: 'Thịt heo',
          price: 150000,
          createdAt: '2024-01-01T00:01:00.000Z',
        },
      ];

      StorageService.saveItems(items);

      expect(localStorage.setItem).toHaveBeenCalled();
      const savedData = localStorageMock['shopping_items'];
      expect(savedData).toBeDefined();

      const parsed = JSON.parse(savedData);
      expect(parsed.items).toEqual(items);
      expect(parsed.startTime).toBeDefined();
      expect(parsed.lastModified).toBeDefined();
    });

    it('should save empty array', () => {
      StorageService.saveItems([]);

      expect(localStorage.setItem).toHaveBeenCalled();
      const savedData = localStorageMock['shopping_items'];
      const parsed = JSON.parse(savedData);
      expect(parsed.items).toEqual([]);
    });

    it('should preserve session time when updating items', () => {
      const sessionTime = '2024-01-01T00:00:00.000Z';
      StorageService.saveSessionTime(sessionTime);

      const items: ShoppingItem[] = [
        {
          id: '1',
          name: 'Test',
          price: 10000,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      StorageService.saveItems(items);

      const savedData = localStorageMock['shopping_items'];
      const parsed = JSON.parse(savedData);
      expect(parsed.startTime).toBe(sessionTime);
    });

    it('should throw error when localStorage is not available', () => {
      // Mock localStorage không khả dụng
      Object.defineProperty(window, 'localStorage', {
        value: {
          setItem: jest.fn(() => {
            throw new Error('localStorage is not available');
          }),
          getItem: jest.fn(() => {
            throw new Error('localStorage is not available');
          }),
          removeItem: jest.fn(),
        },
        writable: true,
      });

      const items: ShoppingItem[] = [
        {
          id: '1',
          name: 'Test',
          price: 10000,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      expect(() => StorageService.saveItems(items)).toThrow();
    });

    it('should throw error when localStorage is full (QuotaExceededError)', () => {
      // Mock QuotaExceededError
      Object.defineProperty(window, 'localStorage', {
        value: {
          setItem: jest.fn(() => {
            const error = new Error('QuotaExceededError');
            error.name = 'QuotaExceededError';
            throw error;
          }),
          getItem: jest.fn(() => null),
          removeItem: jest.fn(),
        },
        writable: true,
      });

      const items: ShoppingItem[] = [
        {
          id: '1',
          name: 'Test',
          price: 10000,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      try {
        StorageService.saveItems(items);
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.type).toBe(ErrorType.STORAGE_ERROR);
        expect(error.message).toContain('Bộ nhớ trình duyệt đã đầy');
      }
    });
  });

  describe('getItems', () => {
    it('should return empty array when no data exists', () => {
      const items = StorageService.getItems();
      expect(items).toEqual([]);
    });

    it('should retrieve saved items', () => {
      const items: ShoppingItem[] = [
        {
          id: '1',
          name: 'Cà chua',
          price: 20000,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      StorageService.saveItems(items);
      const retrieved = StorageService.getItems();

      expect(retrieved).toEqual(items);
    });

    it('should return empty array when localStorage is not available', () => {
      // Mock localStorage không khả dụng
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn(() => {
            throw new Error('localStorage is not available');
          }),
          setItem: jest.fn(),
          removeItem: jest.fn(),
        },
        writable: true,
      });

      const items = StorageService.getItems();
      expect(items).toEqual([]);
    });

    it('should handle corrupt data and clear storage', () => {
      // Lưu dữ liệu không hợp lệ
      localStorageMock['shopping_items'] = 'invalid json {';

      try {
        StorageService.getItems();
        fail('Should have thrown error');
      } catch (error: any) {
        expect(error.type).toBe(ErrorType.STORAGE_ERROR);
        expect(error.message).toContain('Dữ liệu cũ không hợp lệ');
      }

      // Kiểm tra storage đã được xóa
      expect(localStorage.removeItem).toHaveBeenCalledWith('shopping_items');
    });

    it('should handle invalid session structure', () => {
      // Lưu dữ liệu với cấu trúc không hợp lệ
      localStorageMock['shopping_items'] = JSON.stringify({
        items: 'not an array',
        startTime: '2024-01-01T00:00:00.000Z',
        lastModified: '2024-01-01T00:00:00.000Z',
      });

      const items = StorageService.getItems();
      expect(items).toEqual([]);
      expect(localStorage.removeItem).toHaveBeenCalled();
    });

    it('should handle missing items field', () => {
      // Lưu dữ liệu thiếu items
      localStorageMock['shopping_items'] = JSON.stringify({
        startTime: '2024-01-01T00:00:00.000Z',
        lastModified: '2024-01-01T00:00:00.000Z',
      });

      const items = StorageService.getItems();
      expect(items).toEqual([]);
      expect(localStorage.removeItem).toHaveBeenCalled();
    });
  });

  describe('clearItems', () => {
    it('should remove all items from localStorage', () => {
      const items: ShoppingItem[] = [
        {
          id: '1',
          name: 'Test',
          price: 10000,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      StorageService.saveItems(items);
      StorageService.saveSessionTime('2024-01-01T00:00:00.000Z');

      StorageService.clearItems();

      expect(localStorage.removeItem).toHaveBeenCalledWith('shopping_items');
      expect(localStorage.removeItem).toHaveBeenCalledWith(
        'shopping_session_time'
      );
      expect(localStorageMock['shopping_items']).toBeUndefined();
      expect(localStorageMock['shopping_session_time']).toBeUndefined();
    });

    it('should not throw error when localStorage is not available', () => {
      // Mock localStorage không khả dụng
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn(() => {
            throw new Error('localStorage is not available');
          }),
          setItem: jest.fn(),
          removeItem: jest.fn(),
        },
        writable: true,
      });

      expect(() => StorageService.clearItems()).not.toThrow();
    });

    it('should throw error when removeItem fails', () => {
      // Mock removeItem throwing error
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn(() => 'test'),
          setItem: jest.fn(),
          removeItem: jest.fn(() => {
            throw new Error('Failed to remove');
          }),
        },
        writable: true,
      });

      expect(() => StorageService.clearItems()).toThrow();
    });
  });

  describe('saveSessionTime', () => {
    it('should save session time', () => {
      const time = '2024-01-01T00:00:00.000Z';
      StorageService.saveSessionTime(time);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'shopping_session_time',
        time
      );
      expect(localStorageMock['shopping_session_time']).toBe(time);
    });

    it('should not throw error when localStorage is not available', () => {
      // Mock localStorage không khả dụng
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn(() => {
            throw new Error('localStorage is not available');
          }),
          setItem: jest.fn(() => {
            throw new Error('localStorage is not available');
          }),
          removeItem: jest.fn(),
        },
        writable: true,
      });

      expect(() =>
        StorageService.saveSessionTime('2024-01-01T00:00:00.000Z')
      ).not.toThrow();
    });
  });

  describe('getSessionTime', () => {
    it('should return null when no session time exists', () => {
      const time = StorageService.getSessionTime();
      expect(time).toBeNull();
    });

    it('should retrieve saved session time', () => {
      const time = '2024-01-01T00:00:00.000Z';
      StorageService.saveSessionTime(time);

      const retrieved = StorageService.getSessionTime();
      expect(retrieved).toBe(time);
    });

    it('should return null when localStorage is not available', () => {
      // Mock localStorage không khả dụng
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn(() => {
            throw new Error('localStorage is not available');
          }),
          setItem: jest.fn(),
          removeItem: jest.fn(),
        },
        writable: true,
      });

      const time = StorageService.getSessionTime();
      expect(time).toBeNull();
    });
  });

  describe('Round-trip tests', () => {
    it('should preserve data through save and load cycle', () => {
      const items: ShoppingItem[] = [
        {
          id: '1',
          name: 'Cà chua',
          price: 20000,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          name: 'Thịt heo',
          price: 150000,
          createdAt: '2024-01-01T00:01:00.000Z',
        },
        {
          id: '3',
          name: 'Rau muống',
          price: 15000,
          createdAt: '2024-01-01T00:02:00.000Z',
        },
      ];

      StorageService.saveItems(items);
      const retrieved = StorageService.getItems();

      expect(retrieved).toEqual(items);
      expect(retrieved.length).toBe(items.length);
      expect(retrieved[0].id).toBe(items[0].id);
      expect(retrieved[0].name).toBe(items[0].name);
      expect(retrieved[0].price).toBe(items[0].price);
      expect(retrieved[0].createdAt).toBe(items[0].createdAt);
    });

    it('should handle multiple save and load cycles', () => {
      const items1: ShoppingItem[] = [
        {
          id: '1',
          name: 'Item 1',
          price: 10000,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      StorageService.saveItems(items1);
      let retrieved = StorageService.getItems();
      expect(retrieved).toEqual(items1);

      const items2: ShoppingItem[] = [
        ...items1,
        {
          id: '2',
          name: 'Item 2',
          price: 20000,
          createdAt: '2024-01-01T00:01:00.000Z',
        },
      ];

      StorageService.saveItems(items2);
      retrieved = StorageService.getItems();
      expect(retrieved).toEqual(items2);
      expect(retrieved.length).toBe(2);
    });
  });
});
