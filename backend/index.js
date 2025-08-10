//Initialization
import app from "./app.js";
import mongoose from "mongoose";
import User from "./models/user.model.js";


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

// Function to seed default profile data
async function seedDefaultProfiles() {
  try {
    const usersWithoutProfile = await User.find({
      $or: [
        { fullName: { $exists: false } },
        { role: { $exists: false } },
        { skills: { $exists: false } },
      ],
    });

    const defaultSkills = [
      {
        name: "HTML & CSS",
        description: "HTML, Responsive Design (Flexbox, Grid)",
      },
      {
        name: "JavaScript (ES6+)",
        description: "DOM Manipulation, Asynchronous JS, API Integration",
      },
      {
        name: "React.js",
        description: "Hooks, Context API, Component Lifecycle, Routing",
      },
      { name: "Version Control", description: "Git, GitHub/GitLab workflows" },
      {
        name: "UI/UX Principles",
        description: "User-centered design, Accessibility, Wireframing",
      },
      { name: "Tools & Libraries", description: "Webpack, Babel, npm/yarn" },
    ];

    for (const user of usersWithoutProfile) {
      await User.findByIdAndUpdate(user._id, {
        fullName: user.fullName || "Srijan Bhandari",
        role: user.role || "Frontend Developer",
        skills: user.skills || defaultSkills,
      });
    }

    // if (usersWithoutProfile.length > 0) {
    //   console.log(
    //     `Seeded default profile data for ${usersWithoutProfile.length} users`
    //   );
    // }
  } catch (error) {
    console.error("Error seeding default profiles:", error);
  }
}

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // Seed default profile data
    await seedDefaultProfiles();
  } finally {

  }
}
run().catch(console.dir);
