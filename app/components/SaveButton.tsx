'use client';

import { useState } from 'react';
import { StorageService } from '@/lib/storage';
import type { SaveButtonProps } from '@/types';

/**
 * SaveButton Component
 * Nút lưu báo cáo (đã bỏ xác thực Google)
 */
export default function SaveButton({ items, onSaveSuccess, onSaveError }: SaveButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Kiểm tra xem có thể lưu không (chỉ cần có items)
  const canSave = items.length > 0;

  /**
   * Hiển thị toast notification
   */
  const displayToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);

    // Tự động ẩn toast sau 5 giây
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };

  /**
   * Xử lý lưu báo cáo
   */
  const handleSave = async () => {
    if (!canSave) {
      return;
    }

    setIsLoading(true);

    try {
      // Lấy tên người dùng từ localStorage
      const userName = localStorage.getItem('userName') || 'Người dùng';
      
      // Tính tổng chi phí
      const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

      // Tạo dữ liệu báo cáo
      const reportData = {
        userName,
        items,
        timestamp: new Date().toISOString(),
        totalAmount,
      };

      // Lưu vào localStorage với key riêng cho lịch sử
      const reports = JSON.parse(localStorage.getItem('savedReports') || '[]');
      reports.push(reportData);
      localStorage.setItem('savedReports', JSON.stringify(reports));

      // Gọi API route để tạo Google Sheets (tránh CORS)
      try {
        console.log('Đang gọi API để tạo Google Sheets...', reportData);
        
        const response = await fetch('/api/save-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reportData),
        });

        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Response data:', result);

        if (result.success && result.sheetUrl) {
          // Cập nhật report với URL từ Google Sheets
          reports[reports.length - 1].sheetUrl = result.sheetUrl;
          localStorage.setItem('savedReports', JSON.stringify(reports));
          
          displayToast('Lưu báo cáo thành công! Đã tạo Google Sheets.', 'success');
        } else {
          // Vẫn lưu được vào localStorage
          console.warn('Không tạo được Google Sheets:', result.error || 'Unknown error');
          displayToast('Lưu báo cáo thành công!', 'success');
        }
      } catch (apiError) {
        // Không block nếu API fail
        console.error('Lỗi khi gọi API:', apiError);
        displayToast('Lưu báo cáo thành công!', 'success');
      }

      // Xóa Local Storage sau khi lưu thành công
      StorageService.clearItems();

      // Gọi callback
      onSaveSuccess();
    } catch (error) {
      console.error('Lỗi khi lưu báo cáo:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Đã xảy ra lỗi khi lưu báo cáo';

      // Hiển thị toast lỗi
      displayToast(errorMessage, 'error');

      // Gọi callback
      onSaveError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Đóng toast
   */
  const closeToast = () => {
    setShowToast(false);
  };

  return (
    <>
      {/* Nút lưu */}
      <button
        onClick={handleSave}
        disabled={!canSave || isLoading}
        className={`
          flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium
          transition-all duration-200
          ${canSave && !isLoading
            ? 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
        `}
        title={
          items.length === 0
            ? 'Vui lòng thêm ít nhất một món hàng'
            : 'Lưu báo cáo'
        }
      >
        {isLoading ? (
          <>
            {/* Loading spinner */}
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Đang lưu...</span>
          </>
        ) : (
          <>
            {/* Save icon */}
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            <span>Lưu báo cáo</span>
          </>
        )}
      </button>

      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
          <div
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
              ${toastType === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
              }
            `}
          >
            {/* Icon */}
            {toastType === 'success' ? (
              <svg
                className="w-6 h-6 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}

            {/* Message */}
            <span className="flex-1">{toastMessage}</span>

            {/* Close button */}
            <button
              onClick={closeToast}
              className="flex-shrink-0 hover:opacity-80 transition-opacity"
              aria-label="Đóng"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
