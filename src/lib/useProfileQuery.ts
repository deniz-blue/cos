import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Payload } from "./payload";
import { queryClient } from "./query-client";

export const profileQueryKey = () => ["profile"] as const;

export const useProfileQuery = () => {
	return useQuery({
		queryKey: profileQueryKey(),
		queryFn: async () => {
			return await AsyncStorage.getItem("profile").then(s => s ? (JSON.parse(s) as Payload) : null);
		},
	});
};

export const useProfileMutation = () => {
	return useMutation({
		mutationFn: async (payload: Payload) => {
			await AsyncStorage.setItem("profile", JSON.stringify(payload));
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: profileQueryKey() });
		},
		onError: (err) => {
			console.error("Failed to save profile", err);
		},
	})
};
