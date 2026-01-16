import MarksheetPDFService from '../utils/marksheetPDF.utils.js';
import { Marksheet } from '../models/marksheet.models.js';
import { Student } from '../models/student.models.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const marksheetService = new MarksheetPDFService();

const generateMarksheet = asyncHandler(async (req, res) => {
    try {
        const { studentId } = req.params;
        const { term = 'annual' } = req.query; // 'annual', '1', '2', '3'
        
        const student = await Student.findById(studentId);
        if (!student) {
            throw new ApiError(404, "Student not found");
        }
        
        const marksheet = await Marksheet.findOne({
            student: studentId,
        }).populate('student', 'fullName registrationNo rollNo typeOfClass fatherName');
        
        if (!marksheet) {
            throw new ApiError(404, `Marksheet not found for student`);
        }
        
        // gotta add rapid and edadiath I, II , III
        // determine if Jamiah or Normal based on class type
        const isJamiah = student.typeOfClass && (
            student.typeOfClass.includes('Jamiah') || 
            student.typeOfClass.includes('jamiah') ||
            ['22', '71', '81', '91'].includes(student.typeOfClass?.toString() || '')
        );
        
        const schoolInfo = {
            udiseCode: '19072502602',
            govtRegNo: 'IV/05757/2013',
            academicYear: marksheet.academicYear || new Date().getFullYear().toString()
        };
        

        const studentData = {
            fullName: student.fullName || '',
            registrationNo: student.registerNo || student.registrationNo || 'N/A',
            rollNo: student.rollNo || marksheet.rollNo || 'N/A',
            class: `${student.typeOfClass || ''}${student.section ? ` (${student.section})` : ''}`,
            gurdianName: student.gurdianName || 'N/A'
        };
        
        // generate PDF
        const pdfResult = await marksheetService.generateMarksheetPDF(
            studentData,
            marksheet,
            schoolInfo,
            isJamiah,
            term
        );
        
        // (buffer only)
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${pdfResult.fileName}"`);
        res.send(pdfResult.buffer);
        
    } catch (error) {
        console.error('Error generating marksheet:', error);
        throw new ApiError(500, error.message || 'Internal server error');
    }
});

// preview marksheet HTML
const previewMarksheet = asyncHandler(async (req, res) => {
    try {
        const { studentId } = req.params;
        const { term = 'annual' } = req.query;
        
        const student = await Student.findById(studentId);
        if (!student) {
            throw new ApiError(404, "Student not found");
        }
        
        const marksheet = await Marksheet.findOne({
            student: studentId,
        });
        
        if (!marksheet) {
            throw new ApiError(404, "Marksheet not found");
        }
        
        const isJamiah = student.typeOfClass && (
            student.typeOfClass.includes('Jamiah') || 
            student.typeOfClass.includes('jamiah') ||
            ['22', '71', '81', '91'].includes(student.typeOfClass?.toString() || '')
        );
        
        const schoolInfo = {
            udiseCode: '19072502602',
            govtRegNo: 'IV/05757/2013',
            academicYear: marksheet.academicYear || new Date().getFullYear().toString()
        };
        
        const studentData = {
            fullName: student.fullName || '',
            registrationNo: student.registerNo || student.registrationNo || 'N/A',
            rollNo: student.rollNo || marksheet.rollNo || 'N/A',
            class: `${student.typeOfClass || ''}${student.section ? ` (${student.section})` : ''}`,
            fatherName: student.fatherName || 'N/A'
        };
        
        // Generate HTML for preview
        const htmlContent = marksheetService.generateMarksheetHTML(
            studentData,
            marksheet,
            schoolInfo,
            isJamiah,
            term
        );
        
        res.setHeader('Content-Type', 'text/html');
        res.send(htmlContent);
        
    } catch (error) {
        console.error('Error previewing marksheet:', error);
        throw new ApiError(500, error.message || 'Internal server error');
    }
});

// generate marksheet for multiple students (batch)
const generateMultipleMarksheets = asyncHandler(async (req, res) => {
    try {
        const { studentIds, term = 'annual' } = req.body;
        
        if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
            throw new ApiError(400, "Please provide an array of student IDs");
        }
        
        const results = [];
        
        // process each student
        for (const studentId of studentIds) {
            try {
                const student = await Student.findById(studentId);
                if (!student) {
                    results.push({
                        studentId,
                        success: false,
                        error: "Student not found"
                    });
                    continue;
                }
                
                const marksheet = await Marksheet.findOne({
                    student: studentId,
                });
                
                if (!marksheet) {
                    results.push({
                        studentId,
                        success: false,
                        error: "Marksheet not found for student"
                    });
                    continue;
                }
                
                const isJamiah = student.typeOfClass && (
                    student.typeOfClass.includes('Jamiah') || 
                    student.typeOfClass.includes('jamiah') ||
                    ['22', '71', '81', '91'].includes(student.typeOfClass?.toString() || '')
                );
                
                const schoolInfo = {
                    udiseCode: '19072502602',
                    govtRegNo: 'IV/05757/2013',
                    academicYear: marksheet.academicYear || new Date().getFullYear().toString()
                };
                
                const studentData = {
                    fullName: student.fullName || '',
                    registrationNo: student.registerNo || student.registrationNo || 'N/A',
                    rollNo: student.rollNo || marksheet.rollNo || 'N/A',
                    class: `${student.typeOfClass || ''}${student.section ? ` (${student.section})` : ''}`,
                    fatherName: student.fatherName || 'N/A'
                };
                
                const pdfResult = await marksheetService.generateMarksheetPDF(
                    studentData,
                    marksheet,
                    schoolInfo,
                    isJamiah,
                    term
                );
                
                results.push({
                    studentId,
                    studentName: student.fullName,
                    success: true,
                    buffer: pdfResult.buffer,
                    fileName: pdfResult.fileName
                });
                
            } catch (error) {
                console.error(`Error processing student ${studentId}:`, error);
                results.push({
                    studentId,
                    success: false,
                    error: error.message
                });
            }
        }
        
        // counting successful results
        const successfulResults = results.filter(r => r.success);
        
        if (successfulResults.length === 0) {
            throw new ApiError(400, "No marksheets could be generated for the provided students");
        }
        
        // for single PDF, return directly
        if (successfulResults.length === 1) {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${successfulResults[0].fileName}"`);
            return res.send(successfulResults[0].buffer);
        }
        
        // for multiple PDFs, create ZIP
        const JSZip = require('jszip');
        const zip = new JSZip();
        
        successfulResults.forEach(result => {
            if (result.success && result.buffer) {
                zip.file(result.fileName, result.buffer);
            }
        });
        
        // Add a summary file
        const summary = {
            generated: successfulResults.length,
            failed: results.length - successfulResults.length,
            term: term,
            date: new Date().toISOString(),
            details: results.map(r => ({
                studentId: r.studentId,
                success: r.success,
                error: r.error || null
            }))
        };
        
        zip.file('generation-summary.json', JSON.stringify(summary, null, 2));
        
        // Generate zip file
        const zipBuffer = await zip.generateAsync({ 
            type: 'nodebuffer',
            compression: "DEFLATE",
            compressionOptions: {
                level: 6
            }
        });
        
        // Send zip file
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="marksheets-${term}-${Date.now()}.zip"`);
        res.send(zipBuffer);
        
    } catch (error) {
        console.error('Error generating multiple marksheets:', error);
        throw new ApiError(500, error.message || 'Internal server error');
    }
});

const downloadMarksheet = asyncHandler(async (req, res) => {
    try {
        const { studentId } = req.params;
        const { term = 'annual' } = req.query;
        
        const student = await Student.findById(studentId);
        if (!student) {
            throw new ApiError(404, "Student not found");
        }
        
        const marksheet = await Marksheet.findOne({
            student: studentId,
        });
        
        if (!marksheet) {
            throw new ApiError(404, "Marksheet not found");
        }
        
        const isJamiah = student.typeOfClass && (
            student.typeOfClass.includes('Jamiah') || 
            student.typeOfClass.includes('jamiah') ||
            ['22', '71', '81', '91'].includes(student.typeOfClass?.toString() || '')
        );
        
        const schoolInfo = {
            udiseCode: '19072502602',
            govtRegNo: 'IV/05757/2013',
            academicYear: marksheet.academicYear || new Date().getFullYear().toString()
        };
        
        const studentData = {
            fullName: student.fullName || '',
            registrationNo: student.registerNo || student.registrationNo || 'N/A',
            rollNo: student.rollNo || marksheet.rollNo || 'N/A',
            class: `${student.typeOfClass || ''}${student.section ? ` (${student.section})` : ''}`,
            fatherName: student.fatherName || 'N/A'
        };
        
        const pdfResult = await marksheetService.generateMarksheetPDF(
            studentData,
            marksheet,
            schoolInfo,
            isJamiah,
            term
        );
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${pdfResult.fileName}"`);
        res.setHeader('Content-Length', pdfResult.buffer.length);
        
        res.send(pdfResult.buffer);
        
    } catch (error) {
        console.error('Error downloading marksheet:', error);
        throw new ApiError(500, error.message || 'Internal server error');
    }
});

// get marksheet info (without generating PDF)
const getMarksheetInfo = asyncHandler(async (req, res) => {
    try {
        const { studentId } = req.params;
        
        const student = await Student.findById(studentId);
        if (!student) {
            throw new ApiError(404, "Student not found");
        }
        
        const marksheet = await Marksheet.findOne({
            student: studentId,
        });
        
        if (!marksheet) {
            throw new ApiError(404, "Marksheet not found");
        }
        
        // Calculate totals
        const totalMarks = marksheetService.calculateTotalMarksAnnual(marksheet.terms);
        const obtainedMarks = marksheetService.calculateObtainedMarksAnnual(marksheet.terms);
        const percentage = obtainedMarks > 0 ? ((obtainedMarks / totalMarks) * 100).toFixed(2) : 0;
        
        const isJamiah = student.typeOfClass && (
            student.typeOfClass.includes('Jamiah') || 
            student.typeOfClass.includes('jamiah') ||
            ['22', '71', '81', '91'].includes(student.typeOfClass?.toString() || '')
        );
        
        const grade = marksheetService.calculateGrade(percentage, isJamiah);
        
        return res.status(200).json({
            success: true,
            data: {
                student: {
                    id: student._id,
                    fullName: student.fullName,
                    registerNo: student.registerNo,
                    typeOfClass: student.typeOfClass,
                    section: student.section,
                    fatherName: student.fatherName
                },
                marksheet: {
                    id: marksheet._id,
                    academicYear: marksheet.academicYear,
                    totalMarks,
                    obtainedMarks,
                    percentage: parseFloat(percentage),
                    grade,
                    terms: marksheet.terms.length,
                    hasData: obtainedMarks > 0
                },
                pdfInfo: {
                    canGenerate: true,
                    formats: ['annual', '1', '2', '3'],
                    isJamiah
                }
            }
        });
        
    } catch (error) {
        console.error('Error getting marksheet info:', error);
        throw new ApiError(500, error.message || 'Internal server error');
    }
});

export { 
    generateMarksheet, 
    previewMarksheet, 
    generateMultipleMarksheets,
    downloadMarksheet,
    getMarksheetInfo 
};
