const mongoose = require('mongoose');
const passportlocalmongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;


const PassUserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	}
});

PassUserSchema.plugin(passportlocalmongoose);

module.exports = mongoose.model('PUser', PassUserSchema);