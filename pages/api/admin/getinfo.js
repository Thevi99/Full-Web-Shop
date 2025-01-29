import connectDB from "../../../src/lib/mongo";
import History from "../../../src/models/historyModel";
import Bank from "../../../src/models/transactionModel";
import Item from "../../../src/models/itemModel";
import User from "../../../src/models/userModel";
const handler = async (req, res) => {
  await connectDB();

  if (req.method === "GET") {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const countItem = await Item.countDocuments();
    const countUser = await User.countDocuments();
    const totalDatas = await Item.aggregate([
      {
        $project: {
          totalDatas: { $size: "$datas" },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalDatas" },
        },
      },
    ]);

    const ProductdailyCount = await History.countDocuments({
      createdAt: { $gte: startOfDay },
    });
    const ProductweeklyCount = await History.countDocuments({
      createdAt: { $gte: startOfWeek },
    });
    const ProductmonthlyCount = await History.countDocuments({
      createdAt: { $gte: startOfMonth },
    });
    const ProductyearlyCount = await History.countDocuments({
      createdAt: { $gte: startOfYear },
    });
    const ProducttotalCount = await History.countDocuments();
    // Wallet
    const WalletdailyTotal = await Bank.aggregate([
      { $match: { createdAt: { $gte: startOfDay }, type: "True Wallet" } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    const WalletweeklyTotal = await Bank.aggregate([
      { $match: { createdAt: { $gte: startOfWeek }, type: "True Wallet" } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    const WalletmonthlyTotal = await Bank.aggregate([
      { $match: { createdAt: { $gte: startOfMonth }, type: "True Wallet" } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    const WalletyearlyTotal = await Bank.aggregate([
      { $match: { createdAt: { $gte: startOfYear }, type: "True Wallet" } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    const WallettotalAmount = await Bank.aggregate([
      { $match: { type: "True Wallet" } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);
    // Bank
    const BankdailyTotal = await Bank.aggregate([
      { $match: { createdAt: { $gte: startOfDay }, type: "Qrcode Bank" } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    const BankweeklyTotal = await Bank.aggregate([
      { $match: { createdAt: { $gte: startOfWeek }, type: "Qrcode Bank" } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    const BankmonthlyTotal = await Bank.aggregate([
      { $match: { createdAt: { $gte: startOfMonth }, type: "Qrcode Bank" } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    const BankyearlyTotal = await Bank.aggregate([
      { $match: { createdAt: { $gte: startOfYear }, type: "Qrcode Bank" } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    const BanktotalAmount = await Bank.aggregate([
      { $match: { type: "Qrcode Bank" } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);
    const allTotal =
      Number(BanktotalAmount[0]?.totalAmount) +
      Number(WallettotalAmount[0]?.totalAmount);
    return res.status(200).json({
      userAll: countUser,
      itemAll: countItem,
      stockAll: totalDatas[0]?.total || 0,
      productSellAll: ProducttotalCount,
      productSell: [
        {
          name: "วันนี้",
          count: ProductdailyCount,
          description: ProductdailyCount,
        },
        {
          name: "อาทิตย์นี้",
          count: ProductweeklyCount,
          description: ProductweeklyCount,
        },
        {
          name: "เดือนนี้",
          count: ProductmonthlyCount,
          description: ProductmonthlyCount,
        },
        {
          name: "ปีนี้",
          count: ProductyearlyCount,
          description: ProductyearlyCount,
        },
      ],
      AllTopup: allTotal,
      bank: [
        {
          name: "วันนี้",
          bank: BankdailyTotal[0]?.totalAmount || 0,
          wallet: WalletdailyTotal[0]?.totalAmount || 0,
          description: "ยอดเติมเงินรายวัน",
        },
        {
          name: "อาทิตย์นี้",
          bank: BankweeklyTotal[0]?.totalAmount || 0,
          wallet: WalletweeklyTotal[0]?.totalAmount || 0,
          description: "ยอดเติมเงินรายอาทิตย์",
        },
        {
          name: "เดือนนี้",
          bank: BankmonthlyTotal[0]?.totalAmount || 0,
          wallet: WalletmonthlyTotal[0]?.totalAmount || 0,
          description: "ยอดเติมเงินรายเดือน",
        },
        {
          name: "ปีนี้",
          bank: BankyearlyTotal[0]?.totalAmount || 0,
          wallet: WalletmonthlyTotal[0]?.totalAmount || 0,
          description: "ยอดเติมเงินรายปี",
        },
      ],
      // week: ProductweeklyCount,
      // month: ProductmonthlyCount,
      // year: ProductyearlyCount,
      //   payments: {
      //     day: 100,
      //     week: 100,
      //     month: 100,
      //     year: 100,
      //   },
      //   users: {
      //     day: 100,
      //     week: 100,
      //     month: 100,
      //     year: 100,
      //   },
    });
  } else {
    res.status(405).json({
      message: "Method not allowed",
    });
  }
};

export default handler;
