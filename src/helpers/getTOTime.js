const correctDate = str => {
  let newString = str.split("/");

  if (newString[0].length < 2) {
    return [newString[2], newString[0].replace(/^/, "0"), newString[1]].join(
      "-"
    );
  }
  return [newString[2], newString[0], newString[1]].join("-");
};

const getTOTime = () => {
  //EST
  offset = -5.0;
  clientDate = new Date();
  utc = clientDate.getTime() + clientDate.getTimezoneOffset() * 60000;
  serverDate = new Date(utc + 3600000 * offset);
  let currentDate = serverDate.toLocaleString("en-us", {
    year: "numeric",
    month: "numeric",
    day: "numeric"
  });
  return correctDate(currentDate);
};

module.exports = { getTOTime };
