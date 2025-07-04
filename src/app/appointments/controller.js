const Appointment = require("./model");
const User = require("../users/model");
const SalaryRecord = require("../salaryRecords/model");
const Response = require("../../utils/response");
const APIError = require("../../utils/errors");
const Transaction = require("../transactions/model");
const TransactionCategory = require("../transactionCategories/model");

const createAppointment = async (req, res) => {
  const user = req.user;

  if (
    !user.is_admin &&
    !user.is_moderator &&
    req.body.employee_id !== user._id.toString()
  ) {
    throw APIError.forbidden(
      "Başka bir çalışan adına randevu oluşturamazsınız."
    );
  }

  const newAppointment = new Appointment(req.body);
  await newAppointment.save();
  return new Response(newAppointment, "Randevu oluşturuldu.").created(res);
};

const getAppointments = async (req, res) => {
  const user = req.user;
  const filter = {};

  if (!user.is_admin && !user.is_moderator) {
    filter.employee_id = user._id;
  }

  const appointments = await Appointment.find(filter)
    .sort({ createdAt: -1 })
    .populate("employee_id", "name lastname")
    .populate("services", "name price duration");

  return new Response(appointments, "Randevular listelendi.").success(res);
};

const markAsDone = async (req, res) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id);
  if (!appointment) throw APIError.notFound("Randevu bulunamadı.");
  if (appointment.is_done) throw APIError.badRequest("Zaten tamamlandı.");
  if (appointment.is_cancelled)
    throw APIError.badRequest("İptal edilmiş randevu tamamlanamaz.");

  appointment.is_done = true;
  await appointment.save();

  const employee = await User.findById(appointment.employee_id);
  const rate = employee.commissionRate || 0;
  const commission = Math.floor((appointment.price * rate) / 100);

  await SalaryRecord.create({
    employeeId: employee._id,
    type: "prim",
    amount: commission,
    description: `${appointment.customer_name} randevusundan prim`,
    appointment_id: appointment._id,
  });

  const category = await TransactionCategory.findOne({
    name: "Randevu geliri",
  });
  if (!category)
    throw APIError.notFound("Randevu geliri kategorisi bulunamadı.");

  await Transaction.create({
    category_id: category._id,
    amount: appointment.price,
    description: `${appointment.customer_name} randevusundan elde edilen gelir`,
    user_id: employee._id,
    appointment_id: appointment._id,
    createdBy: req.user._id,
    type: "gelir",
  });

  return new Response(
    appointment,
    "Randevu tamamlandı, prim ve gelir kaydedildi."
  ).success(res);
};

const cancelAppointment = async (req, res) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id);
  if (!appointment) throw APIError.notFound("Randevu bulunamadı.");
  if (appointment.is_cancelled)
    throw APIError.badRequest("Zaten iptal edilmiş.");
  if (appointment.is_done)
    throw APIError.badRequest("Tamamlanan randevu iptal edilemez.");

  appointment.is_cancelled = true;
  await appointment.save();

  return new Response(appointment, "Randevu iptal edildi.").success(res);
};

const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const appointment = await Appointment.findById(id);
  if (!appointment) throw APIError.notFound("Randevu bulunamadı.");

  if (
    !user.is_admin &&
    !user.is_moderator &&
    appointment.employee_id.toString() !== user._id.toString()
  ) {
    throw APIError.forbidden("Bu randevuyu güncelleme yetkiniz yok.");
  }

  Object.assign(appointment, req.body);
  await appointment.save();

  return new Response(appointment, "Randevu güncellendi.").success(res);
};


module.exports = {
  createAppointment,
  getAppointments,
  markAsDone,
  cancelAppointment,
  updateAppointment
};
