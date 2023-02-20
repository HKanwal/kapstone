describe('login page shows continue option', () => {
  it('should navigate to the dashboard page', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/');

    // Find a button with text "Continue"
    cy.get('button').contains('Continue').click();

    // The new url should include "/dashboard"
    cy.url().should('include', '/dashboard');
  });
});

describe('login page shows login option', () => {
  it('should navigate to the login page', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/');

    // Find a button with text "Login"
    cy.get('button').contains('Login').click();

    // The new url should include "/login"
    cy.url().should('include', '/login');
  });
});
