import mySchema from "./mySchema";
import { integer, serial, varchar } from "drizzle-orm/pg-core";
import users from "./users";


const photographers = mySchema.table("photographers", {
    photographerId: serial("photographer_id").primaryKey(),
    userId: integer("user_id").references(() => users.userId).notNull()
})

export default photographers;
