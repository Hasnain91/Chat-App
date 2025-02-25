// User Signup
const signup = (req, res) => {
  res.send("Sign Up Route is now working");
};

// User Login
const login = (req, res) => {
  res.send("Login Route is now working");
};

//User Logout
const logout = (req, res) => {
  res.send("Logout Route is now working");
};

module.exports = { signup, login, logout };
