const { Router } = require("express");
const ProgrammerController = require("./app/controllers/ProgrammerController");

const routes = Router();

routes.get("/programmer", ProgrammerController.index)
routes.get("/programmer/:id", ProgrammerController.show)
routes.post("/programmer", ProgrammerController.store)
routes.put("/programmer/:id", ProgrammerController.update)
routes.delete("/programmer/:id", ProgrammerController.destroy)

module.exports = routes;
