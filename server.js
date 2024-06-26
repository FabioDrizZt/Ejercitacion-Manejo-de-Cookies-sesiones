require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const usuarios = require('./views/usersdatabase.js')
const contenidoOculto = require('./views/vista.js')
const PORT = process.env.PORT
const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // Permite parsear los datos desde un formulario

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.get('/', (req, res) => {
  res
    .status(200)
    .send(
      `<p>Si ingresas por primera vez, dirígete a <strong>'/login'</strong> e identifícate.</p>`
    )
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', (req, res) => {
  const { email, password } = req.body || ''
  console.log(email + ' ' + password)

  if (!email || !password) {
    res
      .status(401)
      .json({ error: 'Usuario no autorizado. Valide sus credenciales.' })
  } else {
    let respuesta = usuarios.find(
      (usr) => usr.email === email && usr.password === password
    )
    if (respuesta) {
      // Crear la cookie 'cookieLogin' y establecer su valor desde el 'nombre' del usuario identificado
      res.cookie('cookieLogin', respuesta.nombre)
      res.status(200).json({ mensaje: `Bienvenid@ ${respuesta.nombre}` })
    } else {
      res
        .status(401)
        .json({ error: `No se pudo validar el usuario ingresado ${email}` })
    }
  }
})

app.get('/contenido-oculto', (req, res) => {
  const cookieLogin = req.cookies.cookieLogin
  if (cookieLogin) {
    res.status(200).send(contenidoOculto)
  } else {
    res
      .status(401)
      .json({ error: 'Usuario no autorizado. Valide sus credenciales.' })
  }
})

app.get('/contenido-oculto', (req, res) => {
  //Crear una constante y validar de que existe 'cookieLogin' para así enviarle el contenido oculto
  if (cookieLogin) {
    res.status(200).send(contenidoOculto)
  } else {
    res
      .status(401)
      .json({ error: 'Usuario no autorizado. Valide sus credenciales.' })
  }
})

app.get('/eliminarcookie', (req, res) => {
  res.clearCookie('cookieLogin')
  if (!res.cookie.cookieLogin) {
    res.status(200).send('Cookie eliminada.')
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
