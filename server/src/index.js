import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bcryptjs from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;
const saltԼevel  = 10;

app.use(cors());
app.use(express.json());

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
                    <td>${user.remember}</td>
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
                                <th>Remember</th>
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
    const { email, name, password, repPassword, remember } = req.body;

    if (email && name && password && repPassword) {
        try {
            const hashedPassword = await bcryptjs.hash(password, saltԼevel);
            
            const newUser = {
                email,
                name,
                password: hashedPassword,
                remember
            };

            const userEmails = new Set(users.map(u => u.email));
            const userNames = new Set(users.map(u => u.name));
            
            if (!userEmails.has(newUser.email) && !userNames.has(newUser.name)) {
                users.push(newUser);
                console.log('All users now:', users);
                console.log('User registered:', newUser);
 
                return res.status(201).json({message: 'User registered succesfully'});
            } else if (userEmails.has(newUser.email)) {
                return res.status(409).json({message: 'Email already exist'});
            } else if (userNames.has(newUser.name)) {
                return res.status(409).json({message: 'Name already exist'});
            } else {
                return res.status(503).json({message: 'Something went wrong. Please try later!'});
            }
        } catch(error) {
            console.error('Error hashing password', error);
            res.status(500).send('Server error')
        }
    } else {
        return res.status(400).json({ error: 'Missing required fields' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
