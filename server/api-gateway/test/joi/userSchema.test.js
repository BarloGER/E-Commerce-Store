import { expect } from "chai";
import { userSchema } from "../../joi/userSchema.js";

describe("User schema validation tests", () => {
  it("should successfully perform the validation for a valid user object", () => {
    const result = userSchema.validate({
      username: "TestUser123",
      email: "testuser@example.com",
      password: "ValidPassword1!",
      first_name: "Max",
      last_name: "Mustermann",
    });

    expect(result.error).to.be.undefined;
  });

  it("should return an error if the user name is too short", () => {
    const result = userSchema.validate({
      username: "Tu",
      email: "testuser@example.com",
      password: "ValidPassword1!",
      first_name: "Max",
      last_name: "Mustermann",
    });

    expect(result.error).to.not.be.undefined;
    expect(result.error.details[0].message).to.equal(
      "Der Benutzername muss mindestens 3 Zeichen lang sein.",
    );
  });

  it("should return an error if the user name is not alphanumeric", () => {
    const result = userSchema.validate({
      username: "Invalid User!",
      email: "validuser@example.com",
      password: "ValidPassword1!",
      first_name: "Max",
      last_name: "Mustermann",
    });
    expect(result.error).to.not.be.undefined;
    expect(result.error.details[0].message).to.equal(
      "Der Benutzername sollte aus alphanumerischen Zeichen bestehen.",
    );
  });

  it("should return an error if the e-mail is invalid (@)", () => {
    const result = userSchema.validate({
      username: "ValidUser",
      email: "invalid-email",
      password: "ValidPassword1!",
      first_name: "Max",
      last_name: "Mustermann",
    });
    expect(result.error).to.not.be.undefined;
    expect(result.error.details[0].message).to.equal(
      "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    );
  });

  it("should return an error if the e-mail domain does not exist", () => {
    const result = userSchema.validate({
      username: "ValidUser",
      email: "invalid-email@address",
      password: "ValidPassword1!",
      first_name: "Max",
      last_name: "Mustermann",
    });
    expect(result.error).to.not.be.undefined;
    expect(result.error.details[0].message).to.equal(
      "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    );
  });

  it("should return an error if the e-mail domain is not allowed", () => {
    const result = userSchema.validate({
      username: "ValidUser",
      email: "user@invalid.org",
      password: "ValidPassword1!",
      first_name: "Max",
      last_name: "Mustermann",
    });
    expect(result.error).to.not.be.undefined;
    expect(result.error.details[0].message).to.equal(
      "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    );
  });

  it("should return an error if the password is too short", () => {
    const result = userSchema.validate({
      username: "ValidUser",
      email: "validuser@example.com",
      password: "short",
      first_name: "Max",
      last_name: "Mustermann",
    });
    expect(result.error).to.not.be.undefined;
    expect(result.error.details[0].message).to.equal(
      "Das Passwort muss mindestens 8 Zeichen lang sein.",
    );
  });

  it("should return an error if the password is too long", () => {
    const result = userSchema.validate({
      username: "ValidUser",
      email: "validuser@example.com",
      password: "P" + "a".repeat(31) + "1!",
      first_name: "Max",
      last_name: "Mustermann",
    });
    expect(result.error).to.not.be.undefined;
    expect(result.error.details[0].message).to.equal(
      "Das Passwort darf höchstens 30 Zeichen lang sein.",
    );
  });

  it("should return an error if the password does not contain special characters", () => {
    const result = userSchema.validate({
      username: "ValidUser",
      email: "validuser@example.com",
      password: "Password1",
      first_name: "Max",
      last_name: "Mustermann",
    });
    expect(result.error).to.not.be.undefined;
    expect(result.error.details[0].message).to.equal(
      "Das Passwort muss mindestens einen Kleinbuchstaben, einen Großbuchstaben, eine Zahl und ein Sonderzeichen enthalten.",
    );
  });

  it("should return an error if the password does not contain lowercase letters", () => {
    const result = userSchema.validate({
      username: "ValidUser",
      email: "validuser@example.com",
      password: "PASSWORD1!",
      first_name: "Max",
      last_name: "Mustermann",
    });
    expect(result.error).to.not.be.undefined;
    expect(result.error.details[0].message).to.equal(
      "Das Passwort muss mindestens einen Kleinbuchstaben, einen Großbuchstaben, eine Zahl und ein Sonderzeichen enthalten.",
    );
  });

  it("should return an error if the password does not contain an uppercase letter", () => {
    const result = userSchema.validate({
      username: "ValidUser",
      email: "validuser@example.com",
      password: "validpassword1!",
      first_name: "Max",
      last_name: "Mustermann",
    });
    expect(result.error).to.not.be.undefined;
    expect(result.error.details[0].message).to.equal(
      "Das Passwort muss mindestens einen Kleinbuchstaben, einen Großbuchstaben, eine Zahl und ein Sonderzeichen enthalten.",
    );
  });

  it("should return an error if the password does not contain a number", () => {
    const result = userSchema.validate({
      username: "ValidUser",
      email: "validuser@example.com",
      password: "Validpassword!",
      first_name: "Max",
      last_name: "Mustermann",
    });
    expect(result.error).to.not.be.undefined;
    expect(result.error.details[0].message).to.equal(
      "Das Passwort muss mindestens einen Kleinbuchstaben, einen Großbuchstaben, eine Zahl und ein Sonderzeichen enthalten.",
    );
  });

  it("should successfully perform validation for valid first names", () => {
    const result = userSchema.validate({
      username: "ValidUser",
      email: "validuser@example.com",
      password: "ValidPassword1!",
      first_name: "Max",
      last_name: "Müller",
    });
    expect(result.error).to.be.undefined;
  });

  it("should return an error if the first name is too long", () => {
    const result = userSchema.validate({
      username: "ValidUser",
      email: "validuser@example.com",
      password: "ValidPassword1!",
      first_name: "M".repeat(101),
      last_name: "Mustermann",
    });
    expect(result.error).to.not.be.undefined;
    expect(result.error.details[0].message).to.equal(
      "Der Vorname darf höchstens 100 Zeichen lang sein.",
    );
  });

  it("should return an error if the first name contains invalid characters", () => {
    const result = userSchema.validate({
      username: "ValidUser",
      email: "validuser@example.com",
      password: "ValidPassword1!",
      first_name: "Max!",
      last_name: "Müller",
    });
    expect(result.error).to.not.be.undefined;
    expect(result.error.details[0].message).to.equal(
      "Der Vorname enthält unzulässige Zeichen.",
    );
  });

  it("should successfully perform validation for valid surnames", () => {
    const result = userSchema.validate({
      username: "ValidUser",
      email: "validuser@example.com",
      password: "ValidPassword1!",
      first_name: "Max",
      last_name: "O'Harra",
    });
    expect(result.error).to.be.undefined;
  });

  it("should return an error if the last name is too long", () => {
    const result = userSchema.validate({
      username: "ValidUser",
      email: "validuser@example.com",
      password: "ValidPassword1!",
      first_name: "Max",
      last_name: "M".repeat(101),
    });
    expect(result.error).to.not.be.undefined;
    expect(result.error.details[0].message).to.equal(
      "Der Nachname darf höchstens 100 Zeichen lang sein.",
    );
  });

  it("should return an error if the last name contains invalid characters", () => {
    const result = userSchema.validate({
      username: "ValidUser",
      email: "validuser@example.com",
      password: "ValidPassword1!",
      first_name: "Max",
      last_name: "O'Harra%",
    });
    expect(result.error).to.not.be.undefined;
    expect(result.error.details[0].message).to.equal(
      "Der Nachname enthält unzulässige Zeichen.",
    );
  });
});
