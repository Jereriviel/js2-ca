import { expect, describe, it } from "vitest";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateForm,
} from "../../src/js/utils/validation";

describe("validateEmail", () => {
  it("returns true for valid student Noroff email", () => {
    const email = "student@stud.noroff.no";
    const result = validateEmail(email);
    expect(result).toBe(true);
  });

  it("returns false for non-Noroff email", () => {
    const email = "student@gmail.com";
    const result = validateEmail(email);
    expect(result).toBe(false);
  });

  it("returns false for invalid email format", () => {
    const email = "not-an-email";
    const result = validateEmail(email);
    expect(result).toBe(false);
  });
});

describe("validatePassword", () => {
  const testCases = [
    { password: "short", expected: false },
    { password: "exactly8", expected: true },
    { password: "longerpassword", expected: true },
  ];

  testCases.forEach(({ password, expected }) => {
    it(`returns ${expected} for password "${password}"`, () => {
      const result = validatePassword(password);
      expect(result).toBe(expected);
    });
  });
});

describe("validateConfirmPassword", () => {
  it("returns true when passwords match", () => {
    const result = validateConfirmPassword("Password123", "Password123");
    expect(result).toBe(true);
  });

  it("returns false when passwords do not match", () => {
    const result = validateConfirmPassword("PasswordWrong", "Password123");
    expect(result).toBe(false);
  });
});

describe("validateForm", () => {
  const baseCases = [
    {
      name: "valid login (no confirmPassword)",
      email: "valid@stud.noroff.no",
      password: "validpass",
      expected: { isValid: true, errors: {} },
    },
    {
      name: "invalid email and short password",
      email: "invalid@gmail.com",
      password: "short",
      expected: {
        isValid: false,
        errors: {
          email: "Please enter a valid Noroff email address",
          password: "Password must be at least 8 characters",
        },
      },
    },
    {
      name: "valid email domain but short password",
      email: "valid@noroff.no",
      password: "short",
      expected: {
        isValid: false,
        errors: {
          password: "Password must be at least 8 characters",
        },
      },
    },
  ];

  baseCases.forEach(({ name, email, password, expected }) => {
    it(`validates correctly for ${name}`, () => {
      const result = validateForm(email, password);
      expect(result).toEqual(expected);
    });
  });

  it("returns error when confirmPassword does not match", () => {
    const result = validateForm(
      "valid@stud.noroff.no",
      "validpass",
      "differentpass",
    );
    expect(result).toEqual({
      isValid: false,
      errors: { confirmPassword: "Passwords do not match" },
    });
  });

  it("returns valid when confirmPassword matches", () => {
    const result = validateForm(
      "valid@stud.noroff.no",
      "validpass",
      "validpass",
    );
    expect(result).toEqual({
      isValid: true,
      errors: {},
    });
  });
});
