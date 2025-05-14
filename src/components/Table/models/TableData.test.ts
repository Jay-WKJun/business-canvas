import { describe, it, expect } from "vitest";
import { testRecord, testRecord2 } from "./mock/mockRecords";
import { testSchemas } from "./mock/mockSchemas";
import { TableData } from "./TableData";

const records = [testRecord, testRecord2];

describe("TableData Model", () => {
  const testTableData = {
    schema: testSchemas,
    records,
  };

  it("should create a valid table data", () => {
    const tableData = TableData.parse(testTableData);

    expect(tableData).toEqual(testTableData);
    expect(tableData.schema).toEqual(testSchemas);
    expect(tableData.records).toEqual(records);
  });

  it("should throw an error when a table data is not valid", () => {
    expect(() =>
      TableData.parse({
        schema: testSchemas,
        records: testRecord,
      })
    ).toThrow();

    expect(() =>
      TableData.parse({
        schema: testSchemas[0],
        records,
      })
    ).toThrow();
  });
});
