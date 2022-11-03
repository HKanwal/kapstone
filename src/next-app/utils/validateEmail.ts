/**
 * Checks for three conditions:
 * 1. Contains at least one @ sign
 * 2. Greater than 0 characters to the left of the rightmost @ sign
 * 3. At least one period to the right of the rightmost @ sign
 *
 * Source for rules:
 * https://stackoverflow.com/questions/48055431/can-it-cause-harm-to-validate-email-addresses-with-a-regex
 */
const validateEmail = (email: string) => {
  let foundAmpersand = false;
  let hasLocalPart = false;
  let domainHasPeriod = false;

  for (let i = 0; i < email.length; i++) {
    if (email[i] === "@") {
      foundAmpersand = true;
      domainHasPeriod = false;

      if (i > 0) {
        hasLocalPart = true;
      }
    } else if (email[i] === ".") {
      domainHasPeriod = true;
    }
  }

  return foundAmpersand && hasLocalPart && domainHasPeriod;
};

export default validateEmail;
