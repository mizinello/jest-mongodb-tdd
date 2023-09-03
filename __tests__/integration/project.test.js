const request = require('supertest');
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require('../../src/app');

describe('Programmer', () => {
  let mongoServer;
  beforeAll(async () => {
    const mongod = await MongoMemoryServer.create();
    const URI = mongod.getUri();

    mongoose.connect(URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async done => {
    mongoose.disconnect(done);
    await mongoServer.stop();
  });

  afterEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany();
    }
  });

  // POSITIVE CASE:
  //get all records of programmers
  it('should be able to create a programmers', async () => {
    const data = [{
      firstName: "Andi",
      lastName: "Wijayanto",
      age: 20,
      programmingLanguages: ['English', 'English'],
    }]
    await request(app)
      .post('/programmer')
      .send(data)

    const response = await request(app)
      .get('/programmer');
    expect(response.status).toBe(200);
  });

  // NEGATIVE CASE:
  //get records of nonexistant data
  it("should not be able to get nonexistant document", async () => {
    const response = await request(app).get('/projects');
    expect(response.status).toBe(404);
  });

  //POSITIVE CASE:
  //show details of programmer
  it('should be able to show details of programmer', async () => {
    const responseCreate = await request(app)
      .post('/programmer')
      .send({
        firstName: "Andi",
        lastName: "Wijayanto",
        age: 20,
        programmingLanguages: ['English', 'English'],
      })
    expect(responseCreate.status).toBe(200);
    const responseGet = await request(app)
      .get(`/programmer/${responseCreate.body._id}`);
    expect(responseGet.status).toBe(200);
  });

  //NEGATIVE CASE:
  //show details of programmer with nonexistent data
  it('should be able to show details of programmer', async () => {
    const responseCreate = await request(app)
      .post('/programmer')
      .send({
        firstName: "Andi",
        lastName: "Wijayanto",
        age: 20,
        programmingLanguages: ['English', 'English'],
      })
    expect(responseCreate.status).toBe(200);
    const responseGet = await request(app)
      .get(`/programmer/${responseCreate.body._id}`);
    expect(responseGet.firstName).not.toBe('Ahmad');
  });

  //POSITIVE CASE:
  //store new data to database
  it('should be able to create a programmer', async () => {
    const response = await request(app)
      .post('/programmer')
      .send({
        firstName: "Andi",
        lastName: "Wijayanto",
        age: 20,
        programmingLanguages: ['English', 'English'],
      })

    expect(response.status).toBe(200);
    const responseGet = await request(app)
      .get('/programmer');

    expect(responseGet.body.length).toBe(1);
  });

  //NEGATIVE CASE
  // store 2 data with duplicate to database
  it('should not be able to create a programmer because duplicate data', async () => {
    const data = [{
      firstName: "Andi",
      lastName: "Wijayanto",
      age: 20,
      programmingLanguages: ['English', 'English'],
    }, {
      firstName: "Andi",
      lastName: "Wijayanto",
      age: 20,
      programmingLanguages: ['English', 'English'],
    }]

    await request(app)
      .post('/programmer')
      .send(data[0])
    await request(app)
      .post('/programmer')
      .send(data[1])
    const response = await request(app)
      .post('/programmer');
    expect(response.status).toBe(400);
  });

  //POSITIVE CASE
  // modify data programmer on record
  it("should be able to update a programmer", async () => {
    const responseCreate = await request(app).post("/programmer").send({
      firstName: "Andi",
      lastName: "Wijayanto",
      age: 20,
      programmingLanguages: ['English', 'English'],
    });
    expect(responseCreate.status).toBe(200);

    const responseUpdate = await request(app)
      .put(`/programmer/${responseCreate.body._id}`)
      .send({
        firstName: "Ahmad",
        lastName: "Wijayanto",
        age: 25,
        programmingLanguages: ['Java', 'Ruby'],
      });
    expect(responseUpdate.status).toBe(200);

    const responseGet = await request(app)
      .get(`/programmer/${responseUpdate.body._id}`);
    expect(responseGet.body.firstName).toBe("Ahmad");
  });

  //NEGATIVE CASE
  // modify data programmer on record nonexistant
  it("should not be able to update a programmer because data nonexistant", async () => {
    const responseCreate = await request(app).post("/programmer").send({
      firstName: "Andi",
      lastName: "Wijayanto",
      age: 20,
      programmingLanguages: ['English', 'English'],
    });
    expect(responseCreate.status).toBe(200);

    const responseUpdate = await request(app)
      .put('/programmer/1')
      .send({
        firstName: "Ahmad",
        lastName: "Wijayanto",
        age: 25,
        programmingLanguages: ['Java', 'Ruby'],
      });
    expect(responseUpdate.status).toBe(500);
  });

  //POSITIVE CASE
  // delete data programmer on record
  it("should be able to delete a programmer", async () => {
    const responseCreate = await request(app).post("/programmer").send({
      firstName: "Andi",
      lastName: "Wijayanto",
      age: 20,
      programmingLanguages: ['English', 'English'],
    });
    expect(responseCreate.status).toBe(200);

    const responseDelete = await request(app)
      .delete(`/programmer/${responseCreate.body._id}`);
    expect(responseDelete.status).toBe(200);

    const responseGet = await request(app)
      .get(`/programmer/${responseCreate.body._id}`);
    expect(responseGet.status).toBe(404);
  });

  //NEGATIVE CASE
  // delete data programmer on record
  it("should be able to delete a programmer", async () => {
    const responseCreate = await request(app).post("/programmer").send({
      firstName: "Andi",
      lastName: "Wijayanto",
      age: 20,
      programmingLanguages: ['English', 'English'],
    });
    expect(responseCreate.status).toBe(200);

    const responseDelete = await request(app)
      .delete('/programmer/34');
    expect(responseDelete.status).toBe(500);
  });


})