const pengaduanModel = require("../models/pengaduanUser");

const addPengaduan = async (req, res) => {
  const { first_name, last_name, email, nomor_telpon, pesan } = req.body;

  try {
    if (!first_name || !email || !pesan) {
      return res.status(400).json({
        success: false,
        message: "first_name, email, dan pesan wajib diisi",
      });
    }

    await pengaduanModel.addPengaduan(
      first_name,
      last_name,
      email,
      nomor_telpon,
      pesan
    );

    res.status(201).json({
      success: true,
      message: "Pengaduan berhasil ditambahkan",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllPengaduan = async (req, res) => {
  try {
    const [data] = await pengaduanModel.getAllPengaduan();

    if (data.length === 0) {
      return res.json({
        success: true,
        message: "Tidak ada data pengaduan",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Menampilkan semua pengaduan",
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

const deletePengaduan = async (req, res) => {
  const { id_pengaduan } = req.params;

  try {
    const result = await pengaduanModel.deletePengaduan(id_pengaduan);

    if (result[0].affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Data pengaduan tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Data pengaduan berhasil dihapus",
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
  addPengaduan,
  getAllPengaduan,
  deletePengaduan,
};