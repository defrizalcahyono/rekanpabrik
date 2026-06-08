require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const adminModel = require("../models/admin");
const pelamarModel = require("../models/pelamar");
const perusahaanModel = require("../models/perusahaan");

const transporter = require("../config/mail.config");

const generateToken = (id, role) => {
  return jwt.sign(
    {
      id,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "2h",
    }
  );
};

const getUserModelByRole = (role) => {
  switch (role) {
    case "pelamar":
      return pelamarModel;

    case "admin":
      return adminModel;

    case "perusahaan":
      return perusahaanModel;

    default:
      throw new Error("Role tidak valid");
  }
};

const findUserByEmail = async (email) => {
  const [pelamarRows] =
    await pelamarModel.searchByEmail(email);

  if (pelamarRows.length > 0) {
    return {
      user: pelamarRows[0],
      role: "pelamar",
      idField: "id_pelamar",
    };
  }

  const [adminRows] =
    await adminModel.searchByEmail(email);

  if (adminRows.length > 0) {
    return {
      user: adminRows[0],
      role: "admin",
      idField: "id_admin",
    };
  }

  const [perusahaanRows] =
    await perusahaanModel.searchByEmail(email);

  if (perusahaanRows.length > 0) {
    return {
      user: perusahaanRows[0],
      role: "perusahaan",
      idField: "id_perusahaan",
    };
  }

  return null;
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi",
      });
    }

    email = email.trim().toLowerCase();

    const result =
      await findUserByEmail(email);

    if (!result) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    const { user, role, idField } = result;

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    const token = generateToken(
      user[idField],
      role
    );

    return res.status(200).json({
      success: true,
      message: "Login berhasil",
      token,
      role,
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

const getUserLoggedIn = async (
  req,
  res
) => {
  try {
    const model =
      getUserModelByRole(req.role);

    const [rows] =
      await model.searchByID(req.id);

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    const user = rows[0];

    delete user.password;

    return res.status(200).json({
      success: true,
      message: "User ditemukan",
      data: user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createAccountPelamar = async (
  req,
  res
) => {
  try {
    let {
      email,
      password,
      first_name,
      last_name,
    } = req.body;

    if (
      !email ||
      !password ||
      !first_name ||
      !last_name
    ) {
      return res.status(400).json({
        success: false,
        message: "Semua field wajib diisi",
      });
    }

    email = email.trim().toLowerCase();

    const [existingUser] =
      await pelamarModel.searchByEmail(
        email
      );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }

    await pelamarModel.addPelamar(
      email,
      password,
      "pelamar",
      first_name,
      last_name
    );

    return res.status(201).json({
      success: true,
      message:
        "Akun pelamar berhasil dibuat",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createAccountPerusahaan =
  async (req, res) => {
    try {
      let {
        email,
        password,
        namaPerusahaan,
      } = req.body;

      if (
        !email ||
        !password ||
        !namaPerusahaan
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Semua field wajib diisi",
        });
      }

      email = email.trim().toLowerCase();

      const [existing] =
        await perusahaanModel.searchByEmail(
          email
        );

      if (existing.length > 0) {
        return res.status(409).json({
          success: false,
          message:
            "Email sudah terdaftar",
        });
      }

      await perusahaanModel.addPerusahaan(
        email,
        password,
        "perusahaan",
        namaPerusahaan
      );

      return res.status(201).json({
        success: true,
        message:
          "Akun perusahaan berhasil dibuat",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


const createAccountAdmin = async (
  req,
  res
) => {
  try {
    let {
      email,
      password,
      first_name,
      last_name,
    } = req.body;

    if (
      !email ||
      !password ||
      !first_name ||
      !last_name
    ) {
      return res.status(400).json({
        success: false,
        message: "Semua field wajib diisi",
      });
    }

    email = email.trim().toLowerCase();

    const [existingUser] =
      await adminModel.searchByEmail(
        email
      );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }

    await adminModel.addAdmin(
      email,
      password,
      "admin",
      first_name,
      last_name
    );

    return res.status(201).json({
      success: true,
      message:
        "Akun admin berhasil dibuat",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const forgetPassword = async (
  req,
  res
) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email wajib diisi",
      });
    }

    email = email.trim().toLowerCase();

    const result =
      await findUserByEmail(email);

    if (!result) {
      return res.status(404).json({
        success: false,
        message:
          "Email tidak ditemukan",
      });
    }

    const {
      user,
      role,
      idField,
    } = result;

    const token = jwt.sign(
      {
        id: user[idField],
        role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const resetLink =
      `${process.env.WEB_URL}/resetPassword/${token}`;

    await transporter.sendMail({
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Reset Password",
      html: `
        <h2>Reset Password</h2>
        <p>Klik tombol berikut:</p>

        <a href="${resetLink}">
          Reset Password
        </a>

        <p>Link berlaku 15 menit.</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message:
        "Email reset password berhasil dikirim",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const resetPassword = async (
  req,
  res
) => {
  try {
    const { newPassword } =
      req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password baru wajib diisi",
      });
    }

    const model =
      getUserModelByRole(req.role);

    await model.updatePasswordByID(
      newPassword,
      req.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Password berhasil diperbarui",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  login,

  getUserLoggedIn,

  createAccountPelamar,
  createAccountPerusahaan,
  createAccountAdmin,

  forgetPassword,
  resetPassword,
};