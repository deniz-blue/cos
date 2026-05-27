import { useInfiniteQuery } from "@tanstack/react-query";
import { database } from "./db";
import { parsePayload, Payload } from "./payload";

export interface ListItemRaw {
	id: number;
	payload: string;
	note: string;
	created_at: number;
}

export interface ListItem extends Omit<ListItemRaw, "payload"> {
	payload: Payload;
};

export const fetchItemsPage = async ({ pageParam = 0 }: { pageParam: number }) => {
	const limit = 20;

	const result = await (await database()).getAllAsync<ListItemRaw>(
		"SELECT * FROM list ORDER BY created_at DESC LIMIT ? OFFSET ?;",
		[limit, pageParam]
	);

	const parsedResult: ListItem[] = result.map(item => ({
		...item,
		payload: parsePayload(item.payload),
	}));

	return {
		data: parsedResult,
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
