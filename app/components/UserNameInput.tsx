'use client';

import { useState, useEffect } from 'react';

/**
 * UserNameInput Component
 * Component cho phép người dùng nhập tên để sử dụng ứng dụng
 */
export default function UserNameInput() {
  const [userName, setUserName] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');

  // Load tên từ localStorage khi mount
  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName);
    } else {
      setIsEditing(true); // Hiển thị form nhập nếu chưa có tên
    }
  }, []);

  const handleSave = () => {
    const trimmedName = tempName.trim();
    if (trimmedName) {
      setUserName(trimmedName);
      localStorage.setItem('userName', trimmedName);
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setTempName(userName);
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setTempName('');
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tên của bạn"
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <button
          onClick={handleSave}
          disabled={!tempName.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Lưu
        </button>
        {userName && (
          <button
            onClick={() => {
              setIsEditing(false);
              setTempName('');
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Hủy
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {userName.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-gray-700 text-sm font-medium">{userName}</span>
      </div>
      <button
        onClick={handleEdit}
        className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Đổi tên
      </button>
    </div>
  );
}
