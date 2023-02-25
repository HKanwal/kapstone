describe('create shop owner account and shop', () => {
  it('should create shop owner account', () => {
    cy.visit('/create-account');
    
    cy.get('input[id="First Name"]').type('John');
    cy.get('input[id="Last Name"]').type('Smith');
    cy.get('input[id="Phone Number"]').type('1123456789');
    cy.get('input[id="Email"]').type('test@email.com');
    cy.get('input[id="Username"]').type(`SHOP-${Math.round(Math.random()*10000)}`);
    cy.get('input[id="Password"]').type('ShopPass123');
    cy.get('input[id="Type"]').type('Shop').get('button[id="Shop Owner"]').click();
  });
});

export {}; // Needed to fix linting errors
