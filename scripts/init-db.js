const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔧 Initializing database...');
    console.log('DATABASE_URL set:', process.env.DATABASE_URL ? 'YES' : 'NO');
    if (process.env.DATABASE_URL) {
      console.log('DATABASE_URL starts with:', process.env.DATABASE_URL.substring(0, 20));
    }
    
    // Check if admin exists
    const existingAdmin = await prisma.admin.findFirst({
      where: { username: 'admin' }
    });

    if (!existingAdmin) {
      // Create default admin user
      const hashedPassword = await bcrypt.hash('admin', 10);
      
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
      console.log('   ⚠️  SECURITY WARNING: This is a default password for development only!');
      console.log('   ⚠️  You MUST change this password immediately after first login!');
      console.log('   ⚠️  NEVER use default passwords in production!');
    } else {
      // Reset password to 'admin' if user already exists
      const hashedPassword = await bcrypt.hash('admin', 10);
      await prisma.admin.update({
        where: { username: 'admin' },
        data: { password: hashedPassword }
      });
      console.log('✅ Admin password reset to: admin');
      console.log('   ⚠️  SECURITY WARNING: This script resets to a default password!');
      console.log('   ⚠️  Only use this script in development environments!');
      console.log('   ⚠️  Change the password immediately after login!');
    }
    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    console.error('Error details:', error.message);
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

