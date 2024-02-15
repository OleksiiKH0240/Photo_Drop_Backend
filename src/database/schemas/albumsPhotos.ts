import mySchema from "./mySchema";
import { timestamp, serial, integer, varchar, index, unique, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import albums from "./albums";


const albumsPhotos = mySchema.table("albums_photos", {
    photoId: serial("photo_id").primaryKey(),
    albumId: integer("album_id").references(() => albums.albumId),
    photoS3Key: varchar("photo_s3_key", { length: 255 }).notNull(),
    watermarkPhotoS3Key: varchar("watermark_photo_s3_key", { length: 255 }).notNull(),
    hasWatermark: boolean("has_watermark").default(false).notNull(),
    lastUpdated: timestamp("last_updated").default(sql`localtimestamp`).notNull()
}, (table) => ({
    albumsPhotosAlbumIdIdx: index("albums_photos_album_id_idx").on(table.albumId),
    albumsPhotosHasWatermarkIdx: index("albums_photos_has_watermark_idx").on(table.hasWatermark),
    albumsPhotosUniqueCol1: unique("albums_photos_unique_col1").on(table.photoS3Key),
    albumsPhotosUniqueCol2: unique("albums_photos_unique_col2").on(table.watermarkPhotoS3Key)
})
)

export default albumsPhotos;
