import apiUrl from '../constants/api-url';

/** Mutations */

type RegistrationBody = {
  email: string;
  username: string;
  password: string;
  re_password: string;
  first_name?: string;
  last_name?: string;
  type: 'shop_owner' | 'employee' | 'customer';
};

function registrationFn(registrationBody: RegistrationBody) {
  return fetch(`${apiUrl}/auth/users/`, {
    method: 'POST',
    body: JSON.stringify(registrationBody),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  });
}

export type { RegistrationBody };
export { registrationFn };
