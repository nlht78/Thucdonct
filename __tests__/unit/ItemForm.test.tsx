import { render, screen, fireEvent } from '@testing-library/react';
import ItemForm from '@/app/components/ItemForm';
import type { ShoppingItem } from '@/types';

describe('ItemForm Component', () => {
  it('should render form with inputs and button', () => {
    const mockOnAddItem = jest.fn();
    render(<ItemForm onAddItem={mockOnAddItem} />);

    expect(screen.getByLabelText(/tên món hàng/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/giá/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /thêm món hàng/i })).toBeInTheDocument();
  });

  it('should show validation error for empty name', () => {
    const mockOnAddItem = jest.fn();
    render(<ItemForm onAddItem={mockOnAddItem} />);

    const priceInput = screen.getByLabelText(/giá/i);
    fireEvent.change(priceInput, { target: { value: '10000' } });

    const submitButton = screen.getByRole('button', { name: /thêm món hàng/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/vui lòng nhập tên món hàng/i)).toBeInTheDocument();
    expect(mockOnAddItem).not.toHaveBeenCalled();
  });

  it('should show validation error for invalid price', () => {
    const mockOnAddItem = jest.fn();
    render(<ItemForm onAddItem={mockOnAddItem} />);

    const nameInput = screen.getByLabelText(/tên món hàng/i);
    const priceInput = screen.getByLabelText(/giá/i);
    
    fireEvent.change(nameInput, { target: { value: 'Cà chua' } });
    fireEvent.change(priceInput, { target: { value: 'abc' } });

    const submitButton = screen.getByRole('button', { name: /thêm món hàng/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/giá phải là số/i)).toBeInTheDocument();
    expect(mockOnAddItem).not.toHaveBeenCalled();
  });

  it('should call onAddItem with valid data and reset form', () => {
    const mockOnAddItem = jest.fn();
    render(<ItemForm onAddItem={mockOnAddItem} />);

    const nameInput = screen.getByLabelText(/tên món hàng/i);
    const priceInput = screen.getByLabelText(/giá/i);
    
    fireEvent.change(nameInput, { target: { value: 'Cà chua' } });
    fireEvent.change(priceInput, { target: { value: '20000' } });

    const submitButton = screen.getByRole('button', { name: /thêm món hàng/i });
    fireEvent.click(submitButton);

    expect(mockOnAddItem).toHaveBeenCalledTimes(1);
    const addedItem: ShoppingItem = mockOnAddItem.mock.calls[0][0];
    
    expect(addedItem.name).toBe('Cà chua');
    expect(addedItem.price).toBe(20000);
    expect(addedItem.id).toBeDefined();
    expect(addedItem.createdAt).toBeDefined();

    // Form should be reset
    expect(nameInput).toHaveValue('');
    expect(priceInput).toHaveValue('');
  });

  it('should submit form when Enter key is pressed', () => {
    const mockOnAddItem = jest.fn();
    render(<ItemForm onAddItem={mockOnAddItem} />);

    const nameInput = screen.getByLabelText(/tên món hàng/i);
    const priceInput = screen.getByLabelText(/giá/i);
    
    fireEvent.change(nameInput, { target: { value: 'Thịt heo' } });
    fireEvent.change(priceInput, { target: { value: '150000' } });

    // Press Enter on price input
    fireEvent.keyDown(priceInput, { key: 'Enter', code: 'Enter' });

    expect(mockOnAddItem).toHaveBeenCalledTimes(1);
    const addedItem: ShoppingItem = mockOnAddItem.mock.calls[0][0];
    expect(addedItem.name).toBe('Thịt heo');
    expect(addedItem.price).toBe(150000);
  });
});
