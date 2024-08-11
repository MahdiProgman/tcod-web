import mongoose from 'mongoose';

const disscountSchema = new mongoose.Schema({
    courses : {
        type : mongoose.Types.ObjectId,
        ref : 'course',
        required : true
    },
    type : {
        enum : ['percent', 'toman'],
        required : true
    },
    teacher : {
        type : mongoose.Types.ObjectId,
        ref : 'user',
        required : true,
    },
    amount : {
        type : Number,
        validate : {
            validator : (value)=>{
                return this.type == 'percent' ? value != null : true;
            }
        }
    },
    price : {
        type : Number,
        validate : {
            validator : (value)=> {
                return this.type == 'toman' ? value != null : true;
            }
        }
    },
    enableFor : {
        type : String,
        enum : ['all', 'some', 'one']
    },
    startDisscountDate : {
        type : String,
        required : true
    },
    endDisscountDate : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum : ['started', 'ended', 'not-yet']
    }
});

const Disscount = mongoose.model('disscount', disscountSchema);

export default Disscount;