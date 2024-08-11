import controller from "./../controller.js";
import User from "./../../models/user.js";
import Permission from "./../../models/permission.js";
import Ticket from "./../../models/ticket.js";

export default new (class extends controller {
  async addPermissionToUser(req, res) {
    const { role, userEmail } = req.body;

    const userFound = await User.findOne({ email: userEmail });
    if (userFound) {
      const newPermission = new Permission({
        user: userFound,
        role,
      });
      userFound.permission = newPermission;

      await newPermission.save();
      await userFound.save();

      this.response({
        data: userFound,
        res,
      });
    } else {
      this.response({
        code: 404,
        message: "not found error",
        errors: [
          {
            field: "userEmail",
            error: "کاربری با ایمیل مدنظر وجود ندارد",
          },
        ],
        res,
      });
    }
  }

  async getTickets(req, res) {
    const limit = parseInt(req.params.limit) || 10;
    const page = parseInt(req.params.page) || 1;

    const tickets = await Ticket.find()
      .populate("user")
      .populate("ticket")
      .limit(limit)
      .skip((page - 1) * limit);

    const ticketsCount = await Ticket.countDocuments();

    let pagesCount = 1;

    if (ticketsCount > 10) pagesCount = ticketsCount / 10;

    this.response({
      data: {
        tickets,
        page,
        pagesCount,
      },
      res,
    });
  }

  async replyToUserTicket(req, res) {
    const { title, text, replyToTicketId } = req.body;

    const adminFound = await User.findById(req.user._id);
    const ticketFound = await Ticket.findById(replyToTicketId);
    if (ticketFound) {
      const newTicket = new Ticket({
        user: adminFound,
        title,
        text,
        replyToTicket: ticketFound,
      });

      adminFound.tickets.push(newTicket);

      ticketFound.ticketStatus = 1;
      ticketFound.replyTicket = newTicket;

      await newTicket.save();
      await ticketFound.save();
      await adminFound.save();

      this.response({
        data: newTicket,
        res,
      });
    } else {
      this.response({
        code: 400,
        message: "validation error",
        errors: [
          {
            field: "replyToTicketId",
          },
        ],
      });
    }
  }
})();
