'use client';

import { useEffect } from 'react';
import { useShoppingItems } from '@/hooks/useShoppingItems';
import UserNameInput from './components/UserNameInput';
import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';
import Summary from './components/Summary';
import SaveButton from './components/SaveButton';
import SavedReports from './components/SavedReports';

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
  } = useShoppingItems();

  /**
   * Xử lý thêm món hàng từ ItemForm
   */
  const handleAddItem = (item: any) => {
    addItem(item.name, item.price);
  };

  /**
   * Xử lý lưu thành công
   */
  const handleSaveSuccess = () => {
    // Xóa tất cả món hàng sau khi lưu thành công
    clearAll();
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
                Ghi chép và quản lý các món hàng đã mua
              </p>
            </div>
            <div className="flex-shrink-0">
              <UserNameInput />
            </div>
          </div>
        </header>

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
                <SaveButton
                  items={items}
                  onSaveSuccess={handleSaveSuccess}
                  onSaveError={handleSaveError}
                />
                
                {/* Nút xem lịch sử */}
                <SavedReports />
                
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
            Nhấn "Lưu báo cáo" để lưu vào lịch sử.
          </p>
        </footer>
      </div>
    </main>
  );
}
