const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Users = require("../models/User")
require("dotenv").config();

exports.login = (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  const senhaValida = bcrypt.compareSync(password, user.password);
  if (!senhaValida) {
    return res.status(401).json({ error: "Senha inválida" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );

  res.json({ auth: true, token });
};
