'use client';

import { useState, useEffect } from 'react';
import { fraudApi, FraudAlert, FraudCheckResult } from '@/service/fraudService';

interface UseFraudDetectionOptions {
  daSessionResponse?: any;
}

export const useFraudDetection = (options?: UseFraudDetectionOptions) => {
  const { daSessionResponse } = options || {};

  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [fraudCheck, setFraudCheck] = useState<FraudCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load alerts from session response
  const loadAlertsFromSession = () => {
    if (!daSessionResponse) return;

    try {
      const data = fraudApi.getSessionAlertsFromResponse(daSessionResponse);
      const fraudChecks = fraudApi.getSessionFraudChecksFromResponse(daSessionResponse);
      setAlerts(data);
      if (fraudChecks.length > 0) {
        setFraudCheck(fraudChecks[0]); // or combine them depending on how we want to use them
      }
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to load fraud alerts');
      return [];
    }
  };

  // Auto-load alerts when daSessionResponse changes
  useEffect(() => {
    loadAlertsFromSession();
  }, [daSessionResponse]);

  const resolveAlert = async (alertId: string, status: string = 'RESOLVED', note?: string) => {
    try {
      await fraudApi.resolveAlert(alertId, status, note);
      // Refresh alerts from session (would need to reload session data)
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to resolve alert');
      return false;
    }
  };

  // Calculate fraud risk level
  const getRiskLevel = () => {
    if (!alerts || alerts.length === 0) return 'NONE';

    const highCount = alerts.filter((a) => a.severity === 'HIGH' && a.status === 'OPEN').length;
    const mediumCount = alerts.filter((a) => a.severity === 'MEDIUM' && a.status === 'OPEN').length;

    if (highCount > 0) return 'HIGH';
    if (mediumCount > 0) return 'MEDIUM';
    return 'LOW';
  };

  const riskLevel = getRiskLevel();

  return {
    alerts,
    fraudCheck,
    loading,
    error,
    riskLevel,
    loadAlertsFromSession,
    resolveAlert,
  };
};
