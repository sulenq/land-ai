import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useRequest from "@/hooks/useRequest";
import useRenderTrigger from "@/context/useRenderTrigger";
import { useLoadingBar } from "@/context/useLoadingBar";

interface Props<T> {
  initialData?: T;
  dummyData?: T;
  url?: string;
  method?: string;
  payload?: any;
  params?: any;
  dependencies?: any[];
  conditions?: boolean;
  noRt?: boolean;
  initialPage?: number;
  initialLimit?: number;
  intialOffset?: number;
  dataResource?: boolean;
  loadingBar?: boolean;
  loadingBarInitialOnly?: boolean;
}

const useDataState = <T = any>({
  initialData,
  dummyData,
  payload,
  params,
  url,
  method,
  dependencies = [],
  conditions = true,
  noRt = false,
  initialPage = 1,
  initialLimit = 15,
  dataResource = true,
  loadingBar = true,
  loadingBarInitialOnly = false,
}: Props<T>) => {
  const setLoadingBar = useLoadingBar((s) => s.setLoadingBar);
  const { rt } = useRenderTrigger();

  const abortControllerRef = useRef<AbortController | null>(null);
  const paginationRef = useRef<any>(null);
  const hasFetchedRef = useRef(false);
  const hasShownLoadingBarRef = useRef(false);

  const [data, setData] = useState<T | undefined>(dummyData || initialData);
  const [initialLoading, setInitialLoading] = useState<boolean>(!!url);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [loadingLoadMore, setLoadingLoadMore] = useState(false);

  const { req, loading, error, response, status } = useRequest({
    id: url || "data-state",
    showLoadingToast: false,
    showErrorToast: true,
    showSuccessToast: false,
  });

  const config = useMemo(() => {
    if (!url) return null;

    return {
      url,
      method,
      data: { ...payload, limit, page },
      params: { ...(dataResource ? { limit, page } : {}), ...params },
    };
  }, [url, method, payload, params, limit, page, dataResource]);

  const makeRequest = useCallback(() => {
    if (!config || !conditions) return;

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (!hasFetchedRef.current) {
      setInitialLoading(true);
    }

    req({
      config: { ...config, signal: controller.signal },
      onResolve: {
        onSuccess: (r) => {
          paginationRef.current = r?.data?.data?.pagination;
          setData(
            dummyData ??
              (dataResource
                ? Array.isArray(r?.data?.data)
                  ? r?.data?.data
                  : r?.data?.data?.data
                : r?.data?.data),
          );
          hasFetchedRef.current = true;
          hasShownLoadingBarRef.current = true;
          setInitialLoading(false);
        },
        onError: () => {
          hasFetchedRef.current = true;
          hasShownLoadingBarRef.current = true;
          setInitialLoading(false);
        },
      },
    });
  }, [config, conditions, dummyData, dataResource, req]);

  const onRetry = useCallback(() => {
    makeRequest();
  }, [makeRequest]);

  const loadMore = useCallback(() => {
    if (!config) return;

    setLoadingLoadMore(true);

    req({
      config,
      onResolve: {
        onSuccess: (r) => {
          setData((prev: any) =>
            prev ? [...prev, ...r?.data?.data] : r?.data?.data,
          );
          paginationRef.current = r?.data?.pagination;
          setLoadingLoadMore(false);
        },
      },
    });
  }, [config, req]);

  useEffect(() => {
    if (!url || !conditions) return;

    makeRequest();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [url, page, limit, ...(noRt ? [] : [rt]), ...dependencies]);

  useEffect(() => {
    if (!loadingBar || !conditions) return;

    if (!loadingBarInitialOnly) {
      setLoadingBar(loading);
      return;
    }

    if (!hasShownLoadingBarRef.current && initialLoading) {
      setLoadingBar(true);
      return;
    }

    if (hasShownLoadingBarRef.current) {
      setLoadingBar(false);
    }
  }, [loading, initialLoading, conditions, loadingBarInitialOnly]);

  return {
    data,
    setData,
    initialLoading,
    loading,
    error,
    loadMore,
    loadingLoadMore,
    pagination: paginationRef.current,
    page,
    setPage,
    limit,
    setLimit,
    response,
    status,
    makeRequest,
    onRetry,
  };
};

export default useDataState;
