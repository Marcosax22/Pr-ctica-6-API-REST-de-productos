const express = require('express')
const app = express()

app.use(express.json())

const productos = [
    {
        id: 1,
        nombre: 'Teclado inalambrico',
        descripcion: 'Teclado 101 teclas idioma ingles',
        precio: 1500.00
    },
    {
        id: 2,
        nombre: 'Mouse inalambrico',
        descripcion: 'Mouse optico inalambrico.',
        precio: 600.00
    },
    {
        id: 3,
        nombre: 'Monitor 23.5 pulgadas full hd',
        descripcion: 'Monitor Full HD panel IPS',
        precio: 6500.00
    }
]

// GET - Listar todos los productos
app.get('/productos', (req, res) => {
    res.json(productos)
})

// GET - Obtener un producto por id
app.get('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const producto = productos.find(p => p.id === id)

    if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    res.json(producto)
})


// ============================================================
// PRÁCTICA 6: Completa los siguientes métodos de la API
// ============================================================

// POST - Crear un producto nuevo
app.post('/productos', (req, res) => {
    // Aquí agarro los datos que llegan en el cuerpo de la petición.
    const datProd = req.body || {}
    const {
        nombre: nomProd,
        descripcion: descProd,
        precio: precProd
    } = datProd

    // Si falta alguno de los tres datos, aviso y no creo nada.
    if (!nomProd || !descProd || precProd === undefined || precProd === null || precProd === '') {
        return res.status(400).json({
            mensaje: 'Los campos nombre, descripcion y precio son obligatorios'
        })
    }

    // Tomo el id más alto y le sumo uno para que no se repita.
    const idProd = productos.length > 0
        ? Math.max(...productos.map(p => p.id)) + 1
        : 1

    // Armo el producto con su id y convierto el precio a número.
    const prodNuevo = {
        id: idProd,
        nombre: nomProd,
        descripcion: descProd,
        precio: parseFloat(precProd)
    }

    // Lo agrego al arreglo y devuelvo el producto que acabo de crear.
    productos.push(prodNuevo)
    res.status(201).json(prodNuevo)
})


// PUT - Actualizar un producto que ya existe
app.put('/productos/:id', (req, res) => {
    // Primero saco el id de la ruta y busco dónde está ese producto.
    const idProd = parseInt(req.params.id)
    const indProd = productos.findIndex(p => p.id === idProd)

    // Si no aparece en el arreglo, ese producto no existe.
    if (indProd === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    // Ahora reviso que me hayan enviado los tres datos necesarios.
    const datProd = req.body || {}
    const {
        nombre: nomProd,
        descripcion: descProd,
        precio: precProd
    } = datProd

    if (!nomProd || !descProd || precProd === undefined || precProd === null || precProd === '') {
        return res.status(400).json({
            mensaje: 'Los campos nombre, descripcion y precio son obligatorios'
        })
    }

    // Preparo los datos nuevos, pero mantengo el mismo id del producto.
    const prodAct = {
        id: idProd,
        nombre: nomProd,
        descripcion: descProd,
        precio: parseFloat(precProd)
    }

    // Reemplazo el producto en la misma posición donde estaba antes.
    productos[indProd] = prodAct
    res.status(200).json(prodAct)
})


// DELETE - Eliminar un producto
app.delete('/productos/:id', (req, res) => {
    // Busco el producto usando el id que viene en la ruta.
    const idProd = parseInt(req.params.id)
    const indProd = productos.findIndex(p => p.id === idProd)

    // Si no existe, respondo con un 404 y no intento eliminarlo.
    if (indProd === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    // Guardo el producto antes de quitarlo para poder devolver sus datos.
    const prodElim = productos[indProd]

    // Quito solamente ese producto del arreglo.
    productos.splice(indProd, 1)

    // Confirmo que se eliminó y mando también los datos que tenía.
    res.status(200).json({
        mensaje: 'Producto eliminado',
        producto: prodElim
    })
})


app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000')
})