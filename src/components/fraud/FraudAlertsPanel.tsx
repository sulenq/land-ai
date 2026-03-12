'use client';

import React, { useState, useEffect } from 'react';
import { useFraudDetection } from '@/hooks/useFraudDetection';
import { FraudAlertCard } from './FraudAlertCard';
import { CContainer } from "@/components/ui/c-container";
import { HStack, Box, Badge } from "@chakra-ui/react";
import { P } from "@/components/ui/p";
import { Btn } from "@/components/ui/btn";
import { FadingSkeletonContainer } from "@/components/ui/skeleton";

interface FraudAlertsPanelProps {
  daSession?: any;
}

const riskLevelConfig = {
  HIGH: {
    borderColor: 'fg.error',
    colorScheme: 'red',
    icon: '🔴',
    label: 'Risiko Tinggi',
  },
  MEDIUM: {
    borderColor: 'fg.warning',
    colorScheme: 'orange',
    icon: '🟡',
    label: 'Risiko Sedang',
  },
  LOW: {
    borderColor: 'blue.500',
    colorScheme: 'blue',
    icon: '🔵',
    label: 'Risiko Rendah',
  },
  NONE: {
    borderColor: 'fg.success',
    colorScheme: 'green',
    icon: '✅',
    label: 'Tidak Ada Masalah',
  },
};

export const FraudAlertsPanel: React.FC<FraudAlertsPanelProps> = ({ daSession }) => {
  const { alerts, riskLevel, loading, resolveAlert } = useFraudDetection({ daSessionResponse: daSession });
  const [showAll, setShowAll] = useState(false);

  // Load alerts when daSession changes
  useEffect(() => {
    // Alerts will be loaded via hook
  }, [daSession]);

  const config = riskLevelConfig[riskLevel as keyof typeof riskLevelConfig] || riskLevelConfig.NONE;
  const openAlerts = alerts.filter((a) => a.status === 'OPEN');
  const displayAlerts = showAll ? alerts : openAlerts.slice(0, 3);

  if (loading) {
    return (
      <CContainer p={4} bg="d0" rounded="md" border="1px solid" borderColor="border.muted">
        <FadingSkeletonContainer loading={true} h="40px" />
      </CContainer>
    );
  }

  return (
    <CContainer overflow="hidden">
      {/* Header */}
      <CContainer p={4} borderBottom="1px solid" borderColor="border.muted" bg="d1">
        <HStack justify="space-between">
          <HStack gap={3}>
            <P fontSize="2xl">{config.icon}</P>
            <Box>
              <P fontWeight="semibold" fontSize="lg">{config.label}</P>
              <P fontSize="sm" color="fg.muted">
                {openAlerts.length} alert terbuka dari {alerts.length} total
              </P>
            </Box>
          </HStack>
          {riskLevel !== 'NONE' && (
            <Badge colorScheme={config.colorScheme} px={3} py={1} rounded="full">
              {riskLevel}
            </Badge>
          )}
        </HStack>
      </CContainer>

      {/* Alerts List */}
      <CContainer p={4} gap={4}>
        {alerts.length === 0 ? (
          <CContainer align="center" py={4}>
            <P color="fg.muted">Tidak ada alert fraud yang ditemukan</P>
          </CContainer>
        ) : (
          <>
            {displayAlerts.map((alert) => (
              <FraudAlertCard
                key={alert.id}
                alert={alert}
                onResolve={alert.status === 'OPEN' ? resolveAlert : undefined}
              />
            ))}

            {/* Show More Button */}
            {alerts.length > 3 && (
              <Btn
                variant="outline"
                size="sm"
                w="full"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Tampilkan Lebih Sedikit' : `Tampilkan Semua (${alerts.length})`}
              </Btn>
            )}
          </>
        )}
      </CContainer>

      {/* Fraud Score (if available) */}
      {alerts.length > 0 && (
        <Box px={4} pb={4}>
          <HStack justify="space-between" bg="d1" rounded="md" p={3} border="1px solid" borderColor="border.muted">
            <P fontSize="sm" color="fg.muted">Fraud Score</P>
            <P fontSize="lg" fontWeight="bold">
              {alerts.filter((a) => a.severity === 'HIGH').length * 30 +
               alerts.filter((a) => a.severity === 'MEDIUM').length * 10 +
               alerts.filter((a) => a.severity === 'LOW').length * 5}
              /100
            </P>
          </HStack>
        </Box>
      )}
    </CContainer>
  );
};

export default FraudAlertsPanel;
