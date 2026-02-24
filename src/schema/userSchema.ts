import mongoose from "mongoose";
import { required } from "zod/mini";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		username: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		token: { type: String, required: true },
	},
	{
		timestamps: true,
	},
);

export default mongoose.model("UserSchema", UserSchema);
