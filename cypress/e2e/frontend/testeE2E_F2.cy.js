describe('Teste E2E ADMIN | Adicionar Produto e Verificar como Cliente', () => {
  let nomeProduto

  beforeEach(() => {
    cy.visitSite()
    cy.loginAdmin()
  })

  it('Acrescenta um produto aleatório ao sistema e verifica se aparece para o cliente.', () => {
    //Gera um nome aleatório para evitar duplicações
    nomeProduto = `Produto Teste - ${Date.now()}`

    //Adiciona o produto
    cy.adicionarProduto({
      nome: nomeProduto,
      preco: '50.00',
      descricao: 'Descrição do produto',
      quantidade: '10'
    })

    //Faz logout e login como cliente
    cy.logout()
    cy.loginClient()

    //Pesquisa pelo produto cadastrado
    cy.get('[data-testid="pesquisar"]').type(nomeProduto)
    cy.get('[data-testid="botaoPesquisar"]').click()

    //Valida se o produto aparece nos resultados
    cy.contains(nomeProduto).should('be.visible')
  })
})
