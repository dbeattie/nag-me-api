const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = require("twilio")(accountSid, authToken);
const numbersToMessage = ["+14169090083", "+14166487618", "+17788480760"];

// function to send out SMS messages to mulitiple numbers
module.exports = sendSMSToMultiplePeople = () => {
  numbersToMessage.forEach(function(number) {
    const message = client.messages
      .create({
        //get a real messasge from the body
        body: `Nag-Me Completion Report: ${user} did / did not complete ${nag} as of midnight on ${new Date}. ${user} requires copious amounts of public shaming`,
        from: "+13172155407",
        to: number
      })
      .then(message => console.log(message.status))
      .done();
  });
};

// function to send out SMS messages to mulitiple numbers
module.exports = sendSMSToNagUserOnly = () => {
  client.messages
    .create({
      //get a real messasge from the body
      body: `Nag-Me Daily Nag: Hello ${user} Your goal for today is to complete ${nag} as of midnight on ${new Date}`,
      from: "+13172155407",
      to: "14169090083" /*user.number call user number from the backend*/
    })
    .then(message => console.log(message.status))
    .done();
};
