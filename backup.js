const mongoose = require("mongoose");

// 🔹 Your MongoDB Connection String
const uri = "mongodb+srv://Momen:uagae@cluster0.n8gtz.mongodb.net/SEDB"; 

async function printDatabase() {
    try {
        // Connect to MongoDB (without deprecated options)
        await mongoose.connect(uri);
        console.log("✅ Connected to MongoDB");

        const db = mongoose.connection.db;

        // Get all collection names
        const collections = await db.listCollections().toArray();

        if (collections.length === 0) {
            console.log("⚠️ No collections found in the database.");
            return;
        }

        for (let collection of collections) {
            const data = await db.collection(collection.name).find().toArray();
            console.log(`\n📁 Collection: ${collection.name}`);
            console.log(data.length > 0 ? JSON.stringify(data, null, 2) : "⚠️ No documents found");
        }

        mongoose.connection.close();
        console.log("\n✅ Done printing all collections!");
    } catch (err) {
        console.error("❌ Error:", err);
    }
}

// Run the function
printDatabase();
