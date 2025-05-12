// This file handles the PDF processing functionalities, including merging, compressing, and editing PDFs using the pdf-lib library.

document.addEventListener('DOMContentLoaded', function() {
    const uploadButton = document.getElementById('upload-pdf');
    const mergeButton = document.getElementById('merge-pdfs');
    const compressButton = document.getElementById('compress-pdf');
    const outputArea = document.getElementById('output');

    uploadButton.addEventListener('change', handleFileUpload);
    mergeButton.addEventListener('click', mergePDFs);
    compressButton.addEventListener('click', compressPDF);

    let pdfFiles = [];

    function handleFileUpload(event) {
        const files = event.target.files;
        pdfFiles = Array.from(files);
        outputArea.innerHTML = `${pdfFiles.length} file(s) selected.`;
    }

    async function mergePDFs() {
        if (pdfFiles.length < 2) {
            alert('Please upload at least two PDF files to merge.');
            return;
        }

        const { PDFDocument } = PDFLib;
        const mergedPdf = await PDFDocument.create();

        for (const file of pdfFiles) {
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const mergedPdfFile = await mergedPdf.save();
        downloadPDF(mergedPdfFile, 'merged.pdf');
    }

    async function compressPDF() {
        if (pdfFiles.length === 0) {
            alert('Please upload a PDF file to compress.');
            return;
        }

        const { PDFDocument } = PDFLib;
        const pdfFile = pdfFiles[0];
        const pdfBytes = await pdfFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);

        // Here you can implement compression logic if needed
        const compressedPdfFile = await pdfDoc.save({ useObjectStreams: false });
        downloadPDF(compressedPdfFile, 'compressed.pdf');
    }

    function downloadPDF(pdfBytes, filename) {
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }
});