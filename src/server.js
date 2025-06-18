import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getEnvVar } from './utils/getEnvVar.js';
import { getAllContacts, getContactById } from './services/contacts.js';

export const setupServer = () => {
    const app = express();
    const PORT = Number(getEnvVar('PORT', 3000));

    app.use(cors());
    app.use(pino({
        transport: {
            target: 'pino-pretty',
        },
    }));

    app.get('/contacts', async (req, res) => {
        const data = await getAllContacts();
        res.status(200).json({
            status: 200,
            message: 'Successfully found contacts',
            data,
        });
    });

   app.get('/contacts/:contactId', async (req, res) => {
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

    app.use((req, res) => {
      res.status(404).json({
       message: 'Not found',
      });
    });

 app.use((err, req, res, next) => {
  res.status(500).json({
    message: 'Something went wrong',
    error: err.message,
  });
});

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
}
