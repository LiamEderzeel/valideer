import "reflect-metadata";
import { describe, expect, it } from "vitest";
import {
  IsDateString,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { ClassType } from "class-transformer-validator";
import { validate, validateAndParse } from "../src/index";
import { Type } from "class-transformer";

class TestValidationNestedClass {
  @IsString()
  test?: string;
}

class TestValidationClass {
  @IsString()
  test?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => TestValidationNestedClass)
  nested?: TestValidationNestedClass[];
}

describe("Validate", () => {
  it("It should validate dto object and succeed", async () => {
    const validationObject: TestValidationClass = { test: "test" };

    const classType: ClassType<TestValidationClass> = TestValidationClass;

    const result = await validate(classType, validationObject);

    expect(result).toEqual({ test: "test" });
  });

  it("It should validate dto with nested validation object and succeed", async () => {
    const o: TestValidationClass = { test: "test", nested: [{ test: "test" }] };

    const classType: ClassType<TestValidationClass> = TestValidationClass;

    const result = await validate(classType, o);

    expect(result).toEqual({ test: "test", nested: [{ test: "test" }] });
  });

  it("It should validate dto object and fail", async () => {
    const validationObject = { test: 1 };

    const classType: ClassType<TestValidationClass> = TestValidationClass;

    try {
      await validate(classType, validationObject);
    } catch (err) {
      expect(err).toEqual([
        {
          children: [],
          constraints: {
            isString: "test must be a string",
          },
          property: "test",
          value: 1,
        },
      ]);
    }
  });

  it("It should validate dto with nested validation object and fail", async () => {
    const validationObject = { test: "test", nested: [{ test: 1 }] };

    const classType: ClassType<TestValidationClass> = TestValidationClass;

    try {
      await validate(classType, validationObject);
    } catch (err) {
      expect(err).toEqual([
        {
          children: [
            {
              children: [
                {
                  children: [],
                  constraints: {
                    isString: "test must be a string",
                  },
                  property: "test",
                  value: 1,
                },
              ],
              property: "0",
              value: { test: 1 },
            },
          ],
          property: "nested",
          value: [
            {
              test: 1,
            },
          ],
        },
      ]);
    }
  });
});

class ValidateObject {
  @IsDateString()
  date?: string;
}

class ParsedObject {
  date: Date;

  constructor(validateObject: ValidateObject) {
    if (validateObject.date == null) throw new Error();
    this.date = new Date(validateObject.date);
  }
}

describe("Validate and parse", () => {
  it("It should validate and parse dto object and succeed", async () => {
    const date = new Date();
    const dateString = date.toISOString();
    const validationObject: ValidateObject = { date: dateString };

    const classType: ClassType<ValidateObject> = ValidateObject;
    const parseFunction = (validationObject: ValidateObject): ParsedObject => {
      return new ParsedObject(validationObject);
    };

    const result = await validateAndParse(
      classType,
      validationObject,
      parseFunction,
    );

    expect(result).toEqual({ date });
  });
});
