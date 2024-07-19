

export function loginViaAuth0Ui(username: string, password: string) {
    cy.visit('/')

    cy.origin(
        Cypress.env('VITE_AUTH0_DOMAIN'),
        { args: { username, password } },
        ({ username, password }) => {
            cy.get('input#username').type(username)
            cy.get('input#password').type(password, { log: false })
            cy.contains('button[value=default]', 'Continue').click()
        }
    )

    // Ensure Auth0 has redirected us back to the RWA.
    cy.url().should('equal', 'http://localhost:5173/')
}
