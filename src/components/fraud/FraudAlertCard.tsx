'use client';

import React from 'react';
import { FraudAlert } from '@/service/fraudService';
import { CContainer } from "@/components/ui/c-container";
import { HStack, Box, Badge } from "@chakra-ui/react";
import { P } from "@/components/ui/p";

interface FraudAlertCardProps {
  alert: FraudAlert;
  onResolve?: (alertId: string) => void;
}

const severityConfig = {
  HIGH: { borderColor: 'fg.error', colorScheme: 'red' },
  MEDIUM: { borderColor: 'fg.warning', colorScheme: 'orange' },
  LOW: { borderColor: 'blue.500', colorScheme: 'blue' },
};

const statusColors = {
  OPEN: 'red',
  RESOLVED: 'green',
  INVESTIGATING: 'blue',
  CLOSED: 'gray',
};

export const FraudAlertCard: React.FC<FraudAlertCardProps> = ({ alert, onResolve: _onResolve }) => {
  const sevConfig = severityConfig[alert.severity as keyof typeof severityConfig] || severityConfig.LOW;
  const statusColor = statusColors[alert.status as keyof typeof statusColors] || 'gray';

  return (
    <CContainer 
      borderLeft="4px solid" 
      borderColor={sevConfig.borderColor} 
      bg="d1" 
      rounded="md" 
      p={4} 
      gap={3}
    >
      <HStack justify="space-between" align="start">
        <Box flex={1}>
          <HStack gap={2} mb={2} wrap="wrap">
            <Badge colorScheme={sevConfig.colorScheme}>
              {alert.severity}
            </Badge>
            <P fontSize="xs" color="fg.muted">
              {new Date(alert.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </P>
            {alert.file_name && (
              <P fontSize="xs" color="fg.muted">
                • {alert.file_name}
              </P>
            )}
          </HStack>
          <P fontWeight="semibold" fontSize="md">{alert.title}</P>
        </Box>
        <Badge colorScheme={statusColor}>
          {alert.status}
        </Badge>
      </HStack>

      <P fontSize="sm" color="fg.subtle">{alert.description}</P>

      {/* Render Specific Matched Info if Available */}
      {alert.evidence?.matchedWith && alert.evidence.matchedWith.length > 0 && (
        <Box mt={2} p={3} rounded="md" bg="d0" border="1px solid" borderColor="border.muted">
          <P fontSize="xs" fontWeight="semibold" color="fg.muted" mb={2}>
            Ditemukan kemiripan dengan dokumen berikut:
          </P>
          <HStack wrap="wrap" gap={2}>
            {alert.evidence.matchedWith.map((match: any, idx: number) => (
              <Badge key={idx} variant="subtle" colorScheme="blue">
                {match.fileName || `Job #${match.jobId}`}
              </Badge>
            ))}
          </HStack>
        </Box>
      )}

      {/* Render Similar Signatures Info */}
      {(alert.alert_type === 'SIMILAR_SIGNATURE' || alert.alertType === 'SIMILAR_SIGNATURE') && alert.evidence?.matches && alert.evidence.matches.length > 0 && (
        <Box mt={2} p={3} rounded="md" bg="d0" border="1px solid" borderColor="border.muted">
          <HStack justify="space-between" mb={2}>
            <P fontSize="xs" fontWeight="semibold" color="fg.muted">
              Ditemukan {alert.matchCount || alert.evidence.matches.length} tanda tangan mirip:
            </P>
            {alert.similarityPercent && (
              <Badge colorScheme="orange" variant="subtle" size="sm">Max: {alert.similarityPercent}</Badge>
            )}
          </HStack>
          <HStack wrap="wrap" gap={2}>
            {alert.evidence.matches.map((match: any, idx: number) => (
              <Badge key={idx} variant="outline" colorScheme="orange" display="flex" gap={1}>
                <span>{match.fileName || `Job #${match.jobId}`}</span>
                <span style={{ opacity: 0.7 }}>({match.similarityDisplay})</span>
              </Badge>
            ))}
          </HStack>
        </Box>
      )}

      {/* Render Materai Serial Number if Available */}
      {alert.evidence?.serial && (
        <Box mt={2}>
          <P fontSize="xs" color="fg.muted">
            Nomor Seri: <P as="span" fontWeight="semibold">{alert.evidence.serial}</P>
          </P>
        </Box>
      )}

      {/* Render Image Proof if Available */}
      {alert.evidence?.evidencePath && (
        <Box mt={3}>
           <P fontSize="xs" fontWeight="medium" color="fg.muted" mb={2}>Bukti Potongan Dokumen:</P>
           <img 
             src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}${alert.evidence.evidencePath}`} 
             alt="Bukti Area Terdeteksi"
             style={{
               maxWidth: '100%',
               height: 'auto',
               border: '1px solid var(--chakra-colors-border-muted)',
               borderRadius: 'var(--chakra-radii-md)'
             }}
           />
        </Box>
      )}

      {/* TEMPORARILY HIDDEN
      {alert.evidence && (
        <AccordionRoot collapsible mt={1}>
          <AccordionItem value="evidence" border="none">
            <AccordionItemTrigger cursor="pointer" px={0} py={2} _hover={{ bg: "transparent" }}>
              <P fontSize="sm" fontWeight="medium" color="fg.muted">Lihat Bukti</P>
            </AccordionItemTrigger>
            <AccordionItemContent px={0} pb={2}>
              <Box bg="d0" p={3} rounded="md" overflowX="auto" border="1px solid" borderColor="border.muted">
                <P as="pre" fontSize="xs" color="fg.muted">
                  {JSON.stringify(alert.evidence, null, 2)}
                </P>
              </Box>
            </AccordionItemContent>
          </AccordionItem>
        </AccordionRoot>
      )}

      {onResolve && alert.status === 'OPEN' && (
        <HStack mt={2}>
          <Btn
            size="xs"
            variant="outline"
            onClick={() => onResolve(alert.id)}
          >
            Tandai Selesai
          </Btn>
        </HStack>
      )}
      */}
    </CContainer>
  );
};

export default FraudAlertCard;
