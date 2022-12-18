module.exports = (error, req, res, next) => {
  console.log("Not found");

  res.status(404).json({
    message: "Not found",
    error: error.message,
  });
};
