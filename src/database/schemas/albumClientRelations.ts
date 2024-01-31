import mySchema from "./mySchema";
import { integer, index } from "drizzle-orm/pg-core";
import clients from "./clients";
import albums from "./albums";


const albumClientRelations = mySchema.table("album_client_relations", {
    albumId: integer("album_id").references(() => albums.albumId).notNull(),
    clientId: integer("client_id").references(() => clients.clientId).notNull()
}, (table) => ({
    albumsPhotographerIdIdx: index("album_client_relations_photographer_id_idx").on(table.albumId),
    albumsClientIdIdx: index("album_client_relations_client_id_idx").on(table.clientId)
}))

export default albumClientRelations;
