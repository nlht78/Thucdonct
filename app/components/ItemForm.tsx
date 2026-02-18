'use client';

import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { ValidationService } from '@/lib/validation';
import type { ItemFormProps, ItemFormErrors } from '@/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * ItemForm Component
 * Form nhập thông tin món hàng với validation
 * Requirements: 1.1, 1.2, 1.3, 5.1
 */
export default function ItemForm({ onAddItem }: ItemFormProps) {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [errors, setErrors] = useState<ItemFormErrors>({});

  /**
   * Xử lý submit form
   */
  const handleSubmit = (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // Reset errors
    setErrors({});

    // Validate tên món hàng
    const nameValidation = ValidationService.validateItemName(itemName);
    if (!nameValidation.valid) {
      setErrors(prev => ({ ...prev, name: nameValidation.error }));
      return;
    }

    // Validate giá
    const priceValidation = ValidationService.validatePrice(itemPrice);
    if (!priceValidation.valid) {
      setErrors(prev => ({ ...prev, price: priceValidation.error }));
      return;
    }

    // Tạo món hàng mới
    const newItem = {
      id: uuidv4(),
      name: itemName.trim(),
      price: priceValidation.value!,
      createdAt: new Date().toISOString(),
    };

    // Gọi callback
    onAddItem(newItem);

    // Reset form
    setItemName('');
    setItemPrice('');
    setErrors({});
  };

  /**
   * Xử lý Enter key để submit
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Thêm Món Hàng</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input tên món hàng */}
        <div>
          <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
            Tên món hàng
          </label>
          <input
            id="itemName"
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 ${
              errors.name
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Ví dụ: Cà chua"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Input giá */}
        <div>
          <label htmlFor="itemPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Giá (₫)
          </label>
          <input
            id="itemPrice"
            type="text"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 ${
              errors.price
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Ví dụ: 20000"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>
      </div>

      {/* Nút thêm */}
      <div className="mt-4">
        <button
          type="submit"
          className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Thêm món hàng
        </button>
      </div>
    </form>
  );
}
