const service = require("../services/authService");

exports.login = async (req, res) => {
  try {
    const { email, senha, password } = req.body;
    const senhaFinal = senha ?? password;

    if (!email || !senhaFinal) {
      return res
        .status(400)
        .json({ error: "Email e senha são obrigatórios" });
    }

    const token = await service.login(email, senhaFinal);
    return res.json({ token });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};
