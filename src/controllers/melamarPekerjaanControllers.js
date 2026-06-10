const melamarPekerjaanModel = require("../models/melamarPekerjaan");

const melamarPekerjaan = async (req, res) => {
  try {
    const { idPostPekerjaan, idPelamar } = req.body;

    if (!idPostPekerjaan || !idPelamar) {
      return res.status(400).json({
        success: false,
        message: "Data tidak lengkap",
      });
    }

    const [existing] =
      await melamarPekerjaanModel.checkAlreadyApplied(
        idPostPekerjaan,
        idPelamar
      );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Anda sudah melamar pekerjaan ini",
      });
    }

    await melamarPekerjaanModel.reqMelamarPekerjaan(
      idPostPekerjaan,
      idPelamar,
      new Date(),
      "diproses"
    );

    return res.status(201).json({
      success: true,
      message: "Lamaran berhasil dikirim",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { idlamaranpekerjaan } = req.params;
    const { status } = req.body;

    const allowedStatus = [
      "diproses",
      "diterima",
      "ditolak",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status tidak valid",
      });
    }

    const [result] =
      await melamarPekerjaanModel.updateStatus(
        status,
        idlamaranpekerjaan
      );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Lamaran tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Status berhasil diperbarui",
      status,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getDataMelamarPekerjaan = async (req, res) => {
  try {
    const [data] =
      await melamarPekerjaanModel.getDataMelamarPekerjaan();

    return res.status(200).json({
      success: true,
      total: data.length,
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getMelamarHistoryByIDPelamar = async (
  req,
  res
) => {
  try {
    const { idPelamar } = req.params;

    const [data] =
      await melamarPekerjaanModel.getMelamarHistoryByIDPelamar(
        idPelamar
      );

    return res.status(200).json({
      success: true,
      total: data.length,
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getMelamarHistoryByIDPostingan = async (
  req,
  res
) => {
  try {
    const { idPostinganPekerjaan } = req.params;

    const [data] =
      await melamarPekerjaanModel.getMelamarHistoryByIDPostingan(
        idPostinganPekerjaan
      );

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      data: data[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  melamarPekerjaan,
  updateStatus,

  getDataMelamarPekerjaan,

  getMelamarHistoryByIDPelamar,
  getMelamarHistoryByIDPostingan,
};