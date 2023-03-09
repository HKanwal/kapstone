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

export {};
declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>;
      register(
        username: string,
        password: string,
        first_name: string,
        last_name: string,
        phone_number: string,
        email: string,
        type?: 'Shop Owner' | 'Customer'
      ): Chainable<void>;
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

Cypress.Commands.add(
  'register',
  (username, password, first_name, last_name, phone_number, email, type) => {
    cy.get('input[id="First Name"]').type(first_name);
    cy.get('input[id="Last Name"]').type(last_name);
    cy.get('input[id="Phone Number"]').type(phone_number);
    cy.get('input[id="Email"]').type(email);
    cy.get('input[id="Username"]').type(username);
    cy.get('input[id="Password"]').type(password);
    if (type != undefined) {
      cy.get('input[id="Type"]').click(); // open the dropdown menu
      cy.get(`button[id="${type}"]`).then(($button) => {
        const button = $button[0]; // get the DOM node
        button.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
      });
    }

    cy.get('button').contains('Create').click();
  }
);
