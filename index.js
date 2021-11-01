const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cxwlf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run () {
    try{
        await client.connect();
        const database = client.db('travel_packages');
        const packagesCollection = database.collection("packages");
        const bookingsCollection = database.collection("bookings");

        // // GET PRODUCTS API
        app.get('/packages', async (req, res) => {
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        })

        // // POST BOOKING API
        app.post('/bookings', async (req, res) => {
            booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            res.json(result)
        })

        // // POST PACKAGE API
        app.post('/addProduct', async (req, res) => {
            addPackage = req.body;
            const result = await packagesCollection.insertOne(addPackage);
            res.json(result);
        })

        // // GET All BOOKING API 
        app.get('/allBookings', async (req, res) => {
            const cursor = bookingsCollection.find({});
            const allBookings = await cursor.toArray();
            res.send(allBookings);
        })

        // // GET My BOOKING API 
        app.get('/allBookings/:userEmail', async (req, res) => {
            const email = req.params.userEmail;
            const query = {userEmail:email}
            const cursor = bookingsCollection.find(query)
            const result = await cursor.toArray();
            res.json(result);
            // console.log(result);
            // console.log('hitting')
        })

        // // DELETE My BOOKING API 
        app.delete('/allBookings/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await bookingsCollection.deleteOne(query)
            // console.log('deleting booking', result);
            res.json(result);
        })

    }finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("server is running")
})

app.listen(port, () => {
    console.log('Server running at port', port);
})