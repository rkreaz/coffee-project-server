const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j9zzvlf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

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

        const database = client.db("coffeeDB");
        const coffeeCollection = database.collection("coffee");
        const databaseUser = client.db("coffeeDB");
        const userCollection = databaseUser.collection("user");

        app.get('/addedProduct', async (req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/addedProduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.findOne(query);
            res.send(result);
        })

        app.put('/addedProduct/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateCoffee = req.body;
            const coffee = {
                $set: {
                    name: updateCoffee.name,
                    chef: updateCoffee.chef,
                    supplier: updateCoffee.supplier,
                    photo: updateCoffee.photo,
                    taste: updateCoffee.taste,
                    category: updateCoffee.category,
                    details: updateCoffee.details
                }
            }
            const result = await coffeeCollection.updateOne(filter, coffee, options);
            res.send(result)

        })

        app.post('/addedProduct', async (req, res) => {
            const user = req.body;
            const result = await coffeeCollection.insertOne(user);
            res.send(result);
        })

        // user Collection server.
        app.post('/user', async(req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user)
            res.send(result);
        })



        app.delete('/addedProduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.deleteOne(query);
            res.send(result);
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
    res.send('Simple Coffee Server Running')
})

app.listen(port, () => {
    console.log(`Coffee Server Running on Port, ${port}`);
})