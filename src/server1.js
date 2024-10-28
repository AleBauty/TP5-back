const express = require('express')
const app = express()
const port = 3000
const {connectToMongoDB, disconnectFromMongoDB }= require('./config/mongodb.js')
const {ObjectId} =require ('mongodb')
//Midlleware para acceder a la BD y la collection
app.use(async (req, res, next)=>{
    const client = await connectToMongoDB()
    const db = client.db('frutas') 
    req.frutas = await db.collection('frutas')
    next()
})
//Middleware para cerrar la conexión a la BD
app.use(async (req, res, next) => {
    res.on('finish', async()=>{
        await disconnectFromMongoDB()
    })
    next()
})
app.get('/', (req, res) => {
  res.send('Bienveniddo a la API de Frutas🍒')
})

app.get('/frutas', async(req, res)=>{
    const frut = await req.frutas.find().toArray()
    res.json(frut)
})

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`)
  })

  // Ruta para buscar frutas por nombre (usando regex para búsqueda parcial)
app.get('/frutas/nombre/:nombre', async (req, res) => {
    try {
        const nombreBuscado = req.params.nombre;
        // Creamos una expresión regular que busca el nombre sin importar mayúsculas/minúsculas
        const regex = new RegExp(nombreBuscado, 'i');
        
        const frutasEncontradas = await req.frutas.find({
            nombre: regex
        }).toArray();

        if (frutasEncontradas.length === 0) {
            res.status(404).json({ mensaje: 'No se encontraron frutas con ese nombre' });
            return;
        }

        res.json(frutasEncontradas);
    } catch (error) {
        console.error('Error al buscar frutas por nombre:', error);
        res.status(500).json({ error: 'Error al buscar frutas' });
    }
});

// Ruta para buscar frutas por precio (igual o superior al especificado)
app.get('/frutas/importe/:precio', async (req, res) => {
    try {
        const importeMinimo = parseInt(req.params.precio);
        
        // Validar que el precio sea un número válido
        if (isNaN(importeMinimo)) {
            res.status(400).json({ error: 'El precio debe ser un número válido' });
            return;
        }

        const frutasEncontradas = await req.frutas.find({
            importe: { $gte: importeMinimo }  
        }).toArray();

        if (frutasEncontradas.length === 0) {
            res.status(404).json({ mensaje: 'No se encontraron frutas con ese precio o superior' });
            return;
        }

        res.json(frutasEncontradas);
    } catch (error) {
        console.error('Error al buscar frutas por precio:', error);
        res.status(500).json({ error: 'Error al buscar frutas' });
    }
});

