// marksheet.controllers.js
import MarksheetPDFService from '../utils/marksheetPDF.utils.js';
import { Marksheet } from '../models/marksheet.models.js';
import { Student } from '../models/student.models.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const marksheetService = new MarksheetPDFService();

const generateMarksheet = asyncHandler(async (req, res) => {
    try {
        const { studentId } = req.params;
        const { term = 'annual' } = req.query; // 'annual', '1', '2', '3' thining to chagne a lil logic as per here
        
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
        
        // Determine if Jamiah or Normal based on class type
        const isJamiah = student.typeOfClass && (
            student.typeOfClass.includes('Jamiah') || 
            student.typeOfClass.includes('jamiah') ||
            ['22', '71', '81', '91'].includes(student.typeOfClass.toString())
        );
        
        const schoolInfo = {
            udiseCode: '19072502602',
            govtRegNo: 'IV/05757/2013',
            academicYear: marksheet.academicYear || '2025'
        };
        
        // Student data - FIX: use correct field names from your student model
        const studentData = {
            fullName: student.fullName,
            registrationNo: student.registerNo || student.registrationNo,
            rollNo: student.rollNo || marksheet.rollNo,
            class: `${student.typeOfClass}${student.section ? ` (${student.section})` : ''}`,
            fatherName: student.fatherName
        };
        
        const pdfResult = await marksheetService.generateMarksheetPDF(
            studentData,
            marksheet,
            schoolInfo,
            isJamiah,
            term
        );
        
        // steaming dire ly to browser ini buffer
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${pdfResult.fileName}"`);
        res.send(pdfResult.buffer);
        
    } catch (error) {
        console.error('Error generating marksheet:', error);
        throw new ApiError(500, error.message || 'Internal server error');
    }
});

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
            ['22', '71', '81', '91'].includes(student.typeOfClass.toString())
        );
        
        const schoolInfo = {
            udiseCode: '19072502602',
            govtRegNo: 'IV/05757/2013',
            academicYear: marksheet.academicYear || '2025'
        };
        
        const studentData = {
            fullName: student.fullName,
            registrationNo: student.registerNo || student.registrationNo,
            rollNo: student.rollNo || marksheet.rollNo,
            class: student.typeOfClass,
            fatherName: student.fatherName
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
        
        const results = [];
        
        for (const studentId of studentIds) {
            try {
                const student = await Student.findById(studentId);
                if (!student) continue;
                
                const marksheet = await Marksheet.findOne({
                    student: studentId,
                });
                
                if (!marksheet) continue;
                
                const isJamiah = student.typeOfClass && (
                    student.typeOfClass.includes('Jamiah') || 
                    student.typeOfClass.includes('jamiah') ||
                    ['22', '71', '81', '91'].includes(student.typeOfClass.toString())
                );
                
                const schoolInfo = {
                    udiseCode: '19072502602',
                    govtRegNo: 'IV/05757/2013',
                    academicYear: marksheet.academicYear || '2025'
                };
                
                const studentData = {
                    fullName: student.fullName,
                    registrationNo: student.registerNo || student.registrationNo,
                    rollNo: student.rollNo || marksheet.rollNo,
                    class: student.typeOfClass,
                    fatherName: student.fatherName
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
                results.push({
                    studentId,
                    success: false,
                    error: error.message
                });
            }
        }
        
        // for single PDF, return directly
        if (results.length === 1 && results[0].success) {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${results[0].fileName}"`);
            return res.send(results[0].buffer);
        }
        
        // for multiple PDFs, create ZIP
        const JSZip = require('jszip');
        const zip = new JSZip();
        
        results.forEach(result => {
            if (result.success && result.buffer) {
                zip.file(result.fileName, result.buffer);
            }
        });
        
        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
        
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename="marksheets.zip"');
        res.send(zipBuffer);
        
    } catch (error) {
        console.error('Error generating multiple marksheets:', error);
        throw new ApiError(500, error.message || 'Internal server error');
    }
});

export { generateMarksheet, previewMarksheet, generateMultipleMarksheets };