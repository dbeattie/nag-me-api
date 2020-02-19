const PORT = process.env.PORT || 8001;
const ENV = require("./environment");

const sendSMSToMuliplePeople = require("./helpers/sendMessages");
const sendSMSToNagUserOnly = require(".helpers/sendMessages")
const CronJob = require("cron").CronJob;

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");


const app = require("./application")(ENV); /*,{ updateAppointment });*/

const server = require("http").Server(app);

const WebSocket = require("ws");
const wss = new WebSocket.Server({ server });


app.use(bodyParser.json());
app.use(cookieParser());

wss.on("connection", socket => {
  socket.onmessage = event => {
    console.log(`Message Received: ${event.data}`);

    if (event.data === "ping") {
      socket.send(JSON.stringify("pong"));
    }
  };
});

// Old Web Socket Query
// sending sms to one person
// client.messages.create({
//   body: "hi, it works",
//   from: `+13172155407`,
//   to:   `+14169090083`
// })
// .then(message => console.log(message.sid));

// sending sms to mulitple people
const numbersToMessage = ["+14169090083", "+14166487618", "+17788480760"]

const sendSMS = () => { 
numbersToMessage.forEach(function(number){
  const message = client.messages.create({
    body: 'It works! Sending nag completions to multiple people',
    from: '+13172155407',
    to: number
  })
  .then(message =>  console.log(message.status))
  .done();
});
}

// console.log('Before job instantiation');
// const job = new CronJob('*/10 * * * * *', function() {
//   sendSMS();
// 	const d = new Date();
// 	console.log('send SMS every 10 secs:', d);
// });
// console.log('After job instantiation');
// job.start();

const sendUserNagAt6am = new CronJob('00 00 6 * * *', function() {
  const d = new Date();
  sendSMSToMuliplePeople()
	console.log('SMS Sent at 6am:', d);
});
sendUserNagAt6am.start()

const sendNagStatsToEveryoneInYourGroupAtMidnight = new CronJob('00 00 00 * * *', function() {
  const d = new Date();
  sendSMSToNagUserOnly()
	console.log('SMS Sent at Midnight:', d);
});
sendNagStatsToEveryoneInYourGroupAtMidnight.start();

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
