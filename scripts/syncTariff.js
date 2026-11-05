const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const connectDB = require('../config/db');
const { MongooseModels } = require('../config/store');
const tariffMaster = require('../data/tariffMaster');

async function sync() {
  console.log('🔄 Connecting to MongoDB to synchronize Test Tariff...');
  await connectDB();

  const Test = MongooseModels.Test;
  console.log(`📋 Total master tests to synchronize: ${tariffMaster.length}`);

  let created = 0;
  let updated = 0;

  for (const t of tariffMaster) {
    const existing = await Test.findOne({ code: t.code });
    if (!existing) {
      await Test.create({ ...t, isActive: true });
      created++;
      console.log(`   ➕ Created: [${t.code}] ${t.name} (₹${t.price})`);
    } else {
      await Test.updateOne(
        { code: t.code },
        {
          $set: {
            name: t.name,
            category: t.category,
            sampleType: t.sampleType,
            price: t.price,
            turnaroundTime: t.turnaroundTime,
            testType: t.testType,
            parameters: t.parameters,
            isActive: true
          }
        }
      );
      updated++;
      console.log(`   🔄 Updated: [${t.code}] ${t.name} (₹${t.price})`);
    }
  }

  const finalCount = await Test.countDocuments({ isActive: true });
  console.log('\n=============================================');
  console.log(`✅ Tariff Sync Complete!`);
  console.log(`   Created: ${created}`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Active Tests in Database: ${finalCount}`);
  console.log('=============================================\n');

  process.exit(0);
}

sync().catch((err) => {
  console.error('❌ Error synchronizing tariff:', err);
  process.exit(1);
});
