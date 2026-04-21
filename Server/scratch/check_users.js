const { User } = require('../models');

async function checkUsers() {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'email', 'isVerified', 'verifyOtp']
        });
        console.log(JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkUsers();
