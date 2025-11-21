const generateToken = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
    let token = '';
    for (let i = 0; i < 30; i++){
        const randomIndex = Math.floor(Math.random() * chars.length);
        token += chars[randomIndex]
    }
    return token;
}

export default generateToken;