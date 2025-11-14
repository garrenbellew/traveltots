const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // SECURITY WARNING: This script is for LOCAL DEVELOPMENT ONLY
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ SECURITY ERROR: This script cannot be run in production!');
      process.exit(1);
    }
    
    // Check if admin exists
    const existingAdmin = await prisma.admin.findFirst({
      where: { username: 'admin' }
    });

    // Reset password to 'admin' (DEVELOPMENT ONLY - NEVER IN PRODUCTION)
    const hashedPassword = await bcrypt.hash('admin', 10);
    
    if (existingAdmin) {
      await prisma.admin.update({
        where: { username: 'admin' },
        data: { password: hashedPassword }
      });
      console.log('✅ Admin password reset to: admin');
    } else {
      await prisma.admin.create({
        data: {
          username: 'admin',
          password: hashedPassword,
          email: 'admin@traveltots.com',
          twoFactorEnabled: false,
        }
      });
      console.log('✅ Default admin user created:');
      console.log('   Username: admin');
      console.log('   Password: admin');
      console.log('   ⚠️  SECURITY WARNING: Default password for development only!');
    }
    
    console.log('   ⚠️  SECURITY: Change this password immediately after login!');
    console.log('   ⚠️  NEVER use default passwords in production!');
  } catch (error) {
    console.error('Error setting up local database:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

