const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    const usersToSeed = [
      {
        name: 'Admin',
        email: 'admin@gmail.com',
        password: 'Admin@123',
        role: 'admin',
      },
      {
        name: 'User One',
        email: 'user1@gmail.com',
        password: 'User1@123',
        role: 'user',
      },
      {
        name: 'User Two',
        email: 'user2@gmail.com',
        password: 'User2@123',
        role: 'user',
      }
    ];

    for (const userData of usersToSeed) {
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        console.log(`User already exists: ${existingUser.email} (${existingUser.role})`);
      } else {
        const newUser = await User.create(userData);
        console.log(`User seeded successfully:`);
        console.log(`  Name: ${newUser.name}`);
        console.log(`  Email: ${newUser.email}`);
        console.log(`  Role: ${newUser.role}`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedUsers();
