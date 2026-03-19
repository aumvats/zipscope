import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { CensusData } from '@/lib/types';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 24,
    borderBottom: '2px solid #0D9488',
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#0D9488',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  card: {
    width: '48%',
    border: '1px solid #E2E8F0',
    borderRadius: 6,
    padding: 12,
  },
  cardLabel: {
    fontSize: 9,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
    marginBottom: 2,
  },
  cardNote: {
    fontSize: 8,
    color: '#64748B',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
    color: '#0F172A',
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  barLabel: {
    width: 70,
    fontSize: 8,
    color: '#64748B',
  },
  barTrack: {
    flex: 1,
    height: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
  },
  barFill: {
    height: 10,
    backgroundColor: '#0D9488',
    borderRadius: 3,
  },
  barValue: {
    width: 40,
    fontSize: 8,
    textAlign: 'right',
    color: '#0F172A',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: '1px solid #E2E8F0',
    paddingTop: 8,
    fontSize: 7,
    color: '#94A3B8',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

function fmt(n: number): string {
  return n.toLocaleString('en-US');
}

function fmtCurrency(n: number): string {
  return '$' + n.toLocaleString('en-US');
}

interface ReportProps {
  zip: string;
  city: string | null;
  state: string | null;
  data: CensusData;
}

export function generateReportPDF({ zip, city, state, data }: ReportProps) {
  const location = [city, state].filter(Boolean).join(', ');
  const totalPop = data.totalPopulation;
  const maxAge = Math.max(...data.ageGroups.map(g => g.value), 1);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{location || `ZIP ${zip}`}</Text>
          <Text style={styles.subtitle}>Demographic Report — ZIP {zip}</Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Total Population</Text>
            <Text style={styles.cardValue}>{fmt(data.totalPopulation)}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Median Household Income</Text>
            <Text style={styles.cardValue}>{fmtCurrency(data.medianHouseholdIncome)}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Median Home Value</Text>
            <Text style={styles.cardValue}>{fmtCurrency(data.medianHomeValue)}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Median Rent</Text>
            <Text style={styles.cardValue}>{fmtCurrency(data.medianRent)}/mo</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Employment Rate</Text>
            <Text style={styles.cardValue}>{data.employmentRate}%</Text>
            <Text style={styles.cardNote}>{fmt(data.employed)} employed / {fmt(data.unemployed)} unemployed</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Gender Split</Text>
            <Text style={styles.cardValue}>{totalPop > 0 ? Math.round((data.maleTotal / totalPop) * 100) : 0}% M / {totalPop > 0 ? Math.round((data.femaleTotal / totalPop) * 100) : 0}% F</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Age Distribution</Text>
          {data.ageGroups.map(group => (
            <View style={styles.barRow} key={group.label}>
              <Text style={styles.barLabel}>{group.label}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${(group.value / maxAge) * 100}%` }]} />
              </View>
              <Text style={styles.barValue}>{fmt(group.value)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Educational Attainment (% of population 25+)</Text>
          {data.educationLevels.map(level => (
            <View style={styles.barRow} key={level.label}>
              <Text style={styles.barLabel}>{level.label}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${level.value}%` }]} />
              </View>
              <Text style={styles.barValue}>{level.value}%</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer} fixed>
          <Text>Source: U.S. Census Bureau, ACS 5-Year Estimates</Text>
          <Text>Generated by ZipScope — {new Date().toLocaleDateString('en-US')}</Text>
        </View>
      </Page>
    </Document>
  );
}
