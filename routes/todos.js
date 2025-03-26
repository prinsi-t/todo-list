import express from 'express';
import Todo from '../models/Todo.js';

const router = express.Router();

router.get('/', async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/auth/login');
  const todos = await Todo.find({ userId: req.user.id });
  res.render('todos', { todos, user: req.user });
});

router.post('/', async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/auth/login');
  const { text } = req.body;
  await new Todo({ text, userId: req.user.id }).save();
  res.redirect('/todos');
});

router.get('/', async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/auth/register');
  const todos = await Todo.find({ userId: req.user.id });
  res.render('todos', { todos, user: req.user });
});

router.post('/', async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/auth/register');
  const { text } = req.body;
  await new Todo({ text, userId: req.user.id }).save();
  res.redirect('/todos');
});

export default router;
