import createHttpError from "http-errors";
import { createContact, deleteContactById, getAllContacts, getContactById, updateContact } from "../services/contacts.js";


export const getAllContactsController = async (req, res) => {
    const { page = 1, perPage = 10, sortBy='name', sortOrder='asc', contactType, isFavourite } = req.query;
    const filters = { userId: req.user._id };

      if (contactType) filters.contactType = contactType;
      if (isFavourite !== undefined) filters.isFavourite = isFavourite === 'true';

        const data = await getAllContacts({
          page: Number(page),
          perPage: Number(perPage),
          sortBy,
          sortOrder,
          contactType,
          isFavourite,
          filters,
        });
        res.status(200).json({
            status: 200,
            message: 'Successfully found contacts',
            data,
        });
    };


export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId, req.user._id);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact ${contactId}`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

   export const createContactsController = async (req, res) => {
    const contact = await createContact({
        ...req.body,
         userId:  req.user._id,
        });

    return  res.status(201).json({
            status: 201,
            message: 'Successfully created contact',
            data: contact,
        });
};

export const patchContactsController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await updateContact(contactId, req.body, req.user._id);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    return res.status(200).json({
      status: 200,
      message: `Successfully updated contact with id ${contactId}`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res) => {
        const { contactId } = req.params;
        const userId = req.user._id;
        const deleted = await deleteContactById(contactId, userId);

        if (!deleted) {
            throw createHttpError(404, "Contact not found");
        }
        res.status(204).send();
};
