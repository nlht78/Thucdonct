'use client';

import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/formatting';
import { formatDateTime } from '@/lib/formatting';

interface SavedReport {
  userName: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    createdAt: string;
  }>;
  timestamp: string;
  totalAmount: number;
  category?: string; // Thêm category
  sheetUrl?: string; // Optional - chỉ có khi tạo Google Sheets thành công
}

interface SavedReportsProps {
  onEditReport: (report: SavedReport) => void;
}

/**
 * SavedReports Component
 * Hiển thị danh sách các báo cáo đã lưu
 */
export default function SavedReports({ onEditReport }: SavedReportsProps) {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load báo cáo từ localStorage
  useEffect(() => {
    if (isOpen) {
      loadReports();
    }
  }, [isOpen]);

  const loadReports = () => {
    try {
      const savedReports = localStorage.getItem('savedReports');
      if (savedReports) {
        const parsed = JSON.parse(savedReports);
        // Sắp xếp theo thời gian mới nhất
        setReports(parsed.reverse());
      }
    } catch (error) {
      console.error('Lỗi khi load báo cáo:', error);
    }
  };

  const deleteReport = (index: number) => {
    if (confirm('Bạn có chắc muốn xóa báo cáo này?')) {
      const updatedReports = [...reports];
      updatedReports.splice(index, 1);
      setReports(updatedReports);
      localStorage.setItem('savedReports', JSON.stringify(updatedReports.reverse()));
    }
  };

  const clearAllReports = () => {
    if (confirm('Bạn có chắc muốn xóa TẤT CẢ báo cáo đã lưu?')) {
      localStorage.removeItem('savedReports');
      setReports([]);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Xem lịch sử báo cáo ({reports.length})
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Lịch Sử Báo Cáo</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {reports.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600">Chưa có báo cáo nào được lưu</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  {/* Report Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {report.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800">{report.userName}</span>
                          {report.category && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {report.category}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDateTime(new Date(report.timestamp))}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteReport(index)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Xóa báo cáo"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Items List */}
                  <div className="bg-gray-50 rounded p-3 mb-3">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-1 text-gray-600">STT</th>
                          <th className="text-left py-1 text-gray-600">Tên món hàng</th>
                          <th className="text-right py-1 text-gray-600">Giá</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.items.map((item, itemIndex) => (
                          <tr key={item.id} className="border-b border-gray-100 last:border-0">
                            <td className="py-1 text-gray-700">{itemIndex + 1}</td>
                            <td className="py-1 text-gray-700">{item.name}</td>
                            <td className="py-1 text-right text-gray-700">{formatCurrency(item.price)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="font-semibold text-gray-700">Tổng cộng:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(report.totalAmount)}
                    </span>
                  </div>

                  {/* Link to Google Sheets and Edit Button */}
                  <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                    <button
                      onClick={() => {
                        onEditReport(report);
                        setIsOpen(false);
                      }}
                      className="flex-1 px-3 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition-colors text-center flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Chỉnh sửa
                    </button>
                    {report.sheetUrl && (
                      <a
                        href={report.sheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors text-center flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Mở Sheet
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {reports.length > 0 && (
          <div className="p-6 border-t border-gray-200 flex gap-3">
            <button
              onClick={clearAllReports}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Xóa tất cả
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
