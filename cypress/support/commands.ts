/// <reference types="cypress" />

import { loginViaAuth0Ui } from './auth-provider-commands/auth0';

Cypress.Commands.add('loginToAuth0', (username, password) => {
    loginViaAuth0Ui(username, password);
});
