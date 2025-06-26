class Response {
  constructor(data = null, message = null) {
    this.data = data;
    this.message = message;
  }

  success(res) {
    return res.status(200).json({
      success: true,
      data: this.data,
      message: this.message ?? "İşlem başarılı!",
    });
  }

  created(res) {
    return res.status(201).json({
      success: true,
      data: this.data,
      message: this.message ?? "Kayıt başarılı!",
    });
  }

  error500(res) {
    return res.status(500).json({
      success: false,
      data: this.data,
      message: this.message ?? "İşlem Başarısız!",
    });
  }

  error400(res) {
    return res.status(400).json({
      success: false,
      data: this.data,
      message: this.message ?? "İşlem Başarısız!",
    });
  }

  error401(res) {
    return res.status(401).json({
      success: false,
      data: this.data,
      message: this.message ?? "Yetkisiz erişim!",
    });
  }

  error404(res) {
    return res.status(404).json({
      success: false,
      data: this.data,
      message: this.message ?? "İstek bulunamadı!",
    });
  }

  error429(res) {
    return res.status(429).json({
      success: false,
      data: this.data,
      message: this.message ?? "Çok fazla istek atıldı!",
    });
  }

  error503(res) {
    return res.status(503).json({
      success: false,
      data: this.data,
      message: this.message ?? "Servis geçici olarak kullanılamıyor!",
    });
  }
}
module.exports = Response;
