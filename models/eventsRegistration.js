const mongoose = require("mongoose");

const EventTeamListSchema = mongoose.Schema({
  EventName: {
    type: String,
    required: true,
  },
  Teams: [
    {
      MembersList: [
        {
          username: {
            type: String,
            required: true,
          },
          email: {
            type: String,
            required: true,
          },
          PhoneNumber: {
            type: String,
            required: true,
          },
          College: {
            type: String,
            required: true,
          },
        },
      ],
      TeamName: {
        type: String,
        default: null,
      },
    },
  ],
});

module.exports = mongoose.model(
  "EventsData",
  EventTeamListSchema
);
