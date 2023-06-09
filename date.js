exports.getDate = function() {

  const today = new Date();
  const option = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  return today.toLocaleDateString("en-US", option);

};

exports.getTime = function() {
  const today = new Date();
  return today.toLocaleTimeString();
};
