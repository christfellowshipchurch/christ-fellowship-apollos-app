import * as Yup from 'yup';
import PhoneNumber from 'awesome-phonenumber';

export const parseUsername = async (username) => {
  // remove all non-integer characters
  const digits = username.replace(/[^0-9]/gi, '');
  const phoneNumber = new PhoneNumber(`+1${digits}`);

  return {
    // Yup for email validation
    email: await Yup.string()
      .email()
      .isValid(username),
    // AwesomePhoneNumber validation
    phoneNumber: phoneNumber.isValid(),
  };
};
