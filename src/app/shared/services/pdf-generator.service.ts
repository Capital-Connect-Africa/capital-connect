import { Injectable, inject } from '@angular/core';
import { LoadingService } from '../../core';
import html2pdf from 'html2pdf.js';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {
  private _loadingService = inject(LoadingService);


  generatePDF2(element: HTMLElement, filename: string) {
    this._loadingService.setLoading(true);
  
    const options = {
      margin: 20, // Remove margins to eliminate extra white space
      filename: filename + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 1.5, // Scale the content by 150%
        backgroundColor: '#FFFFFF',
        width: element.scrollWidth, // Use the element's original width
        windowWidth: element.scrollWidth, // Ensure the content is rendered at full width
        useCORS: true,
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'landscape', // Use landscape to accommodate wider content
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };
  
    html2pdf()
      .from(element)
      .set(options)
      .toPdf()
      .get('pdf')
      .then((pdf: any) => {
        const totalPages = pdf.internal.getNumberOfPages();
        const now = new Date();
        const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const url = 'www.capitalconnect.africa';
  
        pdf.setFontSize(10);
  
        // Add header and footer to each page
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
  
          // Header: Filename
          pdf.setFontSize(12);
          pdf.text(filename, pdfWidth / 2, 10, { align: 'center' });
  
          // Footer: URL and page number
          pdf.setTextColor('#FCBA05');
          pdf.text(url, 10, pdfHeight - 10, { align: 'left' });
          pdf.setTextColor('#000000');
          pdf.text(`Page ${i} of ${totalPages}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
        }
  
        // Add timestamp to the last page
        pdf.setPage(totalPages);
        pdf.setFontSize(8);
        pdf.text(timestamp, pdfWidth - 10, pdfHeight - 10, { align: 'right' });
      })
      .save()
      .then(() => {
        this._loadingService.setLoading(false);
      })
      .catch((error: any) => {
        this._loadingService.setLoading(false);
        console.error('Error generating PDF:', error);
      });
  }




  generatePDF(element: HTMLElement, filename: string) {
    this._loadingService.setLoading(true);

    const options = {
      margin: 10, 
      filename: filename + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, backgroundColor: '#FFFFFF' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().from(element).set(options).toPdf().get('pdf').then((pdf: any) => {
      const totalPages = pdf.internal.getNumberOfPages();
      const now = new Date();
      const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const url = 'www.capitalconnect.africa';

      pdf.setFontSize(10); 

      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setTextColor('#FCBA05');
        pdf.text(url, 10, pdfHeight - 10, { align: 'left' }); 
        pdf.setTextColor('#000000'); 
        pdf.text(`Page ${i} of ${totalPages}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' }); 
      }


      pdf.setPage(totalPages);
      pdf.setFontSize(8); 
      pdf.text(timestamp, pdfWidth - 10, pdfHeight - 10, { align: 'right' });
    }).save().then(() => {
      this._loadingService.setLoading(false);
    }).catch((error: any) => {
      this._loadingService.setLoading(false);
      console.error('Error generating PDF:', error);
    });
  }
}










