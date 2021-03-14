// initialisations
const baseUrl = Cypress.config().baseUrl;
const practiceForm = Cypress.config().practiceForm;

const prezObj = {
  firstName: 'Joe',
  lastName: 'Biden',
  email: 'joe@us.co',
  number: '9999999999',
  gender: 'Male',
};
const fullName = getConcatenatedValues(prezObj.firstName, prezObj.lastName);

// Owing to limited time of the assignment not implementing TS Files
describe('Form Validation', () => {
  before(() => {
    cy.visit(practiceForm);
  });

  it('should display the Practice Form title', () => {
    cy.url().should('eq', baseUrl + practiceForm);
    cy.get('.main-header').should('contain', 'Practice Form');
  });

  it('should display Student Registration Form', () => {
    cy.contains('Student Registration Form').should('be.visible');
  });

  it('should not submit form, unless mandatory fields are populated', () => {
    cy.get('#submit').click();
    cy.contains('Thanks for submitting the form').should('not.be.visible');
  });

  it('should submit form, once mandatory fields are populated', () => {
    // interactions
    populateForm(prezObj);

    // assertions
    cy.contains('Thanks for submitting the form').should('be.visible');
    cy.tableTdContains(fullName);
    cy.tableTdContains(prezObj.email);
    cy.tableTdContains(prezObj.gender);
    cy.tableTdContains(prezObj.number);

    cy.get('#closeLargeModal').click();
  });

  it('should keep City Dropdown disabled unless State is Selected', () => {
    const newDetails = {
      state: 'NCR',
      city: 'Delhi',
      ...prezObj,
    };
    const cityState = getConcatenatedValues(newDetails.state, newDetails.city);

    cy.contains('div', 'Select City').get('input').should('be.disabled');

    cy.get('#state').click();
    cy.contains('div', newDetails.state).click();
    cy.contains('div', 'Select City').get('input').should('not.be.disabled');
    cy.get('#city').click();
    cy.contains('div', newDetails.city).click();
    populateForm(newDetails);
    cy.tableTdContains(cityState);

    cy.get('#closeLargeModal').click();
  });
});

/** Joins passed values
 * @param  {String} ...values to be concatenated
 * @return {String} concatednated string with padding
 */
function getConcatenatedValues(...values) {
  return values.join(' ');
}

/** populate student form
 * @param  {userObject} prezDetails form parameters
 */
function populateForm(prezDetails) {
  cy.get('#firstName').type(prezDetails.firstName);
  cy.get('#lastName').type(prezDetails.lastName);
  cy.get('#userEmail').type(prezDetails.email);
  cy.get('#userNumber').type(prezDetails.number);
  // below implementation is too simple to be pulled to command.js
  cy.contains('div', prezDetails.gender).click();
  cy.get('#submit').click();
}
