import { expect } from "chai";
import sinon from "sinon";
import { errorHandler } from "../../middlewares/errorHandler.js";

describe("Error Handler Middleware Tests", () => {
  let mockResponse;
  let nextFunction;

  beforeEach(() => {
    mockResponse = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    nextFunction = sinon.stub();
  });

  it("should return a 500 status code and error details if a general error occurs", () => {
    const error = new Error("Ein allgemeiner Fehler ist aufgetreten");
    errorHandler(error, {}, mockResponse, nextFunction);

    expect(mockResponse.status.calledWith(500)).to.be.true;
    expect(
      mockResponse.json.calledWith({
        message: error.message,
        errorType: undefined,
        errorCode: undefined,
        statusCode: undefined,
      }),
    ).to.be.true;
  });

  it("should return a user-defined status code and error details when a specific error occurs", () => {
    const error = {
      message: "Ressource nicht gefunden",
      errorType: "NotFoundError",
      errorCode: "RESOURCE_NOT_FOUND",
      statusCode: 404,
    };
    errorHandler(error, {}, mockResponse, nextFunction);

    expect(mockResponse.status.calledWith(404)).to.be.true;
    expect(
      mockResponse.json.calledWith({
        message: error.message,
        errorType: error.errorType,
        errorCode: error.errorCode,
        statusCode: 404,
      }),
    ).to.be.true;
  });
});
