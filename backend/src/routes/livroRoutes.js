const express = require('express');
const router = express.Router();
const livroController = require('../controllers/livroController');
const upload = require('../config/upload');

router.get('/', livroController.listar);
router.get('/:id', livroController.buscarPorId);
router.post('/', upload.single('capa'), livroController.criar);
router.put('/:id', upload.single('capa'), livroController.atualizar);
router.delete('/:id', livroController.excluir);

module.exports = router;