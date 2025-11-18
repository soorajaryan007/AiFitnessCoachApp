import { Page, Text, View, Document, StyleSheet, pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

// Define PDF Styles
const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10 },
  header: { fontSize: 20, marginBottom: 20 }
});

// PDF Document Structure
const MyDocument = ({ plan }: { plan: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>My AI Workout Plan</Text>
        <Text>Motivation: {plan.motivation}</Text>
        {/* Add loops for workout and diet here */}
      </View>
    </Page>
  </Document>
);

export const downloadPDF = async (plan: any) => {
  const blob = await pdf(<MyDocument plan={plan} />).toBlob();
  saveAs(blob, 'workout-plan.pdf');
};