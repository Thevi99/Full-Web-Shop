// models/historyModel.js
import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // เพิ่ม index เพื่อการค้นหาที่เร็วขึ้น
  },
  name: {
    type: String,
    required: [true, 'กรุณาระบุชื่อรายการ'],
    trim: true
  },
  data: {
    type: String,
    required: [true, 'กรุณาระบุข้อมูลรายการ'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'กรุณาระบุราคา'],
    min: [0, 'ราคาต้องไม่ต่ำกว่า 0']
  },
  currency: {
    type: String,
    required: true,
    default: 'THB',
    enum: ['THB', 'USD', 'EUR'] // สกุลเงินที่รองรับ
  },
  status: {
    type: String,
    required: true,
    enum: ['รอดำเนินการ', 'กำลังดำเนินการ', 'สำเร็จ', 'ยกเลิก'],
    default: 'รอดำเนินการ'
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['credit_card', 'bank_transfer', 'promptpay', 'wallet'],
  },
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  metadata: {
    type: Map,
    of: String,
    default: {} // สำหรับเก็บข้อมูลเพิ่มเติมในอนาคต
  }
}, {
  timestamps: true, // เพิ่ม createdAt และ updatedAt โดยอัตโนมัติ
  versionKey: false // ไม่ใช้ versionKey
});

// Indexes
historySchema.index({ date: -1 }); // Index สำหรับการเรียงตามวันที่
historySchema.index({ status: 1 }); // Index สำหรับการค้นหาตาม status

// Virtual field สำหรับคำนวณเวลาที่ผ่านมา
historySchema.virtual('timeAgo').get(function() {
  const seconds = Math.floor((new Date() - this.date) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' ปีที่แล้ว';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' เดือนที่แล้ว';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' วันที่แล้ว';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' ชั่วโมงที่แล้ว';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' นาทีที่แล้ว';
  
  return Math.floor(seconds) + ' วินาทีที่แล้ว';
});

// Methods
historySchema.methods.markAsCompleted = async function() {
  this.status = 'สำเร็จ';
  return this.save();
};

historySchema.methods.cancel = async function() {
  this.status = 'ยกเลิก';
  return this.save();
};

// Statics
historySchema.statics.findByUserId = function(userId) {
  return this.find({ userId }).sort({ date: -1 });
};

historySchema.statics.findByStatus = function(status) {
  return this.find({ status });
};

historySchema.statics.getStatistics = async function(userId) {
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) }},
    { 
      $group: {
        _id: null,
        totalSpent: { $sum: '$price' },
        totalOrders: { $sum: 1 },
        averageOrderValue: { $avg: '$price' },
        lastPurchaseDate: { $max: '$date' }
      }
    }
  ]);
};

// Middleware
historySchema.pre('save', function(next) {
  // ถ้าไม่มี transactionId ให้สร้างขึ้นมา
  if (!this.transactionId) {
    this.transactionId = 'TXN' + Date.now() + Math.random().toString(36).substring(7);
  }
  next();
});

// Create model
const History = mongoose.models.History || mongoose.model('History', historySchema);

export default History;