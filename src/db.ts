import mongoose, {model, Schema} from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate MongoDB URL
const mongoUrl = process.env.MONGO_URL;
if (!mongoUrl) {
    throw new Error('MONGO_URL environment variable is not defined. Please check your .env file.');
}

// Connect to MongoDB with error handling
mongoose.connect(mongoUrl)
    .then(() => {
        console.log('✅ Successfully connected to MongoDB');
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    });

// console.log('Loaded MONGO_URL:', process.env.MONGO_URL);

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
})

export const userModel = model("user", userSchema);

const contentSchema = new Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  tag: { type: [String], default: [] },
  type: { type: String, required: true, enum: ['article', 'video', 'image'] },
  content: { type: String, required: false },
  userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  createdAt: { type: Date, default: Date.now }
});


const linkSchema = new Schema({
    hash: String,
    link: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
})

export const linkModel = model("link", linkSchema);
export const contentModel = model("content", contentSchema);
