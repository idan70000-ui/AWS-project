require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const {
  S3Client,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const app = express();
const PORT = process.env.PORT || 3000;

const s3 = new S3Client({
  region: process.env.AWS_REGION,
});

const BUCKET = process.env.S3_BUCKET;

const upload = multer({
  storage: multer.memoryStorage(),
});

const posts = [];

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/test", (req, res) => {
  res.json({
    message: "Server and CORS are working",
  });
});

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image was uploaded",
      });
    }

    const unique = `${Date.now()}-${req.file.originalname}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: unique,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    posts.unshift({
      key: unique,
      description: req.body.description || "",
    });

    return res.status(201).json({
      message: "File uploaded successfully",
      key: unique,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error uploading file",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});