// MongoDB-based data store
const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB Connected Successfully');
    }
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Initialize connection
connectDB();

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  company: String,
  message: String,
  source: { type: String, default: 'Contact Form' },
  status: { type: String, default: 'new', enum: ['new', 'contacted', 'in-progress', 'completed'] },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

// Newsletter Schema
const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  status: { type: String, default: 'active', enum: ['active', 'unsubscribed'] },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

// Project Schema
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  client: String,
  description: String,
  status: { type: String, default: 'planning', enum: ['planning', 'in-progress', 'completed', 'on-hold'] },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  budget: Number,
  category: String
}, { timestamps: true });

// Create models
const Contact = mongoose.model('Contact', contactSchema);
const Newsletter = mongoose.model('Newsletter', newsletterSchema);
const Project = mongoose.model('Project', projectSchema);

// DataStore class with MongoDB operations
class DataStore {
  // Contact methods
  async addContact(contactData) {
    try {
      const contact = new Contact(contactData);
      await contact.save();
      return contact.toObject();
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  }

  async getContacts() {
    try {
      return await Contact.find().sort({ createdAt: -1 }).lean();
    } catch (error) {
      console.error('Error getting contacts:', error);
      return [];
    }
  }

  async getRecentContacts(limit = 5) {
    try {
      return await Contact.find().sort({ createdAt: -1 }).limit(limit).lean();
    } catch (error) {
      console.error('Error getting recent contacts:', error);
      return [];
    }
  }

  async updateContactStatus(id, status) {
    try {
      const contact = await Contact.findByIdAndUpdate(
        id, 
        { status }, 
        { new: true }
      );
      return contact ? contact.toObject() : null;
    } catch (error) {
      console.error('Error updating contact status:', error);
      return null;
    }
  }

  // Newsletter methods
  async addNewsletter(email) {
    try {
      // Check if email already exists
      const existing = await Newsletter.findOne({ email });
      if (existing) {
        return existing.toObject();
      }
      
      const newsletter = new Newsletter({ email });
      await newsletter.save();
      return newsletter.toObject();
    } catch (error) {
      console.error('Error adding newsletter:', error);
      throw error;
    }
  }

  async getNewsletters() {
    try {
      return await Newsletter.find().sort({ createdAt: -1 }).lean();
    } catch (error) {
      console.error('Error getting newsletters:', error);
      return [];
    }
  }

  async getRecentNewsletters(limit = 5) {
    try {
      return await Newsletter.find().sort({ createdAt: -1 }).limit(limit).lean();
    } catch (error) {
      console.error('Error getting recent newsletters:', error);
      return [];
    }
  }

  // Project methods
  async addProject(projectData) {
    try {
      const project = new Project(projectData);
      await project.save();
      return project.toObject();
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  }

  async getProjects() {
    try {
      return await Project.find().sort({ createdAt: -1 }).lean();
    } catch (error) {
      console.error('Error getting projects:', error);
      return [];
    }
  }

  async updateProjectProgress(id, progress, status) {
    try {
      const updateData = { progress };
      if (status) updateData.status = status;
      
      const project = await Project.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
      return project ? project.toObject() : null;
    } catch (error) {
      console.error('Error updating project progress:', error);
      return null;
    }
  }

  // Stats methods
  async getStats() {
    try {
      const [
        totalContacts,
        newContacts,
        contactedContacts,
        newsletterSubscribers,
        totalProjects,
        activeProjects,
        completedProjects
      ] = await Promise.all([
        Contact.countDocuments(),
        Contact.countDocuments({ status: 'new' }),
        Contact.countDocuments({ status: 'contacted' }),
        Newsletter.countDocuments({ status: 'active' }),
        Project.countDocuments(),
        Project.countDocuments({ status: 'in-progress' }),
        Project.countDocuments({ status: 'completed' })
      ]);

      return {
        totalContacts,
        newContacts,
        contactedContacts,
        newsletterSubscribers,
        totalProjects,
        activeProjects,
        completedProjects
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        totalContacts: 0,
        newContacts: 0,
        contactedContacts: 0,
        newsletterSubscribers: 0,
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0
      };
    }
  }
}

// Create singleton instance
const dataStore = new DataStore();

module.exports = dataStore;