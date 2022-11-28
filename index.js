
const express = require('express');
require("dotenv").config();
const { MongoClient, ServerApiVersion,ObjectId} = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const stripe = require("stripe")('sk_test_51M8qimGPXpMGbXvmme3yDPCsGpBJbsnm8gm0i7Zj88i7ouTSl8MUbbfIbJ7R8aZ7qiLxIG5xfPZoO7QzC6P8HMfL00dM1JX8WQ');


// middeileware
app.use(cors());
// var jwt = require('jsonwebtoken');
app.use(express.json())

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.u9dq38i.mongodb.net/?retryWrites=true&w=majority`;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.u9dq38i.mongodb.net/?retryWrites=true&w=majority`;
const uri = "mongodb+srv://laptopdb:4HeyxGc2vlwAbcLB@cluster0.u9dq38i.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('laptopdbc').collection('category')
        const productCollection = client.db('laptopdbc').collection('product')
        const userCollection = client.db('laptopdbc').collection('user')
        const oderdetailCollection = client.db('laptopdbc').collection('oderdetail')
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

     app.delete('/buyer/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            console.log(result);
            res.send(result)
        })
     app.delete('/sellers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            console.log(result);
            res.send(result)
        })
        app.get('/Sellerproduct',async(req,res)=>{
          let query={};
          if(req.query.email){
            query={Email: req.query.email}
          }
          const result = await productCollection.find(query).toArray()
          res.send(result)
        })
         app.delete('/sellersproduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            console.log(result);
            res.send(result)
        })

      app.patch("/product/ad/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const UpdatedDoc = {
        $set: {
          advertise: "true",
        },
      };
      const result = await productCollection.updateOne(
        filter,
        UpdatedDoc,
        option
      );
      res.send(result);
    });
      app.patch("/sellers/ver/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const UpdatedDoc = {
        $set: {
          verify: "true",
        },
      };
      const result = await userCollection.updateOne(
        filter,
        UpdatedDoc,
        option
      );
      res.send(result);
    });
     
         app.get('/home/add', async (req, res) => {
            const id = req.params.id;
            const query = { advertise:"true" }
            const user = await productCollection.find(query).toArray();
            res.send(user)
        })
          app.get('/prepayment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const user = await productCollection.findOne(query);
            res.send(user)
        });

        app.patch("/product/report/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const UpdatedDoc = {
        $set: {
          report: "true",
        },
      };
      const result = await productCollection.updateOne(
        filter,
        UpdatedDoc,
        option
      );
      res.send(result);
    });
     app.get('/product/report', async (req, res) => {
            const id = req.params.id;
            const query = { report:"true" }
            const user = await productCollection.find(query).toArray();
            res.send(user)
        })
          app.get('/myorders',async(req,res)=>{
          let query={};
          if(req.query.email){
            query={buyeremail: req.query.email}
          }
          const result = await oderdetailCollection.find(query).toArray()
          res.send(result)
        })
   app.post("/paydetails", async (req, res) => {
            const service = req.body;
            const result = await oderdetailCollection.insertOne(service);
            res.send(result)
        })
         app.delete('/myproduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await oderdetailCollection.deleteOne(query)
            console.log(result);
            res.send(result)
        })
        // Payment
    //  app.post("/create-payment-intent", async (req, res) => {
    //   const Price = req.body.price;
    //   const amount = Price * 100;
    //   const paymentIntent = await stripe.paymentIntents.create({
    //     currency: "usd",
    //     amount: amount,
    //     payment_method_types: ["card"],
    //   });
    //   res.send({
    //     clientSecret: paymentIntent.client_secret,
    //   });
    // });


            app.get('/payorder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const user = await oderdetailCollection.findOne(query);
            res.send(user)
        });


          app.get('/verifyed',async(req,res)=>{
          let query={};
          if(req.query.email){
            query={email: req.query.email}
          }
          const result = await userCollection.findOne(query)
          res.send(result)
        })
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