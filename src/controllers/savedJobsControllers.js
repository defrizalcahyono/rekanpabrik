const savedJobsModel = require("../models/savedJobs");

const savedJobs = async (req, res) => {
  const { idPelamar, idPostPekerjaan } = req.body;

  try {
    if (!idPelamar || !idPostPekerjaan) {
      return res.status(400).json({
        success: false,
        message: "idPelamar dan idPostPekerjaan wajib diisi",
      });
    }

    // cek sudah disimpan atau belum
    const [existing] = await savedJobsModel.isJobSaved(
      idPelamar,
      idPostPekerjaan
    );

    // kalau sudah ada → UNSAVE (toggle)
    if (existing.length > 0) {
      await savedJobsModel.deleteSavedJobByPelamarAndPost(
        idPelamar,
        idPostPekerjaan
      );

      return res.json({
        success: true,
        message: "Pekerjaan dihapus dari saved jobs",
        saved: false,
      });
    }

    // kalau belum ada → SAVE
    await savedJobsModel.simpanPekerjaan(
      idPelamar,
      idPostPekerjaan
    );

    res.json({
      success: true,
      message: "Pekerjaan berhasil disimpan",
      saved: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getSavedJobsByIdPelamar = async (req, res) => {
  const { idPelamar } = req.params;

  try {
    const [data] =
      await savedJobsModel.getSavedJobsByIdPelamar(
        idPelamar
      );

    res.json({
      success: true,
      message:
        data.length > 0
          ? `Saved jobs user ${idPelamar}`
          : "Belum ada saved jobs",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  savedJobs,
  getSavedJobsByIdPelamar
};