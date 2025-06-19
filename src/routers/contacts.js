import { Router } from 'express';
import { getAllContacts, getContactById } from "../services/contacts.js";

const contactsRouter  = Router();

contactsRouter.get('/contacts', async (req, res) => {
        const data = await getAllContacts();
        res.status(200).json({
            status: 200,
            message: 'Successfully found contacts',
            data,
        });
    });

   contactsRouter.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;

    try {
        const contact = await getContactById(contactId);

        if (!contact) {
            return res.status(404).json({
                status: 404,
                message: 'Contact not found',
            });
        }

        res.status(200).json({
            status: 200,
            message: `Successfully found contact ${contactId}`,
            data: contact,
        });
    } catch (err) {
            return res.status(400).json({
            status: 400,
            message: 'Invalid contact ID',
        });
    }
});

export default contactsRouter;
