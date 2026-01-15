import { OnlineRegistration } from "../models/onlineRegistration.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import AdmitCardPDFService from "../utils/pdfAdmitCard.utils.js";

const register = asyncHandler(async (req, res) => {
  const { fullName, email, phoneNumber, address, birthDate, city, state ,desiredClass,typeOfClass} =
    req.body;
  if (
    [fullName, address, city, state, phoneNumber, birthDate].some(
      (t) => !t && t !== 0
    )
  ) {
    throw new ApiError(400, "these fields are must required");
  }

  if(!(desiredClass || typeOfClass)){
    throw new ApiError(400,"at least one of these fields either desired class or type of class required or both required")
  }

  const checkAlready = await OnlineRegistration.findOne({
    $or: [{ email }, { phoneNumber }],
  });
  if (checkAlready)
    throw new ApiError(
      400,
      "studnet is already registarted using the following phone number"
    );

  const photoFilePath = req.files?.photo?.[0];
  const birthphotoFilePath = req.files?.brithCertificate?.[0];

  if (!(photoFilePath && birthphotoFilePath))
    throw new ApiError(
      400,
      "candidate photo and birth Certificate must required"
    );

  const photo = await uploadOnCloudinary(photoFilePath.buffer);
  const brithCertificate = await uploadOnCloudinary(birthphotoFilePath.buffer);

  if (!photo)
    throw new ApiError(400, "faield to upload candidate photo to cloudinary");
  if (!brithCertificate)
    throw new ApiError(400, "failed to upload birth certificate to cloudinary");

  const applicationId = Math.round(Math.random() * 1000000);

  const newOnline = await OnlineRegistration.create({
    fullName,
    email: email || "",
    phoneNumber,
    address,
    birthDate:new Date(birthDate),
    city,
    state,
    photo: photo.secure_url,
    brithCertificate: brithCertificate.secure_url,
    application_Id: applicationId,
    desiredClass : desiredClass || null,
    typeOfClass : typeOfClass || "",
  });
  if (!newOnline)
    throw new ApiError(500, "internal server error ,failed to register");
  return res
  .status(200)
  .json(
    new ApiResponse(
        200,
        newOnline,
        "studnet successfully registered"
    )
  )
});


// fee payment thing left here

// initialising pdf generation
const pdfService = new AdmitCardPDFService();

// generate single admit card - STREAM TO BROWSER
const generateAdmitCard = async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await OnlineRegistration.findById(studentId);
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        
        const schoolLogoPath = `https://res.cloudinary.com/dkrwq4wvi/image/upload/v1768457598/saralpath_logo.png`;
        const studentPhotoPath = student.photo || '';
        
        const studentData = {
            studentName: student.fullName,
            applicationId: student.application_Id,
            dob: student.birthDate,
            class: student.typeOfClass,
            typeOfClass: student.typeOfClass,
            guardianName: student.guardianName,
            mobile: student.phoneNumber,
            email: student.email,
            address: student.address,
            photoPath: studentPhotoPath
        };
        
        // generate PDF buffer 
        const result = await pdfService.generateAdmitCard(studentData, schoolLogoPath);
        
        // set headers for PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${result.fileName}"`);
        
        // stream the PDF buffer directly to browser
        res.send(result.buffer);
        
    } catch (error) {
        console.error('Error generating admit card:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating admit card',
            error: error.message
        });
    }
};

// generate multiple admit cards (for batch processing) - RETURNS ZIP
const generateMultipleAdmitCards = async (req, res) => {
    try {
        const { studentIds } = req.body;
        
        // fetch all students
        const students = await OnlineRegistration.find({
            '_id': { $in: studentIds }
        });
        
        const schoolLogoPath = `https://res.cloudinary.com/dkrwq4wvi/image/upload/v1768457598/saralpath_logo.png`;
        
        // Prepare student data array - FIXED TYPO: was 'students' should be 'student'
        const studentsData = students.map(student => ({
            studentName: student.fullName, 
            applicationId: student.application_Id, 
            dob: student.birthDate, 
            class: student.desiredClass || student.typeOfClass, 
            typeOfClass: student.typeOfClass, 
            guardianName: student.guardianName, 
            mobile: student.phoneNumber, 
            email: student.email, 
            address: student.address, 
            photoPath: student.photo 
        }));
        
        // generate PDFs in memory
        const pdfResults = await pdfService.generateMultipleAdmitCards(studentsData, schoolLogoPath);
        
        // if only one PDF, stream it directly
        if (pdfResults.length === 1 && pdfResults[0].success) {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${pdfResults[0].fileName}"`);
            return res.send(pdfResults[0].buffer);
        }
        
        // For multiple PDFs, we need to create a ZIP , need to install npm i jszip (later)
        const JSZip = require('jszip');
        const zip = new JSZip();
        
        pdfResults.forEach(result => {
            if (result.success && result.buffer) {
                zip.file(result.fileName, result.buffer);
            }
        });
        
        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
        
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename="admit-cards.zip"');
        res.send(zipBuffer);
        
    } catch (error) {
        console.error('Error generating multiple admit cards:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating admit cards',
            error: error.message
        });
    }
};

// alternative: simple download (forced download instead of preview)
const downloadAdmitCard = async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await OnlineRegistration.findById(studentId);
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        
        const schoolLogoPath = `https://res.cloudinary.com/dkrwq4wvi/image/upload/v1768457598/saralpath_logo.png`;
        const studentPhotoPath = student.photo || '';
        
        const studentData = {
            studentName: student.fullName,
            applicationId: student.application_Id,
            dob: student.birthDate,
            class: student.typeOfClass,
            typeOfClass: student.typeOfClass,
            guardianName: student.guardianName,
            mobile: student.phoneNumber,
            email: student.email,
            address: student.address,
            photoPath: studentPhotoPath
        };
        
        const result = await pdfService.generateAdmitCard(studentData, schoolLogoPath);
        
        // set headers for forced download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
        
        res.send(result.buffer);
        
    } catch (error) {
        console.error('Error downloading admit card:', error);
        res.status(500).json({
            success: false,
            message: 'Error downloading admit card',
            error: error.message
        });
    }
};

// preview in browser (inline)
const previewAdmitCard = async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await OnlineRegistration.findById(studentId);
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        
        const schoolLogoPath = `https://res.cloudinary.com/dkrwq4wvi/image/upload/v1768457598/saralpath_logo.png`;
        
        const htmlContent = pdfService.generateHTML({
            studentName: student.fullName,
            applicationId: student.application_Id,
            dob: student.birthDate,
            class: student.typeOfClass,
            typeOfClass: student.typeOfClass,
            guardianName: student.guardianName,
            mobile: student.phoneNumber,
            email: student.email,
            address: student.address,
            photoPath: student.photo || ''
        }, schoolLogoPath);
        

        res.send(htmlContent);
        
    } catch (error) {
        console.error('Error previewing admit card:', error);
        res.status(500).json({
            success: false,
            message: 'Error previewing admit card',
            error: error.message
        });
    }
};



export { 
  register,
    generateAdmitCard, 
    generateMultipleAdmitCards, 
    downloadAdmitCard,
    previewAdmitCard 
};