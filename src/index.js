const PORT = process.env.PORT || 8001;
const ENV = require("./environment");
const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = require('twilio')(accountSid, authToken);


const app = require("./application")(ENV); /*,{ updateAppointment });*/

const server = require("http").Server(app);

const WebSocket = require("ws");
const wss = new WebSocket.Server({ server });

wss.on("connection", socket => {
  socket.onmessage = event => {
    console.log(`Message Received: ${event.data}`);

    if (event.data === "ping") {
      socket.send(JSON.stringify("pong"));
    }
  };
});

// sending sms to one person
// client.messages.create({
//   body: "hi, it works",
//   from: `+13172155407`,
//   to:   `+14169090083`
// })
// .then(message => console.log(message.sid));

// sending sms to mulitple people
const numbersToMessage = ["+14169090083", "+14166487618", "+17788480760"]

numbersToMessage.forEach(function(number){
  const message = client.messages.create({
    body: 'It works! Sending nag completions to multiple people',
    from: '+13172155407',
    to: number
  })
  .then(message =>  console.log(message.status))
  .done();
});

// function updateAppointment(id, interview) {
//   wss.clients.forEach(function eachClient(client) {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(
//         JSON.stringify({
//           type: "SET_INTERVIEW",
//           id,
//           interview
//         })
//       );
//     }
//   });
// }

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT} in ${ENV} mode.`);
});
