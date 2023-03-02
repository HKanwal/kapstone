describe('shop owner quote response', () => {
  let quoteRequest: any;
  const VIN = '123456789';
  const manufacturer = 'BMW';
  const model = 'i7';
  const modelYear = '2005';
  const shop = "Sam's Workshop";
  const price = '50';
  const estimatedTime = '2 days';
  const day = '28';
  const notes = 'This is a test quote.';

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

    cy.get('textarea[id="Notes"]').type(quoteRequest);

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

    // Go to new quote request page
    cy.visit('/new-quote-requests');

    cy.get('span').contains('New Quote Requests').should('be.visible');
    cy.get('div').contains(quoteRequest).should('be.visible');

    cy.get('div').contains(quoteRequest).click();
    cy.get('span', { timeout: 10000 }).contains(quoteRequest.slice(0, 10)).should('be.visible');

    cy.get('button').contains('Respond').click();

    cy.get('span', { timeout: 10000 }).contains(quoteRequest.slice(0, 10)).should('be.visible');

    cy.get('input[id="Price ($)"]').type(price);
    cy.get('input[id="Estimated Time"]').type(estimatedTime);
    cy.get('input[name="date"]').click();
    cy.get('button').contains(day).click();
    cy.get('textarea[id="Notes"]').type(notes);

    cy.get('button').contains('Submit Quote').should('be.enabled');
    cy.get('button').contains('Submit Quote').click();

    cy.get('span', { timeout: 100000 }).contains('Quotes').should('be.visible');
    cy.get('div').contains(quoteRequest).should('be.visible');
  });
});

describe('customer views/accepts/rejects quote', () => {
  let quoteRequest: any;
  const VIN = '123456789';
  const manufacturer = 'BMW';
  const model = 'i7';
  const modelYear = '2005';
  const shop = "Sam's Workshop";
  const price = '50';
  const estimatedTime = '2 days';
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  const day = '28';
  const today = new Date(`${year}/${month}/${day}`).toDateString();
  const notes = 'This is a test quote.';
  let quote: any;

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

    cy.get('textarea[id="Notes"]').type(quoteRequest);

    cy.get('input[id="Vehicle ID Number"]').type(VIN);

    cy.get('button').contains('Create').should('be.enabled');
    cy.get('button').contains('Create').click();

    cy.get('span').contains('Quote Requests').should('be.visible');
    cy.get('div').contains(quoteRequest).should('be.visible');
    cy.logout();

    // Login as Shop Owner
    cy.login('sam', 'pass101word');

    // Go to new quote request page
    cy.visit('/new-quote-requests');

    cy.get('span').contains('New Quote Requests').should('be.visible');
    cy.get('div').contains(quoteRequest).should('be.visible');

    cy.get('div').contains(quoteRequest).click();
    cy.get('span').contains(quoteRequest.slice(0, 10)).should('be.visible');

    cy.get('button').contains('Respond').click();

    cy.get('span').contains(quoteRequest.slice(0, 10)).should('be.visible');

    cy.get('input[id="Price ($)"]').type(price);
    cy.get('input[id="Estimated Time"]').type(estimatedTime);
    cy.get('input[name="date"]').click();
    cy.get('button').contains(day).click();
    cy.get('textarea[id="Notes"]').type(notes);

    cy.get('button').contains('Submit Quote').should('be.enabled');
    cy.get('button').contains('Submit Quote').click();

    cy.get('span', { timeout: 10000 }).contains('Quotes').should('be.visible');
    cy.get('div').contains(quoteRequest).should('be.visible');
    cy.get('div').contains(quoteRequest).click();
    quote = cy.url.toString().split('?id=')[1];
    cy.logout();
  });

  it('customer should be able to accept quote sent by shop', () => {
    // Login as Customer
    cy.login('chris', 'pass101word');

    // Go to quote request list page
    cy.visit('/quote-request-list');

    cy.get('span').contains('Quote Requests').should('be.visible');
    cy.get('div').contains(quoteRequest).should('be.visible');

    cy.get('div').contains(quoteRequest).click();
    cy.get('span', { timeout: 100000 }).contains(quoteRequest.slice(0, 10)).should('be.visible');

    cy.get('select[id="Filter By"').select('Pending');
    cy.get(`div[id="quote-${quote}"]`).should('be.visible');
    cy.get(`div[id="quote-${quote}"]`).click();

    cy.get('label').contains('Status: ').should('contain', 'Pending');
    cy.get('label').contains('Cost: $').should('contain', price);
    cy.get('input[id="Sent By"]').should('have.attr', 'placeholder', shop);
    cy.get('input[id="Estimated Time:"]').should('have.attr', 'placeholder', estimatedTime);
    cy.get('input[id="Quote Expires On:"]').should('have.attr', 'placeholder', today);
    cy.get('textarea[id="Notes"]').should('have.attr', 'placeholder', notes);

    cy.get('button').contains('Accept Quote').click();

    cy.get('span', { timeout: 10000 }).contains(quoteRequest.slice(0, 10)).should('be.visible');

    cy.get('select[id="Filter By"').select('Pending');
    cy.get(`div[id="quote-${quote}"]`).should('not.be.visible');

    cy.get('select[id="Filter By"').select('Accepted');
    cy.get(`div[id="quote-${quote}"]`).should('be.visible');
    cy.get(`div[id="quote-${quote}"]`).click();
    cy.get('label').contains('Status: ').should('contain', 'Accepted');
  });

  it('customer should be able to reject quote sent by shop', () => {
    // Login as Customer
    cy.login('chris', 'pass101word');

    // Go to quote request list page
    cy.visit('/quote-request-list');

    cy.get('span').contains('Quote Requests').should('be.visible');
    cy.get('div').contains(quoteRequest).should('be.visible');

    cy.get('div').contains(quoteRequest).click();
    cy.get('span', { timeout: 100000 }).contains(quoteRequest.slice(0, 10)).should('be.visible');

    cy.get('select[id="Filter By"').select('Pending');
    cy.get(`div[id="quote-${quote}"]`).should('be.visible');
    cy.get(`div[id="quote-${quote}"]`).click();

    cy.get('label').contains('Status: ').should('contain', 'Pending');
    cy.get('label').contains('Cost: $').should('contain', price);
    cy.get('input[id="Sent By"]').should('have.attr', 'placeholder', shop);
    cy.get('input[id="Estimated Time:"]').should('have.attr', 'placeholder', estimatedTime);
    cy.get('input[id="Quote Expires On:"]').should('have.attr', 'placeholder', today);
    cy.get('textarea[id="Notes"]').should('have.attr', 'placeholder', notes);

    cy.get('button').contains('Reject Quote').click();

    cy.get('span', { timeout: 10000 }).contains(quoteRequest.slice(0, 10)).should('be.visible');

    cy.get('select[id="Filter By"').select('Pending');
    cy.get(`div[id="quote-${quote}"]`).should('not.be.visible');

    cy.get('select[id="Filter By"').select('Rejected');
    cy.get(`div[id="quote-${quote}"]`).should('be.visible');
    cy.get(`div[id="quote-${quote}"]`).click();
    cy.get('label').contains('Status: ').should('contain', 'Rejected');
  });
});

export {}; // Needed to fix linting errors
