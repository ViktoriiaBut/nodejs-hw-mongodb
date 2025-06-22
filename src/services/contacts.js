import createHttpError from "http-errors";
import { Contacts } from "../db/models/contactModel.js"

export const getAllContacts = async () => {
  const contacts = await Contacts.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await Contacts.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await Contacts.create(payload);
  return contact;
}

export const updateContact = async (contactId, payload) => {
  const contact = await Contacts.findByIdAndUpdate(contactId, payload, { new: true });

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
};

export const deleteContactById = async (contactId) => {
  const contact = await Contacts.findByIdAndDelete(contactId);
  return contact;
};
