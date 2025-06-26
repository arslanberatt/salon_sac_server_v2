const Transaction = require("./model");
const SalaryRecord = require("../salaryRecords/model");
const Response = require("../../utils/response");
const APIError = require("../../utils/errors");

const addTransaction = async (req, res) => {
  const { type, amount, description, date, user_id } = req.body;

  if (!type || !amount || !description) {
    throw APIError.badRequest("Gerekli alanlar eksik.");
  }

  const transaction = await Transaction.create({
    type,
    amount,
    description,
    date,
    user_id,
    createdBy: req.user._id,
  });

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
};
