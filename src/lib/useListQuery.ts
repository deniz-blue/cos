import AsyncStorage from "@react-native-async-storage/async-storage";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Payload } from "./payload";

export interface ListItem {
	id: string;
	payload: Payload;
	note: string;
	created_at: number;
};

export const fetchItemsPage = async ({ pageParam = 0 }: { pageParam: number }) => {
	const limit = 20;

	const result = await AsyncStorage.getItem("list") || "[]";
	const parsedList: ListItem[] = JSON.parse(result);
	const paginatedList = parsedList.slice(pageParam, pageParam + limit);

	return {
		data: paginatedList,
		nextOffset: result.length === limit ? pageParam + limit : null,
	};
};

export const useInfiniteListQuery = () => {
	return useInfiniteQuery({
		queryKey: ["items"],
		queryFn: fetchItemsPage,
		initialPageParam: 0,
		getNextPageParam: (lastPage) => lastPage.nextOffset,
	});
};
