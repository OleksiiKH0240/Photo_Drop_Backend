import mySchema from "./mySchema";
import { integer, serial, varchar, index, boolean } from "drizzle-orm/pg-core";
import albums from "./albums";


const albumsPhotos = mySchema.table("albums_photos", {
    photoId: serial("photo_id").primaryKey(),
    photoS3Key: varchar("photo_s3_key", { length: 255 }),
    albumId: integer("album_id").references(() => albums.albumId).notNull(),
    isAlbumIcon: boolean("is_album_icon").default(false)

}, (table) => ({
    albumsPhotosAlbumIdIdx: index("albums_photos_album_id_idx").on(table.albumId)
})
)

export default albumsPhotos;
