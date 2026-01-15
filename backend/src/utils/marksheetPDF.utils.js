import puppeteer from 'puppeteer';

class MarksheetPDFService {
    constructor() {
    }

    async generateMarksheetPDF(studentData, marksheetData, schoolInfo, isJamiah = false, term = 'annual') {
        try {
            const browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            
            const page = await browser.newPage();
            const htmlContent = this.generateMarksheetHTML(studentData, marksheetData, schoolInfo, isJamiah, term);
            
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
                fileName: `marksheet-${studentData.registrationNo}-${term}-${new Date().getTime()}.pdf`,
                buffer: pdfBuffer
            };
            
        } catch (error) {
            console.error('Error generating marksheet PDF:', error);
            throw error;
        }
    }

    generateMarksheetHTML(studentData, marksheetData, schoolInfo, isJamiah = false, term = 'annual') {
        const academicYear = schoolInfo.academicYear || new Date().getFullYear();
        
        // process marks based on term
        let processedSubjects = [];
        let totalMarks = 0;
        let obtainedMarks = 0;
        
        if (term.toLowerCase() === 'annual') {
            // combine all terms for annual marksheet
            processedSubjects = this.processAnnualSubjects(marksheetData.terms);
            totalMarks = this.calculateTotalMarksAnnual(marksheetData.terms);
            obtainedMarks = this.calculateObtainedMarksAnnual(marksheetData.terms);
        } else {
            // get specific term
            const termNumber = parseInt(term);
            const termData = marksheetData.terms.find(t => t.term === termNumber);
            if (termData) {
                processedSubjects = this.processTermSubjects(termData.subjects);
                totalMarks = this.calculateTotalMarksTerm(termData.subjects);
                obtainedMarks = this.calculateObtainedMarksTerm(termData.subjects);
            }
        }
        
        const percentage = obtainedMarks > 0 ? ((obtainedMarks / totalMarks) * 100).toFixed(2) : 0;
        const grade = this.calculateGrade(percentage, isJamiah);
        const gradeRemarks = this.getGradeRemarks(grade);
        const totalInWords = this.numberToWords(Math.round(obtainedMarks));
        
        return isJamiah 
            ? this.generateJamiahMarksheetHTML(studentData, processedSubjects, schoolInfo, {
                totalMarks, obtainedMarks, percentage, grade, gradeRemarks, totalInWords, term
            })
            : this.generateNormalMarksheetHTML(studentData, processedSubjects, schoolInfo, {
                totalMarks, obtainedMarks, percentage, grade, gradeRemarks, totalInWords, term
            });
    }

    generateNormalMarksheetHTML(studentData, subjects, schoolInfo, calculations) {
        const { totalMarks, obtainedMarks, percentage, grade, gradeRemarks, totalInWords, term } = calculations;
        
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Marksheet - ${studentData.fullName}</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Times New Roman', serif;
                    font-size: 12px;
                    color: #000;
                    background: #fff;
                    padding: 20px;
                    line-height: 1.4;
                }
                
                .marksheet-container {
                    max-width: 800px;
                    margin: 0 auto;
                    border: 2px solid #000;
                    padding: 20px;
                    position: relative;
                }
                
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                
                .school-info {
                    margin-bottom: 10px;
                }
                
                .school-name {
                    font-size: 18px;
                    font-weight: bold;
                    text-transform: uppercase;
                    margin-bottom: 5px;
                }
                
                .school-address {
                    font-size: 11px;
                    margin-bottom: 5px;
                }
                
                .govt-info {
                    display: flex;
                    justify-content: space-between;
                    font-size: 10px;
                    margin-bottom: 5px;
                    padding: 0 10px;
                }
                
                .progress-report-title {
                    font-size: 16px;
                    font-weight: bold;
                    text-decoration: underline;
                    text-align: center;
                    margin: 15px 0;
                }
                
                .term-info {
                    text-align: center;
                    font-weight: bold;
                    font-size: 14px;
                    margin-bottom: 10px;
                    color: #333;
                }
                
                .academic-session {
                    text-align: center;
                    font-weight: bold;
                    margin-bottom: 20px;
                }
                
                .student-info-table {
                    width: 100%;
                    border: 1px solid #000;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                
                .student-info-table td {
                    border: 1px solid #000;
                    padding: 8px 10px;
                    vertical-align: top;
                }
                
                .student-info-table .label {
                    font-weight: bold;
                    width: 30%;
                }
                
                .marks-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    font-size: 11px;
                }
                
                .marks-table th {
                    border: 1px solid #000;
                    padding: 6px 4px;
                    text-align: center;
                    background-color: #f0f0f0;
                    font-weight: bold;
                }
                
                .marks-table td {
                    border: 1px solid #000;
                    padding: 6px 4px;
                    text-align: center;
                }
                
                .marks-table .subject-col {
                    text-align: left;
                    width: 25%;
                }
                
                .marks-table .total-row {
                    font-weight: bold;
                    background-color: #f0f0f0;
                }
                
                .summary-section {
                    margin: 20px 0;
                    padding: 10px;
                    border: 1px solid #000;
                    background-color: #f9f9f9;
                }
                
                .summary-row {
                    display: flex;
                    margin: 5px 0;
                }
                
                .summary-label {
                    font-weight: bold;
                    width: 200px;
                }
                
                .grading-scale {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    font-size: 10px;
                }
                
                .grading-scale th,
                .grading-scale td {
                    border: 1px solid #000;
                    padding: 4px;
                    text-align: center;
                }
                
                .grading-scale th {
                    background-color: #f0f0f0;
                    font-weight: bold;
                }
                
                .total-in-words {
                    margin: 15px 0;
                    padding: 10px;
                    border-top: 1px dashed #000;
                    border-bottom: 1px dashed #000;
                    font-style: italic;
                }
                
                .signature-section {
                    margin-top: 40px;
                    display: flex;
                    justify-content: space-between;
                    padding: 0 30px;
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
                
                .footer {
                    margin-top: 20px;
                    text-align: center;
                    font-size: 10px;
                    color: #666;
                }
                
                .watermark {
                    position: absolute;
                    top: 40%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    font-size: 80px;
                    color: rgba(0,0,0,0.1);
                    z-index: -1;
                    font-weight: bold;
                    opacity: 0.5;
                }
            </style>
        </head>
        <body>
            <div class="watermark">${term === 'annual' ? 'PROGRESS REPORT' : `TERM ${term}`}</div>
            
            <div class="marksheet-container">
                <div class="header">
                    <div class="govt-info">
                        <div>U-DISE CODE: ${schoolInfo.udiseCode || '19072502602'}</div>
                        <div>GOVT.REG.NO. ${schoolInfo.govtRegNo || 'IV/05757/2013'}</div>
                    </div>
                    
                    <div class="school-info">
                        <div class="school-name">SARAL PATH ACADEMY (BOYS)</div>
                        <div class="school-address">
                            Vill - Kankuria, P.O - Miapur, P.S - Raghunathganj, Dist - Murshidabad, Pin No - 742235
                        </div>
                        <div class="school-address">
                            RUN BY: SARAL PATH EDUCATIONAL & WELFARE TRUST(ESTD:2013)
                        </div>
                    </div>
                </div>
                
                <div class="progress-report-title">PROGRESS REPORT</div>
                ${term !== 'annual' ? `<div class="term-info">TERM - ${term}</div>` : ''}
                <div class="academic-session">Academic Session: ${schoolInfo.academicYear || '2025'}</div>
                
                <table class="student-info-table">
                    <tr>
                        <td class="label">Name</td>
                        <td>${studentData.fullName}</td>
                    </tr>
                    <tr>
                        <td class="label">Registration No</td>
                        <td>${studentData.registrationNo}</td>
                    </tr>
                    <tr>
                        <td class="label">Roll No</td>
                        <td>${studentData.rollNo}</td>
                    </tr>
                    <tr>
                        <td class="label">Class</td>
                        <td>${studentData.class}</td>
                    </tr>
                    <tr>
                        <td class="label">Father's Name</td>
                        <td>${studentData.fatherName}</td>
                    </tr>
                </table>
                
                <table class="marks-table">
                    <thead>
                        <tr>
                            <th rowspan="2">Subject</th>
                            <th colspan="3">Summative Evaluation</th>
                            <th rowspan="2">Total Mark</th>
                            <th rowspan="2">Obtained Mark</th>
                            <th rowspan="2">Percentage (%)</th>
                            <th rowspan="2">Grade</th>
                            <th rowspan="2">Remark</th>
                        </tr>
                        <tr>
                            <th>1st</th>
                            <th>2nd</th>
                            <th>3rd</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.generateNormalSubjectsRows(subjects)}
                        
                        <tr class="total-row">
                            <td colspan="4" style="text-align: right;"><strong>GRAND TOTAL:</strong></td>
                            <td><strong>${totalMarks}</strong></td>
                            <td><strong>${obtainedMarks}</strong></td>
                            <td><strong>${percentage}%</strong></td>
                            <td><strong>${grade}</strong></td>
                            <td><strong>${gradeRemarks}</strong></td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="summary-section">
                    <div class="summary-row">
                        <span class="summary-label">Out of Marks:</span>
                        <span>${totalMarks}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">Percentage:</span>
                        <span>${percentage}%</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">Grade:</span>
                        <span>${grade}</span>
                    </div>
                </div>
                
                <table class="grading-scale">
                    <thead>
                        <tr>
                            <th>Grade</th>
                            <th>Min Percentage</th>
                            <th>Max Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.generateGradingScaleRows(false)}
                    </tbody>
                </table>
                
                <div class="total-in-words">
                    <strong>GRAND TOTAL IN WORDS:</strong> ${totalInWords}
                </div>
                
                <div class="signature-section">
                    <div class="signature-box">
                        <div>Class Teacher Signature</div>
                        <div class="signature-line"></div>
                    </div>
                    <div class="signature-box">
                        <div>Head Master Signature</div>
                        <div class="signature-line"></div>
                        <div style="margin-top: 5px;">SARAL PATH ACADEMY</div>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Note: This is a computer generated marksheet. For any discrepancy, contact school administration.</p>
                    <p>Generated on: ${new Date().toLocaleString('en-IN')}</p>
                </div>
            </div>
        </body>
        </html>`;
    }

    generateJamiahMarksheetHTML(studentData, subjects, schoolInfo, calculations) {
        const { totalMarks, obtainedMarks, percentage, grade, gradeRemarks, totalInWords, term } = calculations;
        
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Marksheet - ${studentData.fullName}</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Times New Roman', serif;
                    font-size: 11px;
                    color: #000;
                    background: #fff;
                    padding: 15px;
                    line-height: 1.3;
                }
                
                .marksheet-container {
                    max-width: 800px;
                    margin: 0 auto;
                    border: 1px solid #000;
                    padding: 15px;
                    position: relative;
                }
                
                .header {
                    margin-bottom: 15px;
                    text-align: center;
                }
                
                .jamiah-header {
                    font-size: 12px;
                    line-height: 1.2;
                    margin-bottom: 10px;
                }
                
                .jamiah-header .top-line {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                }
                
                .jamiah-header .school-name {
                    font-size: 14px;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                
                .progress-report-title {
                    font-size: 14px;
                    font-weight: bold;
                    text-align: center;
                    margin: 10px 0;
                }
                
                .term-info {
                    text-align: center;
                    font-weight: bold;
                    font-size: 13px;
                    margin-bottom: 8px;
                    color: #333;
                }
                
                .academic-session {
                    text-align: center;
                    font-weight: bold;
                    margin-bottom: 15px;
                }
                
                .jamiah-marks-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 15px 0;
                    font-size: 10px;
                }
                
                .jamiah-marks-table th {
                    border: 1px solid #000;
                    padding: 4px 3px;
                    text-align: center;
                    background-color: #f0f0f0;
                    font-weight: bold;
                }
                
                .jamiah-marks-table td {
                    border: 1px solid #000;
                    padding: 4px 3px;
                    text-align: center;
                }
                
                .jamiah-marks-table .subject-col {
                    text-align: left;
                    width: 22%;
                }
                
                .jamiah-marks-table .total-row {
                    font-weight: bold;
                    background-color: #f0f0f0;
                }
                
                .summary-box {
                    margin: 15px 0;
                    padding: 8px;
                    border: 1px solid #000;
                    background-color: #f9f9f9;
                    font-size: 10px;
                }
                
                .summary-line {
                    margin: 3px 0;
                }
                
                .grading-scale-jamiah {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 15px 0;
                    font-size: 9px;
                }
                
                .grading-scale-jamiah th,
                .grading-scale-jamiah td {
                    border: 1px solid #000;
                    padding: 3px;
                    text-align: center;
                }
                
                .total-words-jamiah {
                    margin: 10px 0;
                    font-style: italic;
                    font-size: 10px;
                }
                
                .signature-section-jamiah {
                    margin-top: 30px;
                    display: flex;
                    justify-content: space-between;
                    padding: 0 20px;
                }
                
                .signature-box-jamiah {
                    text-align: center;
                    width: 40%;
                    font-size: 10px;
                }
                
                .signature-line-jamiah {
                    border-top: 1px solid #000;
                    width: 70%;
                    margin: 20px auto 3px;
                }
                
                .watermark {
                    position: absolute;
                    top: 40%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    font-size: 70px;
                    color: rgba(0,0,0,0.1);
                    z-index: -1;
                    font-weight: bold;
                    opacity: 0.5;
                }
            </style>
        </head>
        <body>
            <div class="watermark">JAMIAH</div>
            
            <div class="marksheet-container">
                <div class="header">
                    <div class="jamiah-header">
                        <div class="top-line">
                            <span>U-DISE CODE:${schoolInfo.udiseCode || '19072502602'}</span>
                            <span>GOVT.REG.NO.${schoolInfo.govtRegNo || 'IV/05757/2013'}</span>
                        </div>
                        <div class="school-name">JAMIAH AS-SIRATIL MUSTAQEEM AL-MARKAZIAH</div>
                        <div>Vill-Kankuria, P.O-Miapur, P.S-Raghunathganj, Dist-Murshidabad, Pin No-742235</div>
                        <div>RUN BY: SARAL PATH EDUCATIONAL & WELFARE TRUST(ESTD:2013)</div>
                    </div>
                </div>
                
                <div class="progress-report-title">PROGRESS REPORT</div>
                ${term !== 'annual' ? `<div class="term-info">TERM - ${term}</div>` : ''}
                <div class="academic-session">Academic Session: ${schoolInfo.academicYear || new Date().getFullYear()}</div>
                
                <table class="jamiah-marks-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>${studentData.fullName}</th>
                            <th>Registration No</th>
                            <th>${studentData.registrationNo}</th>
                            <th>Roll No</th>
                            <th>${studentData.rollNo}</th>
                            <th>Class</th>
                            <th>${studentData.class}</th>
                            <th>Father's Name</th>
                            <th>${studentData.fatherName}</th>
                        </tr>
                        <tr>
                            <th>Subject</th>
                            <th>1st Summative Evaluation</th>
                            <th>2nd Summative Evaluation</th>
                            <th>3rd Summative Evaluation</th>
                            <th>Total Mark</th>
                            <th>Obtained Mark</th>
                            <th>Percentage (%)</th>
                            <th>Grade</th>
                            <th>Remark</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.generateJamiahSubjectsRows(subjects)}
                        
                        <tr class="total-row">
                            <td colspan="4" style="text-align: right;"><strong>GRAND TOTAL:</strong></td>
                            <td><strong>${totalMarks}</strong></td>
                            <td><strong>${obtainedMarks}</strong></td>
                            <td><strong>${percentage}%</strong></td>
                            <td><strong>${grade}</strong></td>
                            <td><strong>${gradeRemarks}</strong></td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="summary-box">
                    <div class="summary-line">Out of Marks : ${totalMarks}</div>
                    <div class="summary-line">Percentage : ${percentage}%</div>
                    <div class="summary-line">Grade : ${grade}</div>
                    <div class="summary-line">GRAND TOTAL IN WORDS: ${totalInWords}</div>
                </div>
                
                <table class="grading-scale-jamiah">
                    <thead>
                        <tr>
                            <th>Grade</th>
                            <th>Min. Percentage</th>
                            <th>Max. Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.generateGradingScaleRows(true)}
                    </tbody>
                </table>
                
                <div class="signature-section-jamiah">
                    <div class="signature-box-jamiah">
                        <div>Class Teacher Signature</div>
                        <div class="signature-line-jamiah"></div>
                    </div>
                    <div class="signature-box-jamiah">
                        <div>Head (Jamiah)</div>
                        <div class="signature-line-jamiah"></div>
                    </div>
                </div>
            </div>
        </body>
        </html>`;
    }

    generateNormalSubjectsRows(subjects) {
        if (!subjects || !Array.isArray(subjects)) return '';
        
        return subjects.map(subject => `
            <tr>
                <td class="subject-col">${subject.name}</td>
                <td>${subject.firstEvaluation || 0}</td>
                <td>${subject.secondEvaluation || 0}</td>
                <td>${subject.thirdEvaluation || 0}</td>
                <td>${subject.totalMarks || 0}</td>
                <td>${subject.obtainedMarks || 0}</td>
                <td>${subject.percentage || 0}</td>
                <td>${subject.grade || 'N/A'}</td>
                <td>${subject.remark || ''}</td>
            </tr>
        `).join('');
    }

    generateJamiahSubjectsRows(subjects) {
        if (!subjects || !Array.isArray(subjects)) return '';
        
        return subjects.map(subject => `
            <tr>
                <td class="subject-col">${subject.name}</td>
                <td>${subject.firstEvaluation || 0}</td>
                <td>${subject.secondEvaluation || 0}</td>
                <td>${subject.thirdEvaluation || 0}</td>
                <td>${subject.totalMarks || 0}</td>
                <td>${subject.obtainedMarks || 0}</td>
                <td>${subject.percentage || 0}</td>
                <td>${subject.grade || 'N/A'}</td>
                <td>${subject.remark || ''}</td>
            </tr>
        `).join('');
    }

    generateGradingScaleRows(isJamiah) {
        if (isJamiah) {
            return `
                <tr><td>AA</td><td>90%</td><td>100%</td></tr>
                <tr><td>A+</td><td>80%</td><td>89%</td></tr>
                <tr><td>A</td><td>60%</td><td>79%</td></tr>
                <tr><td>B+</td><td>45%</td><td>59%</td></tr>
                <tr><td>B</td><td>30%</td><td>44%</td></tr>
                <tr><td>C</td><td>25%</td><td>34%</td></tr>
                <tr><td>D</td><td>0%</td><td>25%</td></tr>
            `;
        } else {
            return `
                <tr><td>AA</td><td>90%</td><td>100%</td></tr>
                <tr><td>A+</td><td>80%</td><td>89%</td></tr>
                <tr><td>A</td><td>60%</td><td>79%</td></tr>
                <tr><td>B+</td><td>40%</td><td>59%</td></tr>
                <tr><td>B</td><td>30%</td><td>44%</td></tr>
                <tr><td>C</td><td>20%</td><td>34%</td></tr>
                <tr><td>D</td><td>0%</td><td>25%</td></tr>
            `;
        }
    }

    // process subjects for annual marksheet (combine all terms)
    processAnnualSubjects(terms) {
        if (!terms || !Array.isArray(terms)) return [];
        
        const subjectsMap = new Map();
        
        //c\combine all subjects from all terms
        terms.forEach(term => {
            if (term.subjects && Array.isArray(term.subjects)) {
                term.subjects.forEach(subject => {
                    // remove term number from subject name (e.g., "Hifzul Qur'an 3" → "Hifzul Qur'an") ,, need a lil
                    const subjectName = subject.subjectName.replace(/ \d+$/, '').trim();
                    
                    if (!subjectsMap.has(subjectName)) {
                        subjectsMap.set(subjectName, {
                            name: subjectName,
                            evaluations: [],
                            totalMarks: 0,
                            obtainedMarks: 0
                        });
                    }
                    
                    const subjectData = subjectsMap.get(subjectName);
                    
                    // add marks for this term
                    subjectData.evaluations.push({
                        term: term.term,
                        maxMarks: subject.maxMarks || 0,
                        obtainedMarks: subject.obtainedMarks || 0
                    });
                    
                    subjectData.totalMarks += subject.maxMarks || 0;
                    subjectData.obtainedMarks += subject.obtainedMarks || 0;
                });
            }
        });
        
        //convert to array and calculate percentages
        return Array.from(subjectsMap.values()).map(subject => {
            const percentage = subject.totalMarks > 0 ? 
                ((subject.obtainedMarks / subject.totalMarks) * 100).toFixed(2) : 0;
            const grade = this.calculateGrade(percentage, false); // Default grading for normal
            
            // cet evaluations for each term
            const evaluations = subject.evaluations.sort((a, b) => a.term - b.term);
            const firstEval = evaluations.find(e => e.term === 1);
            const secondEval = evaluations.find(e => e.term === 2);
            const thirdEval = evaluations.find(e => e.term === 3);
            
            return {
                name: subject.name,
                firstEvaluation: firstEval ? firstEval.obtainedMarks : 0,
                secondEvaluation: secondEval ? secondEval.obtainedMarks : 0,
                thirdEvaluation: thirdEval ? thirdEval.obtainedMarks : 0,
                totalMarks: subject.totalMarks,
                obtainedMarks: subject.obtainedMarks,
                percentage: parseFloat(percentage),
                grade: grade,
                remark: this.getGradeRemarks(grade)
            };
        });
    }


    processTermSubjects(subjects) {
        if (!subjects || !Array.isArray(subjects)) return [];
        
        return subjects.map(subject => {
            const percentage = subject.maxMarks > 0 ? 
                ((subject.obtainedMarks || 0) / subject.maxMarks * 100).toFixed(2) : 0;
            const grade = this.calculateGrade(percentage, false);
            

            let firstEvaluation = 0;
            let secondEvaluation = 0;
            let thirdEvaluation = 0;
            
            // based on term number, place marks in appropriate column
            // i might need to adjust this based on your actual term structure
            thirdEvaluation = subject.obtainedMarks || 0; // Default to third evaluation
            
            return {
                name: subject.subjectName,
                firstEvaluation: firstEvaluation,
                secondEvaluation: secondEvaluation,
                thirdEvaluation: thirdEvaluation,
                totalMarks: subject.maxMarks || 0,
                obtainedMarks: subject.obtainedMarks || 0,
                percentage: parseFloat(percentage),
                grade: grade,
                remark: this.getGradeRemarks(grade)
            };
        });
    }

    calculateTotalMarksAnnual(terms) {
        if (!terms || !Array.isArray(terms)) return 0;
        
        let total = 0;
        terms.forEach(term => {
            if (term.subjects && Array.isArray(term.subjects)) {
                term.subjects.forEach(subject => {
                    total += subject.maxMarks || 0;
                });
            }
        });
        return total;
    }

    calculateObtainedMarksAnnual(terms) {
        if (!terms || !Array.isArray(terms)) return 0;
        
        let obtained = 0;
        terms.forEach(term => {
            if (term.subjects && Array.isArray(term.subjects)) {
                term.subjects.forEach(subject => {
                    obtained += subject.obtainedMarks || 0;
                });
            }
        });
        return obtained;
    }

    calculateTotalMarksTerm(subjects) {
        if (!subjects || !Array.isArray(subjects)) return 0;
        return subjects.reduce((total, subject) => total + (subject.maxMarks || 0), 0);
    }

    calculateObtainedMarksTerm(subjects) {
        if (!subjects || !Array.isArray(subjects)) return 0;
        return subjects.reduce((total, subject) => total + (subject.obtainedMarks || 0), 0);
    }

    calculateGrade(percentage, isJamiah) {
        percentage = parseFloat(percentage);
        
        if (isJamiah) {
            if (percentage >= 90) return 'AA';
            if (percentage >= 80) return 'A+';
            if (percentage >= 60) return 'A';
            if (percentage >= 45) return 'B+';
            if (percentage >= 30) return 'B';
            if (percentage >= 25) return 'C';
            return 'D';
        } else {
            if (percentage >= 90) return 'AA';
            if (percentage >= 80) return 'A+';
            if (percentage >= 60) return 'A';
            if (percentage >= 40) return 'B+';
            if (percentage >= 30) return 'B';
            if (percentage >= 20) return 'C';
            return 'D';
        }
    }

    getGradeRemarks(grade) {
        const remarks = {
            'AA': 'Outstanding',
            'A+': 'Excellent',
            'A': 'Very Good',
            'B+': 'Good',
            'B': 'Satisfactory',
            'C': 'Needs Improvement',
            'D': 'Poor'
        };
        return remarks[grade] || '';
    }

    numberToWords(num) {
        if (num === 0) return 'Zero';
        
        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        
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
        
        return result.trim() || 'Zero';
    }
}

export default MarksheetPDFService;