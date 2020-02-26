const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = require("twilio")(accountSid, authToken);

//*********EXAMPLE OF USER OBJECT TO SEND A NAG TO*****************/
//*****************************************************************/
// {
//   id: 3,
//   user_name: 'Kevin Zhu',
//   email: 'Kevin@example.com',
//   password: 'password',
//   phone_number: '+14166487618',
//   goal_name: 'Codewars',
//   user_id: 3,
//   start_date: 2019-10-14T04:00:00.000Z,
//   end_date: 2020-10-14T04:00:00.000Z,
//   cron: 'everyday at 900',
//   friend_1_phone_number: '+17788480760',
//   friend_2_phone_number: '+14169090083'
// }

// function to send out SMS messages to mulitiple [person] 6 AM
//*************************************************************
const sendSMSToMultiplePeople6AM = mulitiplePeople => {
  mulitiplePeople.forEach(sendSMSToNagUserOnly6AM);
};

// function to send out SMS messages to the user only 6 AM
//********************************************************
const sendSMSToNagUserOnly6AM = person => {
  const todaysDate = new Date();
  const dateDisplayOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  client.messages
    .create({
      body: `Greetings from Nag-Me.com!! Hello ${person.user_name}! You are working towards the goal of ${person.goal_name} ending on ${person.end_date.toLocaleDateString('en-us', dateDisplayOptions)}. Your goal for today is to complete the activity toward the goal of ${person.goal_name} by midnight on ${todaysDate.toLocaleDateString('en-us', dateDisplayOptions)}. When you have completed the daily actvity, please log in to Nag-Me.com to mark today's Nag as complete.`,
      from: "+13172155407",
      to: person.phone_number
    })
    .then(message => console.log(message.status))
    .done();
};

// function to send out SMS messages to mulitiple [person] 12AM
//*************************************************************
const sendSMSToMultiplePeople12AM = mulitiplePeople => {
  mulitiplePeople.forEach(sendSMSToNagUserOnly12AM);
};

// function currently only sends one nag completion result ONE person friend, despite multiple attempts to send to multiple people
//********************************************************************************************************************************
const sendSMSToNagUserOnly12AM = person => {
  const todaysDate = new Date();
  const dateDisplayOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  console.log("person is ", person)
  client.messages
    .create({
      body: `Greetings from Nag-Me.com!! ${person.user_name} is working towards the goal of ${person.goal_name}. They did not complete their task for today, ${todaysDate.toLocaleDateString('en-us', dateDisplayOptions)}. ${person.user_name} requires an exorbitant amount of public shaming!`,
      from: "+13172155407",
      to: person.friend_1_phone_number
    })
    .then(message => console.log("here is queued", message.status))
    .done();
};

module.exports = { sendSMSToMultiplePeople6AM, sendSMSToMultiplePeople12AM };
