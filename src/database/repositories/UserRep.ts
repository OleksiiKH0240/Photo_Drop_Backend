import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { db } from "../databaseConnection";
import { eq } from "drizzle-orm"
import users from "../schemas/users";
import roles from "../schemas/roles";


class UsersRep {
    dbClient: NodePgDatabase<Record<string, never>>

    constructor(dbClient = db) {
        this.dbClient = dbClient;
    }

    init = async () => {
        await this.dbClient.insert(users).values([
            { userId: -1, userRoleId: 0, username: "admin", password: "hashedPassword" },
            { userId: -2, userRoleId: 1, username: "photographer1", password: "hashedPassword" },
            { userId: -3, userRoleId: 2, username: "client1", password: "hashedPassword" },

        ]).onConflictDoNothing();
        console.log("test users were created successfully.");
    }

    getUsers = async () => {
        return await this.dbClient.select({
            userId: users.userId,
            roleName: roles.roleName,
            username: users.username,
            password: users.password
        }).from(users).innerJoin(roles, eq(users.userRoleId, roles.roleId));
    }

    getUserByUsername = async (username: string) => {
        return (await this.dbClient.select().from(users).where(eq(users.username, username)))[0];
    }

    hasUserWithUsername = async (username: string) => {
        const user = await this.getUserByUsername(username);
        return user === undefined ? false : true;
    }

    addUser = async (roleId: number, username: string, password: string) => {
        const result = await this.dbClient.insert(users).
            values({ userRoleId: roleId, username: username, password: password }).
            returning({ userId: users.userId });
        return result;
    }
}

export default new UsersRep();
