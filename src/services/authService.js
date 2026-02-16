const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (email, senha) => {
    const response = await axios.get(
        `${process.env.USER_SERVICE_URL}/usuarios`
    );

    const usuario = response.data.find(u => u.email === email);

    if (!usuario) throw new Error("Usuário não encontrado");

    const userFull = await axios.get(
        `${process.env.USER_SERVICE_URL}/usuarios/${usuario.id}`
    );

    const senhaValida = await bcrypt.compare(
        senha,
        userFull.data.senha
    );

    if (!senhaValida) throw new Error("Senha inválida");

    const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return token;
};
