import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "../databaseConnection";
import photographersRep from "./PhotographerRep";
import clientsRep from "./ClientRep";


class InitialRep {
    dbClient: NodePgDatabase<Record<string, never>>

    constructor(dbClient = db) {
        this.dbClient = dbClient
    }

    init = async () => {
        await this.migrate();
        await photographersRep.init();
        await clientsRep.init();
    }

    migrate = async () => {
        await migrate(this.dbClient, { migrationsFolder: "./drizzle" });
        console.log("migrations were done successfully.");
    }
}

export default new InitialRep();
