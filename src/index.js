const PORT = process.env.PORT || 8001;
const ENV = require("./environment");
const sendSMSToMuliplePeople = require("./helpers/sendMessages");
const sendSMSToNagUserOnly = require("./helpers/sendMessages")
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
    console.log(`Message Received!`);

    if (event.data === "ping") {
      socket.send(JSON.stringify("pong"));
    }
  };
});

const sendUserNagAt6am = new CronJob('00 00 6 * * *', function() {
  const d = convertToTOTime();
  sendSMSToMuliplePeople()
	console.log('SMS Sent at 6am:', d);
});
sendUserNagAt6am.start()

const sendNagStatsToEveryoneInYourGroupAtMidnight = new CronJob('00 00 00 * * *', function() {
  const d = convertToTOTime();
  sendSMSToNagUserOnly()
	console.log('SMS Sent at Midnight:', d);
});
sendNagStatsToEveryoneInYourGroupAtMidnight.start();

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT} in ${ENV} mode.`);
});
