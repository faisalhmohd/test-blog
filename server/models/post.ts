import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

export default Post;