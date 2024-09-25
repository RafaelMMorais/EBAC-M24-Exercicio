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

it('API - Deve Listar os produtos', async () => {
    await spec()
        .get('/public/getProducts')
        .expectStatus(200)
});

let catId;
it('API - Deve Adicionar um produto e pegar o ID', async () => {
    catId = await spec()
        .post('/api/addProduct')
        .withHeaders("Authorization", token)
        .withJson({
            "name": "Guitarra Gibson Les Paul",
            "price": 1327.00,
            "quantity": "3",
            "categories": [],
            "description": "Guitarra les paul da marca Gibson",
            "photos": "https://www.zipmaster.com/wp-content/uploads/2022/04/Reusable-Cloth-Shopping-Bags-Rainbow-Pack-200-Case-Reusable-Bags-B26-061-3-1000x1000.jpg.webp",
            "popular": null,
            "visible": true,
            "location": "SP, SP",
            "additionalDetails": null,
            "specialPrice": null
        })
        .returns('data._id') //Capturar o ID que retorna da API
    console.log("ID da Nova Categoria: ", catId)
});

it('API - Deve editar um produto', async () => {
    await spec()
        .put(`/api/editProduct/${catId}`)
        .withJson({
            "authorization": token,
            "name": "Guitarra Gibson SG Angus Young Signature",
            "price": 5500.00,
            "quantity": "1",
            "categories": [],
            "description": "Guitarra SG Signature do Angus Young do AC/DC",
            "photos": "https://www.zipmaster.com/wp-content/uploads/2022/04/Reusable-Cloth-Shopping-Bags-Rainbow-Pack-200-Case-Reusable-Bags-B26-061-3-1000x1000.jpg.webp",
            "popular": null,
            "visible": true,
            "location": "SP, SP",
            "additionalDetails": null,
            "specialPrice": null
        })
});

it('API - Deve deletar um produto', async () => {
    await spec()
        .delete(`/api/deleteProduct/66f47e114252422517014d51`)
        .withJson({
            "authorization": token,
        })
});
