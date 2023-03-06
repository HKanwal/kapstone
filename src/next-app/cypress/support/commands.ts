/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>;
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>;
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>;
//       visit(
//         originalFn: CommandOriginalFn,
//         url: string,
//         options: Partial<VisitOptions>
//       ): Chainable<Element>;
//     }
//   }
// }

import apiUrl from "../../constants/api-url";
import Cookies from "js-cookie";

export {};
declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>;
      deleteShop(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (username, password) => {
  cy.session([username, password], () => {
    cy.visit('/login');
    cy.get('input[type=text]').type(username);
    cy.get('input[type=password]').type(password);
    cy.get('button[type=submit]').click();
    cy.url().should('contain', '/dashboard');
  });
});

Cypress.Commands.add('deleteShop', () => {
  cy.session([], () => {
    const access_token = Cookies.get('access');
    fetch(`${apiUrl}/shops/shops/me/`, {
    method: 'GET',
    headers: {
      Authorization: `JWT ${access_token}`,
      'Content-Type': 'application/json; charset=UTF-8',
    }
    }).then((response) => {
      response.json().then((data) => {
        console.log(data);
        fetch(`${apiUrl}/shops/shops/${data.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `JWT ${access_token}`,
            'Content-Type': 'application/json; charset=UTF-8',
          }
        })
      })
    });
  });
});
