import httpStatus from "http-status";
import app from "../src/index";
import supertest from "supertest";
import fruits from "data/fruits";

const server = supertest(app);

beforeEach(() => {
    fruits.length = 0
});

describe("POST /fruits", () => {
    it("Should respond with 422 when request is missing a value", async () => {
        const mockObject = {
            price: 10
        };

        const response = await server.post("/fruits").send(mockObject);

        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
        expect(fruits.length).toBe(0);
    })

    it("Should respond with 422 when request types are wrong", async () => {
        const mockObject = {
            name: 11,
            price: "string"
        };

        const response = await server.post("/fruits").send(mockObject);

        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
        expect(fruits.length).toBe(0)
    })

    it("Should respond with 201 when type and value are right", async () => {
        const mockObject = {
            name: "tomate",
            price: 10,
        };

        const response = await server.post("/fruits").send(mockObject);

        expect(response.status).toBe(httpStatus.CREATED);
        expect(fruits.length).toBe(1);
    });
})

describe("GET /fruits", () => {

    it("should respond with 200 and empty array if there are no fruits registered", async () => {
        const response = await server.get("/fruits");

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual([]);
    })

    it("should respond with 200 and an object containing all registered fruits", async () => {
        const mockObject = {
            name: "tomate",
            price: 10,
        };
        const mockObject2 = {
            name: "maça",
            price: 12
        };

        await server.post("/fruits").send(mockObject);
        await server.post("/fruits").send(mockObject2);

        const response = await server.get("/fruits");

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    price: expect.any(Number)
                })
            ])
        );
        expect(fruits.length).toBe(2)
    });
})

describe("GET /fruits/:id", () => {

    it("Should respond with 404 when id is not found or not valid", async () => {
        const response = await server.get("/fruits/notvalid");

        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });


    it("Should respond with 200 and object containing fruit info when id is valid", async () => {
        const mockObject = {
            name: "tomate",
            price: 10,
        };
        
        await server.post("/fruits").send(mockObject);

        const response = await server.get("/fruits/1");
        
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
            id: expect.any(Number),
            name: expect.any(String),
            price: expect.any(Number)
        });
    });
})
