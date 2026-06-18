import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { serializePayload } from "./payload";
import { uid } from "./uid";
import { queryClient } from "./query-client";
import { ListItem } from "./useListQuery";

export interface NewListItem extends Omit<ListItem, "id" | "created_at"> { };
export interface UpdateListItem extends Pick<ListItem, "id">, Partial<Omit<ListItem, "id" | "created_at">> { };

export const getAll = async (): Promise<ListItem[]> => {
	const result = await AsyncStorage.getItem("list") || "[]";
	return JSON.parse(result) as ListItem[];
};

export type AddResult = { id: string; type: "added" } | { id: string; type: "exists" };

export const addToList = async (item: NewListItem): Promise<AddResult> => {
	const all = await getAll();

	const existing = all.find(existingItem => serializePayload(existingItem.payload) === serializePayload(item.payload));

	if (existing) return { id: existing.id, type: "exists" };

	const next: ListItem = {
		...item,
		id: uid(),
		created_at: Date.now(),
	};

	await AsyncStorage.setItem("list", JSON.stringify([next, ...all]));

	return { id: next.id, type: "added" };
};

export const updateListItem = async (item: UpdateListItem): Promise<void> => {
	const all = await getAll();
	const index = all.findIndex(existingItem => existingItem.id === item.id);
	if (index === -1) throw new Error("Item not found");

	const updatedItem = {
		...all[index],
		...item,
	};

	all[index] = updatedItem;
	await AsyncStorage.setItem("list", JSON.stringify(all));
};

export const deleteListItem = async (id: string): Promise<void> => {
	const all = await getAll();
	const updatedList = all.filter(item => item.id !== id);
	await AsyncStorage.setItem("list", JSON.stringify(updatedList));
};

export const useListMutation = () => {
	return useMutation({
		mutationFn: async (data: { type: "add"; item: NewListItem } | { type: "update"; item: UpdateListItem } | { type: "delete"; id: string }) => {
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
