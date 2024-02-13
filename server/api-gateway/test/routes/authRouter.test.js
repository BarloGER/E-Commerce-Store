import request from "supertest";
import { expect } from "chai";
import { app } from "../../server.js";

describe("Auth Router Integration Tests", () => {
  const generateRandomAlphanumeric = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const randomUsername = generateRandomAlphanumeric(20);
  const randomEmailLocalPart = generateRandomAlphanumeric(20);

  describe("POST /auth/signup", () => {
    it("should successfully register a user", (done) => {
      request(app)
        .post("/auth/signup")
        .send({
          username: randomUsername,
          email: `${randomEmailLocalPart}@example.com`,
          password: "Password123!",
          first_name: "Test",
          last_name: "User",
        })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property(
            "message",
            "Erfolgreich registriert.",
          );
          done();
        });
    });

    it("should reject the registration if the e-mail already exists", (done) => {
      request(app)
        .post("/auth/signup")
        .send({
          username: generateRandomAlphanumeric(20),
          email: `${randomEmailLocalPart}@example.com`,
          password: "Password123!",
          first_name: "Test",
          last_name: "User",
        })
        .expect(409)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property(
            "message",
            "Diese E-Mail existiert bereits!",
          );
          done();
        });
    });

    it("should reject the registration if the user name already exists", (done) => {
      request(app)
        .post("/auth/signup")
        .send({
          username: randomUsername,
          email: `${generateRandomAlphanumeric(20)}@example.com`,
          password: "Password123!",
          first_name: "Test",
          last_name: "User",
        })
        .expect(409)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property(
            "message",
            "Dieser Benutzername existiert bereits!",
          );
          done();
        });
    });
  });

  describe("POST /auth/signin", () => {
    it("should allow a user to log in", (done) => {
      request(app)
        .post("/auth/signin")
        .send({
          email: `${randomEmailLocalPart}@example.com`,
          password: "Password123!",
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property("token");
          done();
        });
    });

    it("should refuse to log in if the password is incorrect", (done) => {
      request(app)
        .post("/auth/signin")
        .send({
          email: `${randomEmailLocalPart}@example.com`,
          password: "wrongPassword",
        })
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property("message", "Falsches Passwort");
          done();
        });
    });

    it("should reject the login if the e-mail does not exist", (done) => {
      request(app)
        .post("/auth/signin")
        .send({
          email: "nonExistent@example.com",
          password: "Password123!",
        })
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property(
            "message",
            "Es ist kein User mit dieser E-Mail registriert.",
          );
          done();
        });
    });
  });
});
