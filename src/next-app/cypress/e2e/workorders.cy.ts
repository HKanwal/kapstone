describe('work orders for shop owners', () => {
  beforeEach(() => {
    // Login as Shop Owner
    cy.login(Cypress.env('TEST_SHOP_OWNER_USERNAME'), Cypress.env('TEST_SHOP_OWNER_PASSWORD'));
  });
  it('work orders should be visible to shop owners', () => {
    // Start from the work orders page
    cy.visit('/work-orders');

    // Find a button with text "Continue"
    cy.get('span').contains('Work Orders').should('be.visible');
  });

  it('work orders should be editable by the shop owner', () => {
    // Start from the work orders page
    cy.visit('/work-orders');

    cy.get('#work-orders-list').children().first().click();

    // Find edit button
    cy.get('div[class="Header_right-btn-container__rhE22"]').should('be.visible').click();
    cy.get('.textarea').click();
    cy.get('.textarea').type(`test-${Math.round(Math.random() * 1000000)}`);
    cy.get('form').submit();

    cy.get('button').contains('Save').should('not.exist');
  });

  // FT-RT-14
  it('should allow shop owners to send customers work orders', () => {
    const workOrderId = Cypress.env('TEST_WORK_ORDER_ID');

    // Navigate to work order page
    cy.visit(`/work-orders/${workOrderId}`);

    // Find a button with text "Continue"
    cy.get('button').contains('Send to Customer').should('be.visible').click();
  });
});

describe('work orders for employee', () => {
  beforeEach(() => {
    // Login as Employee
    cy.login(Cypress.env('TEST_EMPLOYEE_USERNAME'), Cypress.env('TEST_EMPLOYEE_PASSWORD'));
  });

  it('work orders should be visible to employees', () => {
    // Navigate to work orders page
    cy.visit('/work-orders');

    // Find text with "Work Orders"
    cy.get('span').contains('Work Orders').should('be.visible');
  });

  it('work orders should be editable by the shop owner', () => {
    // Start from the index page
    cy.visit('/work-orders');

    cy.get('#work-orders-list').children().first().click();

    // Find edit button
    cy.get('div[class="Header_right-btn-container__rhE22"]').should('be.visible').click();
    cy.get('.textarea').click();
    cy.get('.textarea').type(`test-${Math.round(Math.random() * 1000000)}`);
    cy.get('form').submit();

    cy.get('button').contains('Save').should('not.exist');
  });
});

describe('work orders for customer', () => {
  beforeEach(() => {
    // Login as Customer
    cy.login(Cypress.env('TEST_CUSTOMER_USERNAME'), Cypress.env('TEST_CUSTOMER_PASSWORD'));
  });

  it('work orders should not be visible to customers', () => {
    // Navigate to work orders page -> 404 page should be displayed
    cy.request({ url: '/work-orders', failOnStatusCode: false }).its('status').should('equal', 404);
    cy.visit('/work-orders', { failOnStatusCode: false });
  });

  // FT-RT-14
  it('should allow customers to view work orders sent to them', () => {
    const workOrderId = Cypress.env('TEST_WORK_ORDER_ID');

    // Navigate to work order page
    cy.visit(`/work-orders/${workOrderId}`);

    // Find work order text
    cy.get('span').contains(`Work Order: #${workOrderId}`).should('be.visible');
  });
});

export {}; // Needed to fix linting errors
