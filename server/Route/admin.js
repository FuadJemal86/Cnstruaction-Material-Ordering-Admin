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

// add-account

router.post('/add-account', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ status: false, message: 'Missing required fields' });
    }

    try {

        const existhingUsr = await prisma.admin.findUnique({ where: { email } })

        if (existhingUsr) {
            return res.status(400).json({ status: false, message: 'Account Already Exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const account = await prisma.admin.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
            },
        });

        return res.status(201).json({ status: true, message: 'Account added successfully' });

    } catch (err) {
        console.error("server error:", err.message);
        res.status(500).json({ status: false, error: err.message });
    }
});


// get supplier 

router.get('/get-supplier', async (req, res) => {
    try {
        const supplier = await prisma.supplier.findMany()
        console.log(supplier)
        if (supplier == 0) {
            return res.status(404).json({ status: false, message: 'supplier not found' })
        }
        return res.status(200).json({ status: true, result: supplier })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})

// delete supplier

router.delete('/delete-supplier/:id', async (req, res) => {

    try {
        const { id } = req.params

        const existingSupplier = await prisma.supplier.findUnique({
            where: { id: Number(id) }
        });

        if (!existingSupplier) {
            return res.status(404).json({ status: false, message: 'Supplier not found' });
        }

        await prisma.supplier.delete({ where: { id: Number(id) } })

        return res.status(200).json({ status: true, message: 'supplier deleted successfully!' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})

// update supplier

router.put('/update-supplier/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { companyName, email, phone, address, tinNumber, licenseNumber, password } = req.body;


        const updatedSupplier = await prisma.supplier.update({
            where: { id: Number(id) },
            data: { companyName, email, phone, address, tinNumber, licenseNumber, password }
        });

        return res.status(200).json({ status: true, message: 'Supplier updated successfully!' });

    } catch (err) {
        console.error('Error updating supplier:', err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});




// get customer

router.get('/get-customer', async (req, res) => {
    try {
        const supplier = await prisma.customer.findMany()
        console.log(supplier)
        if (supplier == 0) {
            return res.status(404).json({ status: false, message: 'customer not found' })
        }
        return res.status(200).json({ status: true, result: supplier })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})

// delete customer

router.delete('/delete-customer/:id', async (req, res) => {

    try {
        const { id } = req.params

        await prisma.customer.delete({ where: { id: Number(id) } })

        return res.status(200).json({ status: true, message: 'customer deleted successfully!' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})

// update customer

router.put('/update-customer/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, phone } = req.body;


        await prisma.customer.update({
            where: { id: Number(id) },
            data: { name, email, password, phone }
        });

        return res.status(200).json({ status: true, message: 'customer updated successfully!' });

    } catch (err) {
        console.error('Error updating supplier:', err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});


// get order

router.get('/get-order', async (req, res) => {
    try {

        const order = await prisma.order.findMany()

        return res.status(200).json({ status: true, result: order })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})

// update order status

router.put('/update-order/:id', async (req, res) => {

    try {
        const { id } = req.params;
        const { customerId, supplierId, totalPrice, paymentId, status } = req.body;

        await prisma.order.update({
            where: { id: Number(id) },
            data: { customerId, supplierId, totalPrice, paymentId, status }
        });

        return res.status(200).json({ status: true, message: 'order updated successfully!' });

    } catch (err) {
        console.error('Error updating order:', err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});

// add category

router.post('/add-category', async (req, res) => {
    try {
        const { category } = req.body

        const ifExist = await prisma.category.findUnique({ where: { category } })

        if (ifExist) {
            return res.status(401).json({ status: false, message: 'category already exist' })
        }

        await prisma.category.create({
            data: { category }
        })
        return res.status(200).json({ status: true, message: 'category added' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: false, error: 'server error' })
    }
})

// get categorys

router.get('/get-order', async (req, res) => {
    try {

        const category = await prisma.category.findMany()

        return res.status(200).json({ status: true, result: category })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})


// delete category

router.delete('/delete-category/:id', async (req, res) => {

    try {
        const { id } = req.params

        await prisma.customer.delete({ where: { id: Number(id) } })

        return res.status(200).json({ status: true, message: 'category deleted successfully!' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})


// add address

router.post('/add-address', async (req, res) => {
    try {
        const { address } = req.body

        const ifExist = await prisma.address.findFirst({ where: { address } })

        if (ifExist) {
            return res.status(401).json({ status: false, message: 'address already exist' })
        }

        await prisma.address.create({
            data: { address }
        })
        return res.status(200).json({ status: true, message: 'address added' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: false, error: 'server error' })
    }
})


// delete address

router.delete('/delete-address/:id', async (req, res) => {

    try {
        const { id } = req.params

        await prisma.address.delete({ where: { id: Number(id) } })

        return res.status(200).json({ status: true, message: 'address deleted successfully!' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: 'server error' })
    }
})




module.exports = { admin: router }