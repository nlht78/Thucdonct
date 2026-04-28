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
  
  // State cho chế độ lưu báo cáo (cũ/mới)
  const [saveMode, setSaveMode] = useState<'old' | 'new'>('new');
  const [showSaveModeToggle, setShowSaveModeToggle] = useState(false);
  
  // State cho form báo cáo mới
  const [mealTime, setMealTime] = useState<'Sáng' | 'Trưa' | 'Chiều'>('Trưa');
  const [peopleCount, setPeopleCount] = useState<number>(0);
  const [pricePerPerson, setPricePerPerson] = useState<number>(28800);

  // State cho lưu theo ngày
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDate, setCustomDate] = useState<string>('');

  // State cho ngày lễ (nhân đôi giá/người)
  const [isHoliday, setIsHoliday] = useState(false);

  // Giá mặc định theo buổi (có thể chỉnh sửa)
  const [mealPrices, setMealPrices] = useState({
    'Sáng': 14400,
    'Trưa': 28800,
    'Chiều': 28800,
  });

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

        {/* Toggle chọn chế độ lưu báo cáo */}
        <div className="mb-6 bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Chế độ lưu báo cáo
            </label>
            <button
              onClick={() => setShowSaveModeToggle(!showSaveModeToggle)}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              {showSaveModeToggle ? 'Ẩn' : 'Thay đổi chế độ'}
            </button>
          </div>

          {!showSaveModeToggle ? (
            <p className="text-sm text-green-700 font-medium">
              Đang dùng: Báo cáo tổng hợp
            </p>
          ) : (
            <div className="flex gap-4 mt-3">
              <button
                onClick={() => setSaveMode('old')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  saveMode === 'old'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-left">
                  <div className="font-semibold">Báo cáo riêng lẻ</div>
                  <div className="text-xs opacity-80">Tạo file mới mỗi báo cáo</div>
                </div>
              </button>
              <button
                onClick={() => setSaveMode('new')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  saveMode === 'new'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-left">
                  <div className="font-semibold">Báo cáo tổng hợp</div>
                  <div className="text-xs opacity-80">Lưu vào file chung</div>
                </div>
              </button>
            </div>
          )}
        </div>

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

        {/* Form bổ sung cho báo cáo mới */}
        {saveMode === 'new' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Thông tin bổ sung
            </h3>
            
            {/* Chỉ hiện form đầy đủ cho "Thức ăn" */}
            {category === 'Thức ăn' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Buổi */}                  <div>
                    <label htmlFor="mealTime" className="block text-sm font-medium text-gray-700 mb-2">
                      Buổi
                    </label>
                    <select
                      id="mealTime"
                      value={mealTime}
                      onChange={(e) => {
                        const selected = e.target.value as 'Sáng' | 'Trưa' | 'Chiều';
                        setMealTime(selected);
                        setPricePerPerson(mealPrices[selected]);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    >
                      <option value="Sáng">Sáng</option>
                      <option value="Trưa">Trưa</option>
                      <option value="Chiều">Chiều</option>
                    </select>
                  </div>

                  {/* Số lượng người */}
                  <div>
                    <label htmlFor="peopleCount" className="block text-sm font-medium text-gray-700 mb-2">
                      Số lượng người
                    </label>
                    <input
                      id="peopleCount"
                      type="number"
                      min="1"
                      value={peopleCount === 0 ? '' : peopleCount}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (isNaN(value) || value < 1) {
                          setPeopleCount(0);
                        } else {
                          setPeopleCount(value);
                        }
                      }}
                      onBlur={(e) => {
                        // Nếu để trống hoặc 0, set về 1
                        if (peopleCount === 0 || e.target.value === '') {
                          setPeopleCount(1);
                        }
                      }}
                      placeholder="Nhập số người"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  {/* Giá tiền chi cho mỗi người */}
                  <div>
                    <label htmlFor="pricePerPerson" className="block text-sm font-medium text-gray-700 mb-2">
                      Giá/người (₫)
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="pricePerPerson"
                        type="number"
                        min="0"
                        value={pricePerPerson}
                        onChange={(e) => setPricePerPerson(parseInt(e.target.value) || 0)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        placeholder="VD: 30000"
                      />
                      <button
                        type="button"
                        onClick={() => setIsHoliday(!isHoliday)}
                        title="Ngày lễ: nhân đôi giá/người"
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                          isHoliday
                            ? 'bg-red-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        🎉
                      </button>
                    </div>
                    {isHoliday && (
                      <p className="text-xs text-red-600 mt-1">
                        Ngày lễ: {pricePerPerson.toLocaleString('vi-VN')} × 2 = <span className="font-bold">{(pricePerPerson * 2).toLocaleString('vi-VN')} ₫/người</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Hiển thị tổng tiền dự kiến */}
                {peopleCount > 0 && pricePerPerson > 0 && (
                  <div className={`mt-4 p-3 rounded-lg ${isHoliday ? 'bg-red-50' : 'bg-blue-50'}`}>
                    <p className={`text-sm ${isHoliday ? 'text-red-800' : 'text-blue-800'}`}>
                      {isHoliday && <span className="font-semibold">🎉 Ngày lễ · </span>}
                      Tổng tiền dự kiến: <span className="font-bold">
                        {peopleCount} người × {(pricePerPerson * (isHoliday ? 2 : 1)).toLocaleString('vi-VN')} ₫ = {(peopleCount * pricePerPerson * (isHoliday ? 2 : 1)).toLocaleString('vi-VN')} ₫
                      </span>
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-600">
                <p>Chỉ cần thêm món hàng và lưu báo cáo</p>
                <p className="text-sm mt-1">Trang tính: <span className="font-semibold">{category}</span></p>
              </div>
            )}
          </div>
        )}

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
                {/* Dropdown chọn loại báo cáo - hiện cho cả 2 chế độ */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    {saveMode === 'new' ? 'Chọn trang tính' : 'Loại báo cáo'}
                  </label>
                  <select
                    id="category"
                    value={showCustomInput ? 'Khác' : category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="Thức ăn">Thức ăn</option>
                    <option value="Đồ dùng">Đồ dùng</option>
                    <option value="Vật liệu">Vật liệu khác</option>
                    {saveMode === 'old' && <option value="Khác">Khác</option>}
                  </select>
                </div>

                {/* Input tùy chỉnh khi chọn "Khác" - chỉ cho chế độ cũ */}
                {showCustomInput && saveMode === 'old' && (
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
                  saveMode={saveMode}
                  mealTime={mealTime}
                  peopleCount={peopleCount}
                  pricePerPerson={pricePerPerson}
                  isHoliday={isHoliday}
                  customDate={customDate || undefined}
                  onSaveSuccess={handleSaveSuccess}
                  onSaveError={handleSaveError}
                />

                {/* Nút lưu theo ngày */}
                <div>
                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="w-full px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {showDatePicker ? 'Ẩn chọn ngày' : 'Lưu theo ngày'}
                  </button>
                  {showDatePicker && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <label className="block text-xs text-gray-500 mb-1">Chọn ngày lưu thực đơn</label>
                      <input
                        type="date"
                        value={customDate}
                        onChange={(e) => setCustomDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {customDate && (
                        <p className="text-xs text-blue-600 mt-1">
                          Sẽ lưu với ngày: {new Date(customDate).toLocaleDateString('vi-VN')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
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
