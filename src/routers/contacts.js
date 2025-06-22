import { Router } from 'express';
import { createContactsController, deleteContactController, getAllContactsController, getContactByIdController, patchContactsController} from "../controllers/contacts.js"


const contactsRouter  = Router();

contactsRouter.get('/', getAllContactsController);

contactsRouter.get('/:contactId', getContactByIdController);

contactsRouter.post('/', createContactsController);

contactsRouter.patch('/:contactId', patchContactsController);

contactsRouter.delete('/:contactId', deleteContactController);

export default contactsRouter;
