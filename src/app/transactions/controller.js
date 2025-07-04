const Transaction = require("./model");
const SalaryRecord = require("../salaryRecords/model");
const Response = require("../../utils/response");
const APIError = require("../../utils/errors");

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
  const { id } = req.params;

  const transaction = await Transaction.findById(id);
  if (!transaction) throw APIError.notFound("İşlem bulunamadı.");
  if (transaction.canceled) {
  console.log("Bu işlem zaten iptal edilmiş:", transaction._id);
  return new Response(null, "Zaten iptal edilmiş.").success(res);
}


  const now = new Date();
  const created = new Date(transaction.date);
  const sameMonth =
    now.getFullYear() === created.getFullYear() &&
    now.getMonth() === created.getMonth();

  if (!sameMonth) {
    throw APIError.badRequest("Sadece aynı ay içindeki işlemler iptal edilebilir.");
  }

  transaction.canceled = true;
  transaction.canceledAt = now;
  transaction.canceledBy = req.user._id;
  await transaction.save();

  console.log("İşlem iptal edildi:", transaction._id);

  if (
    transaction.description.toLowerCase().includes("prim") &&
    transaction.user_id
  ) {
    await SalaryRecord.deleteOne({
      employeeId: transaction.user_id,
      amount: transaction.amount,
      type: "prim",
    });
    console.log("Prim kaydı da silindi.");
  }

  return new Response(transaction, "İşlem iptal edildi.").success(res);
};

module.exports = {
  addTransaction,
  cancelTransaction,
  getTransactions,
};
