const SalaryRecord = require("./model");
const Response = require("../../utils/response");

const getAllSalaryRecords = async (req, res) => {
  const records = await SalaryRecord.find()
    .populate("employeeId", "name lastname")
    .sort({ createdAt: -1 });
  return new Response(records, "Tüm maaş kayıtları listelendi.").success(res);
};

const getMySalaryRecords = async (req, res) => {
  const records = await SalaryRecord.find({ employeeId: req.user._id }).sort({
    createdAt: -1,
  });
  return new Response(records, "Maaş kayıtlarınız listelendi.").success(res);
};

module.exports = {
  getAllSalaryRecords,
  getMySalaryRecords,
};
