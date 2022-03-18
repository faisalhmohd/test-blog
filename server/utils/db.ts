import mongoose from "mongoose";

let uri: string = 'mongodb+srv://faisal:NDeSZeJ7926nDMw@cluster0.roycp.mongodb.net/NextJSTestBlog?retryWrites=true&w=majority'

export default async function connectToDatabase() {
  if (mongoose.connections[0].readyState) return;
  try {
    await mongoose.connect(uri);
    console.log("Connected to database.");
  } catch (error) {
    console.log("DB error", error);
  }
};