const userModel = require("../models/user.model")
const bcrypt = require('bcryptjs');

exports.signUp = async (req, res) => {
    try {
        const { username = '', password = '' } = req.body;
        const hashPassword = await bcrypt.hash(password, 12);
        console.log({ username, password });
        const newUser = await userModel.create({ username, password: hashPassword });
        res.status(201).json({ error: false, data: newUser, message: 'signUp' });
    } catch (e) {
        return res.status(400).json({ error: true, data: null, message: e?.message })
    }
}

exports.login = async (req, res) => {
    const { username = '', password = '' } = req.body;
    try {
        const signalGetInfoUser = await userModel.findOne({ username });
        if (!signalGetInfoUser) return res.status(400).json({ error: true, data: null, message: 'username_not_exist' })
        if (!bcrypt.compareSync(password, signalGetInfoUser.password)) return res.status(400).json({ error: true, data: null, message: 'password_incorrect' })
        
        return res.status(200).json({error: false, data: {}, message: 'login_success'})
    } catch (e) {
        return res.status(400).json({ error: true, data: null, message: e?.message })
    }
}