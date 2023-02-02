import { createContext, useState } from 'react';
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

type RegistrationErrResponse = {
  type: string;
  errors: {
    code: string;
    detail: string;
    attr: string;
  }[];
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

type LoginBody = {
  username: string;
  password: string;
};

type Jwt = {
  refresh: string;
  access: string;
  user_type: 'shop_owner' | 'employee' | 'customer';
};

const AuthContext = createContext<Jwt>({ refresh: '', access: '', user_type: 'customer'});

function loginFn(loginBody: LoginBody) {
  return fetch(`${apiUrl}/auth/jwt/create/`, {
    method: 'POST',
    body: JSON.stringify(loginBody),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  });
}

export type { RegistrationBody, RegistrationErrResponse, LoginBody, Jwt };
export { registrationFn, loginFn, AuthContext };
