'use client';

import { formatCurrency } from '@/lib/formatting';
import type { SummaryProps } from '@/types';

/**
 * Summary Component
 * Hiển thị tổng kết chi phí và số lượng món hàng
 * Requirements: 1.5, 5.1, 5.2
 */
export default function Summary({ items }: SummaryProps) {
  // Tính tổng chi phí
  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
  
  // Số lượng món hàng
  const itemCount = items.length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Tổng Kết</h2>
      
      <div className="space-y-3">
        {/* Số lượng món hàng */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Số lượng món hàng:</span>
          <span className="text-lg font-medium text-gray-900">{itemCount}</span>
        </div>

        {/* Đường phân cách */}
        <div className="border-t border-gray-200"></div>

        {/* Tổng chi phí - Highlighted */}
        <div className="flex justify-between items-center bg-blue-50 -mx-6 px-6 py-3 rounded-lg">
          <span className="text-lg font-semibold text-gray-800">Tổng chi phí:</span>
          <span className="text-2xl font-bold text-blue-600">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
