import mySchema from "./mySchema";
import { integer, serial, varchar, index, unique } from "drizzle-orm/pg-core";
import albums from "./albums";


const albumsPhotos = mySchema.table("albums_photos", {
    photoId: serial("photo_id").primaryKey(),
    photoS3Key: varchar("photo_s3_key", { length: 255 }).notNull(),
    albumId: integer("album_id").references(() => albums.albumId).notNull()

}, (table) => ({
    albumsPhotosAlbumIdIdx: index("albums_photos_album_id_idx").on(table.albumId),
    albumsPhotosUniqueCol: unique("albums_photos_unique_col").on(table.photoS3Key, table.albumId)
})
)

export default albumsPhotos;
