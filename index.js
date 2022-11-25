const express = require('express');
const { MongoClient, ServerApiVersion,ObjectId} = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


// middeileware
app.use(cors());
// var jwt = require('jsonwebtoken');
app.use(express.json())
require("dotenv").config();

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.u9dq38i.mongodb.net/?retryWrites=true&w=majority`;
const uri = "mongodb+srv://laptopdb:4HeyxGc2vlwAbcLB@cluster0.u9dq38i.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('laptopdbc').collection('category')
        const productCollection = client.db('laptopdbc').collection('product')
        const userCollection = client.db('laptopdbc').collection('user')
        app.get('/category',async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const service = await cursor.toArray()
            res.send(service)
        })
      
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { Category:id }
            const user = await productCollection.find(query).toArray();
            res.send(user)
        })

        app.post("/productadd", async (req, res) => {
            const service = req.body;
            const result = await productCollection.insertOne(service);
            res.send(result)
        })
        app.post("/useradd", async (req, res) => {
            const service = req.body;
            const result = await userCollection.insertOne(service);
            res.send(result)
        })
        //Admin Route
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await userCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
    });
    //Buyer Route
    app.get("/users/buyer/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await userCollection.findOne(query);
      res.send({ isBuyer: user?.role === "buyer" });
    });
    //Seller Route
    app.get("/users/seller/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await userCollection.findOne(query);
      res.send({ isSeller: user?.role === "Seller" });
    });
    app.get("/sellers", async (req, res) => {
      const query = { role:"Seller" };
      const seller = await userCollection.find(query).toArray();
      res.send(seller);
    });
    app.get("/buyer", async (req, res) => {
      const query = { role:"buyer" };
      const seller = await userCollection.find(query).toArray();
      res.send(seller);
    });


        // app.post("/AddReview", async (req, res) => {
        //     const review = req.body;
        //     const result = await reviewcollection.insertOne(review);
        //     res.send(result)
        // })
        // app.get("/reviews", async (req, res) => {
        //     let query = {};
        //     if (req.query.id) {
        //         query = { ServiceId: req.query.id };
        //     }
        //     const cursor = reviewcollection.find(query).sort({
        //         Time: -1,
        //     });
        //     const reviews = await cursor.toArray();
        //     res.send(reviews);
        // });
        // app.get("/myreviews", async (req, res) => {
        //     let query = {};
        //     if (req.query.name) {
        //         query = { UserName: req.query.name };
        //     }
        //     const cursor = reviewcollection.find(query).sort({
        //         Time: -1,
        //     });
        //     const myreviews = await cursor.toArray();
        //     res.send(myreviews);
        // });
        // app.delete('/myreviews/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) }
        //     // console.log('Delete', id);
        //     const result = await reviewcollection.deleteOne(query)
        //     console.log(result);
        //     res.send(result)
        // })
        // app.patch('/myreviewsupdate/:id', async (req, res) => {
        //     const id = req.params.id;
        //     console.log(id);
        //     const filter = { _id: ObjectId(id) }
        //     const up = req.body.up;
        //     console.log(up);
        //     const reviewupdate = {
        //         $set: {
        //             UserReview: up,
        //         },
        //     }
        //     const result = await reviewcollection.updateOne(filter, reviewupdate)
        //     res.send(result)

        // })

    } finally {
    }
}
run().catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send('Connected')
})

app.listen(port, () => {
    console.log(`Port ${port}`);
})