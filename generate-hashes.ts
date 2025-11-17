import bcrypt from 'bcryptjs';

async function generatePasswords() {
  const adminPassword = 'Admin@112';
  const userPassword = 'User@123';

  const adminHash = await bcrypt.hash(adminPassword, 10);
  const userHash = await bcrypt.hash(userPassword, 10);

  console.log('Password Hashes Generated:');
  console.log('==========================');
  console.log(`Admin Password (Admin@112): ${adminHash}`);
  console.log(`User Password (User@123): ${userHash}`);
  console.log('\nUse these hashes in your database initialization script.');
}

generatePasswords().catch(console.error);
