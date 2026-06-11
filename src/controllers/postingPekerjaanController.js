const postPekerjaanModel = require("../models/postingPekerjaan");

const getAllPost = async (req, res) => {
  try {
    const [data] = await postPekerjaanModel.getAllPost();

    res.json({
      message:
        data.length > 0
          ? "Menampilkan data postingan pekerjaan"
          : "Tidak ada postingan pekerjaan",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllPostByIdPerusahaan = async (req, res) => {
  const { idPerusahaan } = req.params;

  try {
    const [data] =
      await postPekerjaanModel.getAllPostByIDPerusahaan(
        idPerusahaan
      );

    res.json({
      message: "Data postingan perusahaan",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getPostinganByIdPostPekerjaan = async (req, res) => {
  const { idPostingan } = req.params;

  try {
    const [data] =
      await postPekerjaanModel.getPostByIDPostingan(
        idPostingan
      );

    if (!data.length) {
      return res.status(404).json({
        message: "Postingan tidak ditemukan",
      });
    }

    res.json({
      message: "Detail postingan",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const createdPostinganPekerjaan = async (req, res) => {
  const {
    idPerusahaan,
    posisi,
    lokasi,
    jobDetails,
    requirements,
  } = req.body;

  const status = "terbuka";

  try {
    if (
      !idPerusahaan ||
      !posisi ||
      !lokasi ||
      !jobDetails ||
      !requirements
    ) {
      return res.status(400).json({
        message: "Semua field wajib diisi",
      });
    }

    // CEK DUPLIKAT
    const [existing] =
      await postPekerjaanModel.checkDuplicatePostingan(
        idPerusahaan,
        posisi,
        lokasi
      );

    if (existing.length > 0) {
      return res.status(409).json({
        message:
          "Lowongan dengan posisi dan lokasi yang sama sudah ada",
      });
    }

    const createdAt = new Date();

    await postPekerjaanModel.addPostPekerjaan(
      idPerusahaan,
      posisi,
      lokasi,
      jobDetails,
      requirements,
      status,
      createdAt
    );

    res.status(201).json({
      message: "Postingan berhasil dibuat",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error create post",
      error: error.message,
    });
  }
};

const deletePostingan = async (req, res) => {
  const { idPostPekerjaan } = req.params;

  try {
    await postPekerjaanModel.deletePostingan(
      idPostPekerjaan
    );

    res.json({
      message: "Postingan berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateStatus = async (req, res) => {
  const { idPostPekerjaan } = req.params;
  const { status } = req.body;

  try {
    await postPekerjaanModel.editStatusPostingan(
      idPostPekerjaan,
      status
    );

    res.json({
      message: "Status berhasil diupdate",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getDetailPelamar = async (req, res) => {
  const { idLamaranPekerjaan } = req.params;

  try {
    const [data] =
      await postPekerjaanModel.getDetailPelamar(
        idLamaranPekerjaan
      );

    res.json({
      message: "Detail pelamar",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllPost,
  getAllPostByIdPerusahaan,
  getPostinganByIdPostPekerjaan,
  createdPostinganPekerjaan,
  deletePostingan,
  updateStatus,
  getDetailPelamar,
};