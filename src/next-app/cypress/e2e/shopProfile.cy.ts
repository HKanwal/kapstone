describe('view shop profile and edit details', () => {
  const shopNew = {
    name: "Sam's New Workshop",
    address: '100 New Street',
    city: 'Hamilton',
    province: 'ON',
    country: 'Canada',
    postalCode: 'M6A3X7',
  };

  const shopPrev = {
    name: "Sam's Workshop",
    address: '10 Sam Street',
    city: 'Toronto',
    province: 'ON',
    country: 'Canada',
    postalCode: 'L6T3X5',
  };

  it('shop owner should be able to edit shop details', () => {
    cy.login('sam', 'pass101word');
    cy.visit('/dashboard');
    cy.get('svg[id="profile"]').click();
    cy.get('button').contains('Profile').should('be.visible');
    cy.get('button').contains('Profile').click({ force: true });
    cy.wait(5000);
    cy.get('span').contains('Shop Profile').should('be.visible');

    cy.get('button[id="icon-button"]').eq(1).click();
    cy.get('input[id="name"]').should('be.enabled');

    cy.get('input[id="name"]').clear();
    cy.get('input[id="name"]').type(shopNew.name);

    cy.get('input[id="address.street"]').clear();
    cy.get('input[id="address.street"]').type(shopNew.address);

    cy.get('input[id="address.city"]').clear();
    cy.get('input[id="address.city"]').type(shopNew.city);

    cy.get('input[id="address.province"]').clear();
    cy.get('input[id="address.province"]').type(shopNew.province);

    cy.get('input[id="address.country"]').clear();
    cy.get('input[id="address.country"]').type(shopNew.country);

    cy.get('input[id="address.postal_code"]').clear();
    cy.get('input[id="address.postal_code"]').type(shopNew.postalCode);

    cy.get('button').contains('Save').click();

    cy.get('input[id="name"]').should('be.disabled');
    cy.get('input[id="name"]').should('have.value', shopNew.name);
    cy.get('input[id="address.street"]').should('have.value', shopNew.address);
    cy.get('input[id="address.city"]').should('have.value', shopNew.city);
    cy.get('input[id="address.province"]').should('have.value', shopNew.province);
    cy.get('input[id="address.country"]').should('have.value', shopNew.country);
    cy.get('input[id="address.postal_code"]').should('have.value', shopNew.postalCode);

    cy.get('button[id="icon-button"]').eq(1).click();
    cy.get('input[id="name"]').should('be.enabled');

    cy.get('input[id="name"]').clear();
    cy.get('input[id="name"]').type(shopPrev.name);

    cy.get('input[id="address.street"]').clear();
    cy.get('input[id="address.street"]').type(shopPrev.address);

    cy.get('input[id="address.city"]').clear();
    cy.get('input[id="address.city"]').type(shopPrev.city);

    cy.get('input[id="address.province"]').clear();
    cy.get('input[id="address.province"]').type(shopPrev.province);

    cy.get('input[id="address.country"]').clear();
    cy.get('input[id="address.country"]').type(shopPrev.country);

    cy.get('input[id="address.postal_code"]').clear();
    cy.get('input[id="address.postal_code"]').type(shopPrev.postalCode);

    cy.get('button').contains('Save').click();
  });
});

export {}; // Needed to fix linting errors
