const express = require('express');
const User = require('./models/user');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());

app.use(
    cors({
        origin: '*', // Allow requests from this origin
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
        credentials: true, // Allow cookies and credentials
    })
);

// Sync the model with the database
User.sync()
  .then(() => {
    console.log('User table synced (no data loss)');
  })
  .catch((err) => {
    console.error('Error syncing User table:', err);
  });

// Signup endpoint
app.post('/signup/user', async (req, res) => {
  try {
    const user = await User.create(req.body);
    const userWithoutPassword = { ...user.toJSON() };
    delete userWithoutPassword.password;
    res.status(201).json({ message: 'User created successfully', userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Login endpoint
app.post('/login/user', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password
    const isMatch = await user.comparePassword(password);
    console.log(isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // If passwords match, return the user (excluding the password)
    const userWithoutPassword = { ...user.toJSON() };
    delete userWithoutPassword.password;
    res.status(200).json({ message: 'Login successful', user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error logging in' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});