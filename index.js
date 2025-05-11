const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MariaDB
const db = mysql.createConnection({
  host: 'bd-taller.cjyk8kosiy9g.us-east-1.rds.amazonaws.com',
  user: 'admin',       // Cambia esto
  password: 'irisESTEFANIA19', // Cambia esto
  database: 'calculadora',
  port: 3306
});

db.connect(err => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
    return;
  }
  console.log('Conectado a MariaDB en puerto 3306');
});

app.post('/calcular', (req, res) => {
  const { num1, num2, operacion } = req.body;
  let resultado;

  switch (operacion) {
    case 'sumar': resultado = num1 + num2; break;
    case 'restar': resultado = num1 - num2; break;
    case 'multiplicar': resultado = num1 * num2; break;
    case 'dividir':
      if (num2 === 0) return res.status(400).json({ error: 'No se puede dividir por cero' });
      resultado = num1 / num2;
      break;
    default:
      return res.status(400).json({ error: 'Operación inválida' });
  }

  // Guardar en la base de datos
  db.query(
    'INSERT INTO calculos (numero1, numero2, operacion, resultado) VALUES (?, ?, ?, ?)',
    [num1, num2, operacion, resultado],
    (err) => {
      if (err) {
        console.error('Error al guardar en la base de datos:', err);
        return res.status(500).json({ error: 'Error en la base de datos' });
      }
      res.json({ resultado });
    }
  );
});

app.listen(3000, () => {
  console.log('Servidor backend escuchando en http://localhost:3000');
});
