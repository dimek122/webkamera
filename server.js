require('dotenv').config();
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.static('public'));

app.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    const file = req.file;
    const targetEmail = process.env.TARGET_EMAIL;

    if (!file) return res.status(400).send('No photo uploaded.');

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: targetEmail,
      subject: "Foto dari Web",
      text: "Terkirim otomatis.",
      attachments: [
        {
          filename: "foto.jpg",
          content: file.buffer
        }
      ]
    });

    res.send("ok");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

app.listen(3000, () => console.log("Server jalan di http://localhost:3000"));
