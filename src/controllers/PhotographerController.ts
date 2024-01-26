import { Request, Response, NextFunction } from "express";
import photographerRep from "../database/repositories/PhotographerRep";
import userRep from "../database/repositories/UserRep";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


class PhotographerController {
    signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, password } = req.body;
            if (!(await userRep.hasUserWithUsername(username))) {
                const saltRounds = Number(process.env.SALT_ROUNDS);
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                const userRes = await userRep.addUser(1, username, hashedPassword);
                const userId = userRes[0].userId;
                await photographerRep.addPhotographer(userId);
                res.status(200).json({
                    message: "photographer was successfully signed up."
                })
            }
            else {
                res.status(400).json({ message: "user with this username already exist. try another username." })
            }
        }
        catch (error) {
            next(error);
        }
    }

    logIn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, password } = req.body;
            const user = await userRep.getUserByUsername(username);
            if (user !== undefined) {
                let isPasswordValid: boolean;
                if (user.password.match(/^\d+/) !== null) {
                    // test users case
                    isPasswordValid = user.password === password ? true : false;
                }
                else {
                    isPasswordValid = await bcrypt.compare(password, user.password);
                }

                if (isPasswordValid) {
                    const ttl = Number(process.env.JWT_TTL);
                    const JWT_SECRET = String(process.env.JWT_SECRET);
                    const token = jwt.sign({ username: user.username, roleId: user.userRoleId }, JWT_SECRET, { expiresIn: ttl });
                    res.status(200).json({
                        token,
                        message: "photographer was logged in."
                    });
                }
                else {
                    res.status(400).json({ message: "password is invalid." })
                }
            }
            else {
                res.status(400).json({ message: "user with this username does not exist. try another username." })
            }
        }
        catch (error) {
            next(error);
        }
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const photographers = await photographerRep.getPhotographers();
            res.status(200).json(photographers);
        }
        catch (error) {
            next(error);
        }
    }
}

export default new PhotographerController();
