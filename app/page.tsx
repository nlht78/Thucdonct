'use client';

import { useEffect, useState } from 'react';
import { useShoppingItems } from '@/hooks/useShoppingItems';
import UserNameInput from './components/UserNameInput';
import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';
import Summary from './components/Summary';
import SaveButton from './components/SaveButton';
import SavedReports from './components/SavedReports';
import type { ShoppingItem } from '@/types';

/**
 * Main Page Component
 * Layout chính của ứng dụng quản lý chi tiêu mua sắm
 * Requirements: 1.1, 1.4, 1.5, 2.1, 2.2, 2.3, 8.2, 5.1
 */
export default function Home() {
  const {
    items,
    isLoading,
    addItem,
    updateItem,
    deleteItem,
    clearAll,
    loadItems,
  } = useShoppingItems();

  // State cho category dropdown
  const [category, setCategory] = useState('Thức ăn');
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  // State cho chế độ chỉnh sửa
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingReport, setEditingReport] = useState<any>(null);

  /**
   * Xử lý thay đổi category
   */
  const handleCategoryChange = (value: string) => {
    if (value === 'Khác') {
      setShowCustomInput(true);
      setCategory('');
    } else {
      setShowCustomInput(false);
      setCategory(value);
      setCustomCategory('');
    }
  };

  /**
   * Lấy category hiện tại (custom hoặc predefined)
   */
  const getCurrentCategory = () => {
    return showCustomInput ? customCategory : category;
  };

  /**
   * Xử lý thêm món hàng từ ItemForm
   */
  const handleAddItem = (item: any) => {
    addItem(item.name, item.price);
  };

  /**
   * Xử lý chỉnh sửa báo cáo
   */
  const handleEditReport = (report: any) => {
    // Load dữ liệu báo cáo vào form
    clearAll();
    
    // Load items từ báo cáo
    report.items.forEach((item: ShoppingItem) => {
      addItem(item.name, item.price);
    });
    
    // Set category
    if (report.category) {
      const predefinedCategories = ['Thức ăn', 'Đồ dùng', 'Vật liệu'];
      if (predefinedCategories.includes(report.category)) {
        setCategory(report.category);
        setShowCustomInput(false);
        setCustomCategory('');
      } else {
        setCategory('');
        setShowCustomInput(true);
        setCustomCategory(report.category);
      }
    }
    
    // Bật chế độ chỉnh sửa
    setIsEditMode(true);
    setEditingReport(report);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Hủy chỉnh sửa
   */
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingReport(null);
    clearAll();
  };

  /**
   * Xử lý lưu thành công
   */
  const handleSaveSuccess = () => {
    // Xóa tất cả món hàng sau khi lưu thành công
    clearAll();
    // Thoát chế độ chỉnh sửa
    setIsEditMode(false);
    setEditingReport(null);
  };

  /**
   * Xử lý lỗi khi lưu
   */
  const handleSaveError = (error: string) => {
    console.error('Lỗi lưu báo cáo:', error);
  };

  // Hiển thị loading state khi đang khôi phục dữ liệu
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header với UserNameInput */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Quản Lý Chi Tiêu Mua Sắm
              </h1>
              <p className="text-gray-600">
                {isEditMode ? 'Đang chỉnh sửa báo cáo' : 'Ghi chép và quản lý các món hàng đã mua'}
              </p>
            </div>
            <div className="flex-shrink-0">
              <UserNameInput />
            </div>
          </div>
        </header>

        {/* Thông báo chế độ chỉnh sửa */}
        {isEditMode && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <div>
                  <p className="font-semibold text-blue-900">Chế độ chỉnh sửa báo cáo</p>
                  <p className="text-sm text-blue-700">
                    Báo cáo gốc: {editingReport?.category || 'Mua sắm'} - {new Date(editingReport?.timestamp).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Hủy chỉnh sửa
              </button>
            </div>
          </div>
        )}

        {/* Form nhập món hàng */}
        <ItemForm onAddItem={handleAddItem} />

        {/* Layout 2 cột cho desktop: Danh sách + Tổng kết */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Danh sách món hàng - chiếm 2 cột */}
          <div className="lg:col-span-2">
            <ItemList
              items={items}
              onUpdateItem={updateItem}
              onDeleteItem={deleteItem}
            />
          </div>

          {/* Sidebar: Tổng kết và nút lưu */}
          <div className="space-y-6">
            <Summary items={items} />
            
            {/* Nút lưu báo cáo */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Hành động
              </h3>
              <div className="space-y-3">
                {/* Dropdown chọn loại báo cáo */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Loại báo cáo
                  </label>
                  <select
                    id="category"
                    value={showCustomInput ? 'Khác' : category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="Thức ăn">Mua thức ăn</option>
                    <option value="Đồ dùng">Mua đồ dùng</option>
                    <option value="Vật liệu">Mua vật liệu khác</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                {/* Input tùy chỉnh khi chọn "Khác" */}
                {showCustomInput && (
                  <div>
                    <label htmlFor="customCategory" className="block text-sm font-medium text-gray-700 mb-2">
                      Nhập loại báo cáo
                    </label>
                    <input
                      id="customCategory"
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Ví dụ: Mua quà tặng"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                )}

                <SaveButton
                  items={items}
                  category={getCurrentCategory()}
                  isEditMode={isEditMode}
                  originalReport={editingReport}
                  onSaveSuccess={handleSaveSuccess}
                  onSaveError={handleSaveError}
                />
                
                {/* Nút xem lịch sử */}
                <SavedReports onEditReport={handleEditReport} />
                
                {/* Nút xóa tất cả */}
                {items.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="w-full px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-600 text-sm mt-12">
          <p>
            Dữ liệu được lưu tạm thời trên trình duyệt của bạn.
            Nhấn &quot;Lưu báo cáo&quot; để lưu vào lịch sử.
          </p>
        </footer>
      </div>
    </main>
  );
}
