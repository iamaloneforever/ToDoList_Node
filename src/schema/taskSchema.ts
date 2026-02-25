import mongoose from "mongoose";
import { required } from "zod/mini";
const { Schema } = mongoose;

const taskSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, default: "" },
		dueDate: { type: Date },
		status: {
			type: String,
			enum: ["pending", "in-progress", "done", "canceled"],
			default: "pending",
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Users",
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model("Task", taskSchema);
