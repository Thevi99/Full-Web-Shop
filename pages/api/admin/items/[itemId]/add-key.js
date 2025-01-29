import Item from '../../../../../src/models/itemModel';
import dbConnect from '../../../../../src/lib/mongo';

export default async function handler(req, res) {
  const { method } = req;
  const { itemId } = req.query;

  await dbConnect();

  switch (method) {
    case 'POST':
      try {
        const { key, datas } = req.body;

        if (!key || (Array.isArray(key) && key.length === 0) || (!Array.isArray(key) && key.trim() === '')) {
          return res.status(400).json({ message: 'Key ไม่สามารถว่างได้' });
        }

        const keysToAdd = Array.isArray(key) ? key : [key];

        const item = await Item.findById(itemId);
        if (!item) {
          return res.status(404).json({ message: 'ไม่พบสินค้า' });
        }

        item.keys = item.keys || [];
        item.keys.push(...keysToAdd);

        if (datas && Array.isArray(datas)) {
          item.datas.push(...datas);
        }

        await item.save();

        res.status(200).json({ message: 'เพิ่ม Key และข้อมูลสำเร็จ', item });
      } catch (error) {
        console.error('Error adding key:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
      }
      break;

    case 'PUT':
      try {
        const { keys, datas } = req.body;

        const item = await Item.findById(itemId);
        if (!item) {
          return res.status(404).json({ message: 'ไม่พบสินค้า' });
        }

        if (keys) {
          item.keys = Array.isArray(keys) ? keys : [keys];
        }

        if (datas) {
          item.datas = Array.isArray(datas) ? datas : [datas];
        }

        await item.save();

        res.status(200).json({ message: 'อัพเดตข้อมูลสำเร็จ', item });
      } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
      }
      break;

    case 'GET':
      try {
        const item = await Item.findById(itemId);
        if (!item) {
          return res.status(404).json({ message: 'ไม่พบสินค้า' });
        }

        res.status(200).json({ item });
      } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
      }
      break;

    case 'DELETE':
      try {
        const item = await Item.findByIdAndDelete(itemId);
        if (!item) {
          return res.status(404).json({ message: 'ไม่พบสินค้า' });
        }

        res.status(200).json({ message: 'ลบสินค้าเรียบร้อยแล้ว' });
      } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
      }
      break;

    default:
      res.setHeader('Allow', ['POST', 'PUT', 'GET', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}