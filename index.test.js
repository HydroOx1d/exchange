const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./index.js');
const Client = require('./model/Client.js');
const Admin = require('./model/Admin.js')

describe("create admin", () => {
  let data = {
    companyName: "Test company",
    website: "https://google.com",
    phoneNumber: "+996704041004",
    licenseNumber: "1",
    password: "123456"
  }

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_SERVER_TESTING)
  })

  it("create admin", async () => {
    const res = await request(app).post('/admin/register').send(data);

    expect(res.status).toBe(201);
    expect(res.body.resultCode).toBe(0)
    expect(res.body.data[0].message).toBe("Admin succesfully registered");
    expect(res.body.data[0].token).toBeTruthy()
  })

  it('create admin without some property', async () => {
    const { companyName, ...dataWithoutCompanyName } = data;

    const res = await request(app).post('/admin/register').send(dataWithoutCompanyName);
    
    expect(res.status).toBe(400);
    expect(res.body.resultCode).toBe(1);

    const errorsLength = res.body.data.errors.length
    expect(errorsLength).toBeGreaterThan(0)
  })

  afterEach(async () => {
    await Admin.deleteOne({companyName: data.companyName});
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })
})

describe("should login admin and create client", () => {
  let createAdminData = {
    companyName: "Test company",
    website: "https://google.com",
    phoneNumber: "+996704041004",
    licenseNumber: "1",
    password: "123456"
  }

  let loginAdminData = {
    companyName: createAdminData.companyName,
    password: createAdminData.password
  }

  let clientData = {
    firstName: 'Test',
    lastName: 'Client',
    phoneNumber: '1231234412',
    personType: 'legal',
    cryptoWallet: '0x11245414124124124124124124',
    volumes: 41212412
  }

  let dealData = {
    transactionCurrency: "USD",
    currency: "BTC",
    blockchainNetwork: "BSC",
    transactionAmount: 24100,
    exchangeMethod: "cash"
  }

  let loginToken;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_SERVER_TESTING)
  })

  it("create admin", async () => {
    const res = await request(app).post('/admin/register').send(createAdminData);

    expect(res.status).toBe(201);
    expect(res.body.resultCode).toBe(0)
    expect(res.body.data[0].message).toBe("Admin succesfully registered");
    expect(res.body.data[0].token).toBeTruthy()
  })

  it("login admin with correct data", async () => {
    const res = await request(app).post('/admin/login').send(loginAdminData);

    expect(res.status).toBe(200)

    expect(res.body.resultCode).toBe(0);
    expect(res.body.data[0].message).toBe("Successfully logged in");
    expect(res.body.data[0].token).toBeTruthy();

    loginToken = res.body.data[0].token
  })

  it("login admin with incorrect password", async () => {
    const res = await request(app).post('/admin/login').send({...loginAdminData, password: "asdasdas"});

    expect(res.status).toBe(400)
    expect(res.body.resultCode).toBe(1)
    expect(res.body.data[0].message).toBe('Incorrect company name or password')
  })

  it("login admin with incorrect company name", async () => {
    const res = await request(app).post('/admin/login').send({...loginAdminData, companyName: "Another company name"})

    expect(res.status).toBe(404)

    expect(res.body.resultCode).toBe(1);
    expect(res.body.data[0].message).toBe("Administrator not found")
  })

  it("check auth before login", async () => {
    const res = await request(app).get('/admin/me').set('Authorization', loginToken)

    expect(res.status).toBe(200)
    expect(res.body.resultCode).toBe(0)
    expect(res.body.data[0].companyName).toBe(createAdminData.companyName)
  })

  it("get client not created yet", async () => {
    const res = await request(app).get('/clients');

    expect(res.status).toBe(200);
    expect(res.body.resultCode).toBe(0)
    expect(res.body.data).toEqual([])
  })

  it("create client without token for creating client", async () => {
    const res = await request(app).post('/clients').send(clientData)

    expect(res.status).toBe(403);
    expect(res.body.resultCode).toBe(1)
    expect(res.body.data[0].message).toBe("You don't have rights")
  })

  it("create client with token but without some property", async () => {
    const { firstName, lastName, ...clientDataWithoutSomeProperty } = clientData
    const res = await request(app).post('/clients').set("Authorization", loginToken).send(clientDataWithoutSomeProperty);

    expect(res.status).toBe(400)
    expect(res.request.header.Authorization).toBe(loginToken)
    expect(res.body.resultCode).toBe(1)
    expect(res.body.data.errors.length).toBeGreaterThan(1)
  })

  it("create client", async () => {
    const res = await request(app).post('/clients').set("Authorization", loginToken).send(clientData);

    expect(res.status).toBe(201)
    expect(res.request.header.Authorization).toBe(loginToken)
    expect(res.body.resultCode).toBe(0)
    expect(res.body.data.length).toBeGreaterThan(0)
    
    expect(res.body.data[0].firstName).toBe(clientData.firstName);
    expect(res.body.data[0].lastName).toBe(clientData.lastName);
    expect(res.body.data[0].phoneNumber).toBe(clientData.phoneNumber);
    expect(res.body.data[0].personType).toBe(clientData.personType);
    expect(res.body.data[0].cryptoWallet).toBe(clientData.cryptoWallet);
    expect(res.body.data[0].volumes).toBe(clientData.volumes);
    expect(res.body.data[0].paymentHistory).toEqual([])

    clientData['_id'] = res.body.data[0]._id
  })

  it("get client by id", async () => {
    const res = await request(app).get('/clients/' + String(clientData._id));
    
    expect(res.status).toBe(200);
    expect(res.body.resultCode).toBe(0)
    expect(res.body.data[0]).toEqual({ ...clientData, paymentHistory: []})
  })

  it("get client by incorrect id", async () => {
    const res = await request(app).get('/clients/2131245115315sadasfas')

    expect(res.status).toBe(400);
    expect(res.body.resultCode).toBe(1)
    expect(res.body.data[0].message).toBe("Client id is invalid")
  })

  it("should return an array of clients where at least there is one client", async () => {
    const res = await request(app).get('/clients')

    expect(res.status).toBe(200)
    expect(res.body.resultCode).toBe(0)
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  })

  it("should create a deal with correct property", async () => {
    const res = await request(app).post('/clients/' + clientData._id + '/deal').set('Authorization', loginToken).send(dealData);

    expect(res.status).toBe(200);
    expect(res.body.resultCode).toBe(0)
    expect(res.body.data[0].paymentHistory[0]).toEqual({ ...dealData, _id: res.body.data[0].paymentHistory[0]._id})
  })

  it("should create a deal without some property", async () => {
    const {blockchainNetwork, ...dealWithoutSomeProperty} = dealData
    const res = await request(app).post('/clients/' + clientData._id + '/deal').set('Authorization', loginToken).send(dealWithoutSomeProperty);

    expect(res.status).toBe(400)
    expect(res.body.resultCode).toBe(1)
    expect(res.body.data.errors.length).toBeGreaterThan(0)
  })

  afterAll(async () => {
    await Admin.deleteOne({ companyName: createAdminData.companyName });
    await Client.deleteOne({ firstName: clientData.firstName });

    await mongoose.connection.close()
  })
})
