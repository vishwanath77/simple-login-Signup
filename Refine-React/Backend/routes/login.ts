import express, { Request, Response, Express } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';


const app: Express = express()
const prisma = new PrismaClient(); 
dotenv.config();

app.use(express.json());

const JWT_SECRET:any = process.env.JWT_SECRET;




app.post('/', async (req: Request, res: Response):Promise<any>   => {
  try {
    const { username, password } = req.body;

    const user = await prisma.users.findUnique({where : {username: username}});
    console.log(user?.username)
    if (!user) {
      return res.status(400).json({ message: 'Invalid username!' });
    }
   
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        // console.log('Password does not match');
        return res.status(401).json({ message: 'Invalid username or password' });
      }   

    const token = jwt.sign({ username: user.username }, JWT_SECRET);

    return res.json({ message: "Login Successful ", login : true ,  token });
  } catch (error) {
    // console.error('Login Err : ', error);
    return res.status(500).json({ message: 'server error' });
  }
});

export default app;