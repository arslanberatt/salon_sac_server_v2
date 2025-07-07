const AdvanceRequest = require("./model");
const APIError = require("../../utils/errors");
const Response = require("../../utils/response");
const SalaryRecord = require("../salaryRecords/model");
const Transaction = require("../transactions/model");
const TransactionCategory = require("../transactionCategories/model");

const getAllAdvanceRequests = async (req, res) => {
  const requests = await AdvanceRequest.find()
    .populate("employeeId", "name lastname")
    .sort({ createdAt: -1 });

  return new Response(requests, "Tüm avans talepleri listelendi.").success(res);
};

const getMyAdvanceRequests = async (req, res) => {
  const requests = await AdvanceRequest.find({ employeeId: req.user._id }).sort(
    { createdAt: -1 }
  );
  return new Response(requests, "Avans talepleriniz listelendi.").success(res);
};

const createAdvanceRequest = async (req, res) => {
  const newRequest = new AdvanceRequest({
    employeeId: req.user._id,
    amount: req.body.amount,
    reason: req.body.reason,
  });

  await newRequest.save();
  return new Response(newRequest, "Avans talebiniz oluşturuldu.").created(res);
};

const updateAdvanceRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const request = await AdvanceRequest.findById(id);
  if (!request) throw APIError.notFound("Avans isteği bulunamadı.");
  if (request.status !== "beklemede") {
    throw APIError.badRequest("Bu istek zaten değerlendirilmiş.");
  }

  request.status = status;
  await request.save();

  if (status === "onaylandi") {
    await SalaryRecord.create({
      employeeId: request.employeeId,
      type: "avans",
      amount: request.amount,
      description: "Avans onayı sonrası otomatik kayıt",
    });

    const expenseCategory = await TransactionCategory.findOne({
      name: "Avans",
    });
    if (!expenseCategory)
      throw APIError.notFound("Avans kategorisi bulunamadı.");

    await Transaction.create({
      type: "gider",
      amount: request.amount,
      description: `${request.employeeId} avansı`,
      date: new Date(),
      category: expenseCategory._id,
      createdBy: req.user._id,
      canceled: false,
      canceledAt: null,
      canceledBy: null,
    });
  }

  return new Response(request, "Avans durumu güncellendi.").success(res);
};

module.exports = {
  getAllAdvanceRequests,
  getMyAdvanceRequests,
  createAdvanceRequest,
  updateAdvanceRequestStatus,
};
