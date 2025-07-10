const Transaction = require("./model");
const SalaryRecord = require("../salaryRecords/model");
const Response = require("../../utils/response");
const APIError = require("../../utils/errors");
const User = require("../users/model");
const AdvanceRequest = require("../advanceRequests/model");

const getTransactions = async (req, res) => {
  const filter = {};
  const user = req.user;

  if (!user.is_admin && !user.is_moderator) {
    filter.user_id = user._id;
  }

  const transactions = await Transaction.find(filter)
    .populate("category")
    .sort({ createdAt: -1 });

  console.log("Transaction listesi gönderildi:", transactions.length);
  return new Response(transactions, "İşlemler listelendi.").success(res);
};

const addTransaction = async (req, res) => {
  const user = req.user;
  const { type, amount, description, date, user_id, category } = req.body;

  console.log("Gelen body:", req.body);

  if (!type || !amount || !description || !category?._id) {
    console.warn("Eksik alan:", { type, amount, description, category });
    throw APIError.badRequest("Gerekli alanlar eksik.");
  }

  const newTransaction = new Transaction({
    type,
    amount,
    description,
    date,
    user_id,
    category: category._id,
    createdBy: user._id,
  });

  await newTransaction.save();

  console.log("Yeni işlem kaydedildi:", newTransaction._id);
  return new Response(newTransaction, "İşlem kaydedildi.").created(res);
};

const cancelTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "İşlem bulunamadı.",
      });
    }

    if (transaction.canceled) {
      return res.status(200).json({
        success: true,
        message: "İşlem zaten iptal edilmiş.",
        data: transaction,
      });
    }

    // İşlemi iptal et
    transaction.canceled = true;
    transaction.canceledAt = new Date();
    transaction.canceledBy = req.user._id;
    await transaction.save();

    // İlgili salary record'u sil
    await SalaryRecord.findOneAndDelete({
      amount: transaction.amount,
      description: transaction.description,
    });

    // Avans iptali kontrolü
    if (transaction.description.includes("avansı")) {
      const employeeIdRaw = transaction.description.split(" ")[0];

      const advance = await AdvanceRequest.findOne({
        employeeId: employeeIdRaw,
        amount: transaction.amount,
        status: "onaylandi",
      });

      if (advance) {
        advance.status = "beklemede";
        await advance.save();
        console.log("Advance status reset:", advance._id);
      }
    }

    return res.status(200).json({
      success: true,
      message: "İşlem iptal edildi.",
      data: transaction,
    });
  } catch (error) {
    console.error("İptal hatası:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  addTransaction,
  cancelTransaction,
  getTransactions,
};
