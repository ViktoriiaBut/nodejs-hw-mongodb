import { Schema, Types, model } from "mongoose";

const sessionShema = new Schema(
    {
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    accessTokenValidUntil: {
        type: Date,
        required: true,
        },
   refreshTokenValidUntil: {
        type: Date,
        required: true,
        },
    userId: {
        type: Types.ObjectId,
        required: true,
        ref: 'User',
    }
},
     { timestamps: true,
       versionKey: false
    },
);

export const Session = model('Session', sessionShema);
