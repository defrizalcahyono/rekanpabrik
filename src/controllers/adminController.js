const adminModel = require("../models/admin");
const pelamarModel = require("../models/pelamar");
const perusahaanModel = require("../models/perusahaan");
const postPekerjaanModel = require("../models/postingPekerjaan");

const createAccountAdmin = async (req, res) => {
  try {
    const {
      email,
      password,
      name,
    } = req.body;

    if (
      !email ||
      !password ||
      !name
    ) {
      return res.status(400).json({
        success: false,
        message: "Semua field wajib diisi",
      });
    }

    const [existingAdmin] =
      await adminModel.searchByEmail(email);

    if (existingAdmin.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }

    await adminModel.addAdmin(
      email,
      password,
      name,
      "admin"
    );

    return res.status(201).json({
      success: true,
      message: "Admin berhasil dibuat",
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

const countUser = async (req, res) => {
  try {
    const [
      [[pelamar]],
      [[admin]],
      [[perusahaan]],
      [[postingan]],
    ] = await Promise.all([
      pelamarModel.countPelamar(),
      adminModel.countAdmin(),
      perusahaanModel.countPerusahaan(),
      postPekerjaanModel.countPostingan(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        jumlahPelamar: pelamar.total,
        jumlahAdmin: admin.total,
        jumlahPerusahaan: perusahaan.total,
        jumlahPostinganPekerjaan:
          postingan.total,
      },
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

const getAllAdmin = async (req, res) => {
  try {
    const [admins] =
      await adminModel.getAllAdmin();

    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil data admin",
      total: admins.length,
      data: admins,
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

const getMeAdmin = async (
  req,
  res
) => {
  try {
    const [rows] =
      await adminModel.searchByID(
        req.id
      );

    if (
      !rows ||
      rows.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Admin tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProfileAdmin = async (
  req,
  res
) => {
  try {
    const {
      email,
      name,
    } = req.body;

    const id_admin = req.id;

    if (
      !email ||
      !name
    ) {
      return res.status(400).json({
        success: false,
        message: "Data tidak lengkap",
      });
    }

    await adminModel.updateProfileAdmin(
      email,
      name,
      id_admin
    );

    return res.status(200).json({
      success: true,
      message:
        "Profile admin berhasil diperbarui",
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

const deleteAdminHandler = async (req, res) => {
  try {
    const { id_admin } = req.params;

    if (!id_admin) {
      return res.status(400).json({
        success: false,
        message: "ID admin wajib diisi",
      });
    }

    const [result] =
      await adminModel.deleteAdmin(id_admin);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin berhasil dihapus",
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
  createAccountAdmin,
  countUser,
  getAllAdmin,
  getMeAdmin,
  updateProfileAdmin,
  deleteAdminHandler,
};