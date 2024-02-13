import { expect } from "chai";
import sinon from "sinon";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { signIn, signUp } from "../../controllers/userController.js";
import { userDBPool } from "../../db/index.js";
import { ErrorResponse } from "../../utils/ErrorResponse.js";

describe("userController - signIn", function () {
  let res;
  let userDBPoolStub;
  let bcryptCompareStub;
  let jwtSignStub;

  beforeEach(function () {
    // Mock the Response object
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Stub for the database query
    userDBPoolStub = sinon.stub(userDBPool, "query");

    // Stub for bcrypt.compare
    bcryptCompareStub = sinon.stub(bcrypt, "compare");

    // Stub for jwt.sign
    jwtSignStub = sinon.stub(jwt, "sign");
  });

  afterEach(function () {
    sinon.restore();
  });

  it("should throw an error if no user is found", async function () {
    userDBPoolStub.resolves({ rows: [] }); // No user found

    try {
      await signIn(
        { body: { email: "test@test.com", password: "123456" } },
        res,
      );
    } catch (error) {
      expect(error).to.be.instanceOf(ErrorResponse);
      expect(error.statusCode).to.equal(404);
    }
  });

  it("should throw an error if the password is incorrect", async function () {
    userDBPoolStub.resolves({
      rows: [
        { user_id: 1, email: "test@test.com", password: "hashedPassword" },
      ],
    });
    bcryptCompareStub.resolves(false); // Incorrect password

    try {
      await signIn(
        { body: { email: "test@test.com", password: "wrongPassword" } },
        res,
      );
    } catch (error) {
      expect(error).to.be.instanceOf(ErrorResponse);
      expect(error.statusCode).to.equal(401);
    }
  });

  it("should return a JWT if the email and password are correct", async function () {
    userDBPoolStub.resolves({
      rows: [
        { user_id: 1, email: "test@test.com", password: "hashedPassword" },
      ],
    });
    bcryptCompareStub.resolves(true); // Correct password
    jwtSignStub.returns("fakeToken");

    await signIn(
      { body: { email: "test@test.com", password: "correctPassword" } },
      res,
    );

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(sinon.match.has("token"))).to.be.true;
  });
});

describe("userController - signUp", function () {
  let res;
  let userDBPoolStub;
  let bcryptHashStub;
  let jwtSignStub;

  beforeEach(function () {
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    userDBPoolStub = sinon.stub(userDBPool, "query");
    bcryptHashStub = sinon.stub(bcrypt, "hash");
    jwtSignStub = sinon.stub(jwt, "sign");
  });

  afterEach(function () {
    sinon.restore();
  });

  it("should throw an error if the email already exists", async function () {
    userDBPoolStub
      .withArgs(sinon.match.any, [sinon.match.string])
      .resolves({ rows: [{ user_id: 1 }] }); // Email exists

    try {
      await signUp(
        {
          body: {
            email: "existing@test.com",
            password: "123456",
            username: "newUser",
            first_name: "Test",
            last_name: "User",
          },
        },
        res,
      );
    } catch (error) {
      expect(error).to.be.instanceOf(ErrorResponse);
      expect(error.statusCode).to.equal(409);
    }
  });

  it("should throw an error if the username already exists", async function () {
    // First query for email check resolves with no rows (email doesn't exist)
    // Second query for username check resolves with rows (username exists)
    userDBPoolStub.onFirstCall().resolves({ rows: [] });
    userDBPoolStub.onSecondCall().resolves({ rows: [{ user_id: 1 }] });

    try {
      await signUp(
        {
          body: {
            email: "new@test.com",
            password: "123456",
            username: "existingUser",
            first_name: "Test",
            last_name: "User",
          },
        },
        res,
      );
    } catch (error) {
      expect(error).to.be.instanceOf(ErrorResponse);
      expect(error.statusCode).to.equal(409);
    }
  });

  it("should return a JWT if the registration is successful", async function () {
    userDBPoolStub.onFirstCall().resolves({ rows: [] }); // Email doesn't exist
    userDBPoolStub.onSecondCall().resolves({ rows: [] }); // Username doesn't exist
    userDBPoolStub.onThirdCall().resolves({ rows: [{ user_id: 1 }] }); // Simulate successful user insertion
    bcryptHashStub.resolves("hashedPassword");
    jwtSignStub.returns("fakeToken");

    await signUp(
      {
        body: {
          email: "new@test.com",
          password: "123456",
          username: "newUser",
          first_name: "Test",
          last_name: "User",
        },
      },
      res,
    );

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(sinon.match.has("token"))).to.be.true;
  });
});
