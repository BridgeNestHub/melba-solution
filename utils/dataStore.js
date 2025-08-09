// Simple in-memory data store (in production, use a proper database)
class DataStore {
  constructor() {
    this.contacts = [];
    this.projects = [];
    this.newsletters = [];
    this.nextContactId = 1;
    this.nextProjectId = 1;
    this.nextNewsletterId = 1;
  }

  // Contact methods
  addContact(contactData) {
    const contact = {
      id: this.nextContactId++,
      ...contactData,
      date: new Date().toISOString(),
      status: 'new'
    };
    this.contacts.unshift(contact); // Add to beginning
    return contact;
  }

  getContacts() {
    return this.contacts;
  }

  getRecentContacts(limit = 5) {
    return this.contacts.slice(0, limit);
  }

  updateContactStatus(id, status) {
    const contact = this.contacts.find(c => c.id === parseInt(id));
    if (contact) {
      contact.status = status;
      return contact;
    }
    return null;
  }

  // Newsletter methods
  addNewsletter(email) {
    const newsletter = {
      id: this.nextNewsletterId++,
      email,
      date: new Date().toISOString(),
      status: 'active'
    };
    this.newsletters.unshift(newsletter);
    return newsletter;
  }

  getNewsletters() {
    return this.newsletters;
  }

  getRecentNewsletters(limit = 5) {
    return this.newsletters.slice(0, limit);
  }

  // Project methods (for future use)
  addProject(projectData) {
    const project = {
      id: this.nextProjectId++,
      ...projectData,
      startDate: new Date().toISOString(),
      status: 'planning',
      progress: 0
    };
    this.projects.unshift(project);
    return project;
  }

  getProjects() {
    return this.projects;
  }

  updateProjectProgress(id, progress, status) {
    const project = this.projects.find(p => p.id === parseInt(id));
    if (project) {
      project.progress = progress;
      if (status) project.status = status;
      project.lastUpdate = new Date().toISOString();
      return project;
    }
    return null;
  }

  // Stats methods
  getStats() {
    return {
      totalContacts: this.contacts.length,
      newContacts: this.contacts.filter(c => c.status === 'new').length,
      contactedContacts: this.contacts.filter(c => c.status === 'contacted').length,
      newsletterSubscribers: this.newsletters.length,
      totalProjects: this.projects.length,
      activeProjects: this.projects.filter(p => p.status === 'in-progress').length,
      completedProjects: this.projects.filter(p => p.status === 'completed').length
    };
  }
}

// Create singleton instance
const dataStore = new DataStore();

module.exports = dataStore;