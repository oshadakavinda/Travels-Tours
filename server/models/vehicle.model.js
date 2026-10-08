import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },

    
    title:{
        type: String,
        required: true,
        unique: true,
    },
    image:{
        type: String,
        default:"https://media.istockphoto.com/id/170107445/photo/white-smart-car.jpg?s=2048x2048&w=is&k=20&c=MAmgToWmcDsgOjMhDvr0ify7pWTaeWuczZolHs8uum4="
    },
    content: {
        type: String,
        required: true,
    },
    
    slug:{
        type: String,
        required: true,
        unique: true,
    },
},{timestamps:true}
);

const Post = mongoose.model('Vehicle',vehicleSchema);

export default Post;