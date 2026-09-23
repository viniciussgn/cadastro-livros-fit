const express = require('express');
const cors = require('cors');
const path = require('path');
const livroRoutes = require('./routes/livroRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/livros', livroRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;