const { defineConfig } = require("cypress");

//Exportação dos dados sensitivos via cypress.config devido utilização sem um projeto (interno)
//Se fosse algo EXTERNO, iria obviamente optar por utilizar um .env não versionado
module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://front.serverest.dev/', //Base URL para testes no FRONT
    env: {
      apiUrl: "https://serverest.dev", //Base URL para testes na API
      //Login cliente 
      email: "TesteCypressNTT@hotmail.com",
      senha: "TesteCypressNTT123",
      user: "TesteCypressNTT",
      //Login admin 
      emailAdmin: "TesteCypressNTTAdmin1@hotmail.com",
      senhaAdmin: "TesteCypressNTTAdmin123",
      userAdmin: "TesteCypressNTTAdmin",
      //Login via API
      emailAPI: "TesteCypressNTTAPI1@hotmail.com",
      senhaAPI: "TesteCypressNTTAPI123",
      userAPI: "TesteCypressNTTAPI"
    }
  }
});