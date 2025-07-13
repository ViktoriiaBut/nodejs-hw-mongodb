import { Router } from 'express';
import { createContactsController, deleteContactController, getAllContactsController, getContactByIdController, patchContactsController} from "../controllers/contacts.js"
import { isValidId } from '../middlewares/isValidId.js';
import { createContactValidation, updateContactValidation } from '../validation/contactValidation.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';


const contactsRouter  = Router();
contactsRouter.use('/', authenticate);
contactsRouter.use('/:contactId', isValidId);
contactsRouter.get('/', getAllContactsController);
contactsRouter.get('/:contactId', getContactByIdController);
contactsRouter.post('/', validateBody(createContactValidation), createContactsController);
contactsRouter.patch('/:contactId', validateBody(updateContactValidation), patchContactsController);
contactsRouter.delete('/:contactId', deleteContactController);

export default contactsRouter;

