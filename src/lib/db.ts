import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";

let db: SQLiteDatabase | undefined;

export const database = async () => {
	if (db) return db;
	db = await openDatabaseAsync("db.sqlite");
	await db.execAsync("CREATE TABLE IF NOT EXISTS list (id INTEGER PRIMARY KEY, payload TEXT, note TEXT, created_at INTEGER);");
	return db;
};


