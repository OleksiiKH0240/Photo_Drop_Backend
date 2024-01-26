import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { db } from "../databaseConnection";
import { eq } from "drizzle-orm"
import clients from "../schemas/clients";


class ClientsRep {
    dbClient: NodePgDatabase<Record<string, never>>

    constructor(dbClient = db) {
        this.dbClient = dbClient;
    }

    init = async () => {
        await this.dbClient.insert(clients).values([
            { clientId: -1, userId: -3 },
        ]).onConflictDoNothing();
        console.log("test clients were created successfully.");
    }

    getClients = async () => {
        return await this.dbClient.select({
            clientId: clients.clientId,
            userId: clients.userId,
        }).from(clients);
    }

    addClient = async (userId: number) => {
        await this.dbClient.insert(clients).values({ userId });
    }
}

export default new ClientsRep();
