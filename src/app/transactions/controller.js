const Transaction = require("./model");
const SalaryRecord = require("../salaryRecords/model");
const Response = require("../../utils/response");
const APIError = require("../../utils/errors");

const getAllTransactions = async (req, res) => {
  const transactions = await Transaction.find()
    .populate("category")
    .populate("createdBy", "name lastname") // sadece ad-soyad
    .sort({ createdAt: -1 });

  return new Response({ transactions }, "Tüm işlemler listelendi.").success(res);
};

const addTransaction = async (req, res) => {
  const { amount, description, date, user_id, category } = req.body;

  if (!category || !amount || !description) {
    throw APIError.badRequest("Gerekli alanlar eksik.");
  }

  const transaction = await Transaction.create({
    amount,
    description,
    date,
    user_id,
    category,
    createdBy: req.user._id,
  });

  return new Response(transaction, "İşlem kaydedildi.").created(res);
};

const cancelTransaction = async (req, res) => {
  const { id } = req.params;

  const transaction = await Transaction.findById(id).populate("category");
  if (!transaction) throw APIError.notFound("İşlem bulunamadı.");
  if (transaction.canceled) throw APIError.badRequest("Zaten iptal edilmiş.");

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

  // prim iptali varsa maaş kaydını sil
  if (
    transaction.description.toLowerCase().includes("prim") &&
    transaction.user_id
  ) {
    await SalaryRecord.deleteOne({
      employeeId: transaction.user_id,
      amount: transaction.amount,
      type: "prim",
    });
  }

  return new Response(transaction, "İşlem iptal edildi.").success(res);
};

module.exports = {
  addTransaction,
  cancelTransaction,
  getAllTransactions
};
