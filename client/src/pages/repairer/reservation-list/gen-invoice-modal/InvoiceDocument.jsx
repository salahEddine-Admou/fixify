// InvoiceDocument.jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { logo } from '../../../../assets';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12,
        lineHeight: 1.5,
    },
    logo: {
        width: 100,
        height: "auto",
        marginBottom: 20,

        objectFit: "cover"
    },
    section: {
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
    },
    listItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottom: '1px solid #ddd',
        padding: '10px 0',
    },
    listItemTitle: {
        fontWeight: 'bold',
    },
    textarea: {
        border: '1px solid #ddd',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    total: {
        marginTop: 20,
        fontWeight: 'bold',
    },
});

const InvoiceDocument = ({ reservation, description }) => (
    <Document>
        <Page style={styles.page}>
            <Image
                style={styles.logo}
                src={logo} // Replace with the path to your logo
            />
            <View style={styles.section}>
                <Text style={styles.title}>Facture #{reservation.ref}</Text>
            </View>
            <View style={styles.section}>
                <View style={styles.listItem}>
                    <Text style={styles.listItemTitle}>Date:</Text>
                    <Text>{reservation.date}</Text>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.listItemTitle}>Client:</Text>
                    <Text>{reservation.client}</Text>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.listItemTitle}>Address:</Text>
                    <Text>{reservation.address}</Text>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.listItemTitle}>Telephone:</Text>
                    <Text>{reservation.phone}</Text>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.listItemTitle}>Model:</Text>
                    <Text>{reservation.model}</Text>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.listItemTitle}>Type of Problem:</Text>
                    <Text>{reservation.problem ? reservation.problem:"Autre"}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.listItemTitle}>Description:</Text>
                    <Text style={styles.textarea}>{description}</Text>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.listItemTitle}>Total:</Text>
                    <Text>{reservation.price} MAD</Text>
                </View>
            </View>
        </Page>
    </Document>
);

export default InvoiceDocument;
