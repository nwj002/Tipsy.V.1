// import request from 'supertest';
const request = require('supertest');
// importing server file
const app = require('../index');

// test token (for admin)
const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NjkyOTVlYzRmYWNlYmM3YWVkZDE1YSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcxOTExNzcyNX0.TQAOHuZ9F_4F9VD9alD4zZi2jkwbm1h81YjZe8ug3fU";


const { compare } = require('bcrypt');
const { get } = require('mongoose');
// describe (list of test cases)
describe('Testing API', () => {
    // testing '/test' api
    it('GET /test | Response with text', async () => {
        const response = await request(app).get('/test');
        expect(response.statusCode).toBe(200);

        // comparing the response with the text.
        expect(response.text).toEqual('Hello World, test api is working.');


    });



    // get all products
    it('GET /api/product/get_all_products | Response with JSON', async () => {
        const response = await request(app).get('/api/product/get_all_products').set('authorization', ` Bearer ${token}`);
        expect(response.statusCode).toBe(201);
        expect(response.body).toBeDefined();
        expect(response.type).toEqual('application/json');
    });

    // register user
    // 1. sending the request
    // 2. expectin :(201)
    // 3. if user already exists, expect (400)
    // 4. success message

    it('POST /api/user/create | Response with JSON', async () => {
        const response = await request(app).post('/api/user/create').send({
            "fullname": "suddu",
            "age": 21,
            "email": "suddu@gmail.com",
            "username": "suddu",
            "phone": 984365214,
            "password": "suddu"
        });
        // if condition
        if (!response.body.sucess) {
            expect(response.body.message).toEqual("email or username already exists!");
        }
        else {
            expect(response.body.message).toEqual("User created successfully!");
        }
    });



    it("POST /api/user/login | Response with body", async () => {
        const response = await request(app).post("/api/user/login").send({
            email: "suddu@gmail.com",
            password: "suddu",
        });
        // if condition
        if (!response.body.success) {
            expect(response.body.message).toEqual("Invalid password");
        } else {
            expect(response.body.message).toEqual("User Logginned Successul!");
            expect(response.body.token.length).toBeGreaterThan(10);
            expect(response.body.userData.firstName).toEqual("rajil");
        }
    });


    // forgotpassword testing
    it("POST /api/user/forgot_password | Response with body", async () => {
        const response = await request(app).post("/api/user/forgot_password").send({
            // login with email and password
            phone: "981245789",
        });

        if (!response.body.success) {
            // expect incorrect password)
            expect(response.body.message).toEqual("User Not Found!");
        } else {
            // expect message
            expect(response.body.message).toEqual("OTP sent successfully");
        }
    });

    // cart
    // add to cart

    it('POST /api/cart/addToCart | Should add Liquor to cart', async () => {
        const response = await request(app)
            .post('/api/cart/addToCart')
            .set('authorization', `Bearer ${token}`)
            .send({
                userID: "66be4b22ea2a0245429abafc",
                productID: "66be5a56f829fb2e08d55a17",
                quantity: 1
            });

        expect(response.statusCode).toBe(200); // Ensure your route actually exists

        expect(response.body).toBeDefined();
        if (response.body.success) {
            expect(response.body.message).toEqual("item added to cart successfully");
        } else {
            expect(response.body.message).toEqual("Liquor already in Cart");
        }
    });
    // get cart by user id

    it('GET /api/cart/getCartByUserID/:id | Should retrieve Liquors in cart for a user', async () => {
        const userId = "66be4b22ea2a0245429abafc"; // Replace with an actual user ID
        const response = await request(app)
            .get(`/api/cart/getCartByUserID/${userId}`)
            .set('authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200); // Ensure your route actually exists

        expect(response.body).toBeDefined();
        expect(response.body.success).toBe(true);
        expect(response.body.message).toEqual("retrieved");
        expect(response.body.cart).toBeInstanceOf(Array);
    });
    // get reviews by user id

    it('GET /api/review/getReviewsByUserID/:id | Should retrieve reviews for a user', async () => {
        const userId = "66be4b22ea2a0245429abafc"; // Replace with an actual user ID
        const response = await request(app)
            .get(`/api/review/getReviewsByUserID/${userId}`)
            .set('authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200); // Ensure your route is returning 200 on success
        expect(response.body).toBeDefined();
        expect(response.body.success).toBe(true);
        expect(response.body.message).toEqual("Reviews retrieved");
        expect(response.body.review).toBeInstanceOf(Array); // Ensure the reviews are returned in an array
        if (response.body.review.length > 0) {
            expect(response.body.review[0]).toHaveProperty('userID', userId);
        }
    });

    // get product reviews by product id

    it('GET /api/review/getReviewsByProductID/:id | Should retrieve reviews for a product', async () => {
        const productId = "66be5a56f829fb2e08d55a17"; // Replace with actual product ID
        const response = await request(app)
            .get(`/api/review/getReviewsByProductID/${productId}`);

        expect(response.statusCode).toBe(200); // Ensure your route is returning 200 on success
        expect(response.body).toBeDefined();
        expect(response.body.success).toBe(true);
        expect(response.body.message).toEqual("Reviews retrieved");
        expect(response.body.review).toBeInstanceOf(Array);
    });

    // delete product
    it("DELETE /api/product/delete_product/:id | Response with body", async () => {
        const response = await request(app).delete(
            "/api/product/delete_product/60f4b9f1e5c4c00015e5b7c4"
        );

        if (!response.body.success) {
            // expect incorrect password)
            expect(response.body.message).toEqual("Internal server error");
        } else {
            // expect message
            expect(response.body.message).toEqual("Product deleted successfully!!!");
        }
    });


}
);

