import { db, PG_DATABASE } from "../databaseConnection";
import { pgSchema } from "drizzle-orm/pg-core";


const mySchema = pgSchema(PG_DATABASE!);

export default mySchema;
