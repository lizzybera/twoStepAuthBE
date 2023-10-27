import mongoose from "mongoose";

interface iAuthor {
    name? : string;
    email? : string;
    password? : string;
    image? : string;
    imageID? : string;
}

export interface iAuthorData extends iAuthor, mongoose.Document {}