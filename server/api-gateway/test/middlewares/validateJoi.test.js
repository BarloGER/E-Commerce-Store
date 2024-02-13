import { expect } from "chai";
import sinon from "sinon";
import Joi from "joi";
import { validateJoi } from "../../middlewares/validateJoi.js";
import { ErrorResponse } from "../../utils/ErrorResponse.js";

describe("Validate Joi Middleware Tests", () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {};
    nextFunction = sinon.spy();
  });

  it("should return an error if no data is available for validation", () => {
    validateJoi(schema)(mockRequest, mockResponse, nextFunction);
    expect(nextFunction.calledOnce).to.be.true;
    expect(nextFunction.getCall(0).args[0] instanceof ErrorResponse).to.be.true;
    expect(nextFunction.getCall(0).args[0].message).to.equal(
      "Keine Daten zum Validieren vorhanden.",
    );
    expect(nextFunction.getCall(0).args[0].statusCode).to.equal(400);
  });

  it("should return an error if the validation fails", () => {
    mockRequest.body = { name: 123 }; // Invalid data for the schema
    validateJoi(schema)(mockRequest, mockResponse, nextFunction);
    expect(nextFunction.calledOnce).to.be.true;
    expect(nextFunction.getCall(0).args[0] instanceof ErrorResponse).to.be.true;
    expect(nextFunction.getCall(0).args[0].statusCode).to.equal(400);
    expect(nextFunction.getCall(0).args[0].errorType).to.equal(
      "ValidationError",
    );
  });

  it("sollte `next` ohne Fehler aufrufen, wenn die Validierung erfolgreich ist", () => {
    mockRequest.body = { name: "Valid Name" };
    validateJoi(schema)(mockRequest, mockResponse, nextFunction);
    expect(nextFunction.calledOnce).to.be.true;
    expect(nextFunction.getCall(0).args.length).to.equal(0);
  });
});
