import { Schema, model } from "mongoose";

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
        parentId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    }
},
     { timestamps: true,
       versionKey: false
    },


);

export const Contacts = model('Contacts', contactShema, 'Contacts');
