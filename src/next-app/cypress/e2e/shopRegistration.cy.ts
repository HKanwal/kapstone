describe('create shop owner account and shop', () => {

  const username = `SHOPOWNER-${Math.round(Math.random()*1000000)}`;
  const password = 'ShopPass123';

  it('should create shop owner account', () => {
    cy.visit('/create-account');
    
    cy.get('input[id="First Name"]').type('John');
    cy.get('input[id="Last Name"]').type('Smith');
    cy.get('input[id="Phone Number"]').type('+16472224448');
    cy.get('input[id="Email"]').type('test@email.com');
    cy.get('input[id="Username"]').type(username);
    cy.get('input[id="Password"]').type(password);
    cy.get('input[id="Type"]').click(); // open the dropdown menu
    cy.get('button[id="Shop Owner"]').then(($button) => {
      const button = $button[0]; // get the DOM node
      button.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
    });
    cy.get('button').contains('Create').click();
  
    cy.url().should('include', '/create-shop');
  });
  
  it('should create shop', () => {
    cy.login(username, password);
    cy.visit('/create-shop');

    cy.get('input[id="name"]').type(`SHOP-${Math.round(Math.random()*1000000)}`);
    cy.get('.hour-field').click();
    cy.get('input[id="num_bays"]').type('2');
    cy.get('input[id="address.street"]').type('123 Main Rd.');
    cy.get('input[id="address.city"]').type('Hamilton');
    cy.get('input[id="address.province"]').type('Ontario');
    cy.get('input[id="address.country"]').type('Canada');
    cy.get('input[id="address.postal_code"]').type('A1B2C3');
    cy.get('button').contains('Save').click();

    cy.url().should('include', '/dashboard');
  })
});

export {}; // Needed to fix linting errors
