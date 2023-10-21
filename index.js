const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rarr4yf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const productCollection = client.db('productDB').collection('product');
        const userCollection = client.db('userDB').collection('user');



        app.post('/product', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product)
            console.log(result)
            res.send(result)
        })

        app.get('/product', async (req, res) => {
            const cursor = productCollection.find()
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/productByBrand/:brand', async (req, res) => {
            const brand = req.params.brand;
            const query = { brand: brand }
            const cursor = await productCollection.find(query).toArray();
            // const result = await cursor.toArray();
            res.send(cursor)
        })


        // Update a product

        app.get('/productById/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query)
            res.send(result)
        })

        // Update product put
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const options = {upsert: true};
            const updateProduct = req.body;
            const product = {
                $set: {
                    name: updateProduct.name,
                    brand: updateProduct.brand,
                    type: updateProduct.type,
                    price: updateProduct.price,
                    description: updateProduct.description,
                    rating: updateProduct.rating,
                    photo: updateProduct.photo,

                }
            }
            const result = await productCollection.updateOne(filter, product,options)
            res.send(result)
        })



        // User collection
        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user)
            console.log(result)
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Car shop.........')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})