import mongoose from 'mongoose';

const usersSchema = mongoose.Schema({
	name:String,
	lastName:String,
	login: String,
	email:String,
	hash: String,
	accesGroup: String
},{collection:"user"});
const UsersModel = mongoose.model("Users", usersSchema);
export default UsersModel;