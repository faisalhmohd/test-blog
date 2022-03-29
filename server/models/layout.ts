import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const LayoutSchema = new Schema({
  mainCTA: {
    title: String,
    description: String,
    ctaText: String,
    image: String,
  },
  mission: {
    title: String,
    description: String,
    backgroundImage: String,
    videoThumbnail: String,
    video: String,
  },
  vision: {
    ctas: [{
      backgroundImage: String,
      title: String,
      description: String,
    }]
  },
  products: {
    title: String,
    description: String,
    slider: [{
      backgroundImage: String,
      title: String,
      description: String,
    }]
  },
  contactUs: {
    title: String,
    description: String,
    location: {
      latitude: String,
      longitude: String,
    },
    image: String,
    addressText: String,
    socialLinks: {
      facebook: String,
      twitter: String,
      instagram: String,
      github: String,
      linkedin: String
    },
  },
  joinUs: {
    title: String,
    ctaText: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  slug: String,
  publishStatus: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  previewToken: String,
});

const Layout = mongoose.models.Layout || mongoose.model('Layout', LayoutSchema);

export default Layout;