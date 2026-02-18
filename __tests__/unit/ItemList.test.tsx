/**
 * Unit tests for ItemList component
 * Feature: shopping-expense-tracker
 * Requirements: 1.4, 2.1, 2.2, 5.1, 5.2
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ItemList from '@/app/components/ItemList';
import type { ShoppingItem } from '@/types';

describe('ItemList Component', () => {
  const mockItems: ShoppingItem[] = [
    {
      id: '1',
      name: 'Cà chua',
      price: 20000,
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Thịt heo',
      price: 150000,
      createdAt: '2024-01-01T00:01:00Z',
    },
  ];

  const mockOnUpdateItem = jest.fn();
  const mockOnDeleteItem = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Empty State', () => {
    it('should display empty state when no items', () => {
      render(
        <ItemList
          items={[]}
          onUpdateItem={mockOnUpdateItem}
          onDeleteItem={mockOnDeleteItem}
        />
      );

      expect(screen.getByText('Chưa có món hàng')).toBeInTheDocument();
      expect(screen.getByText('Bắt đầu bằng cách thêm món hàng đầu tiên của bạn.')).toBeInTheDocument();
    });
  });

  describe('Display Items', () => {
    it('should display all items with correct data', () => {
      render(
        <ItemList
          items={mockItems}
          onUpdateItem={mockOnUpdateItem}
          onDeleteItem={mockOnDeleteItem}
        />
      );

      expect(screen.getAllByText('Cà chua').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Thịt heo').length).toBeGreaterThan(0);
      expect(screen.getAllByText('20.000 ₫').length).toBeGreaterThan(0);
      expect(screen.getAllByText('150.000 ₫').length).toBeGreaterThan(0);
    });

    it('should display items with correct STT (sequential numbers)', () => {
      render(
        <ItemList
          items={mockItems}
          onUpdateItem={mockOnUpdateItem}
          onDeleteItem={mockOnDeleteItem}
        />
      );

      // Check for STT in table
      const sttCells = screen.getAllByText(/^[12]$/);
      expect(sttCells.length).toBeGreaterThanOrEqual(2);
    });

    it('should format prices according to Vietnamese format', () => {
      const itemsWithVariousPrices: ShoppingItem[] = [
        { id: '1', name: 'Item 1', price: 1000, createdAt: '2024-01-01T00:00:00Z' },
        { id: '2', name: 'Item 2', price: 1000000, createdAt: '2024-01-01T00:00:00Z' },
        { id: '3', name: 'Item 3', price: 999999999, createdAt: '2024-01-01T00:00:00Z' },
      ];

      render(
        <ItemList
          items={itemsWithVariousPrices}
          onUpdateItem={mockOnUpdateItem}
          onDeleteItem={mockOnDeleteItem}
        />
      );

      expect(screen.getAllByText('1.000 ₫').length).toBeGreaterThan(0);
      expect(screen.getAllByText('1.000.000 ₫').length).toBeGreaterThan(0);
      expect(screen.getAllByText('999.999.999 ₫').length).toBeGreaterThan(0);
    });
  });

  describe('Inline Editing', () => {
    it('should enter edit mode when clicking Sửa button', () => {
      render(
        <ItemList
          items={mockItems}
          onUpdateItem={mockOnUpdateItem}
          onDeleteItem={mockOnDeleteItem}
        />
      );

      const editButtons = screen.getAllByText('Sửa');
      fireEvent.click(editButtons[0]);

      // Should show input fields (both desktop and mobile)
      const nameInputs = screen.getAllByDisplayValue('Cà chua');
      const priceInputs = screen.getAllByDisplayValue('20000');
      expect(nameInputs.length).toBeGreaterThan(0);
      expect(priceInputs.length).toBeGreaterThan(0);

      // Should show Lưu and Hủy buttons
      expect(screen.getAllByText('Lưu').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Hủy').length).toBeGreaterThan(0);
    });

    it('should cancel edit mode when clicking Hủy button', () => {
      render(
        <ItemList
          items={mockItems}
          onUpdateItem={mockOnUpdateItem}
          onDeleteItem={mockOnDeleteItem}
        />
      );

      const editButtons = screen.getAllByText('Sửa');
      fireEvent.click(editButtons[0]);

      const cancelButtons = screen.getAllByText('Hủy');
      fireEvent.click(cancelButtons[0]);

      // Should exit edit mode
      expect(screen.queryByDisplayValue('Cà chua')).not.toBeInTheDocument();
      expect(screen.getAllByText('Cà chua').length).toBeGreaterThan(0);
    });

    it('should call onUpdateItem with correct data when saving valid edit', () => {
      render(
        <ItemList
          items={mockItems}
          onUpdateItem={mockOnUpdateItem}
          onDeleteItem={mockOnDeleteItem}
        />
      );

      const editButtons = screen.getAllByText('Sửa');
      fireEvent.click(editButtons[0]);

      const nameInputs = screen.getAllByDisplayValue('Cà chua');
      const priceInputs = screen.getAllByDisplayValue('20000');

      fireEvent.change(nameInputs[0], { target: { value: 'Cà chua bi' } });
      fireEvent.change(priceInputs[0], { target: { value: '25000' } });

      const saveButtons = screen.getAllByText('Lưu');
      fireEvent.click(saveButtons[0]);

      expect(mockOnUpdateItem).toHaveBeenCalledWith('1', {
        name: 'Cà chua bi',
        price: 25000,
      });
    });

    it('should show alert when saving with empty name', () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      render(
        <ItemList
          items={mockItems}
          onUpdateItem={mockOnUpdateItem}
          onDeleteItem={mockOnDeleteItem}
        />
      );

      const editButtons = screen.getAllByText('Sửa');
      fireEvent.click(editButtons[0]);

      const nameInputs = screen.getAllByDisplayValue('Cà chua');
      fireEvent.change(nameInputs[0], { target: { value: '   ' } });

      const saveButtons = screen.getAllByText('Lưu');
      fireEvent.click(saveButtons[0]);

      expect(alertSpy).toHaveBeenCalledWith('Tên món hàng không được rỗng');
      expect(mockOnUpdateItem).not.toHaveBeenCalled();

      alertSpy.mockRestore();
    });

    it('should show alert when saving with invalid price', () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      render(
        <ItemList
          items={mockItems}
          onUpdateItem={mockOnUpdateItem}
          onDeleteItem={mockOnDeleteItem}
        />
      );

      const editButtons = screen.getAllByText('Sửa');
      fireEvent.click(editButtons[0]);

      const priceInputs = screen.getAllByDisplayValue('20000');
      fireEvent.change(priceInputs[0], { target: { value: 'abc' } });

      const saveButtons = screen.getAllByText('Lưu');
      fireEvent.click(saveButtons[0]);

      expect(alertSpy).toHaveBeenCalledWith('Giá phải là số dương');
      expect(mockOnUpdateItem).not.toHaveBeenCalled();

      alertSpy.mockRestore();
    });

    it('should show alert when saving with negative price', () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      render(
        <ItemList
          items={mockItems}
          onUpdateItem={mockOnUpdateItem}
          onDeleteItem={mockOnDeleteItem}
        />
      );

      const editButtons = screen.getAllByText('Sửa');
      fireEvent.click(editButtons[0]);

      const priceInputs = screen.getAllByDisplayValue('20000');
      fireEvent.change(priceInputs[0], { target: { value: '-100' } });

      const saveButtons = screen.getAllByText('Lưu');
      fireEvent.click(saveButtons[0]);

      expect(alertSpy).toHaveBeenCalledWith('Giá phải là số dương');
      expect(mockOnUpdateItem).not.toHaveBeenCalled();

      alertSpy.mockRestore();
    });

    it('should show alert when saving with price >= 1 billion', () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      render(
        <ItemList
          items={mockItems}
          onUpdateItem={mockOnUpdateItem}
          onDeleteItem={mockOnDeleteItem}
        />
      );

      const editButtons = screen.getAllByText('Sửa');
      fireEvent.click(editButtons[0]);

      const priceInputs = screen.getAllByDisplayValue('20000');
      fireEvent.change(priceInputs[0], { target: { value: '1000000000' } });

      const saveButtons = screen.getAllByText('Lưu');
      fireEvent.click(saveButtons[0]);

      expect(alertSpy).toHaveBeenCalledWith('Giá không được vượt quá 1 tỷ đồng');
      expect(mockOnUpdateItem).not.toHaveBeenCalled();

      alertSpy.mockRestore();
    });
  });

  describe('Delete Functionality', () => {
    it('should show confirmation when clicking Xóa button', () => {
      render(
        <ItemList
          items={mockItems}
          onUpdateItem={mockOnUpdateItem}
          onDeleteItem={mockOnDeleteItem}
        />
      );

      const deleteButtons = screen.getAllByText('Xóa');
      fireEvent.click(deleteButtons[0]);

      // Should show confirmation text
      expect(screen.getByText('Xác nhận?')).toBeInTheDocument();
    });

    it('should call onDeleteItem when confirming delete', () => {
      render(
        <ItemList
          items={mockItems}
          onUpdateItem={mockOnUpdateItem}
          onDeleteItem={mockOnDeleteItem}
        />
      );

      const deleteButtons = screen.getAllByText('Xóa');
      fireEvent.click(deleteButtons[0]);

      const confirmButton = screen.getByText('Xác nhận?');
      fireEvent.click(confirmButton);

      expect(mockOnDeleteItem).toHaveBeenCalledWith('1');
    });

    it('should reset confirmation after timeout', async () => {
      jest.useFakeTimers();

      render(
        <ItemList
          items={mockItems}
          onUpdateItem={mockOnUpdateItem}
          onDeleteItem={mockOnDeleteItem}
        />
      );

      const deleteButtons = screen.getAllByText('Xóa');
      fireEvent.click(deleteButtons[0]);

      expect(screen.getByText('Xác nhận?')).toBeInTheDocument();

      // Fast-forward time by 3 seconds
      jest.advanceTimersByTime(3000);

      await waitFor(() => {
        expect(screen.queryByText('Xác nhận?')).not.toBeInTheDocument();
      });

      jest.useRealTimers();
    });
  });

  describe('Vietnamese Language', () => {
    it('should display all UI text in Vietnamese', () => {
      render(
        <ItemList
          items={mockItems}
          onUpdateItem={mockOnUpdateItem}
          onDeleteItem={mockOnDeleteItem}
        />
      );

      expect(screen.getByText('Danh Sách Món Hàng')).toBeInTheDocument();
      expect(screen.getByText('STT')).toBeInTheDocument();
      expect(screen.getByText('Tên món hàng')).toBeInTheDocument();
      expect(screen.getByText('Giá')).toBeInTheDocument();
      expect(screen.getByText('Hành động')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should render table for desktop view', () => {
      render(
        <ItemList
          items={mockItems}
          onUpdateItem={mockOnUpdateItem}
          onDeleteItem={mockOnDeleteItem}
        />
      );

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      expect(table.parentElement).toHaveClass('hidden', 'md:block');
    });

    it('should render card layout for mobile view', () => {
      render(
        <ItemList
          items={mockItems}
          onUpdateItem={mockOnUpdateItem}
          onDeleteItem={mockOnDeleteItem}
        />
      );

      const mobileView = document.querySelector('.md\\:hidden.divide-y');
      expect(mobileView).toBeInTheDocument();
    });
  });
});
