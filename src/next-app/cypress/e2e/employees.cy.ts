const axios = require('axios').default;
const ENDPOINT = `https://api.testmail.app/api/json?apikey=${Cypress.env(
  'TESTMAIL_APIKEY'
)}&namespace=${Cypress.env('TESTMAIL_NAMESPACE')}`;

const TAG = `${Math.round(Math.random() * 1000000)}`;
const EMPLOYEE_EMAIL = `${Cypress.env('TESTMAIL_NAMESPACE')}.${TAG}@inbox.testmail.app`;
const startTimestamp = Date.now();

// FT-RT-3 and FT-RT-4
describe('shop owners inviting employees', () => {
  describe('signup', () => {
    before(() => {
      // Login as Shop Owner
      cy.login('sam', 'pass101word');
      // Go to invite page
      cy.visit('/invite');
    });

    it('enter email', () => {
      cy.get('input').type(EMPLOYEE_EMAIL);
      cy.get('input').type(' ');
      cy.get('button').contains('Invite').click();
      cy.url().should('include', '/invitations');
    });
  });

  describe('verify email', () => {
    describe('employees should receive invitation email', () => {
      let inbox: any;
      before((done) => {
        cy.request(`${ENDPOINT}&tag=${TAG}&timestamp_from=${startTimestamp}&livequery=true`).then(
          (response: any) => {
            inbox = response.body;
            done();
          }
        );
      });
      it('Should work', () => {
        expect(inbox.result).to.equal('success');
      });
      it('There should be one email in the inbox', () => {
        expect(inbox.count).to.equal(1);
      });
      it('Get the email verification link', () => {
        const registeration_link = inbox.emails[0].text.match(/\bhttps?:\/\/\S+/gi);
        expect(registeration_link.length).to.equal(1);
      });
      it('Be able to register using the verification link', () => {
        const registeration_link = inbox.emails[0].text.match(/\bhttps?:\/\/\S+/gi);
        expect(registeration_link.length).to.equal(1);
        cy.visit(registeration_link[0].replace('&amp;', '&'));
        cy.register(
          `elliot-${TAG}`,
          'pass101word',
          'Elliot',
          'Smith',
          '+16478889404',
          EMPLOYEE_EMAIL
        );
        cy.url().should('include', '/dashboard');
      });
    });
  });
});
