import mySchema from "./mySchema";
import { serial, varchar } from "drizzle-orm/pg-core";


const photographers = mySchema.table("photographers", {
    photographerId: serial("photographer_id").primaryKey(),
    username: varchar("username", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    fullname: varchar("fullname", { length: 255 }),
    email: varchar("email", { length: 255 })
})

export default photographers;
