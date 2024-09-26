const { reporter, flow, handler, mock } = require('pactum');
const pf = require('pactum-flow-plugin');
const { like } = require('pactum-matchers');

function addFlowReporter() {
    pf.config.url = 'http://localhost:8080'; // pactum flow server url
    pf.config.projectId = 'lojaebac-front';
    pf.config.projectName = 'Loja EBAC Front';
    pf.config.version = '1.0.4';
    pf.config.username = 'scanner';
    pf.config.password = 'scanner';
    reporter.add(pf.reporter);
}

// global before
before(async () => {
    addFlowReporter();
    await mock.start(4000);
});

// global after
after(async () => {
    await mock.stop();
    await reporter.end();
});


handler.addInteractionHandler('Login Response', () => {
    return {
        provider: 'lojaebac-api',
        flow: 'Login',
        request: {
            method: 'POST',
            path: '/public/authUser',
            body: {
                "email": "admin@admin.com",
                "password": "admin123"
            }
        },
        response: {
            status: 200,
            body: {
                "success": true,
                "message": "login successfully",
                "data": {
                    "_id": "65766e71ab7a6bdbcec70d0d",
                    "role": "admin",
                    "profile": {
                        "firstName": "admin"
                    },
                    "email": "admin@admin.com",
                    "token": like("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1NzY2ZTcxYWI3YTZiZGJjZWM3MGQwZCIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTcwNzUwMTA2MCwiZXhwIjoxNzA3NTg3NDYwfQ.Uw6rzxntfGFgWwOFEWNXaJWm_yTjg2VNY9nGAm0X0_s")
                }
            }
        }
    }
})

it('FRONT - Deve listar as categorias', async () => {
    await flow("Category Consumer")
    .useInteraction('Login Response')
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