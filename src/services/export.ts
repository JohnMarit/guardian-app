import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

interface Alert {
  id: string;
  title: string;
  description: string;
  location: string;
  level: 'low' | 'medium' | 'high';
  status: 'pending' | 'verified' | 'dismissed';
  created_at: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

class ExportService {
  private formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }

  private prepareData(alerts: Alert[]) {
    return alerts.map(alert => ({
      ID: alert.id,
      Title: alert.title,
      Description: alert.description,
      Location: alert.location,
      Level: alert.level.toUpperCase(),
      Status: alert.status.toUpperCase(),
      'Created At': this.formatDate(alert.created_at),
      Coordinates: alert.coordinates ? `${alert.coordinates.lat}, ${alert.coordinates.lng}` : 'N/A',
    }));
  }

  exportToCSV(alerts: Alert[]) {
    const data = this.prepareData(alerts);
    const csvContent = this.convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `alerts_${new Date().toISOString().split('T')[0]}.csv`);
  }

  exportToExcel(alerts: Alert[]) {
    const data = this.prepareData(alerts);
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Alerts');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `alerts_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  exportToJSON(alerts: Alert[]) {
    const data = this.prepareData(alerts);
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    saveAs(blob, `alerts_${new Date().toISOString().split('T')[0]}.json`);
  }

  private convertToCSV(data: any[]): string {
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(','))
    ];
    return csvRows.join('\n');
  }
}

export const exportService = new ExportService(); 