const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const authRouter = express.Router();

// Route for user registration
authRouter.post('/register', registerUser);
// Route for user login
authRouter.post('/login', loginUser);
// Route for getting user profile
authRouter.get('/getUser',protect, getUserProfile);

authRouter.post('/upload-image',upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({ fileUrl });
});

module.exports = authRouter;