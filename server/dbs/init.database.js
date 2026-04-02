const mongoose = require('mongoose');
const { host, port, name } = require('../configs/mongodb.config');
const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
    constructor() {
        this.connect();
    }

    connect(type = 'mongodb') {
        mongoose.connect(connectString).then(() => {
            console.log('Connected to MongoDB successfully');
        }).catch(err => console.log('Error connecting to MongoDB:', err));
    }


    // Implementing Singleton pattern
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

module.exports = Database.getInstance();