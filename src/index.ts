import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { contentModel, userModel } from './db';
import './db'; // This will initialize the database connection
import dotenv from 'dotenv';
import { userMiddleware } from './middlewares';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Start server only after ensuring database connection
const startServer = async () => {
    try {
        // Wait for MongoDB connection to be established
        await mongoose.connection.asPromise();
        
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

app.get("/"  , (req, res) => {
    res.send("Hello World!");
});

app.post("/api/v1/SignUp", async (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    try {
        await userModel.create({
            username: username,
            password: password
        })

        res.json({
            message: "user signup successfully"
        })

    } catch (error) {
        res.status(409).json({
            message:"user already exists"
        })
    }
})

app.post("/api/v1/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await userModel.findOne({ username, password });
        
        if (!user) {
            res.status(401).json({ message: "Invalid username or password" });
            return;
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_PASSWORD || 'default_secret', { expiresIn: '12h' });

        res.json({
            message: "Login successful",
            token: token,
            user: {
                username: user.username
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
app.post("/api/v1/content", userMiddleware as any, async (req, res) => {
    try {
        const { link, title, type, content, tag } = req.body;

        // Validate required fields
        if (!link || !title || !type) {
            res.status(400).json({
                message: "Missing required fields: link, title, type"
            });
            return;
        }

        // Validate type enum
        if (!['article', 'video', 'image'].includes(type)) {
            res.status(400).json({
                message: "Type must be one of: article, video, image"
            });
            return;
        }

        // Save the content to the database
        const newContent = await contentModel.create({
            link,
            title,
            type,
            content: content || '', // Use empty string if not provided
            tag: tag || [],
            userId: (req as any).userId
        });

        res.status(201).json({
            message: "Content created successfully",
            content: {
                id: newContent._id,
                title: newContent.title,
                link: newContent.link,
                type: newContent.type
            }
        });
    } catch (error) {
        console.error("Content creation error:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});


app.get("/api/v1/content", async (req, res) => {
    try {
        const contents = await contentModel.find();
        res.json(contents);
    } catch (error) {
        console.error("Content fetch error:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

app.delete("/api/v1/content/:id", async (req, res) => {
    const  contentId = req.params.id;

    await contentModel.deleteMany({
        _id: contentId,
        userId: (req as any).userId
    })

    res.json({
        message: "Content deleted successfully"
    });
});


app.post("/api/v1/brain/share", (req, res) => {

});

app.post("/api/v1/brain/:shareLink", (req, res) => {
    
});

startServer();
