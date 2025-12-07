const generateRandomString = (len) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
    let token = '';
    for (let i = 0; i < len; i++){
        const randomIndex = Math.floor(Math.random() * chars.length);
        token += chars[randomIndex]
    }
    return token;
}

export default generateRandomString;