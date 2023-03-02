describe('shop owner quote response', () => {
  let quoteRequest: any;
  const VIN = '123456789';
  const manufacturer = 'BMW';
  const model = 'i7';
  const modelYear = '2005';
  const shop = "Sam's Workshop";

  beforeEach(() => {
    quoteRequest = `QUOTEREQUEST-${Math.round(Math.random() * 1000000)}`;
    // Login as Customer
    cy.login('chris', 'pass101word');

    // Go to quote request create page
    cy.visit('/quote-request');

    // Find text "Create Quote Request"
    cy.get('span').contains('Create Quote Request').should('be.visible');

    cy.get('input[id="Manufacturer"]').click();
    cy.get(`button[id="${manufacturer}"]`).then(($button) => {
      const button = $button[0]; // get the DOM node
      button.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
    });

    cy.get('span').contains('Model').should('be.visible');
    cy.get('input[id="Model"]').click();
    cy.get(`button[id="${model}"]`).then(($button) => {
      const button = $button[0]; // get the DOM node
      button.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
    });

    cy.get('input[id="Model Year"]').type(modelYear);

    cy.get('input[placeholder="Select the shops"]').type(shop);
    cy.get('input[placeholder="Select the shops"]').focus().type('{downarrow}').type('{enter}');

    cy.get('textarea[placeholder="Enter any additional notes"]').type(quoteRequest);

    cy.get('input[id="Vehicle ID Number"]').type(VIN);

    cy.get('button').contains('Create').should('be.enabled');
    cy.get('button').contains('Create').click();

    cy.get('span').contains('Quote Requests').should('be.visible');
    cy.get('div').contains(quoteRequest).should('be.visible');
    cy.logout();
  });

  it('shop owner should be able to respond to quote request', () => {
    // Login as Shop Owner
    cy.login('sam', 'pass101word');

    // Go to quote request create page
    cy.visit('/new-quote-requests');

    cy.get('span').contains('New Quote Requests').should('be.visible');
    cy.get('div').contains(quoteRequest).should('be.visible');

    cy.get('div').contains(quoteRequest).click();
    cy.get('span').contains(quoteRequest.slice(0, 10)).should('be.visible');

    cy.get('button').contains('Respond').click();
  });
});

describe('customer views/accepts/rejects quote', () => {
  let quoteRequest: any;
  const VIN = '123456789';
  const manufacturer = 'BMW';
  const model = 'i7';
  const modelYear = '2005';
  const shop = "Sam's Workshop";

  beforeEach(() => {
    quoteRequest = `QUOTEREQUEST-${Math.round(Math.random() * 1000000)}`;
    // Login as Customer
    cy.login('chris', 'pass101word');

    // Go to quote request create page
    cy.visit('/quote-request');

    // Find text "Create Quote Request"
    cy.get('span').contains('Create Quote Request').should('be.visible');

    cy.get('input[id="Manufacturer"]').click();
    cy.get(`button[id="${manufacturer}"]`).then(($button) => {
      const button = $button[0]; // get the DOM node
      button.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
    });

    cy.get('span').contains('Model').should('be.visible');
    cy.get('input[id="Model"]').click();
    cy.get(`button[id="${model}"]`).then(($button) => {
      const button = $button[0]; // get the DOM node
      button.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
    });

    cy.get('input[id="Model Year"]').type(modelYear);

    cy.get('input[placeholder="Select the shops"]').type(shop);
    cy.get('input[placeholder="Select the shops"]').focus().type('{downarrow}').type('{enter}');

    cy.get('textarea[placeholder="Enter any additional notes"]').type(quoteRequest);

    cy.get('input[id="Vehicle ID Number"]').type(VIN);

    cy.get('button').contains('Create').should('be.enabled');
    cy.get('button').contains('Create').click();

    cy.get('span').contains('Quote Requests').should('be.visible');
    cy.get('div').contains(quoteRequest).should('be.visible');
    cy.logout();
  });

  it('customer should be able to view quote sent by shop', () => {});

  it('customer should be able to accept quote sent by shop', () => {});

  it('customer should be able to reject quote sent by shop', () => {});
});

export {}; // Needed to fix linting errors
