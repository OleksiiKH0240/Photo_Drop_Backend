import mySchema from "./mySchema";
import { integer, serial, varchar } from "drizzle-orm/pg-core";
import roles from "./roles";


const users = mySchema.table("users", {
    userId: serial("user_id").primaryKey(),
    userRoleId: integer("user_role_id").references(() => roles.roleId).notNull(),
    username: varchar("username", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    fullname: varchar("fullname", { length: 255 }),
    email: varchar("email", { length: 255 })
})

export default users;
