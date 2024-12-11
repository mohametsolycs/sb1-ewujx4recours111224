import React, { useState } from 'react';
import { Calendar, BarChart3, Download, FileText } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { DateRangePicker } from './components/DateRangePicker';
import { InsurerSelector } from './components/InsurerSelector';
import { SettlementSummary } from './components/SettlementSummary';
import { ClaimsTable } from './components/ClaimsTable';
import { BalanceChart } from './components/BalanceChart';
import { useSettlement } from '../../hooks/useSettlement';
import { INSURANCE_COMPANIES } from '../../constants/insuranceCompanies';
import { Button } from '../../components/ui/button';
import { LoadingOverlay } from '../../components/ui/spinner';

export function SettlementDashboard() {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date()
  });

  const [selectedInsurers, setSelectedInsurers] = useState<{
    insurerA: string | null;
    insurerB: string | null;
  }>({
    insurerA: null,
    insurerB: null
  });

  const { 
    settlementSummary, 
    calculateSettlement, 
    generateSettlement, 
    exportData, 
    isLoading 
  } = useSettlement(dateRange, selectedInsurers);

  const handleCalculate = () => {
    if (selectedInsurers.insurerA && selectedInsurers.insurerB) {
      calculateSettlement();
    }
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow p-6 relative">
        {isLoading && <LoadingOverlay />}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FileText className="h-6 w-6 mr-2" />
            Règlement de Recours
          </h1>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Période
              </h2>
              <DateRangePicker
                startDate={dateRange.start}
                endDate={dateRange.end}
                onChange={setDateRange}
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">
                Assureurs concernés
              </h2>
              <InsurerSelector
                insurers={INSURANCE_COMPANIES}
                selectedInsurers={selectedInsurers}
                onChange={setSelectedInsurers}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleCalculate}
              disabled={!selectedInsurers.insurerA || !selectedInsurers.insurerB}
              className="w-full md:w-auto"
            >
              Générer le rapport
            </Button>
          </div>

          {settlementSummary && (
            <div className="space-y-8 mt-8">
              <SettlementSummary summary={settlementSummary} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BalanceChart summary={settlementSummary} />
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Actions</h3>
                    <div className="space-x-3">
                      <Button
                        onClick={() => exportData('xlsx')}
                        variant="outline"
                        className="flex items-center"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Excel
                      </Button>
                      <Button
                        onClick={() => exportData('pdf')}
                        variant="outline"
                        className="flex items-center"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={generateSettlement}
                    className="w-full"
                  >
                    Valider le règlement
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  <BarChart3 className="h-5 w-5 inline-block mr-2" />
                  Détail des recours
                </h3>
                <ClaimsTable claims={[
                  ...settlementSummary.insurerA.claims,
                  ...settlementSummary.insurerB.claims
                ]} />
              </div>
            </div>
          )}

          {!settlementSummary && !isLoading && (
            <div className="py-12 text-center text-gray-500">
              Sélectionnez deux assureurs et une période puis cliquez sur "Générer le rapport"
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}