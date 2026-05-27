import { useMutation } from "@tanstack/react-query";
import { database } from "./db";
import { serializePayload } from "./payload";
import { queryClient } from "./query-client";
import { ListItem } from "./useListQuery";

export interface NewListItem extends Omit<ListItem, "id" | "created_at"> { };
export interface UpdateListItem extends Pick<ListItem, "id">, Partial<Omit<ListItem, "id" | "created_at">> { };

export const addToList = async (item: NewListItem): Promise<number | null> => {
	const db = await database();

	const payloadExists = await db.getFirstAsync(
		"SELECT id FROM list WHERE payload = ?;",
		[serializePayload(item.payload)]
	);

	if (payloadExists) return null;

	const result = await db.runAsync(
		"INSERT INTO list (payload, note, created_at) VALUES (?, ?, ?);",
		[serializePayload(item.payload), item.note, Date.now()]
	);

	return result.lastInsertRowId;
};

export const updateListItem = async (item: UpdateListItem): Promise<void> => {
	const fieldsToUpdate = [];
	const values = [];

	if (item.payload) {
		fieldsToUpdate.push("payload = ?");
		values.push(serializePayload(item.payload));
	}

	if (item.note) {
		fieldsToUpdate.push("note = ?");
		values.push(item.note);
	}

	if (fieldsToUpdate.length === 0) return;

	values.push(item.id);

	const query = `UPDATE list SET ${fieldsToUpdate.join(", ")} WHERE id = ?;`;

	await (await database()).runAsync(query, values);
};

export const deleteListItem = async (id: number): Promise<void> => {
	await (await database()).runAsync("DELETE FROM list WHERE id = ?;", [id]);
};

export const useListMutation = () => {
	return useMutation({
		mutationFn: async (data: { type: "add"; item: NewListItem } | { type: "update"; item: UpdateListItem } | { type: "delete"; id: number }) => {
			switch (data.type) {
				case "add":
					return await addToList(data.item);
				case "update":
					return await updateListItem(data.item);
				case "delete":
					return await deleteListItem(data.id);
			}
		},
		onError: (error) => {
			console.error("List mutation error:", error);
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["items"] });
		},
	});
}
