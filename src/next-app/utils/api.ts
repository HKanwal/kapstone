import { createContext, useState } from 'react';
import apiUrl from '../constants/api-url';

export type accountTypes = 'shop_owner' | 'employee' | 'customer';

/** Mutations */

type RegistrationBody = {
  email: string;
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

type AppointmentBody = {
  status: 'completed' | 'no show' | 'in_progress' | 'done' | 'rework' | 'pending';
  /** In the format hh:mm:ss */
  duration: string;
  shop: number;
  customer: number;
  vehicle: number;
  appointment_slots: number[];
  jwtToken: string;
};

function bookAppointment(body: AppointmentBody) {
  return fetch(`${apiUrl}/shops/appointments/`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: `JWT ${body.jwtToken}`,
    },
  });
}

/** Queries */

type AppointmentSlotsParams = {
  shop: number;
  /** In the format of YYYY-MM-DD */
  startDate: string;
  endDate: string;
  availableOnly: boolean;
  /** In increments of 15 */
  minutes: number;
};

type AppointmentSlot = {
  id: number;
  shop: number;
  start_time: string;
  end_time: string;
};

type AppointmentSlotsResponse = {
  slots: AppointmentSlot[][];
};

function getAppointmentSlots({
  shop,
  startDate,
  endDate,
  availableOnly,
  minutes,
}: AppointmentSlotsParams) {
  let url =
    apiUrl +
    '/shops/appointment-slots/?shop=' +
    shop +
    '&start_date=' +
    startDate +
    '&end_date=' +
    endDate +
    '&available_only=' +
    availableOnly +
    '&minutes=' +
    minutes;
  return () => {
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    }).then((res) => {
      return res.json() as Promise<AppointmentSlotsResponse>;
    });
  };
}

type UserDetails = {
  email: string;
  type: accountTypes;
  id: number;
  username: string;
};

function getUserDetails(jwtToken: string) {
  return () => {
    return fetch(`${apiUrl}/auth/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `JWT ${jwtToken}`,
      },
    }).then((res) => {
      return res.json() as Promise<UserDetails>;
    });
  };
}

export type {
  RegistrationBody,
  RegistrationErrResponse,
  LoginBody,
  Jwt,
  AppointmentSlotsParams,
  AppointmentSlotsResponse,
  AppointmentBody,
  AppointmentSlot,
  UserDetails,
};
export {
  registrationFn,
  loginFn,
  AuthContext,
  refreshToken,
  getAppointmentSlots,
  bookAppointment,
  getUserDetails,
};
