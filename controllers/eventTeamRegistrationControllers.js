const EventsData = require("../models/eventsRegistration");
const User = require("../models/users");
const UserEvents = require("../models/userEventsSchema");
const createError = require("http-errors");

const registerForEvent = async (req, res, next) => {

  let check = true;
  //console.log(req.body.Teams[0].MembersList);
  for (let i = 0; i < req.body.Teams[0].MembersList.length; i++) {
    let email = req.body.Teams[0].MembersList[i].email;
    let dataCheck;
    try {
      dataCheck = await User.findOne({ email: email });
    } catch {
      return next(new createError( `${email} is not registered`, 404));
    }

  }

  if (!check) {
    return next(
      new createError(
        "For registering in the Events all users first need to register",
        404
      )
    );
  }

  let response;
  try {
    response = await EventsData.findOne({ EventName: req.body.EventName });
  } catch {
    return next(new createError("Error event not found ", 404));
  }

  if (!response) {
    response = new EventsData({
      EventName: req.body.EventName,
      Teams: req.body.Teams[0],
    });
  } else {
    response.Teams.push({ ...req.body.Teams[0] });
  }
  let responseData;
  try {
    responseData = await response.save();
  } catch (error) {
    return next(new createError("Error occured ...", 404));
  }

  if (!responseData) {
    return next(new createError("error", 404));
  }

  let EventName = req.body.EventName;
  for (let i = 0; i < req.body.Teams[0].MembersList.length; i++) {
    let email = req.body.Teams[0].MembersList[i].email;
    let user, UserEvent;

    try {
      UserEvent = await UserEvents.findOne({ email: email });
    } catch (error) {
      return next(new createError("error", 404));
    }

    if (!UserEvent) {
      UserEvent = new UserEvents({
        email: email,
        EventsRegistered: EventName
      })
    }
    else {
      UserEvent.EventsRegistered.push(EventName);
    }

    // console.log(user.EventsRegistered);
    // user.EventsRegistered.push(EventName);

    try {
      let resp = await UserEvent.save();
      // console.log(resp);
    } catch (error) {
      return next(new createError("error", 404))
    }
  }

  res.json({
    message: "Successfully registered for events",
    status: "Thank u",
  });
};
exports.registerForEvent = registerForEvent;




