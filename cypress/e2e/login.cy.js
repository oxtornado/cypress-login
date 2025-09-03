describe('Login flow', () => {
  it('logs in with correct creds', () => {
    cy.visit('/');

    cy.get('input[name="email"]').type('admin@example.com');
    cy.get('input[name="password"]').type('passw0rd!');
    cy.get('button[type="submit"]').click();

    // Assert that the "You're in" page loaded
    cy.contains('h1', 'You\'re in').should('be.visible');

    // Click the logout button
    cy.contains('a', 'Log out').click();

    // Assert that the user is redirected back to the login page
    cy.url().should('include', '/');
  });

  it('fails with wrong creds', () => {
    cy.visit('/');

    cy.get('input[name="email"]').type('admin@example.com');
    cy.get('input[name="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();

    // Wait for the animation to complete
    cy.get('.card').should('have.class', 'shake').and('have.class', 'shake').then(() => {
      cy.get('.card').should('not.have.class', 'shake');
    });
  });
});