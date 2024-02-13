import { expect } from "chai";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { proxy } from "../../utils/proxy.js";
import logger from "../../configs/logger.js";
import sinon from "sinon";

describe("Proxy Middleware Tests", () => {
  let mockAxios;
  let logSpy;

  before(() => {
    mockAxios = new MockAdapter(axios);
    logSpy = sinon.spy(logger, "info");
  });

  after(() => {
    mockAxios.restore();
    logSpy.restore();
  });

  beforeEach(() => {
    logSpy.resetHistory();
  });

  it("should successfully forward a request and return the response", async () => {
    mockAxios
      .onGet("http://example.com/test")
      .reply(200, { message: "Erfolgreiche Antwort" });

    const req = {
      method: "GET",
      url: "/test",
      headers: {},
      body: null,
      query: {},
    };

    const res = {
      data: null,
      statusCode: 0,
      json(body) {
        this.data = body;
        return this;
      },
      status(code) {
        this.statusCode = code;
        return this;
      },
    };

    // Mock next function
    const next = sinon.spy();

    await proxy("http://example.com")(req, res, next);

    expect(res.data).to.deep.equal({ message: "Erfolgreiche Antwort" });
    expect(res.statusCode).to.equal(200);
    expect(logSpy.calledWith("Proxying request to: http://example.com/test")).to
      .be.true;
    expect(next.notCalled).to.be.true;
  });

  it("should return an error if the axios request fails", async () => {
    mockAxios
      .onGet("http://example.com/test-fail")
      .reply(500, { message: "Server Error" });

    const req = {
      method: "GET",
      url: "/test-fail",
      headers: {},
      body: null,
      query: {},
    };

    const res = {
      data: null,
      statusCode: 0,
      json(body) {
        this.data = body;
        return this;
      },
      status(code) {
        this.statusCode = code;
        return this;
      },
    };

    const next = sinon.spy();

    await proxy("http://example.com")(req, res, next);

    expect(next.called).to.be.true;
    expect(next.firstCall.args[0]).to.be.an.instanceof(Error);
    expect(next.firstCall.args[0].statusCode).to.equal(500);
  });

  it("should return a 500 server error if a network error occurs", async () => {
    mockAxios.onGet("http://example.com/test-network-error").networkError();

    const req = {
      method: "GET",
      url: "/test-network-error",
      headers: {},
      body: null,
      query: {},
    };

    const res = {
      data: null,
      statusCode: 0,
      json(body) {
        this.data = body;
        return this;
      },
      status(code) {
        this.statusCode = code;
        return this;
      },
    };

    const next = sinon.spy();

    await proxy("http://example.com")(req, res, next);

    expect(next.called).to.be.true;
    expect(next.firstCall.args[0]).to.be.an.instanceof(Error);
    expect(next.firstCall.args[0].statusCode).to.equal(500);
  });

  it("should return a 504 Gateway Timeout if the axios request times out", async () => {
    mockAxios.onGet("http://example.com/test-timeout").timeout();

    const req = {
      method: "GET",
      url: "/test-timeout",
      headers: {},
      body: null,
      query: {},
    };

    const res = {
      data: null,
      statusCode: 0,
      json(body) {
        this.data = body;
        return this;
      },
      status(code) {
        this.statusCode = code;
        return this;
      },
    };

    const next = sinon.spy();

    await proxy("http://example.com")(req, res, next);

    expect(next.called).to.be.true;
    expect(next.firstCall.args[0]).to.be.an.instanceof(Error);
    expect(next.firstCall.args[0].statusCode).to.equal(504);
  });

  it("should return 'An error occurred' if the axios request fails without a response message", async () => {
    mockAxios
      .onGet("http://example.com/test-no-error-message")
      .reply(400, { message: "" });

    const req = {
      method: "GET",
      url: "/test-no-error-message",
      headers: {},
      body: null,
      query: {},
    };

    const res = {
      data: null,
      statusCode: 0,
      json(body) {
        this.data = body;
        return this;
      },
      status(code) {
        this.statusCode = code;
        return this;
      },
    };

    const next = sinon.spy();

    await proxy("http://example.com")(req, res, next);

    expect(next.called).to.be.true;
    const errorPassedToNext = next.firstCall.args[0];
    expect(errorPassedToNext).to.be.an.instanceof(Error);
    expect(errorPassedToNext.message).to.equal("An error occurred");
    expect(errorPassedToNext.statusCode).to.equal(400);
  });
});
