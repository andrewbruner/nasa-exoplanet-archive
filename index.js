const url = 'https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=pl_hostname,pl_name,pl_pnum,pl_orbper,pl_disc,pl_telescope&format=json'

// Config
const config = require('./config.js');
const exoplanets = [];

// Express
const express = require('express');
const app = express();
const port = 80;

app.use(express.static('public'));

// MongoDB
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${config.credentials.username}:${config.credentials.password}@cluster0.k7lmp.mongodb.net/${config.db.dbname}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useUnifiedTopology: true });
const run = async () => {
    try {
        // Connect the client to the server
        await client.connect();
        const database = client.db(config.db.dbname);
        const collection = database.collection(config.db.collectionname);
        const query = { };
        await collection.find(query).sort({ pl_name: 1 }).forEach(doc => exoplanets.push(doc));
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);

app.get('/api', (req, res) => {
    res.json(exoplanets);
});

app.listen(port, () => {
    console.log(`NASA Exoplanet Archive app is listening on port ${port}...`)
});
