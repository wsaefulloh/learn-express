const express = require("express");
const server = express();
const cors = require("cors")
const { Pool } = require("pg")

const database = new Pool({
    user: "user_pg",
    host: "localhost",
    database: "local_db_psql",
    password: "kode123",
    port: 5432
})

server.use(express.json())
server.use(express.urlencoded({ extended: true }))

//Get All Data API --- Start
let getAllData = () => {
    return new Promise((resolve, reject) => {
        database.query("SELECT * FROM public.products")
            .then((result_query) => {
                const product_result = result_query.rows
                resolve(product_result)
            }).catch((err) => {
                reject(err.message)
            });
    })
}

server.get('/', async (req, res) => {
    try {
        const result = await getAllData()
        res.status(200).json({
            type: "success",
            data: result,
            message: ""
        })
    } catch (err) {
        res.status(500).json({
            type: "error",
            message: err
        })
    }
})

//Get Data by ID API --- Start
let getDatabyID = (id) => {
    return new Promise((resolve, reject) => {
        database.query(`SELECT * FROM public.products WHERE products.id = ${id}`)
            .then((result_query) => {
                const product_result = result_query.rows
                resolve(product_result)
            }).catch((err) => {
                reject(err.message)
            });
    })
}

server.get('/product', async (req, res) => {
    try {
        const result = await getDatabyID(req.query.product_id)
        res.status(200).json({
            type: "success",
            data: result,
            message: ""
        })
    } catch (err) {
        res.status(500).json({
            type: "error",
            message: err
        })
    }
})

//Add Data by ID API --- Start
let addData = (data) => {
    return new Promise((resolve, reject) => {
        let date_create = new Date()
        database.query('INSERT INTO products(product_name, product_price, product_stock, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)', [data.product_name, data.product_price, data.product_stock, date_create, date_create])
            .then((res) => {
                resolve('Add product success')
            }).catch((err) => {
                reject(err.message)
            });
    })
}

server.post('/', async (req, res) => {
    try {
        const result = await addData(req.body)
        res.status(200).json({
            type: "success",
            data: null,
            message: "The product has been inserted successfully!"
        })
    } catch (err) {
        res.status(500).json({
            type: "error",
            message: err
        })
    }
})

//Update Data by ID API --- Start
let updateData = (data) => {
    return new Promise((resolve, reject) => {
        let date_create = new Date()
        database.query("UPDATE public.products SET product_name = $1, product_price = $2, product_stock = $3, updated_at = $4  WHERE id = $5", [data.product_name, data.product_price, data.product_stock, date_create, data.product_id])
            .then((res) => {
                resolve('Update product success')
            }).catch((err) => {
                reject(err.message)
            });
    })
}

server.put('/', async (req, res) => {
    try {
        const result = await updateData(req.body)
        res.status(200).json({
            type: "success",
            data: null,
            message: "The product has been edited successfully!"
        })
    } catch (err) {
        res.status(500).json({
            type: "error",
            message: err
        })
    }
})

//Delete Data by ID API --- Start
let deleteData = (id) => {
    return new Promise((resolve, reject) => {
        let date_create = new Date()
        database.query("DELETE FROM products WHERE id = $1", [id])
            .then((res) => {
                resolve('Delete product success')
            }).catch((err) => {
                reject(err.message)
            });
    })
}

server.delete('/:product_id', async (req, res) => {
    try {
        const result = await deleteData(req.params.product_id)
        res.status(200).json({
            type: "success",
            data: null,
            message: "The product has been deleted successfully!"
        })
    } catch (err) {
        res.status(500).json({
            type: "error",
            message: err
        })
    }
})

database.connect()
    .then(() => {
        server.listen(9000, () => {
            console.log('Connection to Database Successful')
            console.log(`Sercive running on port 9000`)
        })
    }).catch(() => {
        console.log('Connection to Database Failed')
    })