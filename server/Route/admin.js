const express = require('express')
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()


const prisma = new PrismaClient();



const router = express.Router()




router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: false, message: 'Missing required fields' });
    }

    try {
        const admin = await prisma.admin.findUnique({ where: { email } });

        if (!admin) {
            return res.status(401).json({ loginStatus: false, message: 'Wrong Email or Password' });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.status(401).json({ loginStatus: false, message: 'Wrong Email or Password' });
        }

        const token = jwt.sign(
            { admin: true, email: admin.email, id: admin.id },
            process.env.ADMIN_PASSWORD,
            { expiresIn: '30d' }
        );

        res.status(200).json({ loginStatus: true, token });
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ loginStatus: false, error: err.message });
    }
});


module.exports = {admin : router}