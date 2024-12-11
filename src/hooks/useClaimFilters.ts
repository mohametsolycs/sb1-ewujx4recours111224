import { useState, useCallback, useMemo } from 'react';
import { Claim, SearchFilters, ClaimStatus } from '../types';

const ITEMS_PER_PAGE = 20;

export function useClaimFilters(allClaims: Claim[]) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    status: 'all',
    insurerCompanyId: 'all',
    responsibleCompanyId: 'all',
    dateRange: {
      start: null,
      end: null
    },
    page: 1,
    limit: ITEMS_PER_PAGE
  });

  const filteredClaims = useMemo(() => {
    return allClaims.filter(claim => {
      // Status filter
      if (filters.status !== 'all' && claim.status !== filters.status) {
        return false;
      }

      // Insurer filter
      if (filters.insurerCompanyId !== 'all' && 
          claim.insurerCompanyId !== filters.insurerCompanyId) {
        return false;
      }

      // Responsible party filter
      if (filters.responsibleCompanyId !== 'all' && 
          claim.responsibleParty.insuranceCompanyId !== filters.responsibleCompanyId) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.start && new Date(claim.incidentDate) < filters.dateRange.start) {
        return false;
      }
      if (filters.dateRange.end && new Date(claim.incidentDate) > filters.dateRange.end) {
        return false;
      }

      // Search query
      if (filters.query) {
        const searchQuery = filters.query.toLowerCase();
        const matchesVictim = claim.victim.fullName.toLowerCase().includes(searchQuery) ||
                            claim.victim.contractNumber.toLowerCase().includes(searchQuery);
        const matchesResponsible = claim.responsibleParty.fullName.toLowerCase().includes(searchQuery) ||
                                 claim.responsibleParty.contractNumber.toLowerCase().includes(searchQuery);
        if (!matchesVictim && !matchesResponsible) {
          return false;
        }
      }

      return true;
    });
  }, [allClaims, filters]);

  const paginatedClaims = useMemo(() => {
    const startIndex = (filters.page - 1) * filters.limit;
    return filteredClaims.slice(startIndex, startIndex + filters.limit);
  }, [filteredClaims, filters.page, filters.limit]);

  const totalPages = Math.ceil(filteredClaims.length / filters.limit);

  const setSearchQuery = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, query, page: 1 }));
  }, []);

  const setStatus = useCallback((status: ClaimStatus | 'all') => {
    setFilters(prev => ({ ...prev, status, page: 1 }));
  }, []);

  const setInsurerCompanyId = useCallback((insurerCompanyId: string) => {
    setFilters(prev => ({ ...prev, insurerCompanyId, page: 1 }));
  }, []);

  const setResponsibleCompanyId = useCallback((responsibleCompanyId: string) => {
    setFilters(prev => ({ ...prev, responsibleCompanyId, page: 1 }));
  }, []);

  const setDateRange = useCallback((dateRange: { start: Date | null; end: Date | null }) => {
    setFilters(prev => ({ ...prev, dateRange, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  return {
    filters,
    filteredClaims,
    paginatedClaims,
    totalPages,
    totalItems: filteredClaims.length,
    setSearchQuery,
    setStatus,
    setInsurerCompanyId,
    setResponsibleCompanyId,
    setDateRange,
    setPage
  };
}