import User from "../models/user"

export default async (req, res, next) => {
    const userFound = await User.findById(req.user._id);
    if(userFound.emailVerified){
        next();
    } else {
        res.status(400).json({
            message : 'user email is not verified',
            errors : [
                {
                    field : 'Authorization',
                    error : 'ایمیل کاربر تایید نشده لطفا اول ایمیل خود را تایید کنید'
                }
            ]
        });
    }
}