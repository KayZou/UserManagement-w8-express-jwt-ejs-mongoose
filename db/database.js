const mongoose = require('mongoose');
exports.connection = () =>{
    function connectToMongo() {
        mongoose.connect(database.uri, database.options).then(
            () => { },
            (err) => {
                console.info('Mongodb error', err);
            }
        )
            .catch((err) => {
                console.log('ERROR:', err);
            });
    }

    mongoose.connection.on('connected', () => {
        console.info('Connected to MongoDB ✓');
    });

    mongoose.connection.on('reconnected', () => {
        console.info('MongoDB reconnected!');
    });

    mongoose.connection.on('error', (error) => {
        console.error(`Error in MongoDb connection: ${error}`);
        mongoose.disconnect();
    });

    mongoose.connection.on('disconnected', () => {
        console.error(
            `MongoDB disconnected! Reconnecting in ${2000 / 1000
            }s...`
        );
        setTimeout(() => connectToMongo(), 2000);
    });

    return {
        connectToMongo
    };
}