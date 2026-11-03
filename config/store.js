const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');

// Real Mongoose Models
const MongooseUser = require('../models/User');
const MongoosePatient = require('../models/Patient');
const MongooseTest = require('../models/Test');
const MongooseBill = require('../models/Bill');
const MongooseReport = require('../models/Report');
const MongooseClinicConfig = require('../models/ClinicConfig');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'clinic_data.json');

let isMongoConnected = false;
let memoryStore = {
  users: [],
  patients: [],
  tests: [],
  bills: [],
  reports: [],
  configs: []
};

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadFromDisk() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      if (content.trim()) {
        memoryStore = JSON.parse(content);
      }
    }
  } catch (err) {
    console.error('Error reading clinic_data.json:', err.message);
  }
}

function saveToDisk() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving clinic_data.json:', err.message);
  }
}

loadFromDisk();

function generateObjectId() {
  return crypto.randomBytes(12).toString('hex');
}

function matchFilter(doc, filter) {
  if (!filter || Object.keys(filter).length === 0) return true;
  for (const key of Object.keys(filter)) {
    if (key === '$or' && Array.isArray(filter.$or)) {
      const anyMatch = filter.$or.some(subFilter => matchFilter(doc, subFilter));
      if (!anyMatch) return false;
      continue;
    }
    const val = filter[key];
    const docVal = doc[key];

    if (key === 'isActive' && val === true) {
      if (docVal === false) return false;
      continue;
    }

    if (val && typeof val === 'object' && '$ne' in val) {
      if (docVal === val.$ne) return false;
      continue;
    }

    if (val && typeof val === 'object' && val instanceof RegExp) {
      if (!val.test(String(docVal || ''))) return false;
    } else if (val && typeof val === 'object' && ('$regex' in val || '$options' in val)) {
      const reg = new RegExp(val.$regex, val.$options || 'i');
      if (!reg.test(String(docVal || ''))) return false;
    } else if (val && typeof val === 'object' && '$in' in val) {
      if (!val.$in.includes(docVal)) return false;
    } else if (val && typeof val === 'object' && ('$gte' in val || '$lte' in val)) {
      const dDate = new Date(docVal).getTime();
      if ('$gte' in val && dDate < new Date(val.$gte).getTime()) return false;
      if ('$lte' in val && dDate > new Date(val.$lte).getTime()) return false;
    } else {
      if (String(docVal) !== String(val)) return false;
    }
  }
  return true;
}

class CollectionStore {
  constructor(name, mongooseModel) {
    this.name = name;
    this.mongooseModel = mongooseModel;
  }

  async find(filter = {}, sort = { createdAt: -1 }) {
    if (isMongoConnected) {
      return await this.mongooseModel.find(filter).sort(sort).lean();
    }
    let list = memoryStore[this.name].filter(doc => matchFilter(doc, filter));
    if (sort) {
      const [field, dir] = Object.entries(sort)[0] || ['createdAt', -1];
      list.sort((a, b) => {
        const aVal = a[field] || '';
        const bVal = b[field] || '';
        if (aVal < bVal) return dir === 1 ? -1 : 1;
        if (aVal > bVal) return dir === 1 ? 1 : -1;
        return 0;
      });
    }
    return JSON.parse(JSON.stringify(list));
  }

  async findOne(filter = {}) {
    if (isMongoConnected) {
      return await this.mongooseModel.findOne(filter).lean();
    }
    const doc = memoryStore[this.name].find(item => matchFilter(item, filter));
    return doc ? JSON.parse(JSON.stringify(doc)) : null;
  }

  async findById(id) {
    if (isMongoConnected) {
      return await this.mongooseModel.findById(id).lean();
    }
    const doc = memoryStore[this.name].find(item => String(item._id) === String(id));
    return doc ? JSON.parse(JSON.stringify(doc)) : null;
  }

  async create(data) {
    if (isMongoConnected) {
      return await this.mongooseModel.create(data);
    }
    const now = new Date().toISOString();
    const newDoc = {
      _id: generateObjectId(),
      ...data,
      createdAt: now,
      updatedAt: now
    };
    memoryStore[this.name].unshift(newDoc);
    saveToDisk();
    return JSON.parse(JSON.stringify(newDoc));
  }

  async findByIdAndUpdate(id, update, options = { new: true }) {
    if (isMongoConnected) {
      return await this.mongooseModel.findByIdAndUpdate(id, update, options).lean();
    }
    const index = memoryStore[this.name].findIndex(item => String(item._id) === String(id));
    if (index === -1) return null;

    const current = memoryStore[this.name][index];
    const updated = {
      ...current,
      ...update,
      _id: current._id,
      updatedAt: new Date().toISOString()
    };
    memoryStore[this.name][index] = updated;
    saveToDisk();
    return JSON.parse(JSON.stringify(updated));
  }

  async findByIdAndDelete(id) {
    if (isMongoConnected) {
      return await this.mongooseModel.findByIdAndDelete(id).lean();
    }
    const index = memoryStore[this.name].findIndex(item => String(item._id) === String(id));
    if (index === -1) return null;
    const deleted = memoryStore[this.name].splice(index, 1)[0];
    saveToDisk();
    return JSON.parse(JSON.stringify(deleted));
  }

  async countDocuments(filter = {}) {
    if (isMongoConnected) {
      return await this.mongooseModel.countDocuments(filter);
    }
    return memoryStore[this.name].filter(doc => matchFilter(doc, filter)).length;
  }

  async insertMany(docs) {
    if (isMongoConnected) {
      return await this.mongooseModel.insertMany(docs);
    }
    const now = new Date().toISOString();
    const created = docs.map(d => ({
      _id: d._id || generateObjectId(),
      ...d,
      createdAt: now,
      updatedAt: now
    }));
    memoryStore[this.name].push(...created);
    saveToDisk();
    return JSON.parse(JSON.stringify(created));
  }
}

const UserStore = new CollectionStore('users', MongooseUser);
const PatientStore = new CollectionStore('patients', MongoosePatient);
const TestStore = new CollectionStore('tests', MongooseTest);
const BillStore = new CollectionStore('bills', MongooseBill);
const ReportStore = new CollectionStore('reports', MongooseReport);
const ConfigStore = new CollectionStore('configs', MongooseClinicConfig);

async function connectDB() {
  const mongoURI = process.env.MONGODB_URI;
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000
    });
    isMongoConnected = true;
    console.log(`[Clinic DB] Connected to MongoDB: ${mongoose.connection.host}`);
  } catch (err) {
    isMongoConnected = false;
    console.log(`[Clinic DB] Note: Local MongoDB not reachable (${err.message}).`);
    console.log(`[Clinic DB] Successfully activated Built-In JSON Document Store at ${DATA_FILE}`);
  }
}

module.exports = {
  connectDB,
  isMongoConnected: () => isMongoConnected,
  UserStore,
  PatientStore,
  TestStore,
  BillStore,
  ReportStore,
  ConfigStore,
  MongooseModels: {
    User: MongooseUser,
    Patient: MongoosePatient,
    Test: MongooseTest,
    Bill: MongooseBill,
    Report: MongooseReport,
    ClinicConfig: MongooseClinicConfig
  }
};
