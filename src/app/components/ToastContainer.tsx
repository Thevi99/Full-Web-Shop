// ToastContainer.js
import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastContainer = () => {
  return (
    <Toaster
      position="top-right"  // ตำแหน่งของ Toast ที่มุมขวาบน
      reverseOrder={false}   // จะทำให้ Toast แสดงจากล่างขึ้นบน
    />
  );
};

export default ToastContainer;
