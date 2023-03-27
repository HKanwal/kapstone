import { createContext, useState } from 'react';
import apiUrl from '../constants/api-url';

export type accountTypes = 'shop_owner' | 'employee' | 'customer';
export type QuoteStatus = 'new_quote' | 'accepted' | 'rejected' | 'in_progress' | 'done' | 'rework';
export type AppointmentStatus =
  | 'completed'
  | 'no show'
  | 'in_progress'
  | 'done'
  | 'rework'
  | 'pending'
  | 'cancelled';

/** Mutations */

type RegistrationBody = {
  email: string;
  phone_number: string;
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
  vehicle?: string;
  appointment_slots: number[];
  service?: number;
  quote?: number;
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

type Shop = {
  id: number;
  name: string;
  shop_email: null | string;
  shop_phone_number: null | string;
};

type BookedAppointmentsResponse = {
  id: number;
  customer: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
  shop: Shop;
  /** Time format: "2023-03-20T14:00:00Z" */
  start_time: string;
  end_time: string;
  status_display: string;
  quote: null | {
    id: number;
    shop: {
      id: number;
      name: string;
      shop_email: null | string;
      shop_phone_number: null | string;
    };
    quote_request: {
      id: number;
      shop: Shop;
      customer: {
        id: number;
        username: string;
        first_name: string;
        last_name: string;
        email: string;
        phone_number: string;
      };
      preferred_date: null | string;
      preferred_time: null | string;
      preferred_phone_number: null | string;
      preferred_email: null | string;
      description: string;
      vehicle: string;
      status: QuoteStatus;
      created_at: string;
    };
    status: QuoteStatus;
    status_display: string;
    /** Eg: "100.05" */
    price: string;
    /** Format: "hh:mm:ss" */
    estimated_time: string;
    /** Format: "YYYY-MM-DD" */
    expiry_date: string;
    /** Eg: "2023-03-15T19:05:27.256825-04:00" */
    created_at: string;
    notes: string;
  };
  service: null | {
    id: number;
    price: string;
    parts: {
      id: number;
      name: string;
      condition: 'new' | 'used';
      type: 'oem' | 'aftermarket';
      price: string;
    }[];
    has_edit_permission: boolean;
    name: string;
    description: null | string;
    active: boolean;
    shop: number;
  };
  status: AppointmentStatus;
  duration: string;
  created_at: string;
  vehicle: string;
}[];

function getBookedAppointments(jwtToken: string) {
  return () => {
    return fetch(`${apiUrl}/shops/appointments/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `JWT ${jwtToken}`,
      },
    }).then((res) => {
      return res.json() as Promise<BookedAppointmentsResponse>;
    });
  };
}

export type Weekday =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

type GetShopHoursResponse = {
  shophours_set: {
    id: number;
    day: Weekday;
    from_time: string;
    to_time: string;
    shop: number;
  }[];
  // other properties or response were ignored
};

function getShopHours(shopId: number) {
  return () => {
    return fetch(`${apiUrl}/shops/shops/${shopId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    }).then((res) => {
      return res.json() as Promise<GetShopHoursResponse>;
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

type ShopDetails = {
  id: number;
  // other properties of response were ignored
};

function getShopDetails(jwtToken: string) {
  return () => {
    return fetch(`${apiUrl}/shops/shops/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `JWT ${jwtToken}`,
      },
    }).then((res) => {
      return res.json() as Promise<ShopDetails>;
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
  getBookedAppointments,
  getShopHours,
  getShopDetails,
};
