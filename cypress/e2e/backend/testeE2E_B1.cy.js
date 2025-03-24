describe("Teste CRUD de produtos", () => {
  //Auth como admin antes dos testes.
  before(() => {
    cy.loginAPI(true)
    cy.log("Administrador logado com sucesso!")
  })

  it("Criação de um novo produto - POST", () => {
    //Gera um nome único para o produto utilizando Date.now()
    const nomeProduto = `Produto Teste Cypress ${Date.now()}`

    //Chama o método para criar o produto via API
    cy.request({
      method: "POST",
      url: `${Cypress.env("apiUrl")}/produtos`,
      headers: {
        Authorization: Cypress.env("token"),
      },
      //Passa os dados do produto
      body: {
        nome: nomeProduto,
        preco: 470,
        descricao: "Descrição do produto criado via API",
        quantidade: 10,
      },
    })
    //Verifica se o status é 201 e a resposta contém a mensagem esperada
    .then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body).to.have.property("message", "Cadastro realizado com sucesso")
      //Armazena nome e id para usar depois.
      cy.wrap(response.body._id).as("produtoId")
      cy.wrap(nomeProduto).as("nomeProduto")
    })
  })

  it("Verificar o produto cadastrado - GET", function () {
    //Usa o ID do produto recém-cadastrado para fazer o GET
    cy.request({
      method: "GET",
      url: `${Cypress.env("apiUrl")}/produtos/${this.produtoId}`,
      headers: {
        Authorization: Cypress.env("token"),
      },
    })
    //Verifica se o produto retornado tem os mesmos dados cadastrados
    .then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property("nome", this.nomeProduto)
      expect(response.body).to.have.property("preco", 470)
      expect(response.body).to.have.property("descricao", "Descrição do produto criado via API")
      expect(response.body).to.have.property("quantidade", 10)
    })
  })

  it("Editar produto - PUT", function () {
    //Dados modificados para a edição
    const novoPreco = 500
    const novaDescricao = "Descrição atualizada do produto via API"

    //Faz a requisição PUT para atualizar o produto
    cy.request({
      method: "PUT",
      url: `${Cypress.env("apiUrl")}/produtos/${this.produtoId}`,
      headers: {
        Authorization: Cypress.env("token"),
      },
      //Aqui mantive a mesma quantidade e nome, apenas chamei novamente o preço e a descrição novas
      body: {
        nome: this.nomeProduto,
        preco: novoPreco,         
        descricao: novaDescricao, 
        quantidade: 10, 
      },
    })
    //Verifica se a edição foi bem-sucedida
    .then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property("message", "Registro alterado com sucesso")

    //Usa o ID do produto para fazer o GET e verificar a edição
    cy.request({
      method: "GET",
      url: `${Cypress.env("apiUrl")}/produtos/${this.produtoId}`,
      headers: {
        Authorization: Cypress.env("token"),
      },
    })
    //Verifica se os dados foram atualizados corretamente com os valores atualizados
    .then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property("nome", this.nomeProduto)
      expect(response.body).to.have.property("preco", 500)
      expect(response.body).to.have.property("descricao", "Descrição atualizada do produto via API")
      expect(response.body).to.have.property("quantidade", 10)
    })
    })
  })

  it("Deletar produto - DELETE", function () {
    //Faz a requisição DELETE para excluir o produto
    cy.request({
      method: "DELETE",
      url: `${Cypress.env("apiUrl")}/produtos/${this.produtoId}`,
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
      url: `${Cypress.env("apiUrl")}/produtos/${this.produtoId}`,
      headers: {
        Authorization: Cypress.env("token"),
      },
      failOnStatusCode: false,
    })
    //Verifica se o produto não existe mais retornando 400 para não encontrado
    .then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body).to.have.property("message", "Produto não encontrado")
    })
  })
})
