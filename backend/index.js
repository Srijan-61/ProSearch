//Initialization
import app from "./app.js";
import mongoose from "mongoose";

const port = 3000;
//Routes
app.get("/", (_req, res) => {
  res.send("Hello Srijan , This is the Homepage.");
});

// Starting the server on the port
app.listen(port, () => {
  console.log(`Server started at PORT: ${port}`);
});

const uri =
  "mongodb+srv://bhandarisrijan321:test123@professionals.rtob45n.mongodb.net/?retryWrites=true&w=majority&appName=professionals";
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

async function run() {
  await mongoose.connect(uri, clientOptions);
  await mongoose.connection.db.admin().command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
}
run();
