// import the model
const User = require("./users.model");

// GET: Return a list of users
async function list(req, res) {
  // use the find method to search for the model document
  const users = await User.find();
  // response with the data that is returned from above
  res.send(users);
}

// Middleware function: validates that the request has the correct properties
function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({
      status: 400,
      message: `Must include a ${propertyName}`,
    });
  };
}

// Middleware function: validates that a given user exists
async function userExists(req, res, next) {
  const { userId } = req.params;
  const foundUser = await User.findOne({ _id: userId });
  if (foundUser) {
    res.locals.user = foundUser;
    return next();
  }
  next({
    status: 404,
    message: `User id not found: ${userId}`,
  });
}

// POST: Create a new user, assign an id, and return at least the id
async function create(req, res) {
  const { data: { username, email } = {} } = req.body;
  const newUser = new User({
    username: username,
    email: email,
  });
  // saves the newUser record in the database
  await newUser.save();
  res.status(201).json({ data: newUser });
}

// GET by id: Return the user with the specified id, or return 404 if it does not exist
function read(req, res, next) {
  res.json({ data: res.locals.user });
}

// PUT: Update an existing user with the data in the request
async function update(req, res) {
  const user = res.locals.user;
  const { data: { username, email } = {} } = req.body;

  user.username = username;
  user.email = email;
  await user.save();

  res.json({ data: user });
}

// DELETE by id: Delete the user with the specified id
async function deleteUser(req, res) {
  const { userId } = req.params;
  await User.deleteOne({ _id: userId });
  res.sendStatus(204);
}

// Export functions so they are available outside of this file (can be added to the router)
module.exports = {
  list,
  userExists,
  create: [bodyDataHas("username"), bodyDataHas("email"), create],
  read: [userExists, read],
  update: [userExists, bodyDataHas("username"), bodyDataHas("email"), update],
  delete: [userExists, deleteUser],
};
