import express from 'express';
import { getContacts, addContact, seedContacts } from '../controllers/contactController.js';

const router = express.Router();

router.get('/contacts', getContacts);
router.post('/contacts', addContact);
router.post('/contacts/seed', seedContacts);

export default router;
