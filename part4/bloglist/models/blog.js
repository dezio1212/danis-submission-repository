const { Schema, model } = require('mongoose');

const blogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    likes: { type: Number, default: 0 },
    user:   { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

blogSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = model('Blog', blogSchema);
