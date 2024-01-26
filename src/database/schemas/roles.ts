import mySchema from "./mySchema";
import { integer, varchar } from "drizzle-orm/pg-core";


const roles = mySchema.table("roles", {
    roleId: integer("role_id").primaryKey(),
    roleName: varchar("role_name", { length: 255 }).notNull()
});

export default roles;
