import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { Payload } from "./payload";

export interface ListItem {
	id: string;
	payload: Payload;
	note: string;
	created_at: number;
};

export const fetchList = async (): Promise<ListItem[]> => {
	const result = await AsyncStorage.getItem("list") || "[]";
	return JSON.parse(result);
};

export const useListQuery = () => {
	return useQuery({
		queryKey: ["items"],
		queryFn: fetchList,
	});
};
