import mySchema from "./mySchema";
import { integer, serial, varchar, index, unique } from "drizzle-orm/pg-core";
import clients from "./clients";


const selfies = mySchema.table("selfies", {
    selfyId: serial("selfy_id").primaryKey(),
    photoS3Key: varchar("photo_s3_key", { length: 255 }).notNull(),
    clientId: integer("client_id").references(() => clients.clientId).notNull()

}, (table) => ({
    selfiesClientIdIdx: index("selfies_client_id_idx").on(table.clientId),
    selfiesUniqueCol: unique("selfies_unique_col").on(table.photoS3Key, table.clientId)
})
)

export default selfies;
