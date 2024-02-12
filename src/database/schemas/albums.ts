import mySchema from "./mySchema";
import { integer, serial, varchar, index, date } from "drizzle-orm/pg-core";
import photographers from "./photographers";
import { sql } from "drizzle-orm";


const albums = mySchema.table("albums", {
    albumId: serial("album_id").primaryKey(),
    albumName: varchar("album_name", { length: 255 }).notNull(),
    albumLocation: varchar("album_location", { length: 255 }).notNull(),
    photographerId: integer("photographer_id").references(() => photographers.photographerId).notNull(),
    createdDate: date("created_date", { mode: "date" }).default(sql`date(now())`)
}, (table) => ({
    albumsPhotographerIdIdx: index("albums_photographer_id_idx").on(table.photographerId)
}))

export default albums;
