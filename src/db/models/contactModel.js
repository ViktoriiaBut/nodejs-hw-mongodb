import { Schema, model, version } from "mongoose";

const contactShema = new Schema (
    {
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
    },
    isFavourite: {
        type: Boolean,
        default: false,
    },
    contactType: {
      type: String,
      enum: ['personal','home','work'],
      default: 'personal',
    },
    }
);

export const Contacts = model('contacts', contactShema, {timestamps: true, versionKey: false});
