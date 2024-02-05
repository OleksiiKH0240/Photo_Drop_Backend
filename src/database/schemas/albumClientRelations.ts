import mySchema from "./mySchema";
import { integer, index, unique } from "drizzle-orm/pg-core";
import clients from "./clients";
import albums from "./albums";


const albumClientRelations = mySchema.table("album_client_relations", {
    albumId: integer("album_id").references(() => albums.albumId).notNull(),
    clientId: integer("client_id").references(() => clients.clientId).notNull()
}, (table) => ({
    albumsClientRelationsAlbumIdIdx: index("album_client_relations_album_id_idx").on(table.albumId),
    albumsClientRelationsClientIdIdx: index("album_client_relations_client_id_idx").on(table.clientId),
    albumClientRelationsUniqueCol: unique("album_client_relations_unique_col").on(table.albumId, table.clientId)
}))

export default albumClientRelations;
