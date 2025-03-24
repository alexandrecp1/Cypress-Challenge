describe('Teste E2E CLIENTE | Verificação de Dados Sensíveis', () => {
  beforeEach(() => {
    cy.visitSite()
    cy.loginClient()
  })

  it('Não deve expor dados sensíveis no código', () => {
    cy.verificarDadosSensiveis()
  })

  it('O campo de senha deve ser do tipo "password"', () => {
    cy.logout()
    cy.verificarCampoSenha()
  })
})

describe('Teste E2E ADMIN | Verificação de Dados Sensíveis', () => {
  beforeEach(() => {
    cy.visitSite()
    cy.loginAdmin()
  })

  it('Não deve expor dados sensíveis no código', () => {
    cy.verificarDadosSensiveis()
  })

  it('O campo de senha deve ser do tipo "password"', () => {
    cy.logout()
    cy.verificarCampoSenha()
  })
})

