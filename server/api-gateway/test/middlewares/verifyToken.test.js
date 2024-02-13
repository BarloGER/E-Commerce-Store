import { expect } from "chai";
import sinon from "sinon";
import jwt from "jsonwebtoken";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { ErrorResponse } from "../../utils/ErrorResponse.js";

describe("Verify Token Middleware Tests", () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;

  // Stubs for jwt and environment variable
  let jwtVerifyStub;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {};
    nextFunction = sinon.spy();

    // Initialize stubs
    jwtVerifyStub = sinon.stub(jwt, "verify");
  });

  afterEach(() => {
    // Reset stubs after each test
    jwtVerifyStub.restore();
  });

  it("should throw an error if no Authorization header is present", async () => {
    await verifyToken(mockRequest, mockResponse, nextFunction);
    expect(nextFunction.calledOnce).to.be.true;
    expect(nextFunction.getCall(0).args[0] instanceof ErrorResponse).to.be.true;
    expect(nextFunction.getCall(0).args[0].message).to.equal(
      "Bitte zuerst einloggen.",
    );
    expect(nextFunction.getCall(0).args[0].statusCode).to.equal(401);
  });

  it("should call `next` if the token is valid", async () => {
    mockRequest.headers.authorization = "validToken";
    const mockUserId = { id: "123" };
    jwtVerifyStub.returns(mockUserId); // Simulate a valid token

    await verifyToken(mockRequest, mockResponse, nextFunction);
    expect(nextFunction.calledOnce).to.be.true;
    expect(mockRequest.userId).to.equal(mockUserId.id);
    expect(nextFunction.getCall(0).args.length).to.equal(0); // No errors, next is called without arguments
  });

  it("should throw an error if the token is invalid", async () => {
    mockRequest.headers.authorization = "invalidToken";
    jwtVerifyStub.throws(new Error("Ungültiger Token")); // Simulate an invalid token

    await verifyToken(mockRequest, mockResponse, nextFunction);
    expect(nextFunction.calledOnce).to.be.true;
    expect(nextFunction.getCall(0).args[0] instanceof ErrorResponse).to.be.true;
    expect(nextFunction.getCall(0).args[0].message).to.equal(
      "Ungültiger Token",
    );
    expect(nextFunction.getCall(0).args[0].statusCode).to.equal(401);
  });
});
