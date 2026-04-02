import {
  DA_API_EXTRACT_SERTIPIKAT,
  DA_API_SESSON_CREATE,
  DA_API_SESSION_DETAIL,
} from "@/constants/apis";
import useRequest from "@/hooks/useRequest";
import { useCallback, useEffect, useState } from "react";

export default function useExtractSertipikat() {
  const [sessionId, setSessionId] = useState<string | null>(null);
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
      description: "Dokumen sedang diproses...",
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
      setSessionId(null);
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

        // The upload response returns a sessionId (or jobId which IS the sessionId)
        const id =
          res?.data?.data?.sessionId ||
          res?.data?.data?.jobId ||
          res?.data?.data?.id;
        if (id) {
          setSessionId(id);
          setIsPolling(true);
        }
      } catch (e) {
        console.error("Upload failed", e);
      }
    },
    [uploadReq],
  );

  const uploadDocuments = useCallback(
    async (
      filesByRequirement: Record<string, File>,
      serviceId: string,
      title?: string,
    ) => {
      setSessionId(null);
      setExtractedData(null);

      const formData = new FormData();
      formData.append("serviceId", serviceId);
      if (title) {
        formData.append("title", title);
      }

      Object.entries(filesByRequirement).forEach(([requirementId, file]) => {
        formData.append(`files[${requirementId}]`, file);
      });

      try {
        const res = await uploadReq({
          config: {
            method: "POST",
            url: DA_API_SESSON_CREATE,
            data: formData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        });

        const id =
          res?.data?.data?.sessionId ||
          res?.data?.data?.id ||
          res?.data?.data?.jobId;
        if (id) {
          setSessionId(id);
          setIsPolling(true);
        }
      } catch (e) {
        console.error("Bulk upload failed", e);
      }
    },
    [uploadReq],
  );

  const pollStatus = useCallback(async () => {
    if (!sessionId || !isPolling) return;

    try {
      await statusReq({
        config: {
          method: "GET",
          url: `${DA_API_SESSION_DETAIL}/${sessionId}`,
        },
        onResolve: {
          onSuccess: (res: any) => {
            const data = res.data?.data;
            if (data?.status === "COMPLETED") {
              setIsPolling(false);
              // Use rawData from the session detail response
              const rawData = data.rawData || {};
              setExtractedData(rawData);
            } else if (data?.status === "FAILED") {
              setIsPolling(false);
            }
          },
        },
      });
    } catch (e) {
      console.error("Polling failed", e);
      setIsPolling(false);
    }
  }, [sessionId, isPolling, statusReq]);

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
    uploadDocuments,
    uploadSertipikat,
    isLoading,
    isPolling,
    isUploading,
    extractedData,
    setExtractedData,
    reset: () => {
      setSessionId(null);
      setExtractedData(null);
      setIsPolling(false);
    },
  };
}
