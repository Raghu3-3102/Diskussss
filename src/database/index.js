import mongoose from "mongoose";

import { DB_NAME } from "../constant.js"

const connectDB = async () => {
    try {
       
        const uri = `mongodb+srv://rajanitnavapara9999:avCSmRvSfYohJwlT@cluster0.7xtre.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/${DB_NAME}`;
        const connectionInstance = await mongoose.connect(uri, {
    
        });

        console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB: ', error);
        process.exit(1);
    }
};

export default connectDB;
