describe('work orders for shop owners', () => {
  it('work orders should be visible to shop owners', () => {
    // Login as Shop Owner
    cy.login('sam', 'pass101word');

    // Start from the index page
    cy.visit('/work-orders');

    // Find a button with text "Continue"
    cy.get('span').contains('Work Orders').should('be.visible');
  });
});

describe('work orders for employee', () => {
  it('work orders should be visible to employees', () => {
    // Login as Employee
    cy.login('ethan', 'pass101word');

    // Navigate to work orders page
    cy.visit('/work-orders');

    // Find text with "Work Orders"
    cy.get('span').contains('Work Orders').should('be.visible');
  });
});

describe('work orders for customer', () => {
  it('work orders should not be visible to customers', () => {
    // Login as Customer
    cy.login('chris', 'pass101word');

    // Navigate to work orders page -> 404 page should be displayed
    cy.request({ url: '/work-orders', failOnStatusCode: false }).its('status').should('equal', 404);
    cy.visit('/work-orders', { failOnStatusCode: false });
  });
});

export {}; // Needed to fix linting errors
