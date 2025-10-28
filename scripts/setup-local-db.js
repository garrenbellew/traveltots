const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if admin exists
    const existingAdmin = await prisma.admin.findFirst({
      where: { username: 'admin' }
    });

    // Reset password to 'admin' (useful for development)
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
    }
    
    console.log('   ⚠️  Please change the password after login!');
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

