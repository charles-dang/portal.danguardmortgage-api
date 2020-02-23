"use strict";
// Node Modules
const express = require("express");
const router = express.Router();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


const applicationRouter = require("./applicationRoutes");

//setting up application routes
router.use('/', applicationRouter);



// Swagger set up
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Application API",
      version: "1.0.0",
      description:
        "Application API to handle loan application",
      license: {
        name: "MIT",
        url: "https://choosealicense.com/licenses/mit/"
      },
      contact: {
        name: "Charles Dang",
        url: "https://www.linkedin.com/in/cdang/",
        email: "charles.d.dang@gmail.com"
      }
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1"
      }
    ]
  },
  apis: [ "./src/Models/ApplicationModel.js",
          "./src/Models/ApplicantModel.js",
          "./src/Utilities/ValidatorUtility.js",
          "./src/Routes/applicationRoutes.js"]
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
