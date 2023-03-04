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
