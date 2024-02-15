import mySchema from "./mySchema";
import { timestamp, serial, varchar, index, unique, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";


const photos = mySchema.table("photos", {
    photoId: serial("photo_id").primaryKey(),
    photoS3Key: varchar("photo_s3_key", { length: 255 }).notNull(),
    watermarkPhotoS3Key: varchar("watermark_photo_s3_key", { length: 255 }).notNull(),
    hasWatermark: boolean("has_watermark").default(false).notNull(),
    lastUpdated: timestamp("last_updated").default(sql`localtimestamp`).notNull()
}, (table) => ({
    albumsPhotosHasWatermarkIdx: index("photos_has_watermark_idx").on(table.hasWatermark),
    albumsPhotosUniqueCol1: unique("photos_unique_col1").on(table.photoS3Key),
    albumsPhotosUniqueCol2: unique("photos_unique_col2").on(table.watermarkPhotoS3Key)
})
)

export default photos;
