import express, { Request, Response } from 'express';
import router from './routes/routes';
import cors from 'cors';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors());

app.use("/api", router)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
