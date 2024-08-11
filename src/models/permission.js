import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
    user : {
        type : mongoose.Types.ObjectId,
        ref : 'user',
        required : true
    },
    role : {
        type : String,
        enum : ['teacher', 'admin'],
        required : true
    }
});

const Permission = mongoose.model('permission', permissionSchema);

export default Permission;