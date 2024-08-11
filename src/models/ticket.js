import mongoose from "mongoose";
import moment from "jalali-moment";

const ticketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
  ticketStatus: {
    type: Number,
    default: 0,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  replyToTicket: {
    type: mongoose.Types.ObjectId,
    ref: "ticket",
    default: null,
  },
  replyTicket: {
    type: mongoose.Types.ObjectId,
    ref: "ticket",
    default: null,
  },
  createdAt: {
    type: String,
    default: moment().format("jYYYY/jMM/jDD"),
  },
  updatedAt: {
    type: String,
    default: moment().format("jYYYY/jMM/jDD"),
  },
});

ticketSchema.pre("save", function () {
  this.updatedAt = moment().format("jYYYY/jMM/jDD");
});

const Ticket = mongoose.model("ticket", ticketSchema);

export default Ticket;
