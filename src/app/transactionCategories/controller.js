const TransactionCategory = require("./model");
const Response = require("../../utils/response");
const APIError = require("../../utils/errors");

const addCategory = async (req, res) => {
  const { name, type } = req.body;
  if (!name || !["gider", "gelir"].includes(type)) {
    throw APIError.badRequest("Geçersiz kategori verisi.");
  }

  const exists = await TransactionCategory.findOne({ name });
  if (exists) throw APIError.badRequest("Bu kategori zaten var.");

  const newCategory = await TransactionCategory.create({ name, type });
  return new Response(newCategory, "Kategori eklendi.").created(res);
};

const getCategories = async (req, res) => {
  const list = await TransactionCategory.find().sort({ createdAt: -1 });
  return new Response(list, "Kategoriler listelendi.").success(res);
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, type } = req.body;

  const updated = await TransactionCategory.findByIdAndUpdate(
    id,
    { name, type },
    { new: true }
  );

  if (!updated) throw APIError.notFound("Kategori bulunamadı.");
  return new Response(updated, "Kategori güncellendi.").success(res);
};

module.exports = {
  addCategory,
  getCategories,
  updateCategory,
};
