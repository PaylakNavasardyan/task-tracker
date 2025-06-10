import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

let user = '' || null;

app.get('/', (req, res) => {
    if (user) res.send(user);
    else res.send('Something went wrong. Please try again!')
})

app.post('/Registration', (req, res) => {
    const { email, name, password, repPassword, remember } = req.body;
    if (email && name && password && repPassword) {
        user = req.body;
        console.log(user)
        res.status(200).send('Something went wrong. Please try again!');
    } 
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
