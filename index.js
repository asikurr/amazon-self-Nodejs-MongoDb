const express = require('express')
const app = express()
const port = 4000
const bodyParser = require('body-parser')
const cors = require('cors')
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').config()


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xjikz.mongodb.net/amazonDB?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("amazonDB").collection("products");
    const ordersCollection = client.db("amazonDB").collection("orders");

    app.post("/addProducts", (req, res) => {
        const products = req.body
        productCollection.insertMany(products)
        .then(result => {
            console.log(result.insertedCount)
        })
    })

    app.get('/getProducts', (req, res) => {
        productCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
        
    })

    app.get('/product/:productsId', (req, res) => {
        productCollection.find({key: req.params.productsId})
            .toArray((err, documents) => {
                res.send(documents[0])
            })

    })

    app.post('/productByKeys', (req, res) => {
        const keys = req.body
        productCollection.find({key : {$in : keys}})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

    app.post("/addorders", (req, res) => {
        const ordersDetail = req.body;
        console.log(ordersDetail)
        ordersCollection.insertOne(ordersDetail)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
            .then(err => {
                console.log(err)
            })
    })
    
    console.log('Database Connected Successfully.')
});



app.get('/', (req, res) =>{
    res.send("Hello World!")
})

app.listen( process.env.PORT || port )