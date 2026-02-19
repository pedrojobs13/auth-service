const axios = require("axios");
const jwt = require("jsonwebtoken");

exports.login = async (email, senha) => {
  // Fluxo recomendado: user-service valida as credenciais e devolve dados básicos.
  let usuario;
  try {
    const { data } = await axios.post(
      `${process.env.USER_SERVICE_URL}/usuarios/auth`,
      { email, senha }
    );
    usuario = data;
  } catch (err) {
    // Se o user-service devolveu 401/404 com mensagem, repassa a mensagem.
    const msg = err?.response?.data?.error;
    if (msg) throw new Error(msg);
    throw err;
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return token;
};
