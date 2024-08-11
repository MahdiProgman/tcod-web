import bcrypt from 'bcrypt';

export default async function hashData(data) {
    const salt = await bcrypt.genSalt(3);
    const hashedData = await bcrypt.hash(data, salt);

    return hashedData;
}