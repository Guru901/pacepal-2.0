import { api } from "@/trpc/react";

export const useDistractionsData = (
  userId: string,
  selectedVersion: string,
) => {
  const query = api.charts.getDistractionsData.useQuery({
    id: userId,
    version: selectedVersion,
  });

  return {
    data: query.data,
    refetch: query.refetch,
    isLoading: query.isLoading,
  };
};

export const useMoodData = (userId: string, selectedVersion: string) => {
  const query = api.charts.getMoodData.useQuery({
    id: userId,
    version: selectedVersion,
  });

  return {
    data: query.data,
    refetch: query.refetch,
    isLoading: query.isLoading,
  };
};

export const useOverworkData = (userId: string, selectedVersion: string) => {
  const query = api.charts.getOverworkData.useQuery({
    id: userId,
    version: selectedVersion,
  });

  return {
    data: query.data,
    refetch: query.refetch,
    isLoading: query.isLoading,
  };
};

export const usePenaltyData = (userId: string, selectedVersion: string) => {
  const query = api.charts.getPenaltyData.useQuery({
    id: userId,
    version: selectedVersion,
  });

  return {
    data: query.data,
    refetch: query.refetch,
    isLoading: query.isLoading,
  };
};

export const useProductivityData = (
  userId: string,
  selectedVersion: string,
) => {
  const query = api.charts.getProductivityData.useQuery({
    id: userId,
    version: selectedVersion,
  });

  return {
    data: query.data,
    refetch: query.refetch,
    isLoading: query.isLoading,
  };
};

export const useSleepData = (userId: string, selectedVersion: string) => {
  const query = api.charts.getSleepData.useQuery({
    id: userId,
    version: selectedVersion,
  });

  return {
    data: query.data,
    refetch: query.refetch,
    isLoading: query.isLoading,
  };
};

export const useTodosData = (userId: string, selectedVersion: string) => {
  const query = api.charts.getTodosData.useQuery({
    id: userId,
    version: selectedVersion,
  });

  return {
    data: query.data,
    refetch: query.refetch,
    isLoading: query.isLoading,
  };
};

export const useWorkData = (userId: string, selectedVersion: string) => {
  const query = api.charts.getWorkData.useQuery({
    id: userId,
    version: selectedVersion,
  });

  return {
    data: query.data,
    refetch: query.refetch,
    isLoading: query.isLoading,
  };
};
