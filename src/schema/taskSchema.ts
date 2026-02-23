import mongoose from "mongoose";
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
	},
	{
		timestamps: true,
	},
);

export default mongoose.model("Task", taskSchema);
