const sharp = require("sharp");

const compressImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const imageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (!imageTypes.includes(req.file.mimetype)) {
    return next();
  }

  try {
    let sharpInstance = sharp(req.file.buffer).resize({
      width: 1024,
      withoutEnlargement: true,
    });

    if (
      req.file.mimetype === "image/jpeg" ||
      req.file.mimetype === "image/jpg"
    ) {
      req.file.buffer = await sharpInstance
        .jpeg({ quality: 75 })
        .toBuffer();
    } else if (req.file.mimetype === "image/png") {
      req.file.buffer = await sharpInstance
        .png({ quality: 75 })
        .toBuffer();
    }

    next();
  } catch (error) {
    console.error("Compression error:", error);

    return res.status(500).json({
      success: false,
      message: "Image compression failed",
    });
  }
};

module.exports = compressImage;