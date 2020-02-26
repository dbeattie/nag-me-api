//function that returns an array of goalIDs
//*****************************************
const goalIdfind = arr => {
  let goalIdArr = [];
  arr.forEach(element => {
    goalIdArr.push(element.goal_id);
  });
  return goalIdArr;
};

module.exports = { goalIdfind };
