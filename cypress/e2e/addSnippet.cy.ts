import {AUTH0_PASSWORD, AUTH0_USERNAME, BACKEND_URL} from "../../src/utils/constants";

describe('Add snippet tests', () => {
  beforeEach(() => {
     cy.loginToAuth0(
         AUTH0_USERNAME,
         AUTH0_PASSWORD
     )
  })
  it('Can add snippets manually', () => {
    cy.visit("/")

    /* ==== Generated with Cypress Studio ==== */
    cy.get('.css-9jay18 > .MuiButton-root').click();
    cy.get('.MuiList-root > [tabindex="0"]').click();
    cy.get('#name').type('unSnippet');
    cy.get('body').click();
    cy.get('[data-testid="menu-option-Printscript"]').click();
    cy.get('.npm__react-simple-code-editor__textarea').click();
    cy.get('.css-z3n8bp > .css-9jay18 > .MuiButtonBase-root').click();
    /* ==== End Cypress Studio ==== */
  })

  it('Can add snippets via file', () => {
    cy.visit("/")
    cy.intercept('POST', BACKEND_URL+"/snippets", (req) => {
      req.reply((res) => {
        expect(res.body).to.include.keys("id","name","content","language")
        expect(res.statusCode).to.eq(200);
      });
    }).as('postRequest');

    /* ==== Generated with Cypress Studio ==== */
    cy.get('.css-9jay18 > .MuiButton-root').click();
    cy.get('.MuiList-root > [tabindex="-1"]').click();
    cy.get('.css-z3n8bp > .css-9jay18 > .MuiButtonBase-root').click();
    /* ==== End Cypress Studio ==== */
  })
})
