//Initialization 
import app from './app.js';
import mongoose from 'mongoose';



const port = 3000;
//Routes 
app.get('/',(_req,res)=>{
    res.send("Hello Srijan , This is the Homepage.");
});

// Starting the server on the port
app.listen(port, () => {
    console.log(`Server started at PORT: ${port}`);
});



const uri = "mongodb+srv://bhandarisrijan321:test123@professionals.rtob45n.mongodb.net/?retryWrites=true&w=majority&appName=professionals";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await mongoose.disconnect();
  }
}
run().catch(console.dir);

