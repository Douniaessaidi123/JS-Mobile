import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  numberOfPages: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Read', 'Re-read', 'DNF', 'Currently reading', 'Returned Unread', 'Want to read'], 
    required: true 
  },
  price: { type: Number, default: 0 },
  pagesRead: { type: Number, default: 0 },
  format: { 
    type: String, 
    enum: ['Print', 'PDF', 'Ebook', 'AudioBook'], 
    required: true 
  },
  suggestedBy: { type: String },
  finished: { type: Boolean, default: false }
});

export default mongoose.model('Book', bookSchema);
