import mySchema from "./mySchema";
import { integer, serial, varchar, index, boolean, unique } from "drizzle-orm/pg-core";
import albums from "./albums";


const albumsPhotos = mySchema.table("albums_photos", {
    photoId: serial("photo_id").primaryKey(),
    photoS3Key: varchar("photo_s3_key", { length: 255 }).notNull(),
    albumId: integer("album_id").references(() => albums.albumId).notNull(),
    isAlbumIcon: boolean("is_album_icon").default(false).notNull(),

}, (table) => ({
    albumsPhotosAlbumIdIdx: index("albums_photos_album_id_idx").on(table.albumId),
    albumsPhotosUniqueCol: unique("albums_photos_unique_col").on(table.albumId, table.photoS3Key)
})
)

export default albumsPhotos;
