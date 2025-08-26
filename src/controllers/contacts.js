import createHttpError from "http-errors";
import { createContact, deleteContactById, getAllContacts, getContactById, updateContact } from "../services/contacts.js";
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


export const createContactsController = async (req, res, next) => {
  try {
    const photo = req.file;
    let photoUrl;
    if (photo) {
      photoUrl = await saveFileToCloudinary(photo);
    }
    const contact = await createContact({
      ...req.body,
      photo: photoUrl,
      userId: req.user._id
    });
    res.status(201).json({
      status: 201,
      message: "Successfully created a contact!",
      data: contact
    });
  } catch (error) {
    console.error(' Error in createContactsController:', error);
    next(error);
  }
};



// export const patchContactsController = async (req, res) => {
//   const { contactId } = req.params;
//   const avatar = req.file;
//   let avatarUrl;
//   if (avatar) {
//     avatarUrl = await saveFileToCloudinary(avatar);
//   }
//   const updates = {
//     ...req.body,
//     ...(avatarUrl && { avatar: avatarUrl })
//   };
//   const result = await updateContact(contactId, req.user._id, updates);
//   if (!result) {
//     throw createHttpError(404, 'Contact not found');
//   }

//   res.status(200).json({
//     status: 200,
//     message: 'Successfully patched a contact!',
//     data: result,
//   });
// };



export const patchContactsController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const photo = req.file;

    let photoUrl;
    if (photo) {
      photoUrl = await saveFileToCloudinary(photo);
    }
    const updates = {
      ...req.body,
      ...(photoUrl && { photo: photoUrl }),
    };

    const result = await updateContact(contactId, userId, updates);

    if (!result) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 'success',
      message: 'Contact updated successfully',
      data: result,
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




