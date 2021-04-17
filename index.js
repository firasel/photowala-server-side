const express=require('express');
const cors=require('cors');
const MongoClient = require('mongodb').MongoClient;
const objectID=require('mongodb').ObjectId;
const app=express();
require('dotenv').config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lwdhb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Api is Working');
})

client.connect(err => {
    const orderCollection = client.db("photoWala").collection("orders");
    const reviewCollection = client.db("photoWala").collection("reviews");
    const packageCollection = client.db("photoWala").collection("package");
    const adminCollection = client.db("photoWala").collection("admins");
    const categoriesCollection = client.db("photoWala").collection("categories");
    
    app.post('/order',(req,res)=>{
        const data=req.body;
        orderCollection.insertOne(data)
        .then(result=>res.send(result.insertedCount>0));
    })

    app.post('/addPackage',(req,res)=>{
        const packageData=req.body;
        packageCollection.insertOne(packageData)
        .then(result=>res.send(result.insertedCount>0));
    })

    app.post('/addAdmin',(req,res)=>{
        const adminData=req.body;
        adminCollection.insertOne(adminData)
        .then(result=>res.send(result.insertedCount>0));
    })

    app.get('/packages',(req,res)=>{
        packageCollection.find({})
        .toArray((error,documents)=>{
            res.send(documents);
        })
    })

    app.get('/allOrderData',(req,res) => {
        orderCollection.find({})
        .toArray((error,documents)=>{
            res.send(documents);
        })
    })

    app.post('/orderData',(req,res) => {
        const userData=req.body;
        orderCollection.find({email:userData.email})
        .toArray((error,documents)=>{
            res.send(documents);
        })
    })

    app.post('/addCategories',(req,res) => {
        const categoriesData=req.body;
        categoriesCollection.insertOne(categoriesData)
        .then(result=>res.send(result.insertedCount>0))
    })

    app.get('/categories',(req,res) => {
        categoriesCollection.find({})
        .toArray((error,documents)=>{
            res.send(documents);
        })
    })

    app.get('/loadData/:id',(req,res) => {
        const packageId=req.params.id;
        packageCollection.find({_id:objectID(packageId)})
        .toArray((error,documents)=>{
            res.send(documents[0]);
        })
    })

    app.post('/updateStatus',(req,res)=>{
        const statusData=req.body;
        orderCollection.updateOne({_id:objectID(statusData.id)},{$set:{status:statusData.status}})
        .then(result=>res.send(result.modifiedCount>0));
    })

    app.delete('/deletePackage/:id',(req,res)=>{
        const packageId=req.params.id;
        packageCollection.deleteOne({_id:objectID(packageId)})
        .then(result=>res.send(result.deletedCount>0));
    })

    app.post('/addReview',(req,res)=>{
        const data=req.body;
        reviewCollection.insertOne(data)
        .then(result=>res.send(result.insertedCount>0))
    })

    app.get('/reviews',(req,res)=>{
        reviewCollection.find({})
        .toArray((error,documents)=>{
            res.send(documents);
        })
    })

    app.post('/checkAdmin',(req,res)=>{
        const data=req.body;
        adminCollection.find({email:data.email})
        .toArray((error,documents)=>{
            res.send(documents.length>0);
        })
    })

});


app.listen(process.env.PORT || 3001);
