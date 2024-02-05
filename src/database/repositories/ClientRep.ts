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
                otp: "123456",
                otpExpiredTimestamp: new Date(Date.now() + 3000),
                email: "client1@gmail.com",
                fullname: "client1_fullname"
            },
            {
                clientId: -2,
                username: "+380963323507",
                otp: "123456",
                otpExpiredTimestamp: new Date(Date.now() + 5000),
                email: "client2@gmail.com",
                fullname: "client2_fullname"
            },
        ]).onConflictDoNothing();
        console.log("test clients were created successfully.");
    }

    getClientByUsername = async (username: string) => {
        return (await this.dbClient.select().from(clients).where(eq(clients.username, username)))[0];
    }

    hasClientWithUsername = async (username: string) => {
        const client = await this.getClientByUsername(username);
        return client === undefined ? false : true;
    }

    addClient = async (username: string, email?: string, fullname?: string) => {
        await this.dbClient.insert(clients).values({ username, email, fullname });
    }

    setClientOtp = async (username: string, otp: string, otpExpiredTimestamp: Date) => {
        await this.dbClient.update(clients).set({ otp, otpExpiredTimestamp }).where(eq(clients.username, username));
    }

    getAlbumsByClientId = async (clientId: number) => {
        return await this.dbClient.select().from(albumClientRelations).where(eq(albumClientRelations.clientId, clientId))
    }
}

export default new ClientsRep();
