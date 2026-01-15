import puppeteer from 'puppeteer';

export default class AdmitCardPDFService {
    constructor() {
    }

    async generateAdmitCard(studentData, schoolLogoPath) {
        try {
            const browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            
            const page = await browser.newPage();
            const htmlContent = this.generateHTML(studentData, schoolLogoPath);
            
            await page.setContent(htmlContent, {
                waitUntil: 'networkidle0'
            });
            
            // generating pdf buffer
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
                fileName: `admit-card-${studentData.applicationId}.pdf`,
                buffer: pdfBuffer
            };
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        }
    }

    generateHTML(studentData, schoolLogoPath) {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Admit Card - ${studentData.studentName}</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    margin: 0;
                    padding: 20px;
                    color: #333;
                }
                
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 3px solid #2c3e50;
                    padding-bottom: 20px;
                }
                
                .school-logo {
                    max-width: 150px;
                    height: auto;
                    margin-bottom: 10px;
                }
                
                .school-name {
                    font-size: 28px;
                    font-weight: bold;
                    color: #2c3e50;
                    margin: 10px 0;
                }
                
                .admit-card-title {
                    font-size: 24px;
                    color: #e74c3c;
                    margin: 15px 0;
                    text-transform: uppercase;
                }
                
                .student-info-container {
                    display: flex;
                    gap: 30px;
                    margin-bottom: 30px;
                }
                
                .student-photo-section {
                    flex: 1;
                    text-align: center;
                }
                
                .student-photo {
                    width: 180px;
                    height: 220px;
                    object-fit: cover;
                    border: 2px solid #34495e;
                    border-radius: 5px;
                    background-color: #f8f9fa;
                }
                
                .student-details-section {
                    flex: 2;
                }
                
                .info-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                
                .info-table th {
                    background-color: #34495e;
                    color: white;
                    padding: 12px;
                    text-align: left;
                    width: 35%;
                }
                
                .info-table td {
                    padding: 12px;
                    border: 1px solid #ddd;
                }
                
                .info-table tr:nth-child(even) {
                    background-color: #f8f9fa;
                }
                
                .section-title {
                    background-color: #2c3e50;
                    color: white;
                    padding: 10px;
                    font-size: 18px;
                    margin: 20px 0 10px 0;
                    border-radius: 4px;
                }
                
                .footer {
                    margin-top: 40px;
                    text-align: center;
                    font-size: 14px;
                    color: #7f8c8d;
                    border-top: 2px dashed #bdc3c7;
                    padding-top: 20px;
                }
                
                .signature-section {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 40px;
                    padding: 20px;
                }
                
                .signature-box {
                    text-align: center;
                    width: 45%;
                }
                
                .signature-line {
                    border-top: 1px solid #333;
                    width: 80%;
                    margin: 20px auto;
                }
                
                .instructions {
                    background-color: #f8f9fa;
                    padding: 15px;
                    border-left: 4px solid #3498db;
                    margin: 20px 0;
                }
                
                .instructions h4 {
                    margin-top: 0;
                    color: #2c3e50;
                }
                
                .barcode-placeholder {
                    text-align: center;
                    margin: 20px 0;
                    padding: 10px;
                    background-color: #f5f5f5;
                    border: 1px dashed #ccc;
                }
                
                @media print {
                    .no-print {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <img src="${schoolLogoPath}" alt="School Logo" class="school-logo">
                <div class="school-name">SARALPATH ACADEMY</div>
                <div class="admit-card-title">Admit Card for Academic Session ${(new Date().getFullYear() - 1)} - ${new Date().getFullYear()}</div>
            </div>
            
            <div class="student-info-container">
                <div class="student-photo-section">
                    <div style="font-weight: bold; margin-bottom: 10px;">Student Photo</div>
                    <img src="${studentData.photoPath || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgwIiBoZWlnaHQ9IjIyMCIgdmlld0JveD0iMCAwIDE4MCAyMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE4MCIgaGVpZ2h0PSIyMjAiIGZpbGw9IiNFNUU1RTUiLz48Y2lyY2xlIGN4PSI5MCIgY3k9IjcwIiByPSI0MCIgZmlsbD0iI0NDQyIvPjxwYXRoIGQ9Ik0zMCAxNjBDMzAgMTMwIDYwIDEyMCA5MCAxMjAgMTIwIDEyMCAxNTAgMTMwIDE1MCAxNjAiIHN0cm9rZT0iI0NDQyIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+'}" 
                         alt="Student Photo" 
                         class="student-photo">
                </div>
                
                <div class="student-details-section">
                    <h3 style="color: #2c3e50; margin-bottom: 15px;">Student Information</h3>
                    
                    <table class="info-table">
                        <tr>
                            <th>Student Name</th>
                            <td>${studentData.studentName || 'N/A'}</td>
                        </tr>
                        <tr>
                            <th>Application ID</th>
                            <td><strong>${studentData.applicationId || 'N/A'}</strong></td>
                        </tr>
                        <tr>
                            <th>Date of Birth</th>
                            <td>${this.formatDate(studentData.dob) || 'N/A'}</td>
                        </tr>
                        <tr>
                            <th>Class</th>
                            <td>${studentData.class || 'N/A'}</td>
                        </tr>
                        <tr>
                            <th>Type</th>
                            <td>${studentData.typeOfClass || 'N/A'}</td>
                        </tr>
                        <tr>
                            <th>Guardian's Name</th>
                            <td>${studentData.guardianName || studentData.fatherName || 'N/A'}</td>
                        </tr>
                        <tr>
                            <th>Mobile Number</th>
                            <td>${studentData.mobile || 'N/A'}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>${studentData.email || 'N/A'}</td>
                        </tr>
                        <tr>
                            <th>Address</th>
                            <td>${studentData.address || 'N/A'}</td>
                        </tr>
                    </table>
                </div>
            </div>
            
            <div class="section-title">Examination Details</div>
            <table class="info-table">
                <tr>
                    <th>Examination Date</th>
                    <td>To be announced</td>
                </tr>
                <tr>
                    <th>Examination Time</th>
                    <td>9:00 AM - 12:00 PM</td>
                </tr>
                <tr>
                    <th>Examination Center</th>
                    <td>Saral Path Finder Main Campus, Block A</td>
                </tr>
                <tr>
                    <th>Reporting Time</th>
                    <td>8:30 AM</td>
                </tr>
            </table>
            
            <div class="instructions">
                <h4>Important Instructions:</h4>
                <ul>
                    <li>Bring this admit card to the examination center</li>
                    <li>Carry original ID proof (Aadhaar Card/Birth Certificate)</li>
                    <li>Report 30 minutes before examination time</li>
                    <li>No electronic devices allowed in examination hall</li>
                    <li>Follow all COVID-19 safety protocols</li>
                </ul>
            </div>
            
            <div class="barcode-placeholder">
                <div>Application ID: ${studentData.applicationId || 'N/A'}</div>
                <small>(Barcode will be generated here)</small>
            </div>
            
            <div class="signature-section">
                <div class="signature-box">
                    <div>Student's Signature</div>
                    <div class="signature-line"></div>
                </div>
                <div class="signature-box">
                    <div>Principal's Signature</div>
                    <div class="signature-line"></div>
                    <div style="margin-top: 5px;">Saral Path Finder School</div>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>Note:</strong> This is a computer generated admit card. No signature required.</p>
                <p>For any queries, contact: examcell@saralpathfinder.edu.in | Phone: +91-XXX-XXXXXXX</p>
                <p>Generated on: ${new Date().toLocaleDateString('en-IN')}</p>
            </div>
        </body>
        </html>`;
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    }

    async generateMultipleAdmitCards(studentsData, schoolLogoPath) {
        const results = [];
        
        for (const student of studentsData) {
            try {
                const result = await this.generateAdmitCard(student, schoolLogoPath);
                results.push({
                    studentId: student.applicationId,
                    success: true,
                    buffer: result.buffer,
                    fileName: result.fileName
                });
            } catch (error) {
                results.push({
                    studentId: student.applicationId,
                    success: false,
                    error: error.message
                });
            }
        }
        
        return results;
    }
}