import { DA_API_EXTRACT_SERTIPIKAT, DA_API_STATUS } from "@/constants/apis";
import useRequest from "@/hooks/useRequest";
import { useCallback, useEffect, useState } from "react";

export interface DashboardExtractStatusResponse {
  status: number;
  message: string;
  data: {
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    result?: {
      fileName: string;
      totalPages: number;
      pagesDetail: {
        data: Record<string, any>;
        pageNumber: number;
      }[];
      extractedData: Record<string, any>;
      validationSummary: {
        note: string;
        isValid: boolean;
      };
    };
  };
}

export default function useExtractSertipikat() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [extractedData, setExtractedData] = useState<Record<
    string,
    any
  > | null>(null);

  const { req: uploadReq, loading: isUploading } = useRequest({
    id: "extract-sertipikat-upload",
    showSuccessToast: true,
    showErrorToast: true,
    successMessage: {
      title: "Berhasil diunggah",
      description: "Sertipikat sedang diproses...",
    },
  });

  const { req: statusReq } = useRequest({
    id: "extract-sertipikat-status",
    showLoadingToast: false,
    showSuccessToast: false,
    showErrorToast: false,
  });

  const uploadSertipikat = useCallback(
    async (file: File, serviceId: string, requirementId?: string) => {
      setJobId(null);
      setExtractedData(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("serviceId", serviceId);
      if (requirementId) {
        formData.append("requirementId", requirementId);
      }

      try {
        const res = await uploadReq({
          config: {
            method: "POST",
            url: DA_API_EXTRACT_SERTIPIKAT,
            data: formData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        });

        // Status 202 Accepted — onSuccess won't fire so we read the response directly
        const jobId = res?.data?.data?.jobId;
        if (jobId) {
          setJobId(jobId);
          setIsPolling(true);
        }
      } catch (e) {
        console.error("Upload failed", e);
      }
    },
    [uploadReq],
  );

  const pollStatus = useCallback(async () => {
    if (!jobId || !isPolling) return;

    try {
      await statusReq({
        config: {
          method: "GET",
          url: `${DA_API_STATUS}/${jobId}`,
        },
        onResolve: {
          onSuccess: (res: any) => {
            const data = res.data
              ?.data as DashboardExtractStatusResponse["data"];
            if (data?.status === "COMPLETED") {
              setIsPolling(false);
              const extracted = data.result?.extractedData || {};
              setExtractedData(extracted);
            } else if (data?.status === "FAILED") {
              setIsPolling(false);
              // Handle failed state if necessary
            }
          },
        },
      });
    } catch (e) {
      console.error("Polling failed", e);
      setIsPolling(false);
    }
  }, [jobId, isPolling, statusReq]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPolling) {
      interval = setInterval(() => {
        pollStatus();
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPolling, pollStatus]);

  const isLoading = isUploading || isPolling;

  return {
    uploadSertipikat,
    isLoading,
    isPolling,
    isUploading,
    extractedData,
    setExtractedData,
    reset: () => {
      setJobId(null);
      setExtractedData(null);
      setIsPolling(false);
    },
  };
}
