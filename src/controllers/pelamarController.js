const pelamarModel = require("../models/pelamar");
const path = require("path");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const r2 = require("../config/r2.config");

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
    const key = url.pathname.substring(1); // remove leading "/"

    await r2.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
      })
    );
  } catch (err) {
    console.error("Gagal delete file R2:", err.message);
  }
};

const getAllPelamar = async (req, res) => {
  try {
    const [data] = await pelamarModel.getAllPelamar();

    if (data.length === 0) {
      return res.json({
        message: "Tidak ada pelamar terdaftar",
      });
    }

    res.json({
      message: "Menampilkan data akun pelamar",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error server",
      error: error.message,
    });
  }
};

const updateDataPelamr = async (req, res) => {
  const { idPelamar } = req.params;
  const { first_name, last_name, email, aboutMe } = req.body;

  try {
    await pelamarModel.updateDataPelamar(
      idPelamar,
      first_name,
      last_name,
      email,
      aboutMe
    );

    res.json({
      message: "Data berhasil diupdate",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error update data",
      error: error.message,
    });
  }
};

const updateProfilePictPelamar = async (req, res) => {
  const { idPelamar } = req.params;
  const file = req.file;

  try {
    const [userData] = await pelamarModel.searchByID(idPelamar);
    const found = userData[0];

    if (!found) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    // delete lama
    if (found.profile_pict) {
      await deleteFromR2(found.profile_pict);
    }

    // upload baru
    const newUrl = await uploadToR2(file, "foto-profile-user");

    await pelamarModel.updateProfilePictPelamar(newUrl, idPelamar);

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

const updateCVPelamar = async (req, res) => {
  const { idPelamar } = req.params;
  const file = req.file;

  try {
    const [userData] = await pelamarModel.searchByID(idPelamar);
    const found = userData[0];

    if (!found) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    // delete lama
    if (found.curriculum_vitae) {
      await deleteFromR2(found.curriculum_vitae);
    }

    // upload baru
    const newUrl = await uploadToR2(file, "curriculum-vitae");

    await pelamarModel.updateCV(newUrl, idPelamar);

    res.json({
      message: "CV berhasil diupdate",
      url: newUrl,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error update CV",
      error: error.message,
    });
  }
};

const deletePelamarHandler = async (req, res) => {
  const { id_pelamar } = req.params;

  try {
    const [userData] =
      await pelamarModel.searchByID(id_pelamar);

    const found = userData[0];

    if (!found) {
      return res.status(404).json({
        message: "Pelamar tidak ditemukan",
      });
    }

    if (found.profile_pict) {
      await deleteFromR2(found.profile_pict);
    }

    if (found.curriculum_vitae) {
      await deleteFromR2(found.curriculum_vitae);
    }

    const result =
      await pelamarModel.deletePelamar(id_pelamar);

    if (result[0].affectedRows === 0) {
      return res.status(404).json({
        message: "Pelamar tidak ditemukan",
      });
    }

    return res.json({
      message: "Pelamar berhasil dihapus",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error delete pelamar",
      error: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  const { id_pelamar } = req.params;
  const { newPass } = req.body;

  try {
    await pelamarModel.updatePasswordByID(newPass, id_pelamar);

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
  getAllPelamar,
  updateDataPelamr,
  updateProfilePictPelamar,
  updateCVPelamar,
  deletePelamarHandler,
  changePassword,
};