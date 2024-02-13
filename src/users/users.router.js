const router = require("express").Router({ mergeParams: true });
const controller = require("./users.controller");
// any other method outside the ones defined in this file will return a methodNotAllowed
const methodNotAllowed = require("../errors/methodNotAllowed");

router
  .route("/:userId")
  .get(controller.read)
  .put(controller.update)
  .delete(controller.delete)
  .all(methodNotAllowed);

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;
