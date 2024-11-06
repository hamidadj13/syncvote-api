import { Timestamp } from 'firebase-admin/firestore'; // ou depuis 'firebase/firestore' pour Firebase client SDK

export function formatTimestamp(timestamp: Timestamp): string {
    // Convertir Timestamp en Date
    const date = timestamp.toDate();

    // Formater la date en 'yyyy-MM-dd HH:mm'
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois (0-11)
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

