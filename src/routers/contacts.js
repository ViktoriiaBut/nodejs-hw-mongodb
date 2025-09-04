import { Router } from 'express';
import { createContactsController, deleteContactController, getAllContactsController,
     getContactByIdController, patchContactsController } from "../controllers/contacts.js"
import { isValidId } from '../middlewares/isValidId.js';
import { createContactValidation, updateContactValidation } from '../validation/contactValidation.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';



const contactsRouter  = Router();

contactsRouter.post('/test-upload', upload.single('photo'), (req, res) => {
  console.log('BODY:', req.body);
  console.log('FILE:', req.file);
  res.json({
    body: req.body,
    file: req.file,
  });
});

contactsRouter.use('/', authenticate);
contactsRouter.use('/:contactId', isValidId);
contactsRouter.get('/', getAllContactsController);
contactsRouter.get('/:contactId', getContactByIdController);
contactsRouter.post('/', upload.single('photo'), validateBody(createContactValidation), createContactsController);
contactsRouter.patch('/:contactId', upload.single('photo'), validateBody(updateContactValidation), patchContactsController);

contactsRouter.delete('/:contactId', deleteContactController);


export default contactsRouter;


