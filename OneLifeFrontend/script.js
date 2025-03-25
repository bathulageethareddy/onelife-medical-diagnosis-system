const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017/"; 
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");

        const database = client.db("admin"); 
        const collections = await database.listCollections().toArray();
        console.log("Collections in the database:");
        collections.forEach((collection) => console.log(collection.name));

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

run();