// src/components/RendererPdfCreate.tsx
import { Document, Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer';
import { contractTexts } from '../utils/contractTexts';
import type { Contract } from '../types/Contract';

type Props = {
  contract: Contract;
  lang: 'en' | 'pt';
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 12,
    padding: 24,
    color: '#222',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  logo: {
    height: 40,
    objectFit: 'contain',
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  intro: {
    color: '#666',
    marginBottom: 16,
  },
  parties: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  partyBox: {
    flex: 1,
    border: '1px solid #bbb',
    borderRadius: 6,
    padding: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 6,
    color: '#111',
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 12,
    marginTop: 12,
  },
  listItem: {
    backgroundColor: '#f3f3f3',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 10,
    marginRight: 4,
    marginBottom: 4,
  },
  leftBorder: {
    borderLeft: '4px solid #2563eb',
    paddingLeft: 10,
    marginBottom: 12,
    marginTop: 12,
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  signatureBox: {
    textAlign: 'center',
  },
  signatureLine: {
    marginBottom: 8,
  },
});

const RendererPdfCreate: React.FC<Props> = ({ contract, lang }) => {
  const t = contractTexts[lang as 'en' | 'pt'];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {contract.logo_url && (
            <Image src={contract.logo_url} style={styles.logo} />
          )}
          <Text style={styles.title}>{t.title}</Text>
        </View>

        <Text style={styles.intro}>{t.intro}</Text>

        {/* Parties */}
        <View style={styles.parties}>
          <View style={styles.partyBox}>
            <Text>
              <Text style={{ fontWeight: 'bold' }}>{t.contractor}:</Text> {contract.client_name}, CPF/CNPJ nº {contract.client_cpf}, {t.resident} {contract.client_address}.
            </Text>
            {contract.client_email && (
              <Text>{"\n"}E-mail: {contract.client_email}</Text>
            )}
          </View>
          <View style={styles.partyBox}>
            <Text>
              <Text style={{ fontWeight: 'bold' }}>{t.provider}:</Text> {contract.provider_name}, CPF/CNPJ nº {contract.provider_cpf}, {t.resident} {contract.provider_address}.
            </Text>
            {contract.provider_email && (
              <Text>{"\n"}E-mail: {contract.provider_email}</Text>
            )}            
          </View>
        </View>

        {/* Cláusula 1 */}
        <Text style={styles.sectionTitle}>{t.clause1_title}</Text>
        <Text>{t.clause1_description}</Text>
        <View style={styles.list}>
          {contract.graphic_design && <Text style={styles.listItem}>{t.graphic_design}</Text>}
          {contract.web_design && <Text style={styles.listItem}>{t.web_design}</Text>}
          {contract.branding && <Text style={styles.listItem}>{t.branding}</Text>}
          {contract.social_media && <Text style={styles.listItem}>{t.social_media}</Text>}
          {contract.photography && <Text style={styles.listItem}>{t.photography}</Text>}
          {contract.illustration && <Text style={styles.listItem}>{t.illustration}</Text>}
          {contract.web_development && <Text style={styles.listItem}>{t.web_development}</Text>}
          {contract.copywriting && <Text style={styles.listItem}>{t.copywriting}</Text>}
          {contract.marketing && <Text style={styles.listItem}>{t.marketing}</Text>}
          {contract.others && <Text style={styles.listItem}>{contract.others}</Text>}
        </View>

        {/* Cláusula 2 */}
        <Text style={styles.sectionTitle}>{t.clause2_title}</Text>
        <Text>{t.clause2_description}</Text>
        <Text style={styles.leftBorder}>
          {contract.service_scope}
          {"\n"}{"\n"}
        </Text>

        {/* Cláusula 3 */}
        <Text style={styles.sectionTitle}>{t.clause3_title}</Text>
        <Text>
          {t.clause3_description.start} {contract.start_date && new Date(contract.start_date).toLocaleDateString('pt-BR')}
          {"\n"}
          {t.clause3_description.end} {contract.delivery_date && new Date(contract.delivery_date).toLocaleDateString('pt-BR')}
        </Text>

        {/* Cláusula 4 */}
        <Text style={styles.sectionTitle}>{t.clause4_title}</Text>
        <Text>
          {t.clause4_description.total_price} {contract.total_value}{"\n"}
          {t.clause4_description.payment_method} {contract.payment_method}
        </Text>

        {/* Cláusula 5 */}
        <Text style={styles.sectionTitle}>{t.clause5_title}</Text>
        <Text>{t.clause5_description}</Text>

        {/* Cláusula 6 */}
        <Text style={styles.sectionTitle}>{t.clause6_title}</Text>
        <Text>
          {t.clause6_description}
          {"\n\n"}
          <Text style={{ fontWeight: 'bold' }}>{t.revision_count}</Text> {contract.revision_count || '-'}
        </Text>

        {/* Cláusula 7 */}
        <Text style={styles.sectionTitle}>{t.clause7_title}</Text>
        <Text>{t.clause7_description}</Text>

        {/* Cláusula 8 */}
        <Text style={styles.sectionTitle}>{t.clause8_title}</Text>
        <Text>
          {t.clause8_description.replace('{court_city}', contract.court_city)}
        </Text>

        <Text style={{ marginTop: 16 }}>
          {t.date_label} {contract.contract_date && new Date(contract.contract_date).toLocaleDateString('pt-BR')}
        </Text>

        {/* Assinaturas */}
        <View style={styles.signatureRow}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLine}>____________________________________</Text>
            <Text>{contract.provider_name}</Text>
            <Text>CPF/CNPJ: {contract.provider_cpf}</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLine}>____________________________________</Text>
            <Text>{contract.client_name}</Text>
            <Text>CPF/CNPJ: {contract.client_cpf}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default RendererPdfCreate;
