const { MongoClient, ServerApiVersion } = require('mongodb');
process.loadEnvFile()
const uri = process.env.URI;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function connectToMongoDB() {
  try {
      await client.connect();
      console.log('Conectado a MongoDB');
      return client;
  } catch (error) {
      console.error('Error al conectar a MongoDB:', error);
      return null;
  }
}

async function disconnectFromMongoDB() {
  try {
      await client.close();
      console.log('Desconectado de MongoDB');
  } catch (error) {
      console.error('Error al desconectar de MongoDB:', error);
  }
}

module.exports = { connectToMongoDB, disconnectFromMongoDB };