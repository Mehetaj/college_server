const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require('cors');
require("dotenv").config()

// middlewares
app.use(express.json());
app.use(cors());
//////////////

const clg = './gra.json'


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4bdkenh.mongodb.net/?retryWrites=true&w=majority`;

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
        // Send a ping to confirm a successful connection
        const usersCollection = client.db("college").collection("users");
        const collegesCollection = client.db("college").collection("colleges");
        const graduateCollection = client.db("college").collection("graduate");
        const admitCollection = client.db("college").collection("admit");
        const reviewCollection = client.db("college").collection("review");
        const researchCollection = client.db("college").collection("research");


        app.get("/users", async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result)
        })

        app.post("/users", async (req, res) => {
            const user = req.body;
            console.log(user);
            const query = { email: user.email }
            console.log(query);
            const existingUser = await usersCollection.findOne(query);
            console.log('existing user', existingUser);
            if (existingUser) {
                return res.send({ message: 'user already exists' })
            }
            const result = await usersCollection.insertOne(user)
            res.send(result)
        })


        // colleges

        app.get("/colleges", async(req, res) => {
            const result = await collegesCollection.find().toArray();
            res.send(result);
        })

        app.get("/colleges/:id", async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await collegesCollection.findOne(query);
            res.send(result)
        })


        // graduated pics

       app.get("/g", async(req, res) => {
        const result = await graduateCollection.find().toArray()
        res.send(result)
       })


       // admit api's

       app.get("/admit", async(req, res) => {
        const result = await admitCollection.find().toArray();
        res.send(result)
       })

       app.post("/admit", async(req, res) => {
        const data = req.body;
        const result = await admitCollection.insertOne(data);
        res.send(result)
       })

       // review api's
       app.get("/review", async(req, res) => {
        const result = await reviewCollection.find().toArray();
        res.send(result)
       })

       app.post("/review", async(req ,res) => {
        const data = req.body;
        const result = await reviewCollection.insertOne(data);
        res.send(result)
       })

       // researches

       app.get("/research", async(req, res) => {
        const result = await researchCollection.find().toArray();
        res.send(result)
       })






        /////////////////////////////////////////////
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.status(200).send({ message: "College admission is running bro" })
})

app.listen(PORT, () => {
    console.log("College on PORT 5000");
})