const request = require("supertest");

jest.mock("axios");
jest.mock("bcryptjs");

const axios = require("axios");
const bcrypt = require("bcryptjs");

const app = require("../app");

describe("POST /auth/login", () => {
  beforeEach(() => {
    process.env.USER_SERVICE_URL = "http://user-service";
    process.env.JWT_SECRET = "test-secret";
  });

  test("retorna 200 e token quando credenciais são válidas", async () => {
    axios.get
      .mockResolvedValueOnce({
        data: [{ id: 1, email: "a@a.com" }],
      })
      .mockResolvedValueOnce({
        data: { id: 1, email: "a@a.com", senha: "hashed" },
      });

    bcrypt.compare.mockResolvedValueOnce(true);

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "a@a.com", senha: "123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
  });

  test("retorna 401 quando usuário não existe", async () => {
    axios.get.mockResolvedValueOnce({ data: [{ id: 1, email: "x@x.com" }] });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "naoexiste@a.com", senha: "123" });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Usuário não encontrado" });
  });

  test("retorna 401 quando senha é inválida", async () => {
    axios.get
      .mockResolvedValueOnce({
        data: [{ id: 1, email: "a@a.com" }],
      })
      .mockResolvedValueOnce({
        data: { id: 1, email: "a@a.com", senha: "hashed" },
      });

    bcrypt.compare.mockResolvedValueOnce(false);

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "a@a.com", senha: "errada" });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Senha inválida" });
  });
});

