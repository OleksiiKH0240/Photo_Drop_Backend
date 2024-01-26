import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { db } from "../databaseConnection";
import roles from "../schemas/roles";


class RolesRep {
    dbClient: NodePgDatabase<Record<string, never>>

    constructor(dbClient = db) {
        this.dbClient = dbClient;
    }

    init = async () => {
        await this.dbClient.insert(roles).values([
            { roleId: 0, roleName: "admin" },
            { roleId: 1, roleName: "photographer" }, 
            { roleId: 2, roleName: "client" }]).onConflictDoNothing();
        console.log("all required roles were created successfully.")
    }
}

export default new RolesRep();
