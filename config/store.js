const connectDB = require('./db');

// Real Mongoose Models
const User = require('../models/User');
const Patient = require('../models/Patient');
const Test = require('../models/Test');
const Bill = require('../models/Bill');
const Report = require('../models/Report');
const ClinicConfig = require('../models/ClinicConfig');

/** Lightweight helper delegating directly to Mongoose queries with .lean() where appropriate */
class StoreWrapper {
  constructor(model) {
    this.mongooseModel = model;
  }

  async find(filter = {}, sort = { createdAt: -1 }) {
    return await this.mongooseModel.find(filter).sort(sort).lean();
  }

  async findOne(filter = {}) {
    return await this.mongooseModel.findOne(filter).lean();
  }

  async findById(id) {
    return await this.mongooseModel.findById(id).lean();
  }

  async create(data) {
    return await this.mongooseModel.create(data);
  }

  async findByIdAndUpdate(id, update, options = { returnDocument: 'after' }) {
    return await this.mongooseModel.findByIdAndUpdate(id, update, options).lean();
  }

  async findByIdAndDelete(id) {
    return await this.mongooseModel.findByIdAndDelete(id).lean();
  }

  async countDocuments(filter = {}) {
    return await this.mongooseModel.countDocuments(filter);
  }

  async insertMany(docs) {
    return await this.mongooseModel.insertMany(docs);
  }

  async updateMany(filter = {}, update = {}) {
    return await this.mongooseModel.updateMany(filter, update);
  }

  async deleteMany(filter = {}) {
    return await this.mongooseModel.deleteMany(filter);
  }
}

module.exports = {
  connectDB,
  UserStore: new StoreWrapper(User),
  PatientStore: new StoreWrapper(Patient),
  TestStore: new StoreWrapper(Test),
  BillStore: new StoreWrapper(Bill),
  ReportStore: new StoreWrapper(Report),
  ConfigStore: new StoreWrapper(ClinicConfig),
  MongooseModels: {
    User,
    Patient,
    Test,
    Bill,
    Report,
    ClinicConfig
  }
};
