import { expect } from "chai";
import sinon from "sinon";
import { userDBPool, testDBConnection } from "../../db/index.js";
import { ErrorResponse } from "../../utils/ErrorResponse.js";

describe("Database Connection Test", function () {
  let queryStub;

  before(function () {
    // Stub the `query` method of `userDBPool` to simulate a successful database connection
    queryStub = sinon
      .stub(userDBPool, "query")
      .resolves({ rowCount: 1, rows: [{ 1: 1 }] });
  });

  after(function () {
    // Restore the original function after testing
    queryStub.restore();
  });

  it("should successfully connect to the database", async function () {
    await testDBConnection(); // Dies ruft die Funktion auf und erwartet, dass kein Fehler geworfen wird
    expect(queryStub.calledOnce).to.be.true;
    expect(queryStub.calledWith("SELECT 1")).to.be.true;
  });

  it("should throw an ErrorResponse if the database connection fails", async function () {
    // Ändere das Stub-Verhalten, um einen Fehler zu simulieren
    queryStub.rejects(new Error("Connection failed"));

    try {
      await testDBConnection();
      // Wenn die Funktion keinen Fehler wirft, ist der Test fehlgeschlagen
      throw new Error("Test did not throw an error as expected");
    } catch (error) {
      expect(error).to.be.an.instanceof(ErrorResponse);
      expect(error.statusCode).to.equal(500);
      expect(error.errorType).to.equal("DatabaseError");
      expect(error.errorCode).to.equal("DB_001");
      expect(error.message).to.include(
        "Fehler bei der Verbindung zur Datenbank",
      );
    }
  });

  // Stelle das ursprüngliche Stub-Verhalten wieder her, um weitere Tests nicht zu beeinträchtigen
  afterEach(function () {
    queryStub.resolves({ rowCount: 1, rows: [{ 1: 1 }] });
  });
});
