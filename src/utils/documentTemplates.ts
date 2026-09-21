import Swal from 'sweetalert2';
import { SchoolConfig } from '../types';

/**
 * Generate standard kop surat without logo, centered bold with double bottom border
 */
export function generateKopHtml(config: SchoolConfig, judulDokumen: string, subJudul?: string): string {
  return `
    <div style="text-align: center; margin-bottom: 24px; padding-bottom: 12px; border-bottom: 3px double #1e293b; font-family: 'Times New Roman', Times, serif;">
      <div style="font-size: 13pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; line-height: 1.2;">
        ${config.namaPemerintah || 'PEMERINTAH DAERAH DINAS PENDIDIKAN DAN KEBUDAYAAN'}
      </div>
      <div style="font-size: 15pt; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #0f172a; margin: 4px 0;">
        ${config.namaSekolah || 'SEKOLAH PENGGERAK'}
      </div>
      <div style="font-size: 10pt; font-style: italic; color: #334155; line-height: 1.3;">
        ${config.alamatSekolah || 'Jl. Pendidikan Karakter No. 12, Telp/Email Sekolah'}
      </div>
    </div>
    <div style="text-align: center; margin-bottom: 20px; font-family: 'Times New Roman', Times, serif;">
      <div style="font-size: 14pt; font-weight: bold; text-transform: uppercase; text-decoration: underline; color: #0f172a;">
        ${judulDokumen}
      </div>
      ${subJudul ? `<div style="font-size: 11pt; font-weight: 600; color: #1e293b; margin-top: 4px;">${subJudul}</div>` : ''}
    </div>
  `;
}

/**
 * Generate mandatory 2-column borderless signature table
 * Kepala Sekolah on Left, Guru Mapel on Right - strictly horizontal and parallel!
 */
export function generateSignatureTable(
  config: SchoolConfig,
  guruNama: string,
  guruNip: string,
  mapel: string
): string {
  const tanggalTtd = config.tempatTanggalTtd || 'Purwodadi, 15 Juli 2024';
  const kepalaSekolah = config.namaKepalaSekolah || 'Drs. H. Ahmad Sudrajat, M.Pd.';
  const nipKepsek = config.nipKepalaSekolah || '19750512 200003 1 002';
  const nipGuru = guruNip || '-';

  return `
    <div style="margin-top: 40px; font-family: 'Times New Roman', Times, serif; page-break-inside: avoid;">
      <table class="signature-table" style="width: 100%; border: none !important; border-collapse: collapse; margin-top: 25px;">
        <tbody>
          <tr style="border: none !important;">
            <td style="width: 50%; vertical-align: top; text-align: left; padding: 0 20px; border: none !important;">
              <p style="margin: 0; font-size: 11pt; line-height: 1.4;">Mengetahui,</p>
              <p style="margin: 0; font-size: 11pt; font-weight: bold; line-height: 1.4;">Kepala Sekolah</p>
              <div style="height: 75px;"></div>
              <p style="margin: 0; font-size: 11pt; font-weight: bold; text-decoration: underline; line-height: 1.3;">
                ${kepalaSekolah}
              </p>
              <p style="margin: 0; font-size: 10pt; line-height: 1.3; color: #334155;">
                NIP. ${nipKepsek}
              </p>
            </td>
            <td style="width: 50%; vertical-align: top; text-align: left; padding: 0 20px; border: none !important;">
              <p style="margin: 0; font-size: 11pt; line-height: 1.4;">${tanggalTtd}</p>
              <p style="margin: 0; font-size: 11pt; font-weight: bold; line-height: 1.4;">Guru Mata Pelajaran ${mapel}</p>
              <div style="height: 75px;"></div>
              <p style="margin: 0; font-size: 11pt; font-weight: bold; text-decoration: underline; line-height: 1.3;">
                ${guruNama}
              </p>
              <p style="margin: 0; font-size: 10pt; line-height: 1.3; color: #334155;">
                NIP. ${nipGuru}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

/**
 * Standard CSS for A4 printing and Word rendering
 */
export const DOCUMENT_STYLES = `
  <style>
    @page {
      size: A4 portrait;
      margin: 20mm 15mm 20mm 20mm;
    }
    @page landscape {
      size: A4 landscape;
      margin: 15mm 15mm 15mm 15mm;
    }
    .page-landscape {
      page: landscape;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #000;
      background: #fff;
      padding: 0;
      margin: 0;
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      font-size: 10pt;
    }
    table.data-table th, table.data-table td {
      border: 1px solid #1e293b;
      padding: 6px 8px;
      vertical-align: top;
    }
    table.data-table th {
      background-color: #f1f5f9;
      font-weight: bold;
      text-align: center;
      color: #0f172a;
    }
    table.signature-table {
      border: none !important;
      width: 100%;
      border-collapse: collapse;
    }
    table.signature-table td {
      border: none !important;
    }
    .badge-blue { background-color: #dbeafe; color: #1e40af; font-weight: 600; padding: 2px 6px; border-radius: 4px; }
    .badge-red { background-color: #fee2e2; color: #991b1b; font-weight: 600; padding: 2px 6px; border-radius: 4px; }
    .badge-yellow { background-color: #fef3c7; color: #92400e; font-weight: 600; padding: 2px 6px; border-radius: 4px; }
    .badge-green { background-color: #dcfce7; color: #166534; font-weight: 600; padding: 2px 6px; border-radius: 4px; }
    .badge-gray { background-color: #f3f4f6; color: #4b5563; font-weight: 600; padding: 2px 6px; border-radius: 4px; }
    h3, h4 {
      margin-top: 14px;
      margin-bottom: 6px;
      font-family: 'Times New Roman', Times, serif;
    }
    p, li {
      text-align: justify;
      line-height: 1.4;
    }
  </style>
`;

/**
 * Print document in an isolated hidden iframe for accurate standard print preview
 */
export function printDocument(htmlContent: string, isLandscape: boolean = false) {
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    Swal.fire({
      icon: 'error',
      title: 'Popup Diblokir',
      text: 'Mohon izinkan pop-up peramban untuk mencetak dokumen.',
      background: '#0f172a',
      color: '#f8fafc',
      confirmButtonColor: '#3b82f6'
    });
    return;
  }

  const orientationStyle = isLandscape ? `
    @page { size: A4 landscape; margin: 12mm; }
  ` : `
    @page { size: A4 portrait; margin: 18mm 15mm; }
  `;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Cetak Dokumen Administrasi</title>
        ${DOCUMENT_STYLES}
        <style>
          ${orientationStyle}
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        ${htmlContent}
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

/**
 * Export document to Microsoft Word (.doc) format with clean formatting
 */
export function exportToWord(htmlContent: string, filename: string, isLandscape: boolean = false) {
  const orientation = isLandscape ? 'landscape' : 'portrait';
  const size = isLandscape ? '29.7cm 21cm' : '21cm 29.7cm';

  const fullWordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${filename}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page WordSection1 {
            size: ${size};
            mso-page-orientation: ${orientation};
            margin: 2.0cm 2.0cm 2.0cm 2.5cm;
            mso-header-margin: 35.4pt;
            mso-footer-margin: 35.4pt;
            mso-paper-source: 0;
          }
          div.WordSection1 {
            page: WordSection1;
          }
          body {
            font-family: 'Times New Roman', serif;
            font-size: 11pt;
            line-height: 1.35;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          table.data-table th, table.data-table td {
            border: 1pt solid windowtext;
            padding: 5pt;
          }
          table.data-table th {
            background: #E2E8F0;
            font-weight: bold;
          }
          table.signature-table {
            border: none !important;
            mso-border-alt: none !important;
          }
          table.signature-table td {
            border: none !important;
            mso-border-alt: none !important;
          }
        </style>
      </head>
      <body>
        <div class="WordSection1">
          ${htmlContent}
        </div>
      </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', fullWordHtml], {
    type: 'application/msword;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `${filename.replace(/[^a-zA-Z0-9_-]/g, '_')}.doc`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);

  Swal.fire({
    icon: 'success',
    title: 'Download Berhasil',
    text: `Dokumen "${filename}.doc" berhasil diunduh dan siap diedit di Microsoft Word.`,
    background: '#0f172a',
    color: '#f8fafc',
    confirmButtonColor: '#3b82f6',
    timer: 2500,
    timerProgressBar: true
  });
}

/**
 * Copy HTML code to clipboard
 */
export async function copyHtmlCode(htmlContent: string) {
  try {
    await navigator.clipboard.writeText(htmlContent);
    Swal.fire({
      icon: 'success',
      title: 'Kode HTML Disalin!',
      text: 'Kode HTML dokumen telah disalin ke clipboard komputer Anda.',
      background: '#0f172a',
      color: '#f8fafc',
      confirmButtonColor: '#10b981',
      timer: 2000,
      timerProgressBar: true
    });
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal Menyalin',
      text: 'Peramban membatasi akses clipboard.',
      background: '#0f172a',
      color: '#f8fafc',
      confirmButtonColor: '#ef4444'
    });
  }
}
