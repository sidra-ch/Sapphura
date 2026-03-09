declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf'

  export interface UserOptions {
    head?: any[][]
    body?: any[][]
    foot?: any[][]
    startY?: number
    margin?: number | { top?: number; right?: number; bottom?: number; left?: number }
    pageBreak?: 'auto' | 'avoid' | 'always'
    theme?: 'striped' | 'grid' | 'plain'
    styles?: any
    headStyles?: any
    bodyStyles?: any
    footStyles?: any
    alternateRowStyles?: any
    didDrawPage?: (data: any) => void
  }

  export default function autoTable(doc: jsPDF, options: UserOptions): jsPDF
}
