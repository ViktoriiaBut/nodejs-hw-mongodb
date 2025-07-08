import { Schema, model } from "mongoose";

const userShema = new Schema (
    {
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    }
},
     { timestamps: true,
       versionKey: false
    },
);

userShema.methods.toJSON = function () {
 const user = this.toObject();

 delete user.password;
 return user;
}


export const User = model('User', userShema, 'Users');
