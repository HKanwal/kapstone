import { createContext, useState } from 'react';
import apiUrl from '../constants/api-url';

export type accountTypes = 'shop_owner' | 'employee' | 'customer';

/** Mutations */

type RegistrationBody = {
  email: string;
  phoneNumber: string;
  username: string;
  password: string;
  re_password: string;
  first_name?: string;
  last_name?: string;
  type: accountTypes;
  invite_key?: any;
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
  user_type: accountTypes;
};

const AuthContext = createContext<Jwt>({ refresh: '', access: '', user_type: 'customer' });

function loginFn(loginBody: LoginBody) {
  return fetch(`${apiUrl}/auth/jwt/create/`, {
    method: 'POST',
    body: JSON.stringify(loginBody),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  });
}

type refreshTokenProps = {
  authData: Jwt;
  setAuthData: (jwt: Jwt) => void;
  onLogin: (jwt: Jwt) => void;
};

const refreshToken = (props: refreshTokenProps) => {
  fetch(`${apiUrl}/auth/jwt/refresh`, {
    method: 'POST',
    body: JSON.stringify({ refresh: props.authData.refresh }),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  }).then((response) =>
    response.json().then((response) => {
      props.setAuthData({
        access: response.access,
        refresh: props.authData.refresh,
        user_type: props.authData.user_type,
      });
      props.onLogin({
        access: response.access,
        refresh: props.authData.refresh,
        user_type: props.authData.user_type,
      });
    })
  );
};

export type { RegistrationBody, RegistrationErrResponse, LoginBody, Jwt };
export { registrationFn, loginFn, AuthContext, refreshToken };
