// test.js
const { spec, request } = require('pactum');
const { eachLike, like } = require('pactum-matchers');

request.setBaseUrl('http://lojaebac.ebaconline.art.br');

let token;
beforeEach(async () => {
    token = await spec()
        .post('/public/authUser')
        .withJson({
            "email": "admin@admin.com",
            "password": "admin123"
        })
        .returns('data.token')
})

it('API - Deve Listar as Categorias', async () => {
    await spec()
        .get('/public/getCategories')
        .expectStatus(200)
        .expectJsonMatch({
            categories: eachLike({
                "_id": like("657b05fe31b986f1c0a7a053"),
                "name": like("Guitarra"),
                "photo": like("https://www.zipmaster.com/wp-content/uploads/2022/04/Reusable-Cloth-Shopping-Bags-Rainbow-Pack-200-Case-Reusable-Bags-B26-061-3-1000x1000.jpg.webp"),
                "createdAt": like("2024-09-25T19:43:44.809Z"),
                "updatedAt": like("2024-09-25T19:43:44.809Z"),
                "__v": 0
            })
        })
});

let catId;
it('API - Deve Adicionar categorias', async () => {
    catId = await spec()
        .post('/api/addCategory')
        .withJson({
            "authorization": token,
            "name": "Guitarra",
            //Imagem usada em aula mesmo
            "photo": "https://www.zipmaster.com/wp-content/uploads/2022/04/Reusable-Cloth-Shopping-Bags-Rainbow-Pack-200-Case-Reusable-Bags-B26-061-3-1000x1000.jpg.webp"
        })
        .returns('data.catId')
});

it('API - Deve editar categorias', async () => {
    await spec()
        .put(`/api/editCategory/${catId}`)
        .withJson({
            "authorization": token,
            "name": "Guitarra 2",
            //Imagem usada em aula mesmo
            "photo": "https://www.zipmaster.com/wp-content/uploads/2022/04/Reusable-Cloth-Shopping-Bags-Rainbow-Pack-200-Case-Reusable-Bags-B26-061-3-1000x1000.jpg.webp"
        })
});

it('API - Deve deletar categorias', async () => {
    await spec()
        .delete(`/api/deleteCategory/${catId}`)
        .withJson({
            "authorization": token,
        })
});
