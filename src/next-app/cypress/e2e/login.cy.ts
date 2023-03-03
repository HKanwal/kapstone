describe('login page shows continue option', () => {
  it('should navigate to the dashboard page', () => {
    // Start from the index page
    cy.visit('/');

    // Find a button with text "Continue"
    cy.get('button').contains('Continue').click();

    // The new url should include "/dashboard"
    cy.url().should('include', '/dashboard');
  });
});

describe('login page shows login option', () => {
  it('should navigate to the login page', () => {
    // Start from the index page
    cy.visit('/');

    // Find a button with text "Login"
    cy.get('button').contains('Login').click();

    // The new url should include "/login"
    cy.url().should('include', '/login');
  });

  it('Login page should show login and register options', () => {
    cy.visit('/login');

    // "Login" button should be visible
    cy.get('button').contains('Login').should('be.visible');

    // "Register" button should be visible
    cy.get('button').contains('Register').should('be.visible');
  });
});

export {}; // Needed to fix linting errors
