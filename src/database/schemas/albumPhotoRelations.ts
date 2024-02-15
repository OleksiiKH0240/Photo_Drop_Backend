import mySchema from "./mySchema";
import { integer, index, unique } from "drizzle-orm/pg-core";
import albums from "./albums";
import photos from "./photos";


const albumPhotoRelations = mySchema.table("album_photo_relations", {
    photoId: integer("photo_id").references(() => photos.photoId).notNull(),
    albumId: integer("album_id").references(() => albums.albumId).notNull()
}, (table) => ({
    photoClientRelationsPhotoIdIdx: index("photo_album_relations_photo_id_idx").on(table.photoId),
    photoClientRelationsClientIdIdx: index("photo_album_relations_album_id_idx").on(table.albumId),
    photoClientRelationsUniqueCol: unique("photo_album_relations_unique_col").on(table.photoId, table.albumId)
})
)

export default albumPhotoRelations;
