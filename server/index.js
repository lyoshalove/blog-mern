import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { registerValidation, loginValidation } from './validations/auth.js';
import checkAuth from './utils/checkAuth.js';
import { postCreateValidation } from './validations/post.js';
import handleValidationErrors from './utils/handleValidationErrors.js';
import { UserController, PostController } from './controllers/index.js';
import cors from 'cors';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Mongo connected'))
  .catch((error) => console.log('Mongo ERROR', error));

const app = express();
const PORT = process.env.PORT || 5000;
const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    if(!fs.existsSync('uploads')) {
      fs.mkdir('uploads');
    }
    callback(null, "uploads");
  },
  filename: (_, file, callback) => {
    callback(null, file.originalname);
  },
});
const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.status(200).send('Hello World!!');
});

app.post(
  "/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/tags", PostController.getLastTags);

app.get("/posts", PostController.getAll);
app.get("/posts/tags", PostController.getLastTags);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.createPost
);
app.get("/posts/:id", PostController.getOne);
app.delete("/posts/:id", checkAuth, PostController.deletePost);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.updatePost
);

app.post("/posts/:id", checkAuth, PostController.createComment);

app.listen(PORT, () => console.log(`Server started on ${PORT} port`));