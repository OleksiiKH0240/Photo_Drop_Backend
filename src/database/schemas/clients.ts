import mySchema from "./mySchema";
import { serial, varchar } from "drizzle-orm/pg-core";


const clients = mySchema.table("clients", {
    clientId: serial("client_id").primaryKey(),
    username: varchar("username", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    fullname: varchar("fullname", { length: 255 }),
    email: varchar("email", { length: 255 })
})

export default clients;
