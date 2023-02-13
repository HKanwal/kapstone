const validatePhoneNumber = (phoneNumber: string) => {
  console.log(phoneNumber.match("@^\d{10}$"))
  if (phoneNumber.length === 10 && phoneNumber.match("^\d{10}$")) {
    return true;
  } else {
    return false;
  }
};

export default validatePhoneNumber;
