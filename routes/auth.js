import express from 'express';
import passport from 'passport';
import User from '../models/User.js';

const router = express.Router();

router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));
router.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/auth/login'));
});

router.post('/register', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    
    // Log the user in automatically after registration
    req.login(user, (err) => {
      if (err) return next(err);
      return res.redirect('/todos'); // Redirect to todos page
    });
  } catch (err) {
    res.redirect('/auth/register');
  }
});


router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/todos',
    failureRedirect: '/auth/login',
    failureFlash: true,
  })
);

export default router;
