const Response = require("../../utils/response");
const APIError = require("../../utils/errors");
const Service = require("./model");

const getAllServices = async (req, res) => {
  const services = await Service.find({});
  return new Response(services, "Hizmetler listelendi.").success(res);
};

const createService = async (req, res) => {
  const newService = new Service(req.body);
  await newService.save();
  return new Response(newService, "Hizmet başarıyla oluşturuldu.").success(res);
};

const updateService = async (req, res) => {
  const updatedService = await Service.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  if (!updatedService) {
    throw APIError.notFound("Hizmet bulunamadı.");
  }
  return new Response(updatedService, "Hizmet başarıyla güncellendi.").success(
    res
  );
};

module.exports = {
  getAllServices,
  createService,
  updateService,
};
