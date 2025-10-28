const User = require('../models/User');

// Create default admin user if none exists
const createDefaultAdmin = async () => {
  try {
    // Check if any admin exists
    const adminExists = await User.findOne({ role: 'admin' });

    if (!adminExists) {
      // Get admin credentials from environment or use defaults
      const adminData = {
        firstName: process.env.ADMIN_FIRST_NAME || 'Admin',
        lastName: process.env.ADMIN_LAST_NAME || 'User',
        email: process.env.ADMIN_EMAIL || 'admin@surkhepunjab.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123',
        phone: process.env.ADMIN_PHONE || '+919876543210',
        role: 'admin',
        isActive: true
      };

      const admin = await User.create(adminData);
      
      console.log('✅ Default admin user created successfully');
      console.log(`📧 Email: ${admin.email}`);
      console.log(`🔑 Password: ${adminData.password}`);
      console.log('⚠️  Please change the password after first login!');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error.message);
  }
};

module.exports = createDefaultAdmin;
