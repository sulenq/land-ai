import { FRAUD_API_ALERTS_GET, FRAUD_API_ALERT_DETAIL, FRAUD_API_ALERT_RESOLVE, FRAUD_API_DASHBOARD, FRAUD_API_JOB_CHECK } from "@/constants/apis";

// Types
export interface FraudAlert {
  id: string;
  job_id: string;
  alert_type: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  evidence?: any;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'FALSE_POSITIVE';
  created_at: string;
  file_name?: string;
  similarityPercent?: string;
  matchCount?: number;
  // Frontend only
  jobId?: string;
  alertType?: string;
  fileName?: string;
  createdAt?: string;
}

export interface FraudDashboardStats {
  total: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  open_count: number;
  resolved_count: number;
}

export interface FraudDashboard {
  stats: FraudDashboardStats;
  recentAlerts: FraudAlert[];
}

export interface FraudCheckResult {
  id: string;
  fraud_check: any;
  fraud_score?: number;
  fraud_status?: string;
  materai_serial?: string;
  signature_hash?: string;
  checked_at?: string;
}

// API Functions
export const fraudApi = {
  // Get fraud alerts from DA session response (already included in getSessionDetails)
  // Get Both Alerts and Sub-Checks from DA session response
  getSessionAlertsFromResponse(daSessionResponse: any): FraudAlert[] {
    const fraudAlerts = daSessionResponse?.fraudAlerts || [];

    // Transform backend format to frontend format
    const parsedAlerts = fraudAlerts.map((alert: any) => ({
      id: alert.id,
      job_id: alert.jobId || alert.job_id,
      alert_type: alert.alertType || alert.alert_type,
      severity: alert.severity,
      title: alert.title,
      description: alert.description,
      similarityPercent: alert.similarityPercent,
      matchCount: alert.matchCount,
      evidence: alert.evidence,
      status: alert.status,
      created_at: alert.createdAt || alert.created_at,
      file_name: alert.fileName || alert.file_name,
      // Frontend aliases
      jobId: alert.jobId || alert.job_id,
      alertType: alert.alertType || alert.alert_type,
      fileName: alert.fileName || alert.file_name,
      createdAt: alert.createdAt || alert.created_at,
    }));

    // Inject document-level fraud checks to matching alerts or just expose fraud checks globally.
    // For now we just return the alerts array 
    return parsedAlerts;
  },

  getSessionFraudChecksFromResponse(daSessionResponse: any): FraudCheckResult[] {
    const uploadedDocs = daSessionResponse?.uploadedDocuments || [];
    const fraudChecks: FraudCheckResult[] = [];

    uploadedDocs.forEach((doc: any) => {
      if (doc.fraudCheck) {
        fraudChecks.push({
           id: doc.jobId,
           fraud_check: doc.fraudCheck,
           fraud_score: doc.fraudScore,
           fraud_status: doc.fraudStatus,
           materai_serial: doc.fraudCheck?.materaiSerial,
           signature_hash: doc.fraudCheck?.signatureHash,
           checked_at: doc.fraudCheck?.checkedAt,
        } as FraudCheckResult);
      }
    });

    return fraudChecks;
  },

  // Get fraud alerts for a specific job (direct API call)
  async getJobAlerts(jobId: string): Promise<FraudAlert[]> {
    const response = await fetch(`${FRAUD_API_ALERTS_GET}/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch fraud alerts');
    }

    const result = await response.json();
    return result.data;
  },

  // Get fraud dashboard
  async getDashboard(): Promise<FraudDashboard> {
    const response = await fetch(FRAUD_API_DASHBOARD, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch fraud dashboard');
    }

    const result = await response.json();
    return result.data;
  },

  // Get fraud alert detail
  async getAlertDetail(alertId: string): Promise<FraudAlert> {
    const response = await fetch(`${FRAUD_API_ALERT_DETAIL}/${alertId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch alert detail');
    }

    const result = await response.json();
    return result.data;
  },

  // Resolve fraud alert
  async resolveAlert(alertId: string, status: string, note?: string): Promise<void> {
    const response = await fetch(`${FRAUD_API_ALERT_RESOLVE}/${alertId}/resolve`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, note }),
    });

    if (!response.ok) {
      throw new Error('Failed to resolve alert');
    }
  },

  // Get job fraud check result
  async getJobFraudCheck(jobId: string): Promise<FraudCheckResult> {
    const response = await fetch(`${FRAUD_API_JOB_CHECK}/${jobId}/check`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch fraud check');
    }

    const result = await response.json();
    return result.data;
  },
};
