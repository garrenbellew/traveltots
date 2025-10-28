const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    
    // Get all admins
    const admins = await prisma.admin.findMany();
    console.log('Found admins:', admins.length);
    
    // Reset password for admin
    const hashedPassword = await bcrypt.hash('admin', 10);
    
    // Try to update
    const updated = await prisma.admin.updateMany({
      where: { username: 'admin' },
      data: { password: hashedPassword }
    });
    
    console.log('Updated admins:', updated.count);
    
    // Verify password
    const admin = await prisma.admin.findUnique({
      where: { username: 'admin' }
    });
    
    if (admin) {
      const matches = await bcrypt.compare('admin', admin.password);
      console.log('Password verification:', matches ? '✅ Matches' : '❌ Does not match');
      console.log('Admin details:');
      console.log('  ID:', admin.id);
      console.log('  Username:', admin.username);
      console.log('  Email:', admin.email);
      console.log('  Password hash:', admin.password.substring(0, 20) + '...');
    } else {
      console.log('No admin user found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

