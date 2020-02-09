
const express = require("express");
const router = express.Router();

// App Modules

const User = require("../Models/User");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * path:
 *  /users/:
 *    post:
 *      summary: Create a new user
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        "200":
 *          description: A user schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
router.post("/", (req, res, next) => {
  const { email, name } = req.body;
  const user = new User(name, email);
  res.json(user);
});

/**
 * @swagger
 * path:
 *  /users/:
 *    get:
 *      summary: Get all users
 *      tags: [Users]
 *      responses:
 *        "200":
 *          description: An array of users
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
router.get("/", (req, res, next) => {
  const userOne = new User("Alexanderia", "fake@gmail.com");
  const userTwo = new User("Ryan", "fakeagain@gmail.com");
  res.json({ userOne, userTwo });
});

module.exports = router;
