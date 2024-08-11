import mongoose from "mongoose";

const activationCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: Number,
    required: true,
  },
  expire: {
    type: Number,
    default: Date.now() + 900,
  },
});

const ActivationCode = mongoose.model("activation-code", activationCodeSchema);

export default ActivationCode;
