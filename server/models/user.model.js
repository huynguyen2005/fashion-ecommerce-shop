const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    password: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    status: {
        type: String,
        enum: ["active", "inactive", "blocked"],
        default: "active",
        index: true
    },
    avatar: {
        type: String,
        default: ""
    },
    googleId: {
        type: String,
        default: null,
        unique: true, 
        sparse: true
    },
    facebookId: {
        type: String,
        default: null,
        unique: true,
        sparse: true
    },
    loginType: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        default: 'local'
    }

}, {
    timestamps: true,
    collection: COLLECTION_NAME
}
);

module.exports = model(DOCUMENT_NAME, userSchema);