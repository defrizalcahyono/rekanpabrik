const perusahaanModel = require("../models/perusahaan");
const path = require("path");
const r2 = require("../config/r2.config");
const {
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const uploadToR2 = async (file, folder) => {
  if (!file) throw new Error("File tidak valid");

  const ext = path.extname(file.originalname);
  const baseName = path.basename(file.originalname, ext);
  const fileName = `${Date.now()}_${baseName}${ext}`;
  const key = `${folder}/${fileName}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  return `${process.env.R2_PUBLIC_URL}/${key}`;
};

const deleteFromR2 = async (fileUrl) => {
  if (!fileUrl) return;

  try {
    const url = new URL(fileUrl);
    const key = url.pathname.substring(1);

    await r2.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
      })
    );
  } catch (err) {
    console.error("Gagal delete R2:", err.message);
  }
};

const getAllPerusahaan = async (req, res) => {
  try {
    const [data] = await perusahaanModel.getAllPerusahaan();

    if (data.length === 0) {
      return res.json({
        message: "Tidak ada perusahaan",
        data: [],
      });
    }

    res.json({
      message: "Menampilkan data perusahaan",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllPerusahaanByIDPerusahaan = async (req, res) => {
  const { idPerusahaan } = req.params;

  try {
    const [data] =
      await perusahaanModel.getPerusahaanByID(idPerusahaan);

    if (!data.length) {
      return res.status(404).json({
        message: "Perusahaan tidak ditemukan",
      });
    }

    return res.json({
      message: "Detail perusahaan",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateProfilePictPerusahaan = async (req, res) => {
  const { idPerusahaan } = req.params;
  const file = req.file;

  try {
    const [userData] = await perusahaanModel.searchByID(idPerusahaan);
    const found = userData[0];

    if (!found) {
      return res.status(404).json({
        message: "Perusahaan tidak ditemukan",
      });
    }

    // delete lama
    if (found.profile_pict) {
      await deleteFromR2(found.profile_pict);
    }

    // upload baru
    const newUrl = await uploadToR2(
      file,
      "foto-profile-perusahaan"
    );

    await perusahaanModel.updateProfilePictPerusahaan(
      idPerusahaan,
      newUrl
    );

    res.json({
      message: "Profile picture berhasil diupdate",
      url: newUrl,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error update profile picture",
      error: error.message,
    });
  }
};

const updateDataPerusahaan = async (req, res) => {
  const {
    idPerusahaan,
    email,
    nama_perusahaan,
    aboutMe,
    alamat,
  } = req.body;

  try {
    await perusahaanModel.updateDataPerusahaan(
      idPerusahaan,
      email,
      nama_perusahaan,
      aboutMe,
      alamat
    );

    res.json({
      message: "Data perusahaan berhasil diupdate",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error update data",
      error: error.message,
    });
  }
};

const cekPelamar = async (req, res) => {
  const { idPerusahaan } = req.params;

  try {
    const [data] = await perusahaanModel.cekPelamar(idPerusahaan);

    res.json({
      message: "Data pelamar perusahaan",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deletePerusahaanHandler = async (req, res) => {
  const { id_perusahaan } = req.params;

  try {
    const [userData] =
      await perusahaanModel.searchByID(id_perusahaan);

    const found = userData[0];

    if (!found) {
      return res.status(404).json({
        message: "Perusahaan tidak ditemukan",
      });
    }

    if (found.profile_pict) {
      await deleteFromR2(found.profile_pict);
    }

    const result =
      await perusahaanModel.deletePerusahaan(
        id_perusahaan
      );

    if (result[0].affectedRows === 0) {
      return res.status(404).json({
        message: "Gagal menghapus perusahaan",
      });
    }

    return res.json({
      message: "Perusahaan berhasil dihapus",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error delete perusahaan",
      error: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  const { id_perusahaan } = req.params;
  const { newPass } = req.body;

  try {
    await perusahaanModel.updatePasswordByID(
      newPass,
      id_perusahaan
    );

    res.json({
      message: "Password berhasil diupdate",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error update password",
      error: error.message,
    });
  }
};

module.exports = {
  getAllPerusahaanByIDPerusahaan,
  getAllPerusahaan,
  updateProfilePictPerusahaan,
  updateDataPerusahaan,
  cekPelamar,
  deletePerusahaanHandler,
  changePassword,
};