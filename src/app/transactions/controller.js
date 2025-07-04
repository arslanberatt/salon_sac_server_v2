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
    .sort({ createdAt: -1 });

  return new Response(transactions, "İşlemler listelendi.").success(res);
};

const addTransaction = async (req, res) => {
  const { type, amount, description, date, user_id, category } = req.body;

  if (!type || !amount || !description || !category) {
    throw APIError.badRequest("Gerekli alanlar eksik.");
  }

  const payload = {
    type,
    amount,
    description,
    date,
    user_id,
    category,
  };

  if (req.user?._id) {
    payload.createdBy = req.user._id;
  }

  const transaction = await Transaction.create(payload);

  return new Response(transaction, "İşlem kaydedildi.").created(res);
};


const cancelTransaction = async (req, res) => {
  const { id } = req.params;

  const transaction = await Transaction.findById(id);
  if (!transaction) throw APIError.notFound("İşlem bulunamadı.");
  if (transaction.canceled) throw APIError.badRequest("Zaten iptal edilmiş.");

  const now = new Date();
  const created = new Date(transaction.date);
  const sameMonth =
    now.getFullYear() === created.getFullYear() &&
    now.getMonth() === created.getMonth();

  if (!sameMonth) {
    throw APIError.badRequest(
      "Sadece aynı ay içindeki işlemler iptal edilebilir."
    );
  }

  transaction.canceled = true;
  transaction.canceledAt = now;
  transaction.canceledBy = req.user._id;

  await transaction.save();

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
  getTransactions
};
