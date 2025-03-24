describe("Teste CRUD de usuários", () => {
  //Auth como admin antes dos testes.
  before(() => {
    cy.loginAPI(true)
    cy.log("Administrador logado com sucesso!")
  })

  it("Criação de um novo usuario - POST", () => {
    //Gera um nome unico para o usuário utilizando Date.now()
    const nomeUsuario = `Usuário Teste Cypress ${Date.now()}`
    const emailUsuario = `usuario${Date.now()}@qa.com.br`

    //Chama o metodo para criar o usuário via API
    cy.request({
      method: "POST",
      url: `${Cypress.env("apiUrl")}/usuarios`,
      headers: {
        Authorization: Cypress.env("token"),
      },
      //Passa os dados do usuário
      body: {
        nome: nomeUsuario,
        email: emailUsuario,
        password: "teste123",
        administrador: "true",
      },
    })
    //Verifica se o status é 201 e a resposta contém a mensagem esperada
    .then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body).to.have.property("message", "Cadastro realizado com sucesso")
      //Armazena nome e id para usar depois.
      cy.wrap(response.body._id).as("usuarioId")
      cy.wrap(nomeUsuario).as("nomeUsuario")
      cy.wrap(emailUsuario).as("emailUsuario")
    })
  })

  it("Verificar o usuário cadastrado - GET", function () {
    //Usa o ID do usuario recem-cadastrado para fazer o GET
    cy.request({
      method: "GET",
      url: `${Cypress.env("apiUrl")}/usuarios/${this.usuarioId}`,
      headers: {
        Authorization: Cypress.env("token"),
      },
    })
    //Verifica se o usuario retornado tem os mesmos dados cadastrados (salvos anteriormente)
    .then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property("nome", this.nomeUsuario)
      expect(response.body).to.have.property("email", this.emailUsuario)
      expect(response.body).to.have.property("administrador", "true")
    })
  })

  it("Editar usuário - PUT", function () {
    //Dados modificados para a edição
    const novoNome = "userEditado"
    const novoEmail = `usuarioeditado${Date.now()}@qa.com.br`

    //Faz a requisição PUT para atualizar o usuário
    cy.request({
      method: "PUT",
      url: `${Cypress.env("apiUrl")}/usuarios/${this.usuarioId}`,
      headers: {
        Authorization: Cypress.env("token"),
      },
      //Passa os dados modificados para o usuário (tomei liberdade de tirar também o admin para testar e tornar ele cliente)
      body: {
        nome: novoNome,
        email: novoEmail,
        password: "novaSenha123",
        administrador: "false",
      },
    })
    //Verifica se a edição foi bem sucedida
    .then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property("message", "Registro alterado com sucesso")
    })

    //Verifica se os dados foram atualizados corretamente com os valores modificados
    cy.request({
      method: "GET",
      url: `${Cypress.env("apiUrl")}/usuarios/${this.usuarioId}`,
      headers: {
        Authorization: Cypress.env("token"),
      },
    })
    .then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property("nome", novoNome)
      expect(response.body).to.have.property("email", novoEmail)
      expect(response.body).to.have.property("administrador", "false")
    })
  })

  it("Deletar usuário - DELETE", function () {
    //Faz o DELETE para excluir o usuário
    cy.request({
      method: "DELETE",
      url: `${Cypress.env("apiUrl")}/usuarios/${this.usuarioId}`,
      headers: {
        Authorization: Cypress.env("token"),
      },
    })
    //Verifica se a exclusão foi bem-sucedida
    .then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property("message", "Registro excluído com sucesso")
    })

    cy.request({
      method: "GET",
      url: `${Cypress.env("apiUrl")}/usuarios/${this.usuarioId}`,
      headers: {
        Authorization: Cypress.env("token"),
      },
      failOnStatusCode: false,
    })
    //Verifica se o usuário não existe mais retornando 400 para não encontrado
    .then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body).to.have.property("message", "Usuário não encontrado")
    })
  })
})