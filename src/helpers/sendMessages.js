const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = require("twilio")(accountSid, authToken);


// function to send out SMS messages to mulitiple [person]
const sendSMSToMultiplePeople = (mulitiplePeople) => {
  console.log("++++++++++ ", mulitiplePeople)
  mulitiplePeople.forEach(sendSMSToNagUserOnly);
};

//*********EXAMPLE OF USER OBJECT TO SEND A NAG TO*****************/
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

// function to send out SMS messages to the user only
const sendSMSToNagUserOnly = (person) => {
  console.log(">>>>>>>>>>>>",person)
  client.messages
    .create({
      //get a real messasge from the body
      body: `Greetings from Nag-Me.com!! Hello ${person.user_name}! You are working towards the goal of ${person.goal_name} ending on ${person.end_date}. Your goal for today is to complete the activity toward the goal of ${person.goal_name} by midnight on ${new Date().toLocaleDateString('en-us', { weekday: 'long', month: 'short', day: 'numeric'})}. When you have completed the daily actvity, please log in to Nag-Me.com to mark today's Nag as complete.`,
      from: "+13172155407",
      to: person.phone_number
    })
    .then(message => console.log(message.status))
    .done();
};

module.exports ={ sendSMSToNagUserOnly, sendSMSToMultiplePeople}