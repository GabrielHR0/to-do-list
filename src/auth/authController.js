const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const users = require("../models/User")
require("dotenv").config();

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await users.findOne({email: email});
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

  console.log("Usuario logado: ", user);

  res.json({ auth: true, token });
};

exports.register = async (req, res) => {
  const { email, password } = req.body;

  const userExists = await users.findOne({email: email});
  if (userExists) {
    return res.status(400).json({ error: "E-mail já cadastrado" });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);
  const newUser = {
    email,
    password: hashedPassword
  };

  const result = await users.create(newUser);

  res.status(201).json({
    message: "Usuário cadastrado com sucesso",
    user: { id: result.id, email: result.email }
  });
};

exports.logout = (req, res) => {
  res.json({ auth: false, token: null, message: "Logout realizado com sucesso" });
};
