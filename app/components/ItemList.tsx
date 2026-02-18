'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/formatting';
import type { ItemListProps } from '@/types';

/**
 * ItemList Component
 * Hiển thị danh sách món hàng với khả năng chỉnh sửa và xóa
 * Requirements: 1.4, 2.1, 2.2, 5.1, 5.2
 */
export default function ItemList({ items, onUpdateItem, onDeleteItem }: ItemListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  /**
   * Bắt đầu chỉnh sửa món hàng
   */
  const startEdit = (id: string, name: string, price: number) => {
    setEditingId(id);
    setEditName(name);
    setEditPrice(price.toString());
  };

  /**
   * Hủy chỉnh sửa
   */
  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditPrice('');
  };

  /**
   * Lưu chỉnh sửa
   */
  const saveEdit = (id: string) => {
    const trimmedName = editName.trim();
    const parsedPrice = parseFloat(editPrice);

    // Validation
    if (!trimmedName) {
      alert('Tên món hàng không được rỗng');
      return;
    }

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      alert('Giá phải là số dương');
      return;
    }

    if (parsedPrice >= 1000000000) {
      alert('Giá không được vượt quá 1 tỷ đồng');
      return;
    }

    // Cập nhật món hàng
    onUpdateItem(id, { name: trimmedName, price: parsedPrice });
    cancelEdit();
  };

  /**
   * Xử lý xóa món hàng
   */
  const handleDelete = (id: string) => {
    if (deleteConfirmId === id) {
      onDeleteItem(id);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
      // Tự động hủy confirmation sau 3 giây
      setTimeout(() => {
        setDeleteConfirmId(null);
      }, 3000);
    }
  };

  // Empty state
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có món hàng</h3>
        <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách thêm món hàng đầu tiên của bạn.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h2 className="text-xl font-semibold text-gray-800 p-6 pb-4">Danh Sách Món Hàng</h2>
      
      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                STT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên món hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                Giá
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {editingId === item.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  ) : (
                    <span>{item.name}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingId === item.id ? (
                    <input
                      type="text"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="font-medium">{formatCurrency(item.price)}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingId === item.id ? (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => saveEdit(item.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEdit(item.id, item.name, item.price)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className={`${
                          deleteConfirmId === item.id
                            ? 'text-red-700 font-semibold'
                            : 'text-red-600 hover:text-red-900'
                        }`}
                      >
                        {deleteConfirmId === item.id ? 'Xác nhận?' : 'Xóa'}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden divide-y divide-gray-200">
        {items.map((item, index) => (
          <div key={item.id} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                    {index + 1}
                  </span>
                  {editingId === item.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                  )}
                </div>
                <div className="ml-8">
                  {editingId === item.id ? (
                    <input
                      type="text"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Giá"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(item.price)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="ml-8 flex gap-3">
              {editingId === item.id ? (
                <>
                  <button
                    onClick={() => saveEdit(item.id)}
                    className="text-sm text-green-600 hover:text-green-900 font-medium"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Hủy
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(item.id, item.name, item.price)}
                    className="text-sm text-blue-600 hover:text-blue-900"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className={`text-sm ${
                      deleteConfirmId === item.id
                        ? 'text-red-700 font-semibold'
                        : 'text-red-600 hover:text-red-900'
                    }`}
                  >
                    {deleteConfirmId === item.id ? 'Xác nhận xóa?' : 'Xóa'}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
