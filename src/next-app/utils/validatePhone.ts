const validatePhoneNumber = (phoneNumber: string) => {
  if (phoneNumber.length === 12 && phoneNumber.match(/^\+\d{11}$/)) {
    return true;
  } else {
    return false;
  }
};

export default validatePhoneNumber;
