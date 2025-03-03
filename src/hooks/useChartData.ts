import { api } from "@/trpc/react";

export const useDistractionsData = (selectedVersion: string) => {
  const query = api.charts.getDistractionsData.useQuery({
    version: selectedVersion,
  });

  return {
    data: query.data,
    refetch: query.refetch,
    isLoading: query.isLoading,
  };
};

export const useMoodData = (selectedVersion: string) => {
  const query = api.charts.getMoodData.useQuery({
    version: selectedVersion,
  });

  return {
    data: query.data,
    refetch: query.refetch,
    isLoading: query.isLoading,
  };
};

export const useOverworkData = (selectedVersion: string) => {
  const query = api.charts.getOverworkData.useQuery({
    version: selectedVersion,
  });

  return {
    data: query.data,
    refetch: query.refetch,
    isLoading: query.isLoading,
  };
};

export const usePenaltyData = (selectedVersion: string) => {
  const query = api.charts.getPenaltyData.useQuery({
    version: selectedVersion,
  });

  return {
    data: query.data,
    refetch: query.refetch,
    isLoading: query.isLoading,
  };
};

export const useProductivityData = (selectedVersion: string) => {
  const query = api.charts.getProductivityData.useQuery({
    version: selectedVersion,
  });

  return {
    data: query.data,
    refetch: query.refetch,
    isLoading: query.isLoading,
  };
};

export const useSleepData = (selectedVersion: string) => {
  const query = api.charts.getSleepData.useQuery({
    version: selectedVersion,
  });

  return {
    data: query.data,
    refetch: query.refetch,
    isLoading: query.isLoading,
  };
};

export const useTodosData = (selectedVersion: string) => {
  const query = api.charts.getTodosData.useQuery({
    version: selectedVersion,
  });

  return {
    data: query.data,
    refetch: query.refetch,
    isLoading: query.isLoading,
  };
};

export const useWorkData = (selectedVersion: string) => {
  const query = api.charts.getWorkData.useQuery({
    version: selectedVersion,
  });

  return {
    data: query.data,
    refetch: query.refetch,
    isLoading: query.isLoading,
  };
};
