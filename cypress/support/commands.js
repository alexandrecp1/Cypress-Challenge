//COMANDOS PARA UTILIZAÇÃO DO FRONT-END ->

// Comando para login Cliente.
Cypress.Commands.add('loginClient', () => {
  //Dados da config.js
  const email = Cypress.env('email')
  const senha = Cypress.env('senha')
  const user = Cypress.env('user')

  //Credenciais de login
  cy.get('[data-testid="email"]').type(email)
  cy.get('[data-testid="senha"]').type(senha)
  cy.get('[data-testid="entrar"]').click()

  //Apenas um aguardo para retorno para validar o login
  cy.wait(3000)

  //Aguardo da resposta para verificar a existencia do login
  cy.get('body').then(($body)  => {
    if ($body.find('.alert').length > 0) {
      cy.log('Login falhou! Criando nova conta...')

      // Criar nova conta
      cy.visit('https://front.serverest.dev/cadastrarusuarios')
      cy.get('[data-testid="nome"]').type(user)
      cy.get('[data-testid="email"]').type(email)
      cy.get('[data-testid="password"]').type(senha)
      cy.get('[data-testid="cadastrar"]').click()
    }
  })
    //Garante ter entrado na página correta
    cy.url().should('include', '/home')
})

// Comando para login Cliente.
Cypress.Commands.add('loginAdmin', () => {
  //Dados da config.js
  const email = Cypress.env('emailAdmin')
  const senha = Cypress.env('senhaAdmin')
  const user = Cypress.env('userAdmin')

  //Credenciais de login
  cy.get('[data-testid="email"]').type(email)
  cy.get('[data-testid="senha"]').type(senha)
  cy.get('[data-testid="entrar"]').click()

  //Apenas um aguardo para retorno para validar o login
  cy.wait(3000)

  //Aguardo da resposta para verificar a existencia do login
  cy.get('body').then(($body)  => {
    if ($body.find('.alert').length > 0) {
      cy.log('Login falhou! Criando nova conta...')

      // Criar nova conta
      cy.visit('https://front.serverest.dev/cadastrarusuarios')
      cy.get('[data-testid="nome"]').type(user)
      cy.get('[data-testid="email"]').type(email)
      cy.get('[data-testid="password"]').type(senha)
      cy.get('[data-testid="checkbox"]').click()
      cy.get('[data-testid="cadastrar"]').click()
    }
  })
    //Garante ter entrado na página correta
    cy.url().should('include', '/home')
})

//Comando para visitar a página checando as rotas já definidas.
Cypress.Commands.add('visitSite', (page = 'home') => {  
    const routes = {
      home: '/',
      login: '/login',
      cadastro: '/cadastrarusuarios',
      carrinho: '/carrinho',
      lista: 'minhaListaDeProdutos',
      minhaConta: '/minha-conta'
    };
  
    const path = routes[page];
  
    if (path !== undefined) {
      cy.visit(path)
    } else {
      throw new Error(`A página "${page}" não está definida e/ou não foi encontrada!`)
    }
})

//Comando para acrescentar algum produto utilizando campos vazios para serem preenchidos pelo tester/dev posteriormente.
Cypress.Commands.add('adicionarProduto', (produto) => {
  // Clica no botão para adicionar um novo produto
  cy.get('[data-testid="cadastrarProdutos"]').click()

  //Gerando um nome aleatório para o produto (Para evitar repetições na hora do cadastro)
  const nomeProduto = `${produto.nome} - ${Date.now()}`;
  //Preenche os campos do produto
  cy.get('[data-testid="nome"]').type(nomeProduto)
  cy.get('[data-testid="preco"]').type(produto.preco)
  cy.get('[data-testid="descricao"]').type(produto.descricao)
  cy.get('[data-testid="quantity"]').type(produto.quantidade)

  //Upload da imagem
  cy.get('[data-testid="imagem"]').selectFile('cypress/fixtures/imagem-teste.jpeg', { force: true })

  //Clica no botão de salvar
  cy.get('[data-testid="cadastarProdutos"]').click()

  //Valida se redirecionou para a página correta pós cadastro
  cy.url().should('include', '/listarprodutos')
})

//Comando para logout para fins de estética para não utilizar id randomicos.
Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="logout"]').click()
})

//Verificação de dados sensiveis
Cypress.Commands.add('verificarDadosSensiveis', () => {
  cy.document().then((doc) => {
    const pageContent = doc.documentElement.innerHTML

    //Verifica se algum dado sensível aparece no HTML
    const palavrasProibidas = ['senha', 'password', 'token', 'Bearer']
    palavrasProibidas.forEach((palavra) => {
      expect(pageContent).not.to.include(palavra)
    })

    cy.log('Nenhuma informação sensível encontrada na fonte.')
  })
})

Cypress.Commands.add('verificarCampoSenha', () => {
  cy.get('[data-testid="senha"]').should('have.attr', 'type', 'password')
  cy.log('O campo de senha está corretamente protegido.')
})


//////////////////////////////////////////////////////////////
//COMANDOS PARA UTILIZAÇÃO DO FRONT-END ->

Cypress.Commands.add('loginAPI', (isAdmin = false) => {
  //Puxa os dados do cypress.config para login
  const email = isAdmin ? Cypress.env('emailAPI') : Cypress.env('email')
  const password = isAdmin ? Cypress.env('senhaAPI') : Cypress.env('senha')
  const nome = isAdmin ? Cypress.env('userAPI') : Cypress.env('user')
  const apiUrl = Cypress.env('apiUrl'); // Base da API definida no config

  //Requisição de login do usuario usando a URL dinamica e continuando mesmo se falhar o status.
  cy.request({
    method: 'POST',
    url: `${apiUrl}/login`,
    body: { email, password },
    failOnStatusCode: false 
  })
    //Caso o login falhe, significa que o user não existe
    .then((loginResponse) => {
    if (loginResponse.status === 401) {
      cy.log('User não existe e/ou não foi encontrado')
    //Executa a criação de um novo usuario
      cy.request('POST', `${apiUrl}/usuarios`, {
        nome,
        email,
        password,
        administrador: isAdmin ? 'true' : 'false'
      })
      //Valida se a criação foi feita com sucesso.
      .then((createResponse) => {
        expect(createResponse.status).to.eq(201)
        cy.log('Usuário criado com sucesso!')

        //Tenta logar novamente após criar o usuário
        cy.request('POST', `${apiUrl}/login`, { email, password }).then((newLoginResponse) => {
          expect(newLoginResponse.status).to.eq(200)
          expect(newLoginResponse.body).to.have.property('authorization')
          Cypress.env('token', newLoginResponse.body.authorization)
        });
      });
    } else {
      expect(loginResponse.status).to.eq(200)
      expect(loginResponse.body).to.have.property('authorization')
      Cypress.env('token', loginResponse.body.authorization)
    }
  });
});