import mySchema from "./mySchema";
import { integer, index, boolean, unique } from "drizzle-orm/pg-core";
import clients from "./clients";
import albumsPhoto from "./albumsPhotos";


const photoClientRelations = mySchema.table("photo_client_relations", {
    photoId: integer("photo_id").references(() => albumsPhoto.photoId).notNull(),
    clientId: integer("client_id").references(() => clients.clientId).notNull(),
    isLocked: boolean("is_locked").default(true).notNull()
}, (table) => ({
    photoClientRelationsPhotoIdIdx: index("photo_client_relations_photo_id_idx").on(table.photoId),
    photoClientRelationsClientIdIdx: index("photo_client_relations_client_id_idx").on(table.clientId),
    photoClientRelationsUniqueCol: unique("photo_client_relations_unique_col").on(table.photoId, table.clientId)
}))

export default photoClientRelations;
