/**
 * Unit tests for useShoppingItems hook
 * Feature: shopping-expense-tracker
 * Requirements: 1.1, 1.4, 1.5, 2.1, 2.2, 8.1
 */

import { renderHook, act } from '@testing-library/react';
import { useShoppingItems } from '@/hooks/useShoppingItems';
import { StorageService } from '@/lib/storage';

// Mock the StorageService
jest.mock('@/lib/storage', () => ({
  StorageService: {
    getItems: jest.fn(),
    saveItems: jest.fn(),
    clearItems: jest.fn(),
  },
}));

// Mock uuid
jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'test-uuid-1234'),
}));

describe('useShoppingItems', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (StorageService.getItems as jest.Mock).mockReturnValue([]);
  });

  describe('initialization', () => {
    it('should load items from storage on mount', () => {
      const mockItems = [
        {
          id: '1',
          name: 'Test Item',
          price: 100,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      (StorageService.getItems as jest.Mock).mockReturnValue(mockItems);

      const { result } = renderHook(() => useShoppingItems());

      expect(result.current.isLoading).toBe(false);
      expect(result.current.items).toEqual(mockItems);
      expect(StorageService.getItems).toHaveBeenCalledTimes(1);
    });

    it('should start with empty list if storage fails', () => {
      (StorageService.getItems as jest.Mock).mockImplementation(() => {
        throw new Error('Storage error');
      });

      const { result } = renderHook(() => useShoppingItems());

      expect(result.current.items).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('addItem', () => {
    it('should add a valid item to the list', () => {
      const { result } = renderHook(() => useShoppingItems());

      act(() => {
        const newItem = result.current.addItem('Cà chua', 20000);
        expect(newItem).not.toBeNull();
        expect(newItem?.name).toBe('Cà chua');
        expect(newItem?.price).toBe(20000);
        expect(newItem?.id).toBe('test-uuid-1234');
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].name).toBe('Cà chua');
      expect(result.current.items[0].price).toBe(20000);
    });

    it('should trim whitespace from item name', () => {
      const { result } = renderHook(() => useShoppingItems());

      act(() => {
        result.current.addItem('  Thịt heo  ', 150000);
      });

      expect(result.current.items[0].name).toBe('Thịt heo');
    });

    it('should reject item with empty name', () => {
      const { result } = renderHook(() => useShoppingItems());

      act(() => {
        const newItem = result.current.addItem('', 20000);
        expect(newItem).toBeNull();
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('should reject item with whitespace-only name', () => {
      const { result } = renderHook(() => useShoppingItems());

      act(() => {
        const newItem = result.current.addItem('   ', 20000);
        expect(newItem).toBeNull();
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('should reject item with invalid price', () => {
      const { result } = renderHook(() => useShoppingItems());

      act(() => {
        const newItem = result.current.addItem('Test', -100);
        expect(newItem).toBeNull();
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('should auto-save to storage after adding item', async () => {
      const { result } = renderHook(() => useShoppingItems());

      await act(async () => {
        result.current.addItem('Test', 100);
        // Wait for useEffect to run
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(StorageService.saveItems).toHaveBeenCalled();
    });
  });

  describe('updateItem', () => {
    it('should update an existing item', () => {
      const mockItems = [
        {
          id: '1',
          name: 'Old Name',
          price: 100,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      (StorageService.getItems as jest.Mock).mockReturnValue(mockItems);

      const { result } = renderHook(() => useShoppingItems());

      act(() => {
        const success = result.current.updateItem('1', { name: 'New Name', price: 200 });
        expect(success).toBe(true);
      });

      expect(result.current.items[0].name).toBe('New Name');
      expect(result.current.items[0].price).toBe(200);
    });

    it('should trim whitespace when updating name', () => {
      const mockItems = [
        {
          id: '1',
          name: 'Old Name',
          price: 100,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      (StorageService.getItems as jest.Mock).mockReturnValue(mockItems);

      const { result } = renderHook(() => useShoppingItems());

      act(() => {
        result.current.updateItem('1', { name: '  New Name  ' });
      });

      expect(result.current.items[0].name).toBe('New Name');
    });

    it('should reject update with invalid name', () => {
      const mockItems = [
        {
          id: '1',
          name: 'Old Name',
          price: 100,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      (StorageService.getItems as jest.Mock).mockReturnValue(mockItems);

      const { result } = renderHook(() => useShoppingItems());

      act(() => {
        const success = result.current.updateItem('1', { name: '' });
        expect(success).toBe(false);
      });

      expect(result.current.items[0].name).toBe('Old Name');
    });

    it('should reject update with invalid price', () => {
      const mockItems = [
        {
          id: '1',
          name: 'Old Name',
          price: 100,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      (StorageService.getItems as jest.Mock).mockReturnValue(mockItems);

      const { result } = renderHook(() => useShoppingItems());

      act(() => {
        const success = result.current.updateItem('1', { price: -100 });
        expect(success).toBe(false);
      });

      expect(result.current.items[0].price).toBe(100);
    });

    it('should return false when updating non-existent item', () => {
      const { result } = renderHook(() => useShoppingItems());

      act(() => {
        const success = result.current.updateItem('non-existent', { name: 'Test' });
        expect(success).toBe(false);
      });
    });
  });

  describe('deleteItem', () => {
    it('should delete an existing item', () => {
      const mockItems = [
        {
          id: '1',
          name: 'Item 1',
          price: 100,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          name: 'Item 2',
          price: 200,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      (StorageService.getItems as jest.Mock).mockReturnValue(mockItems);

      const { result } = renderHook(() => useShoppingItems());

      act(() => {
        const deleted = result.current.deleteItem('1');
        expect(deleted).toBe(true);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].id).toBe('2');
    });

    it('should return false when deleting non-existent item', () => {
      const { result } = renderHook(() => useShoppingItems());

      act(() => {
        const deleted = result.current.deleteItem('non-existent');
        expect(deleted).toBe(false);
      });
    });

    it('should handle deleting the last item', () => {
      const mockItems = [
        {
          id: '1',
          name: 'Item 1',
          price: 100,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      (StorageService.getItems as jest.Mock).mockReturnValue(mockItems);

      const { result } = renderHook(() => useShoppingItems());

      act(() => {
        result.current.deleteItem('1');
      });

      expect(result.current.items).toHaveLength(0);
    });
  });

  describe('clearAll', () => {
    it('should clear all items', () => {
      const mockItems = [
        {
          id: '1',
          name: 'Item 1',
          price: 100,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          name: 'Item 2',
          price: 200,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      (StorageService.getItems as jest.Mock).mockReturnValue(mockItems);

      const { result } = renderHook(() => useShoppingItems());

      act(() => {
        result.current.clearAll();
      });

      expect(result.current.items).toHaveLength(0);
      expect(StorageService.clearItems).toHaveBeenCalledTimes(1);
    });

    it('should handle storage errors gracefully', () => {
      (StorageService.clearItems as jest.Mock).mockImplementation(() => {
        throw new Error('Storage error');
      });

      const { result } = renderHook(() => useShoppingItems());

      act(() => {
        // Should not throw
        result.current.clearAll();
      });

      expect(result.current.items).toHaveLength(0);
    });
  });

  describe('calculateTotal', () => {
    it('should calculate total of all items', () => {
      const mockItems = [
        {
          id: '1',
          name: 'Item 1',
          price: 100,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          name: 'Item 2',
          price: 200,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '3',
          name: 'Item 3',
          price: 300,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      (StorageService.getItems as jest.Mock).mockReturnValue(mockItems);

      const { result } = renderHook(() => useShoppingItems());

      expect(result.current.calculateTotal()).toBe(600);
    });

    it('should return 0 for empty list', () => {
      const { result } = renderHook(() => useShoppingItems());

      expect(result.current.calculateTotal()).toBe(0);
    });

    it('should update total after adding item', () => {
      const { result } = renderHook(() => useShoppingItems());

      act(() => {
        result.current.addItem('Item 1', 100);
        result.current.addItem('Item 2', 200);
      });

      expect(result.current.calculateTotal()).toBe(300);
    });

    it('should update total after deleting item', () => {
      const mockItems = [
        {
          id: '1',
          name: 'Item 1',
          price: 100,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          name: 'Item 2',
          price: 200,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      (StorageService.getItems as jest.Mock).mockReturnValue(mockItems);

      const { result } = renderHook(() => useShoppingItems());

      expect(result.current.calculateTotal()).toBe(300);

      act(() => {
        result.current.deleteItem('1');
      });

      expect(result.current.calculateTotal()).toBe(200);
    });
  });
});
