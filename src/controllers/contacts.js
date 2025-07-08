import createHttpError from "http-errors";
import { createContact, deleteContactById, getAllContacts, getContactById, updateContact } from "../services/contacts.js";



export const getAllContactsController = async (req, res) => {
    const { page = 1, perPage = 10, sortBy='name', sortOrder='asc', contactType, isFavourite } = req.query;

        const data = await getAllContacts({
          page: Number(page),
          perPage: Number(perPage),
          sortBy,
          sortOrder,
          contactType,
          isFavourite,
        });
        res.status(200).json({
            status: 200,
            message: 'Successfully found contacts',
            data,
        });
    };

export const getContactByIdController = async (req, res) => {
    const { contactId } = req.params;

        const contact = await getContactById(contactId);
        if (!contact) {
            throw createHttpError(404, 'Contact not found');
        }
        res.status(200).json({
            status: 200,
            message: `Successfully found contact ${contactId}`,
            data: contact,
        });
   };

   export const createContactsController = async (req, res) => {
    const contact = await createContact({...req.body,
         parentId: req.body.parentId ?? req.user._id,});

    return  res.status(201).json({
            status: 201,
            message: 'Successfully created contact',
            data: contact,
        });
}

export const patchContactsController = async (req, res) => {
    const { contactId } = req.params;
    const contact = await updateContact (contactId, req.body)

    if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
    return  res.status(200).json({
            status: 200,
            message: `Successfully updated contact with id ${contactId}`,
            data: contact,
        });
}
export const deleteContactController = async (req, res, next) => {
        const { contactId } = req.params;
        const deleted = await deleteContactById(contactId);

        if (!deleted) {
            throw createHttpError(404, "Contact not found");
        }
        res.status(204).send();
};
