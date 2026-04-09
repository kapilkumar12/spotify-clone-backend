const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

async function userRegister(req,res) {

    const { username,email,password,role = "user" } = req.body;

    const isUserAlreadyRegister = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserAlreadyRegister) {
        return res.status(409).json({
            message: "User already exists"
        })
    }

    const hash = await bcrypt.hash(password,10)


    try {

        const user = await userModel.create({
            username,
            email,
            password: hash,
            role
        })

        const token = jwt.sign({ id: user._id,role: user.role },process.env.JWT_SECRET)

        res.cookie('token',token,{
            httpOnly: true,
            secure: false, // production me true
            sameSite: 'lax'
        })

        res.status(201).json({
            message: "User is successfully register",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {

        res.status(400).json({
            message: "User register failed",
            error: error.message
        })

    }


}

async function userLogin(req,res) {

    try {

            const { username,email,password } = req.body;

    const user = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (!user) {
        return res.status(401).json({
            message: "Invalid credentils"
        })
    }

    const isPasswordValid = await bcrypt.compare(password,user.password)

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid credentils"
        })
    }

        const token = jwt.sign({
            id: user._id,
            role: user.role
        },process.env.JWT_SECRET)

        res.cookie('token',token,{
            httpOnly: true,
            secure: false, // production me true
            sameSite: 'lax'
        })

        res.status(200).json({
            message: "User logged in successfull",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {

        res.status(500).json({
            message: 'Login failed',
            error: error.message
        })

    }


}

async function userLogout(req,res) {
    res.clearCookie('token')
    res.status(200).json({
        message: "User logged out successfully"
    })
}

module.exports = { userRegister,userLogin,userLogout }