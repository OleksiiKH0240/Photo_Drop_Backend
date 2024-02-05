import mySchema from "./mySchema";
import { serial, varchar, timestamp } from "drizzle-orm/pg-core";


const clients = mySchema.table("clients", {
    clientId: serial("client_id").primaryKey(),
    username: varchar("username", { length: 255 }).notNull().unique(),
    otp: varchar("otp", { length: 255 }),
    otpExpiredTimestamp: timestamp("otp_expired_timestamp"),
    fullname: varchar("fullname", { length: 255 }),
    email: varchar("email", { length: 255 })
})

export default clients;
