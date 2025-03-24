describe('Teste E2E CLIENTE | Fluxo de compra - Caminho Feliz', () => {
  beforeEach(() => {
    //Processo de login
    cy.visitSite()
    cy.loginClient()
  });

  it('Deve adicionar um produto ao carrinho e finalizar a compra', () => {
    //Verifica se há produtos disponíveis antes de continuar
    cy.get('.card').should('exist')

    //Seleciona o primeiro produto disponível
    cy.get('.card').first().as('selectedProduct')

    //Verifica e clica no botão "Adicionar ao Carrinho"
    cy.get('@selectedProduct')
      .find('[data-testid="adicionarNaLista"]')
      .should('exist')
      .click()

    //Acessa a página do carrinho
    cy.visitSite('lista')

    //Verifica se o produto foi adicionado corretamente
    cy.get('@selectedProduct')
      .invoke('text')
      .then((productName) => {
        cy.contains(productName.trim()).should('be.visible')
      });

    //Finaliza a compra
    cy.get('[data-testid="adicionar carrinho"]').click()
    cy.contains('Em construção aguarde').should('be.visible')
  })
})
