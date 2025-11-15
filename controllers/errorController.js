const errorController = {}

errorController.triggerError = (req, res, next) => {
  const err = new Error("This is an intentional test error.")
  err.status = 500
  throw err
}

module.exports = errorController