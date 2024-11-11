// import express, { Request, Response, Express } from 'express';
// import bcrypt from 'bcryptjs';
// import { PrismaClient } from '@prisma/client';

// const app: Express = express();
// const prisma = new PrismaClient();

// app.use(express.json());

// app.post('/', async (req: Request, res: Response): Promise<any> => {
//   try {
//     const { username, email, password } = req.body;

//     const userExist = await prisma.users.findFirst({
//       where: {
//         OR: [
//           { username: username },
//           { email: email }
//         ]
//       }
//     });

//     if (userExist) {
//       if (userExist.email === email) {
//         return res.status(400).json({ message: 'Email already in use.' });
//       }
       
//       if (userExist.username === username) {
//         return res.status(400).json({ message: 'User already Exist' });
//       }
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = await prisma.users.create({
//       data: {
//         username,
//         email,
//         password: hashedPassword,
//       },
//     });

   
//     return res.status(201).json({ signup: true, message: 'User created successfully', newUser });
//   } catch (error) {
//     console.error('Signup Error:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });

// export default app;


import express, { Request, Response, Express } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { Server } from 'socket.io';
import http from 'http';

const app: Express = express();
const prisma = new PrismaClient();
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server); // Initialize Socket.io with the server

app.use(express.json());

// WebSocket connection setup
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Example: Emit a welcome message upon connection
  socket.emit('welcome', 'Welcome to the WebSocket server!');

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.post('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, email, password } = req.body;

    const userExist = await prisma.users.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    });

    if (userExist) {
      if (userExist.email === email) {
        return res.status(400).json({ message: 'Email already in use.' });
      }

      if (userExist.username === username) {
        return res.status(400).json({ message: 'User already exists' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    
    io.emit('newUser', { message: 'A new user has registered', newUser });

    return res.status(201).json({ signup: true, message: 'User created successfully', newUser });
  } catch (error) {
    console.error('Signup Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
