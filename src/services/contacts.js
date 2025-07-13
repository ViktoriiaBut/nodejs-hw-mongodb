import createHttpError from "http-errors";
import { Contacts } from "../db/models/contactModel.js";

const createPagination = (page, perPage, count, contacts) => {
  const totalPages = Math.ceil(count / perPage);
  const hasPreviousPage = page !==1 && page <= totalPages;
  const hasNextPage = totalPages > page;

 return {
  page,
  perPage,
  totalItems: count,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  data: contacts,
 }
}


export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  contactType,
  isFavourite,
  filters = {},
  }) => {
  const offset = (page - 1) * perPage;

  const filter = { ...filters };

  if (contactType) {
    filter.contactType = contactType;
  }
  if (typeof isFavourite === 'boolean') {
    filter.isFavourite = isFavourite;
  }

  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [contacts, contactsCount] = await Promise.all([
    Contacts.find(filter).skip(offset).limit(perPage).sort(sort),
    Contacts.countDocuments(filter),
  ]);

  const pagination = createPagination(page, perPage, contactsCount, contacts);

  return pagination;
};

export const getContactById = async (contactId, userId) => {
  const contact = Contacts.findOne({ _id: contactId, userId });

    if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
};

export const createContact = async (payload) => {
  const contact = await Contacts.create(payload);
  return contact;
};

export const updateContact = async (contactId, body, userId) => {
  const contact = await Contacts.findOneAndUpdate(
    { _id: contactId, userId },
    body,
    { new: true }
  );

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
};

export const deleteContactById = async (id, userId) => {
  const contact = await Contacts.findOneAndDelete({ _id: id, userId });
  return contact;
};
