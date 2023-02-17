const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./index.js');
const Client = require('./model/Client.js');
const Admin = require('./model/Admin.js')
const bcrypt = require('bcrypt')

describe("get empty client", () => {
  beforeEach(async () => {
    await mongoose.connect(process.env.MONGODB_SERVER)
  })

  it("empty", async () => {
    const res = await request(app).get('/clients');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: [],
      resultCode: 0
    });
  })

  afterEach(async () => {
    await mongoose.connection.close();
  })
})

describe("create client and get it", () => {
  let data = {
    firstName: 'Test',
    lastName: 'Client',
    phoneNumber: '1231234412',
    personType: 'legal',
    cryptoWallet: '0x11245414124124124124124124',
    currency: 'USDT',
    blockchainNetwork: 'BSC',
    volumes: 41212412,
    paymentHistory: [],
    exchangeMethod: 'cash',
    transactionAmount: 123123,
    transactionCurrency: 'KGS'
  }

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_SERVER)

    const doc = new Client(data)

    const client = await doc.save()

    data['_id'] = client._id;
    data['__v'] = client.__v;
  })

  it("should get client", async () => {
    const res = await request(app).get('/clients');

    expect(res.status).toBe(200);
    
    const resData = res.body;

    expect(resData.resultCode).toBe(0)

    expect(resData.data[0].firstName).toBe(data.firstName);
    expect(resData.data[0].lastName).toBe(data.lastName);
    expect(resData.data[0].phoneNumber).toBe(data.phoneNumber);
    expect(resData.data[0].personType).toBe(data.personType);
    expect(resData.data[0].cryptoWallet).toBe(data.cryptoWallet);
    expect(resData.data[0].currency).toBe(data.currency);
    expect(resData.data[0].blockchainNetwork).toBe(data.blockchainNetwork);
    expect(resData.data[0].volumes).toBe(data.volumes);
    expect(resData.data[0].paymentHistory).toEqual(data.paymentHistory);
    expect(resData.data[0].exchangeMethod).toBe(data.exchangeMethod);
    expect(resData.data[0].transactionAmount).toBe(data.transactionAmount);
    expect(resData.data[0].transactionCurrency).toBe(data.transactionCurrency);
  })

  afterAll(async () => {
    await Client.deleteOne({ _id: data._id });

    await mongoose.connection.close()
  })
})


describe("create admin", () => {
  let data = {
    companyName: "Test company",
    website: "https://google.com",
    phoneNumber: "+996704041004",
    licenseNumber: "1",
    password: "123456"
  }

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_SERVER)
  })

  it("create admin", async () => {
    const res = await request(app).post('/admin/register').send(data);

    expect(res.status).toBe(201);
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