import createHttpError from "http-errors";
import { createContact, deleteContactById, getAllContacts, getContactById, updateContact } from "../services/contacts.js";
// import fs from 'fs/promises';
// import path from 'path';
// import { UPLOAD_DIR } from '../constants/paths.js';
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";

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
    const avatar = req.file;
    let avatarUrl;
    if (avatar) {
        avatarUrl = await saveFileToCloudinary(avatar);
    }

    const contact = await createContact({
        ...req.body,
        avatar: avatarUrl,
        userId: req.user._id
    });

    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data: contact
    });
};

export const patchContactsController  = async (req, res) => {
    const { contactId } = req.params;
    const avatar = req.file;
    let avatarUrl;
    if (avatar) {
        avatarUrl = await saveFileToCloudinary(avatar);
    }

    const result = await updateContact (
        { _id: contactId, userId: req.user._id },
        { ...req.body, avatar: avatarUrl },
        { upsert: true },
    );
    if (!result) {
        throw createHttpError(404, 'Contact not found');
    }

    const status = result.isNew ? 201 : 200;

    res.status(status).json({
        status,
        message: `Successfully patched a contact!`,
        data: result.contact,
    });
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




