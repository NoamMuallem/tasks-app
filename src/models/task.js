const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User" // needs to be identical to the name we gave in the user model file when we defined mongoose.model('User',userSchema)
    }
  },
  {
    timestamps: true
  }
);

//chacking if a task update filed is valid, returns fals is an unvalid filed was entered
taskSchema.statics.isValidUpdate = updates => {
  const allowedUpdates = ["description", "completed"]; //all valid fileds to update
  const isValidOperetion = updates.every(update =>
    allowedUpdates.includes(update)
  ); //will be true if onle EVERY string in the updates array is included in allowedUpdates
  return isValidOperetion;
};

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
