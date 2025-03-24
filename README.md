# NTTData - Testes

**Este projeto contém uma série de testes realizados com Cypress. O foco principal dos testes é verificar funcionalidades CRUD (Criação, Leitura, Atualização e Exclusão) de recursos, bem como a segurança da aplicação com testes de injeção de SQL, rate limiting, manipulação de tokens JWT e validação de entradas maliciosas.**

Estrutura do Teste:

O projeto é dividido em diferentes suites de testes:

1. **CRUD de Produtos**:
    - Testa a criação, leitura, atualização e exclusão de produtos utilizando requisições HTTP da API.
    - O fluxo de cada teste é o seguinte:
        - Criação de um novo produto via `POST`.
        - Verificação do produto criado via `GET`.
        - Edição do produto via `PUT`.
        - Exclusão do produto via `DELETE`.

2. **CRUD de Usuários**:
    - Testa a criação, leitura, atualização e exclusão de usuários, incluindo modificações como a alteração de informações do usuário (nome, e-mail, status de administrador).
    - O fluxo segue os mesmos passos do CRUD de produtos, mas agora focado em usuários.

3. **Segurança de API**:
    - **SQL Injection**: Testa se a aplicação é vulnerável a injeções de SQL. O objetivo é verificar se as requisições GET podem ser manipuladas com um comando malicioso de SQL.
    - **Rate Limiting**: Testa a capacidade da aplicação de limitar requisições excessivas em um curto período de tempo (principalmente tentativas de login).
    - **Manipulação de Token JWT**: Verifica se a aplicação consegue validar tokens JWT manipulados de forma indevida.
    - **Validação de Entradas Maliciosas**: Testa entradas maliciosas no login, como injeções de comandos de shell ou código JavaScript.

### Testes de CRUD de Produtos:

1. **Criação de um novo produto (POST)**:
    - Gera um nome único para o produto.
    - Envia a requisição `POST` para criar o produto.
    - Verifica o status de resposta e se a mensagem de sucesso é retornada.

2. **Verificar o produto cadastrado (GET)**:
    - Utiliza o ID do produto criado para buscar e validar suas informações via `GET`.
    - Verifica se os dados retornados correspondem aos dados cadastrados.

3. **Editar o produto (PUT)**:
    - Modifica alguns dados do produto, como preço e descrição.
    - Realiza uma requisição `PUT` para atualizar o produto.
    - Valida se os dados foram alterados corretamente.

4. **Deletar o produto (DELETE)**:
    - Realiza uma requisição `DELETE` para excluir o produto.
    - Após a exclusão, tenta buscar o produto para garantir que ele não existe mais.

### Testes de CRUD de Usuários:

1. **Criação de um novo usuário (POST)**:
    - Gera um nome e e-mail únicos para o usuário.
    - Envia a requisição `POST` para criar o usuário.
    - Verifica se o usuário foi criado com sucesso.

2. **Verificar o usuário cadastrado (GET)**:
    - Utiliza o ID do usuário criado para buscar suas informações via `GET`.
    - Verifica se os dados retornados correspondem aos dados cadastrados.

3. **Editar o usuário (PUT)**:
    - Modifica o nome, e-mail e status de administrador.
    - Realiza uma requisição `PUT` para atualizar o usuário.
    - Valida se os dados foram alterados corretamente.

4. **Deletar o usuário (DELETE)**:
    - Realiza uma requisição `DELETE` para excluir o usuário.
    - Após a exclusão, tenta buscar o usuário para garantir que ele não existe mais.

### Testes de Segurança:

1. **SQL Injection**:
    - Testa se a aplicação é vulnerável a injeções SQL utilizando uma carga maliciosa no ID do usuário.
    - Verifica se a aplicação não executa SQL malicioso.

2. **Rate Limiting**:
    - Testa o comportamento da aplicação ao enviar múltiplas requisições de login em um curto período de tempo.
    - Após atingir o limite de tentativas, o sistema deve bloquear novas tentativas (status 429).

3. **Manipulação de Token JWT**:
    - Testa a manipulação de um token JWT inválido para autenticação.
    - Verifica se o sistema retorna o status adequado (401 Unauthorized) quando o token é manipulado.

4. **Validação de Entradas Maliciosas**:
    - Testa a entrada de comandos de shell e código JavaScript no formulário de login.
    - Verifica se a aplicação rejeita entradas maliciosas, como tentativas de injeção de comandos.

### Após a execução do download do repositório, siga as etapas citadas abaixo para a execução dos testes:

1. **Pré-requisitos**:
    - O Cypress deve estar instalado em sua máquina. Caso não tenha, instale com o seguinte comando:
    ```bash
    yarn add cypress
    ```

2. **Variáveis de Ambiente**:
    - O projeto depende de variáveis de ambiente para a URL da API e o token de autorização. Normalmente eu utilizaria um .env para fazer o mesmo, porém, como é algo "público" para testes, deixei tudo isso já disponibilizado nas configurações

3. **Executando os Testes**:
    - Para rodar os testes, execute o seguinte comando no terminal:
    ```bash
    yarn run cypress open
    ```
    - Isso abrirá a interface gráfica do Cypress, onde você pode escolher quais testes executar.

4. **Testes de API**:
    - Os testes são realizados via requisições HTTP utilizando a API da aplicação. Certifique-se de que a API esteja funcionando e acessível.

5. **Testes de Segurança**:
    - Certifique-se de que a aplicação esteja configurada para lidar com diferentes tipos de entradas maliciosas, como SQL Injection, Rate Limiting e manipulação de tokens JWT.

### Observações Finais:

- **Manutenção**: Caso as APIs ou os endpoints mudem, será necessário atualizar os testes para refletir essas alterações.
- **Dúvidas**: Quaisquer dúvidas com relação a como eu pensei para desenvolver o projeto, metodos e afins, pode me chamar no privado que eu respondo assim que possivel!

- <3 

