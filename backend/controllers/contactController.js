import Contact from '../models/Contact.js';

export const getContacts = async (req, res, next) => {
  try {
    const ownerId = req.query.ownerId || 'me';
    const contacts = await Contact.find({ ownerId });
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const addContact = async (req, res, next) => {
  try {
    const { id, name, avatar, group, ownerId } = req.body;
    
    // Check if contact already exists for this owner
    const existing = await Contact.findOne({ id, ownerId: ownerId || 'me' });
    if (existing) {
      return res.status(400).json({ message: 'Contact already exists' });
    }

    const contact = await Contact.create({
      id,
      name,
      avatar: avatar || '👤',
      group: group || 'Other',
      ownerId: ownerId || 'me'
    });

    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

// Ensure default contacts exist on load for testing
export const seedContacts = async (req, res, next) => {
  try {
    const ownerId = 'me';
    const existingCount = await Contact.countDocuments({ ownerId });
    
    if (existingCount === 0) {
      const mockContacts = [
        { ownerId, id: 'alex', name: 'Alex (Colleague)', group: 'Office', avatar: '👨‍💻' },
        { ownerId, id: 'sarah', name: 'Sarah (Designer)', group: 'Office', avatar: '👩‍🎨' },
        { ownerId, id: 'mom', name: 'Mom', group: 'Family', avatar: '👩‍👧' },
        { ownerId, id: 'clone', name: 'My Digital Clone', group: 'Other', avatar: '🤖' }
      ];
      await Contact.insertMany(mockContacts);
      return res.status(201).json({ message: 'Seeded contacts' });
    }
    
    res.status(200).json({ message: 'Contacts already seeded' });
  } catch (error) {
    next(error);
  }
};
