import jwt from 'jsonwebtoken';
import config from 'config';

export default function createToken(data){
    const token = jwt.sign(data, config.get('private_key'));

    return token;
}