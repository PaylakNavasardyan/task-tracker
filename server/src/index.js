import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bcryptjs from 'bcryptjs';
import { sendVerificationCode, generateCode } from './verificationCode.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;
const saltԼevel  = 10;
const router = express.Router();

app.use(cors());
app.use(express.json());
app.use('/', router);

let users = [];

app.get('/', (req, res) => {
    if (users.length > 0) {
        const tableRows = users
            .map((user, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.password}</td>
                </tr>
            `)
            .join('');

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(`
            <html>
                <head>
                    <title>Registered Users</title>
                    <style>
                        table {
                            width: 80%;
                            border-collapse: collapse;
                            margin: 20px auto;
                        }
                        th, td {
                            border: 1px solid #aaa;
                            padding: 8px 12px;
                            text-align: left;
                        }
                        th {
                            background-color: #f0f0f0;
                        }
                    </style>
                </head>
                <body>
                    <h2 style="text-align: center;">Registered Users</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Hashed Password</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </body>
            </html>
        `);
    } else {
        res.status(200).send('No users yet');
    }
});

app.post('/Registration', async(req, res) => {
    const { email, name, password, repPassword } = req.body;

    if (email && name && password && repPassword) {
        try {
            const hashedPassword = await bcryptjs.hash(password, saltԼevel);
            
            const newUser = {
                email,
                name,
                password: hashedPassword,
            };

            const userEmails = new Set(users.map(u => u.email));
            const userNames = new Set(users.map(u => u.name));
            
            if (!userEmails.has(newUser.email) && !userNames.has(newUser.name)) {
                users.push(newUser);
                console.log('All users now:', users);
                console.log('User registered:', newUser);
 
                return res.status(201).json({ message: 'User registered succesfully' });
            } else if (userEmails.has(newUser.email)) {
                return res.status(409).json({ message: 'Email already exist' });
            } else if (userNames.has(newUser.name)) {
                return res.status(409).json({ message: 'Name already exist' });
            } else {
                return res.status(503).json({ message: 'Something went wrong. Please try later!' });
            }
        } catch(error) {
            console.error('Error hashing password', error);
            res.status(500).send('Server error')
        }
    } else {
        return res.status(400).json({ error: 'Missing required fields' });
    }
});

app.post('/Login', async (req, res) => {
    const { name, password } = req.body;

   if (name && password) {
        try {
            const existingUser = users.find(u => u.name === name);

            if (!existingUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            const isMatch = await bcryptjs.compare(password, existingUser.password);

            if (!isMatch) {
                return res.status(401).json({ message: 'Incorrect password provided' });
            }

            console.log('Logged in user:', existingUser);
            return res.status(201).json({ message: 'User logged in', user: existingUser });

        } catch (error) {
            console.error('Passwords matching error', error);
            res.status(500).json({ message: 'Something went wrong. Please try later!' });
        }
    } else {
        return res.status(400).json({ error: 'Missing login data' });
    }
})

router.post('/Forgot', async (req, res) => {
    const { email, newPassword, repNewPassword } = req.body;

    if (email && newPassword && repNewPassword) {
        try {
            const existedUserIndex = users.findIndex(u => u.email === email);
            
            if (existedUserIndex === -1) {
                return res.status(404).json({ message: 'Email not found' })
            }

            const hashedNewPassword = await bcryptjs.hash(newPassword, saltԼevel);
            const userRegisteredEmail = new Set(users.map(u => u.email));

            if (userRegisteredEmail.has(email))     {
                console.log('Email found');
                
                users[existedUserIndex] = {
                    name: users[existedUserIndex].name,
                    email,
                    password: hashedNewPassword
                };

                console.log('Updated users', users);

                const code = generateCode();
                const success = await sendVerificationCode(email, code);

                if (success) {
                    res.status(201).json({ message: 'Email found' })
                }

            } else if (!userRegisteredEmail) {
                console.log('Email not found')
                res.status(401).json({ message: 'You must enter the email address you used to register' })
            } 
        } catch(error) {
            console.error(error)
        }
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
