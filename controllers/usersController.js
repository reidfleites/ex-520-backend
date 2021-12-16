import UsersModel from '../models/users.js'
 
export const getUser = async (login) => {
    const user = await UsersModel.findOne({login:login})
    return user;
}
export const getAllUsers = async () => {
    const allUsers = await UsersModel.find({})
    return allUsers;
}
export const getMembers = async () => {
    const allUsers = await UsersModel.find({accesGroup:"member"})
    return allUsers;
}
export const acceptUser=async(login)=>{
    const user=await UsersModel.findOneAndUpdate({login:login},{accesGroup:"member"},{new:true})
    return user;
}