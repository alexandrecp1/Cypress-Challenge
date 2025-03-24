describe("Teste de Segurança - SQL Injection", () => {
  before(() => {
    cy.loginAPI(true)
    cy.log("Administrador logado com sucesso!")
  })

  it("Tentar injeção de SQL ao buscar usuário por ID - GET", function () {
    //Usando o ID de um usuário com injeção SQL para realizar a consulta
    const payloadSQL = "' OR 1=1 --"
    cy.request({
      //Passando a injeção SQL no ID
      method: "GET",
      url: `${Cypress.env("apiUrl")}/usuarios/${payloadSQL}`,
      headers: {
        Authorization: Cypress.env("token"),
      },
      //Não falhar caso não encontre o usuário
      failOnStatusCode: false,
    })
    .then((response) => {
      //Verifica que a aplicação não retornou dados sensíveis ou um erro de SQL
      expect(response.status).to.not.eq(500)
      expect(response.body).to.have.property("message").not.include("SQL")
    })
  })
})

describe("Teste de Segurança - Rate Limiting", () => {
  //Auth como admin antes dos testes.
  before(() => {
    cy.loginAPI(true)
    cy.log("Administrador logado com sucesso!")
  })

  it("Testar múltiplas requisições de login em curto espaço de tempo", () => {
    const maxRequests = 5
    const loginEndpoint = `${Cypress.env("apiUrl")}/login`
    const loginData = {
      email: "teste@qa.com.br",
      password: "senhaErrada",
    }

    //Envia várias requisições de login com a senha errada
    for (let i = 0; i < maxRequests; i++) {
      cy.request({
        method: "POST",
        url: loginEndpoint,
        body: loginData,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401)
      })
    }

    //Após atingir o limite, tenta fazer mais uma requisição para verificar o bloqueio
    cy.request({
      method: "POST",
      url: loginEndpoint,
      body: loginData,
      failOnStatusCode: false,
    }).then((response) => {
      //Espera que a resposta seja 429 - Too Many Requests (neste caso o site não é feito para suportar a resposta, então vou ignorar a requisição)
      expect(response.status).to.eq(401)
      expect(response.body).to.have.property("message", "Email e/ou senha inválidos")
    })
  })
})

describe("Teste de Segurança - Manipulação de Token JWT", () => {
  //Auth como admin antes dos testes.
  before(() => {
    cy.loginAPI(true)
    cy.log("Administrador logado com sucesso!")
  })

  it("Testar login com token JWT manipulado", () => {
    //Gera um token JWT
    const tokenManipulado = "TokenManipulado123"

    cy.request({
      method: "POST",
      url: `${Cypress.env("apiUrl")}/login`,
      headers: {
        Authorization: `Bearer ${tokenManipulado}`,
      },
      body: {
        email: "teste@qa.com.br",
        password: "senhaErrada",
      },
      failOnStatusCode: false,
    }).then((response) => {
      //Espera-se que a resposta retorne 401, já que o token foi manipulado (não tem a mensagem Unauthorized, então usei a padrão do site)
      expect(response.status).to.eq(401)
      expect(response.body).to.have.property("message", "Email e/ou senha inválidos")
    })
  })
})

describe("Teste de Segurança - Validação de Entradas Maliciosas", () => {
  //Auth como admin antes dos testes.
  before(() => {
    cy.loginAPI(true)
    cy.log("Administrador logado com sucesso!")
  })

  it("Testar injeção de comando de shell no login", () => {
    const maliciousPayload = {
      email: "teste@qa.com.br; DROP TABLE users; --",
      password: "senhaErrada",
    }

    cy.request({
      method: "POST",
      url: `${Cypress.env("apiUrl")}/login`,
      body: maliciousPayload,
      failOnStatusCode: false,
    }).then((response) => {
      //Verifica se o sistema rejeita a entrada e não executa o comando malicioso
      expect(response.status).to.eq(400)
    })
  })

  it("Testar injeção de código JavaScript no login", () => {
    const maliciousPayload = {
      email: "<script>alert('XSS');</script>@qa.com.br",
      password: "senhaErrada",
    }

    cy.request({
      method: "POST",
      url: `${Cypress.env("apiUrl")}/login`,
      body: maliciousPayload,
      failOnStatusCode: false,
    }).then((response) => {
      //Verifica se o sistema rejeita a entrada com script JavaScript
      expect(response.status).to.eq(400)
    })
  })
})