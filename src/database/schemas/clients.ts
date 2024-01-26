import mySchema from "./mySchema";
import { integer, serial, varchar } from "drizzle-orm/pg-core";
import users from "./users";


const clients = mySchema.table("clients", {
    clientId: serial("client_id").primaryKey(),
    userId: integer("user_id").references(() => users.userId).notNull()
})

export default clients;
