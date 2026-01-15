import puppeteer from 'puppeteer';

class InvoicePDFService {
    constructor() {
    }

    async generateInvoicePDF(studentData, feeDetails, schoolInfo) {
        try {
            const browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            
            const page = await browser.newPage();
            const htmlContent = this.generateInvoiceHTML(studentData, feeDetails, schoolInfo);
            
            await page.setContent(htmlContent, {
                waitUntil: 'networkidle0'
            });
            
            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '20px',
                    right: '20px',
                    bottom: '20px',
                    left: '20px'
                }
            });
            
            await browser.close();
            
            return {
                fileName: `invoice-${studentData.registerNo}-${new Date().getTime()}.pdf`,
                buffer: pdfBuffer
            };
            
        } catch (error) {
            console.error('Error generating invoice PDF:', error);
            throw error;
        }
    }

    generateInvoiceHTML(studentData, feeDetails, schoolInfo) {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        
        // Format amount in words
        const amountInWords = this.numberToWords(feeDetails.feeAmount + feeDetails.fine);
        
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invoice - ${studentData.fullName}</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    color: #000;
                    background: #fff;
                    padding: 20px;
                }
                
                .invoice-container {
                    max-width: 800px;
                    margin: 0 auto;
                    border: 1px solid #000;
                    padding: 20px;
                }
                
                .header {
                    text-align: center;
                    border-bottom: 2px solid #000;
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                }
                
                .school-name {
                    font-size: 24px;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin-bottom: 5px;
                }
                
                .school-address {
                    font-size: 11px;
                    margin-bottom: 5px;
                }
                
                .invoice-title {
                    font-size: 18px;
                    font-weight: bold;
                    margin: 15px 0;
                    text-decoration: underline;
                }
                
                .invoice-details {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                }
                
                .invoice-details div {
                    flex: 1;
                }
                
                .bill-to {
                    margin-bottom: 20px;
                }
                
                .bill-to h4 {
                    border-bottom: 1px solid #000;
                    padding-bottom: 5px;
                    margin-bottom: 10px;
                }
                
                .student-info {
                    line-height: 1.8;
                }
                
                .fees-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }
                
                .fees-table th {
                    background-color: #f0f0f0;
                    border: 1px solid #000;
                    padding: 8px;
                    text-align: left;
                    font-weight: bold;
                }
                
                .fees-table td {
                    border: 1px solid #000;
                    padding: 8px;
                }
                
                .fees-table .total-row {
                    background-color: #f0f0f0;
                    font-weight: bold;
                }
                
                .amount-details {
                    margin-top: 20px;
                    padding: 15px;
                    border: 1px solid #000;
                    background-color: #f9f9f9;
                }
                
                .amount-details p {
                    margin: 5px 0;
                    line-height: 1.6;
                }
                
                .amount-in-words {
                    font-style: italic;
                    margin: 15px 0;
                    padding: 10px;
                    border-top: 1px dashed #000;
                    border-bottom: 1px dashed #000;
                }
                
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 11px;
                    border-top: 1px solid #000;
                    padding-top: 10px;
                }
                
                .signature-section {
                    margin-top: 40px;
                    display: flex;
                    justify-content: space-between;
                }
                
                .signature-box {
                    text-align: center;
                    width: 45%;
                }
                
                .signature-line {
                    border-top: 1px solid #000;
                    width: 80%;
                    margin: 30px auto 5px;
                }
                
                .stamp {
                    position: absolute;
                    right: 50px;
                    bottom: 100px;
                    opacity: 0.7;
                }
                
                .watermark {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    font-size: 60px;
                    color: rgba(0,0,0,0.1);
                    z-index: -1;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="watermark">PAID</div>
            
            <div class="invoice-container">
                <div class="header">
                    <div class="school-name">SARAL PATH ACADEMY</div>
                    <div class="school-address">
                        ${schoolInfo.address || 'Vill - kankuria, Po- Miapur, P.s - Raghunathganj, Dist- Murshidabad, Pin No - 742235'}
                    </div>
                    <div class="school-address">
                        WhatsApp: ${schoolInfo.whatsapp || '8514868658 , 7908573548'} | Email: ${schoolInfo.email || 'saralpath2013@gmail.com'}
                    </div>
                </div>
                
                <div class="invoice-title">FEE RECEIPT</div>
                
                <div class="invoice-details">
                    <div>
                        <p><strong>Bill No:</strong> #${schoolInfo.invoiceNumber || '2502'}</p>
                        <p><strong>Date:</strong> ${formattedDate}</p>
                    </div>
                    <div>
                        <p><strong>Academic Year:</strong> ${schoolInfo.academicYear || '2025-2026'}</p>
                    </div>
                </div>
                
                <div class="bill-to">
                    <h4>BILL TO:</h4>
                    <div class="student-info">
                        <p><strong>Name:</strong> ${studentData.fullName}</p>
                        <p><strong>Register No:</strong> ${studentData.registerNo || 'N/A'}</p>
                        <p><strong>Class:</strong> ${studentData.classCurrent || 'N/A'} (${studentData.typeOfClass || 'N/A'}) (${studentData.section || 'N/A'})</p>
                        <p><strong>Father's Name:</strong> ${studentData.gurdianName || 'N/A'}</p>
                        <p><strong>Address:</strong> ${studentData.address || 'N/A'}</p>
                        <p><strong>Mobile:</strong> ${studentData.phoneNumber || 'N/A'}</p>
                    </div>
                </div>
                
                <table class="fees-table">
                    <thead>
                        <tr>
                            <th>Fees Type</th>
                            <th>Status</th>
                            <th>Payment Date</th>
                            <th>Method</th>
                            <th>Amount</th>
                            <th>Discount</th>
                            <th>Fine</th>
                            <th>Paid</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${feeDetails.month} Month Fees</td>
                            <td>PAID</td>
                            <td>${formattedDate}</td>
                            <td>${feeDetails.paymentMethod}</td>
                            <td>₹${feeDetails.feeAmount.toFixed(2)}</td>
                            <td>₹${feeDetails.discount.toFixed(2)}</td>
                            <td>₹${feeDetails.fine.toFixed(2)}</td>
                            <td>₹${feeDetails.totalPaid.toFixed(2)}</td>
                            <td>₹0.00</td>
                        </tr>
                        <tr class="total-row">
                            <td colspan="4" style="text-align: right;"><strong>Total:</strong></td>
                            <td>₹${feeDetails.feeAmount.toFixed(2)}</td>
                            <td>₹${feeDetails.discount.toFixed(2)}</td>
                            <td>₹${feeDetails.fine.toFixed(2)}</td>
                            <td>₹${feeDetails.totalPaid.toFixed(2)}</td>
                            <td>₹0.00</td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="amount-details">
                    <p><strong>Grand Total:</strong> ₹${feeDetails.feeAmount.toFixed(2)}</p>
                    <p><strong>Total Paid (with fine):</strong> ₹${parseInt(feeDetails.feeAmount.toFixed(2)) + parseInt(feeDetails.fine.toFixed(2))}</p>
                    <div class="amount-in-words">
                        <strong>Amount in Words:</strong> ${amountInWords} Only
                    </div>
                    <p><strong>Payment Method:</strong> ${feeDetails.paymentMethod}</p>
                    <p><strong>Remarks:</strong> ${feeDetails.remarks || 'N/A'}</p>
                </div>
                
                <div class="signature-section">
                    <div class="signature-box">
                        <div>Student's Signature</div>
                        <div class="signature-line"></div>
                    </div>
                    <div class="signature-box">
                        <div>Accountant's Signature</div>
                        <div class="signature-line"></div>
                        <div style="margin-top: 5px;">For SARAL PATH ACADEMY</div>
                    </div>
                </div>
                
                <div class="footer">
                    <p><strong>Note:</strong> This is a computer generated receipt. No signature required.</p>
                    <p>Please keep this receipt for future reference.</p>
                    <p>Generated on: ${currentDate.toLocaleString('en-IN')}</p>
                </div>
                
                <div class="stamp">
                    <div style="border: 2px solid red; padding: 5px 10px; border-radius: 5px; transform: rotate(15deg); color: red; font-weight: bold;">
                        PAID<br>SARAL PATH
                    </div>
                </div>
            </div>
        </body>
        </html>`;
    }

    numberToWords(num) {
        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        
        if (num === 0) return 'Zero';
        
        function convertHundreds(n) {
            let result = '';
            if (n >= 100) {
                result += ones[Math.floor(n / 100)] + ' Hundred ';
                n %= 100;
            }
            if (n >= 20) {
                result += tens[Math.floor(n / 10)] + ' ';
                n %= 10;
            } else if (n >= 10) {
                result += teens[n - 10] + ' ';
                n = 0;
            }
            if (n > 0) {
                result += ones[n] + ' ';
            }
            return result.trim();
        }
        
        let result = '';
        if (num >= 10000000) {
            result += convertHundreds(Math.floor(num / 10000000)) + ' Crore ';
            num %= 10000000;
        }
        if (num >= 100000) {
            result += convertHundreds(Math.floor(num / 100000)) + ' Lakh ';
            num %= 100000;
        }
        if (num >= 1000) {
            result += convertHundreds(Math.floor(num / 1000)) + ' Thousand ';
            num %= 1000;
        }
        if (num > 0) {
            result += convertHundreds(num);
        }
        
        return result.trim() + ' Rupees';
    }
}

export default InvoicePDFService;