//Test.js
const { spec } = require('pactum')

it('Deve autenticar o usuario de forma correta', async () => {
  await spec()
    .post('http://lojaebac.ebaconline.art.br/graphql')
    .withGraphQLQuery(`
        mutation AuthUser($email: String, $password: String) {
          authUser(email: $email, password: $password) {
            success
            token
          }
        }
        `)
    .withGraphQLVariables({
      "email": "admin@admin.com",
      "password": "admin123"
    })
    .expectStatus(200)
    .expectJson('data.authUser.success', true)
});