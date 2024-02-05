import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { db } from "../databaseConnection";
import { eq } from "drizzle-orm"
import clients from "../schemas/clients";
import albumClientRelations from "../schemas/albumClientRelations";


class ClientsRep {
    dbClient: NodePgDatabase<Record<string, never>>

    constructor(dbClient = db) {
        this.dbClient = dbClient;
    }

    init = async () => {
        await this.dbClient.insert(clients).values([
            {
                clientId: -1,
                username: "+380963363207",
                password: "123456",
                email: "client1@gmail.com",
                fullname: "client1_fullname"
            },
            {
                clientId: -2,
                username: "+380963323507",
                password: "123456",
                email: "client2@gmail.com",
                fullname: "client2_fullname"
            },
        ]).onConflictDoNothing();
        console.log("test clients were created successfully.");
    }

    getClients = async () => {
        return await this.dbClient.select().from(clients);
    }

    addClient = async (username: string, password: string, email?: string, fullname?: string) => {
        await this.dbClient.insert(clients).values({ username, password, email, fullname });
    }

    getAlbumsByClientId = async (clientId: number) => {
        return await this.dbClient.select().from(albumClientRelations).where(eq(albumClientRelations.clientId, clientId))
    }
}

export default new ClientsRep();
