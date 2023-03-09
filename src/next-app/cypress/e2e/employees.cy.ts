const axios = require('axios').default;
const ENDPOINT = `https://api.testmail.app/api/json?apikey=${Cypress.env(
  'TESTMAIL_APIKEY'
)}&namespace=${Cypress.env('TESTMAIL_NAMESPACE')}`;

const TAG = `${Math.round(Math.random() * 1000000)}`;
const EMPLOYEE_EMAIL = `${Cypress.env('TESTMAIL_NAMESPACE')}.${TAG}@inbox.testmail.app`;
const startTimestamp = Date.now();

// FT-RT-7
describe('shop owners accessing employee pages', () => {
  beforeEach(() => {
    // Login as Shop Owner
    cy.login(Cypress.env('TEST_SHOP_OWNER_USERNAME'), Cypress.env('TEST_SHOP_OWNER_PASSWORD'));
  });
  it('should be able to access employee list pages', () => {
    // Visit employees list page
    cy.visit('/employees');

    // Find heading with "Employees"
    cy.get('span').contains('Employees').should('be.visible');
  });

  it('should be able to access employee detail page', () => {
    // Visit employees list page
    cy.visit('/employees');

    // Find first with Employee and visit their page
    cy.get('div[class="EmployeeCard_card__XqJ6Q"]').first().click();

    // Find heading with "Employee"
    cy.get('span').contains('Employee').should('be.visible');
  });

  it('should be able to edit employee', () => {
    // Visit employees list page
    cy.visit('/employees');

    // Find first with Employee and visit their page
    cy.get('div[class="EmployeeCard_card__XqJ6Q"]').first().click();

    // Check if edit button is visible
    cy.get('div[class="Header_right-btn-container__rhE22"]').should('be.visible').click();

    // TODO: Add testing to edit functionality
  });

  it('menu should show employees option', () => {
    // Navigate to dashboard page
    cy.visit('/dashboard');

    // Open the sidebar menu
    cy.get('div[class="Navbar_menu-bars__rIGtB"]').click();

    // Employees option should not exists
    cy.get('span[class="Navbar_nav-text-item__lmACJ"]').contains('Employees').should('be.visible');
  });
});

describe('employees accessing employee pages', () => {
  beforeEach(() => {
    // Login as Employee
    cy.login(Cypress.env('TEST_EMPLOYEE_USERNAME'), Cypress.env('TEST_EMPLOYEE_PASSWORD'));
  });

  it('should not be able to access employee list page', () => {
    // Navigate to employee list page -> 404 page should be displayed
    cy.request({ url: '/employees', failOnStatusCode: false }).its('status').should('equal', 404);
    cy.visit('/employees', { failOnStatusCode: false });
  });

  it('menu should not show employees option', () => {
    // Navigate to dashboard page
    cy.visit('/dashboard');

    // Open the sidebar menu
    cy.get('div[class="Navbar_menu-bars__rIGtB"]').click();

    // Employees option should not exists
    cy.get('span[class="Navbar_nav-text-item__lmACJ"]').contains('Employees').should('not.exist');
  });
});

describe('customers accessing employee pages', () => {
  beforeEach(() => {
    // Login as Customer
    cy.login(Cypress.env('TEST_CUSTOMER_USERNAME'), Cypress.env('TEST_CUSTOMER_PASSWORD'));
  });

  it('should not be able to access employee list page', () => {
    // Navigate to employee list page -> 404 page should be displayed
    cy.request({ url: '/employees', failOnStatusCode: false }).its('status').should('equal', 404);
    cy.visit('/employees', { failOnStatusCode: false });
  });

  it('menu should not show employees option', () => {
    // Navigate to dashboard page
    cy.visit('/dashboard');

    // Open the sidebar menu
    cy.get('div[class="Navbar_menu-bars__rIGtB"]').click();

    // Employees option should not exists
    cy.get('span[class="Navbar_nav-text-item__lmACJ"]').contains('Employees').should('not.exist');
  });
});

// FT-RT-3 and FT-RT-4
describe('shop owners inviting employees', () => {
  describe('signup', () => {
    before(() => {
      // Login as Shop Owner
      cy.login(Cypress.env('TEST_SHOP_OWNER_USERNAME'), Cypress.env('TEST_SHOP_OWNER_PASSWORD'));
      // Go to invite page
      cy.visit('/invite');
    });

    it('enter email', () => {
      cy.get('input').type(EMPLOYEE_EMAIL);
      cy.get('input').type(' ');
      cy.get('button').contains('Invite').click();
      cy.url().should('include', '/invitations');
    });
  });

  describe('verify email', () => {
    describe('employees should receive invitation email', () => {
      let inbox: any;
      before((done) => {
        cy.request(`${ENDPOINT}&tag=${TAG}&timestamp_from=${startTimestamp}&livequery=true`).then(
          (response: any) => {
            inbox = response.body;
            done();
          }
        );
      });
      it('email should be present in inbox', () => {
        expect(inbox.result).to.equal('success');
      });
      it('there should only be one email in the inbox', () => {
        expect(inbox.count).to.equal(1);
      });
      it('get the email verification link', () => {
        const registeration_link = inbox.emails[0].text.match(/\bhttps?:\/\/\S+/gi);
        expect(registeration_link.length).to.equal(1);
      });
      it('be able to register using the verification link', () => {
        const registeration_link = inbox.emails[0].text.match(/\bhttps?:\/\/\S+/gi);
        expect(registeration_link.length).to.equal(1);
        cy.visit(registeration_link[0].replace('&amp;', '&'));
        cy.register(
          `elliot-${TAG}`,
          'pass101word',
          'Elliot',
          'Smith',
          '+16478889404',
          EMPLOYEE_EMAIL
        );
        cy.url().should('include', '/dashboard');
      });
    });
  });
});

export {}; // Needed to fix linting errors
describe('employee information can be edited', () => {
  const newSalary = String(Math.floor(Math.random() * 90 + 10)) + '.00';
  it('shop owner can edit employee information', () => {
    //Login as shop owner
    cy.login('sam', 'pass101word');

    // Go to employees page
    cy.visit('/employees');

    cy.get('div').contains('Employees').should('be.visible');
    cy.get('div').contains('Name').click();
    cy.get('h2').contains('Employee Details').should('be.visible');
    cy.get('button[id="icon-button"]').eq(1).click();
    cy.get('input[id="salary"]').should('be.enabled');

    //Clear salary value and enter new value
    cy.get('input[id="salary"]').clear();
    cy.get('input[id="salary"]').type(newSalary);

    cy.get('button').contains('Save').click();

    cy.get('input[id="salary"]').should('be.disabled');
    cy.get('input[id="salary"]').should('have.value', newSalary);
  });
});

export {}; // Needed to fix linting errors
