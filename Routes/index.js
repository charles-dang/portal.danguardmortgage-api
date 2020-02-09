"use strict";
// Node Modules
const express = require("express");
const router = express.Router();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const userRouter = require("./UsersRoutes");

//setting up application routes
router.use('/users',userRouter);



// Swagger set up
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Time to document that Express API you built",
      version: "1.0.0",
      description:
        "A test project to understand how easy it is to document and Express API",
      license: {
        name: "MIT",
        url: "https://choosealicense.com/licenses/mit/"
      },
      contact: {
        name: "Swagger",
        url: "https://swagger.io",
        email: "Info@SmartBear.com"
      }
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1"
      }
    ]
  },
  apis: [ "./Models/User.js", "./Routes/UsersRoutes.js", 
          "./Models/ApplicationModel.js",
          "./Models/ApplicantModel.js",
          "./Models/ValidationResultModel.js",
          "./Routes/applicationRoutes.js"]
};
const specs = swaggerJsdoc(options); 
router.use("/docs", swaggerUi.serve);
router.get("/docs", swaggerUi.setup(specs, { explorer: true }));

// catch 404 and forward to error handler
router.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error Handler
router.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

module.exports = router;
