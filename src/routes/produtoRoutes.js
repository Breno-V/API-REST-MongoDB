import { Router } from 'express';
import { criar, listar, buscarPorId, atualizar, remover } from '../controllers/produtoController.js';

const router = Router();

router.post('/', criar); // RF01
router.get('/', listar); // RF02 + RF03 + RF04
router.get('/:id', buscarPorId);
router.patch('/:id', atualizar); // RF05 ($set + $inc)
router.delete('/:id', remover); // RF06

export default router;
