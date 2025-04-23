import mongoose from "mongoose";
const MONGODB_URI = "mongodb+srv://janisha:1812@usermanagement.fajws.mongodb.net/?retryWrites=true&w=majority&appName=usermanagement" ;
const connectdb = async () =>{
    await mongoose.connect(MONGODB_URI);
    console.log("db conected")

}

export default connectdb