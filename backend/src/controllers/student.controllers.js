import { Marksheet } from "../models/marksheet.models.js";
import { Student } from "../models/student.models.js";
import { Teacher } from "../models/teacher.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const subjects = {
  3: [
    "Hifzul Qur'an 3",
    "Hadith 3",
    "Arabic Literature 3",
    "English 3",
    "Bengali 3",
    "Mathematics 3",
    "Environmental Science 3",
    "Urdu 3",
    "Dua 3",
  ],
  4: [
    "Hifzul Qur'an 4",
    "Hadith 4",
    "Arabic Literature 4",
    "English 4",
    "Bengali 4",
    "Mathematics 4",
    "Environmental Science 4",
    "Urdu 4",
    "Dua 4",
    "Diniyat 4",
    "Qirat 4",
  ],
  5: [
    "Hifzul Qur'an 5",
    "Hadith 5",
    "Arabic Literature 5",
    "English 5",
    "Bengali 5",
    "Mathematics 5",
    "Environmental Science 5",
    "Urdu 5",
    "Dua 5",
    "Diniyat 5",
    "Qirat 5",
  ],
  6: [
    "Hifzul Qur'an 6",
    "Hadith 6",
    "Arabic Literature 6",
    "English 6",
    "Bengali 6",
    "Mathematics 6",
    "Environmental Science 6",
    "Urdu 6",
    "Diniyat 6",
    "Qirat 6",
    "Geography 6",
    "History 6",
    "Sarf 6",
    "Nahu 6",
    6,
  ],
  7: [
    "Hifzul Qur'an 7",
    "Hadith 7",
    "Tafseer 7",
    "Aqeedah 7",
    "English 7",
    "Bengali 7",
    "Mathematics 7",
    "History 7",
    "Environmental Science 7",
    "Qirat 7",
    "Geography 7",
  ],
  // for jamiah J = 1
  71: [
    "Hifzul Qur'an 71",
    "Hadith 71",
    "Nahu 71",
    "Sarf 71",
    "Sirat 71",
    "Aqeedah 71",
    "English 71",
    "Bengali 71",
    "Mathematics 71",
    "History 71",
    "Environmental Science 71",
    "Durusul Lugah 71",
    "Geography 71",
    "Arabic Lt + Insha 71",
  ],

  8: [
    "Hifzul Qur'an 8",
    "Hadith 8",
    "Tafseer 8",
    "Aqeedah 8",
    "English 8",
    "Bengali 8",
    "Mathematics 8",
    "History 8",
    "Environmental Science 8",
    "Qirat 8",
    "Geography 8",
  ],
  // for jamiah
  81: [
    "Hifzul Qur'an 81",
    "Nahu 81",
    "Sarf 81",
    "Sirat 81",
    "Tafseer 81",
    "Aqeedah 81",
    "English 81",
    "Bengali 81",
    "Mathematics 81",
    "History 81",
    "Environmental Science 81",
    "Durusul Lugah 81",
    "Geography 81",
    "Arabic Lt + Insha 81",
    "Hadith + Usule Hadith 81",
  ],

  9: [
    "Hifzul Qur'an 9",
    "Hadith 9",
    "Tafseer 9",
    "Fiq 9",
    "English 9",
    "Bengali 9",
    "Mathematics 9",
    "History 9",
    "Physical Science 9",
    "Life Science 9",
    "Qirat 9",
    "Geography 9",
  ],

  // Jamiah
  91: [
    "Hifzul Qur'an 91",
    "Nahu 91",
    "Sirat 91",
    "Sarf 91",
    "Aqeedah 91",
    "English 91",
    "Bengali 91",
    "Mathematics 91",
    "History 91",
    "Physical Science 91",
    "Life Science 91",
    "Islamic History 91",
    "Geography 91",
    "Arabic Lt + Insha 91",
    "Hadith + Usule Hadith 91",
    "Fiqh + U.Fiqh 91",
    "Durusul Lugah 91",
  ],

  // rapid
  22: [
    "Hifzul Qur'an 22",
    "Hadith 22",
    "Nahu 22",
    "Sarf 22",
    "Sirat 22",
    "Aqeedah 22",
    "English 22",
    "Bengali 22",
    "Mathematics 22",
    "History 22",
    "Environmental Science 22",
    "Durusul Lugah 22",
    "Geography 22",
    "Arabic Lt + Insha 22",
  ],

  // edadiah-I
  11:[
    "Hifzul Qur'an 11",
    "Hadith 11",
    "Nahu 11",
    "Sarf 11",
    "Sirat 11",
    "Aqeedah 11",
    "Durusul Lugah 11",
    "Dua 11",
    "Qasasun nabiyyen 11",
    "Taisirul Arabiyyah+Insha 11",
    "An Nahul Wazeh 11"
  ],
  
  // edadiath-II
  12:[
    "Hifzul Qur'an 12",
    "Tafseer 12",
    "Hadith 12",
    "Nahu 12",
    "Sarf 12",
    "Sirat 12",
    "Aqeedah 12",
    "Durusul Lugah 12",
    "Islamic History 12",
    "An Nahul Wazeh 12",
    "Quran Tarjuma 12",
    "Taisirul Arabiyyah+Insha 12",
    "Mantiq 12",
    "Balagah 12",
    "Azharul Arab 12",
    "Hadith + Usule Hadith 12",
  ],

  // edadiah-III
  13:[
    "Hifzul Qur'an 13",
    "Tafseer 13",
    "Hadith 13",
    "Nahu 13",
    "Sarf 13",
    "Sirat 13",
    "Aqeedah 13",
    "Fiq 13",
    "Fiq + U.Fiq 13",
    "U.Tafseer 13",
    "Faraiz 13",
    "Islamic History 13",
    "An Nahul Wazeh 13",
    "Insha 13",
    "Balagah 13",
    "Hadith + Usule Hadith 13",
  ],

  // hifz -A - 15
  15:[
     "Hifzul Qur'an 15",
     "Bengali 15",
     "English 15",
     "Mathematics 15",
     "Arabic Literature 15",
     "Tajweed 15",
     "Urdu 15",
  ]

};

const registerStudent = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phoneNumber,
    birthDate,
    section,
    gurdianName,
    classCurrent,
    typeOfClass,
  } = req.body;

  const {
    monthlyFees,
    admissionFee,
    examinationFee,
    developmentFee,
    miscellaneousFee,
    adittionalFees,
    lateFee,
    dressFee,
    booksFee,
  } = req.body;

  if (!(monthlyFees || admissionFee))
    throw new ApiError(400, "monthly fees and admission fees are reuired");

  if (
    [fullName, phoneNumber, birthDate, section, gurdianName].some(
      (t) => !t && t !== 0
    )
  ) {
    throw new ApiError(400, "each field is required");
  }

  if (!(classCurrent || typeOfClass))
    throw new ApiError(
      400,
      "at least one field or both feild reuired form the above type of class and current class"
    );

  const formatDOBPassword = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}${month}${year}`;
  };

  const passcode = formatDOBPassword(birthDate); // dddmmyyyy
  console.log(passcode);
  const studnet = await Student.create({
    fullName,
    email,
    phoneNumber,
    classCurrent: classCurrent || null,
    typeOfClass: typeOfClass || "",
    birthDate,
    password: passcode,
    section,
    gurdianName,
    fees: {
      jan: { amount: monthlyFees },
      feb: { amount: monthlyFees },
      march: { amount: monthlyFees },
      april: { amount: monthlyFees },
      may: { amount: monthlyFees },
      jun: { amount: monthlyFees },
      july: { amount: monthlyFees },
      august: { amount: monthlyFees },
      september: { amount: monthlyFees },
      october: { amount: monthlyFees },
      november: { amount: monthlyFees },
      december: { amount: monthlyFees },

      admissionFee: { amount: admissionFee },
      examinationFee: { amount: examinationFee },
      developmentFee: { amount: developmentFee },
      miscellaneousFee: { amount: miscellaneousFee },
      adittionalFees: { amount: adittionalFees },
      lateFee: { amount: lateFee },
      dressFee: { amount: dressFee },
      booksFee: { amount: booksFee },
    },
  });

  // marksheet addition left
  if (!studnet)
    throw new ApiError(
      500,
      "internal server error wasn't able to create student"
    );

  // marksheet controller starts here

  let classDefined = 0;

  if (typeOfClass === "Jamiah") {
    classDefined = parseInt(String(classCurrent) + 1);
  } else if (typeOfClass === "Rapid") {
    classDefined = 22;
  } else if(typeOfClass === "Edadiah-I") {
    classDefined = 11
  } else if(typeOfClass === "Edadiah-II") {
    classDefined = 12
  } else if(typeOfClass === "Edadiah-III") {
    classDefined = 13
  } else if(typeOfClass === "Hifz-A") {
    classDefined = 15
  } else {
    classDefined = classCurrent;
  }

  const respectiveSub = subjects[classDefined];


  let maximumMarksFirstAndSecond = 0;
  if(classDefined === 3 || classDefined === 4 || classDefined === 5 || classDefined === 11 || classDefined === 15){
    maximumMarksFirstAndSecond = 40;
  } else if(classDefined === 6 || classDefined === 7 || classDefined === 8 || classDefined === 9 || classDefined === 71 || classDefined === 81 || classDefined === 22 || classDefined === 91 ){
    maximumMarksFirstAndSecond = 50;
  }

  if (classDefined === 13 || classDefined === 12) {

  const assignedSubjects = await Promise.all(
    respectiveSub.map(async (sub) => {
      const teacher = await Teacher.findOne({
        subject: { $in: [sub] },
      });

      let maximumMarksFirstAndSecond12 = 40;

      if (sub === "Sirat 12" || sub === "Islamic History 12" || sub === "Sirat 13" || sub === "Islamic History 13") {
        maximumMarksFirstAndSecond12 = 20;
      }

      return {
        subjectName: sub,
        maxMarks: maximumMarksFirstAndSecond12,
        obtainedMarks: 0,
        teacher: teacher ? teacher._id : null,
        isSubmitted: false,
      };
    })
  );

  const termsArray = [1, 2].map((term) => ({
    term,
    subjects: assignedSubjects.map((s) => ({
      ...s,
      obtainedMarks: 0,
      isSubmitted: false,
    })),
  }));

  const thirdTerm = {
  term: 3,
  subjects: assignedSubjects.map((s) => {
    let maximumThirdMarks = 50;

    if (s.subjectName === "Sirat 12" || s.subjectName === "Islamic History 12" || s.subjectName === "Sirat 13" || s.subjectName === "Islamic History 13") {
      maximumThirdMarks = 25;
    }

    return {
      ...s,
      maxMarks: maximumThirdMarks,
      obtainedMarks: 0,
      isSubmitted: false,
    };
  }),
};

  const wholeMarksheet = await Marksheet.create({
    student: studnet._id,
    terms: [...termsArray, thirdTerm],
  });

  await Student.findByIdAndUpdate(studnet._id, {
    $set: {
      marksheet: wholeMarksheet._id,
    },
  });

  const finalStudnet = await Student.findById(studnet._id).populate("marksheet");

  return res.status(200).json(
    new ApiResponse(200, finalStudnet, "student created successfully")
  );
}


  const assignedSubjects = await Promise.all(
    respectiveSub.map(async (sub) => {
      const teacher = await Teacher.findOne({
        // subject:sub,
        subject: { $in: [sub] },
        // classAssigned: {$in:[classCurrent]}
      });

      return {
        subjectName: sub,
        maxMarks: maximumMarksFirstAndSecond,
        obtainedMarks: 0,
        teacher: teacher ? teacher._id : null,
        isSubmitted: false,
      };
    })
  );

  const termsArray = [1, 2].map((term) => ({
    term,
    subjects: assignedSubjects.map((s) => ({
      ...s,
      obtainedMarks: 0,
      isSubmitted: false,
    })),
  }));

  let maximumThirdMarks = 0;
  if(classDefined === 3 || classDefined === 4 || classDefined === 5 || classDefined === 11 || classDefined === 15){
    maximumThirdMarks = 50;
  } else if(classDefined === 6 || classDefined === 7 || classDefined === 8 || classDefined === 9 || classDefined === 71 || classDefined === 81 || classDefined === 22 || classDefined === 91 ){
    maximumThirdMarks = 100;
  }

  const thirdTerm = {
    term:3,
     subjects: assignedSubjects.map((s) => {
    return {
      ...s,
      maxMarks: maximumThirdMarks,
      obtainedMarks: 0,
      isSubmitted: false,
    };
  }),
  }

  const wholeMarksheet = await Marksheet.create({
    student: studnet._id,
    terms: [...termsArray,thirdTerm],
  });

  await Student.findByIdAndUpdate(studnet._id, {
    $set: {
      marksheet: wholeMarksheet._id,
    },
  });

  const finalStudnet = await Student.findById(studnet._id).populate(
    "marksheet"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, finalStudnet, "student created successfully"));
});



// will remove this while putting to produciton
// const collectFee = asyncHandler(async (req, res) => {
//   const studnetId = req.params.id;
//   const { input } = req.body;
//   const updateField = `fees.${input}.isPaid`;
//   const student = await Student.findByIdAndUpdate(
//     studnetId,
//     {
//       $set: {
//         [updateField]: true,
//       },
//     },
//     {
//       new: true,
//     }
//   );

//   if (!student) throw new ApiError(400, "unable to collect fee");
//   return res
//     .status(200)
//     .json(new ApiResponse(200, student, `updated ${input} fees successfully`));
// });

import InvoicePDFService from '../utils/invoicePDF.utils.js';


const invoiceService = new InvoicePDFService();
// scond attempt for better collectFee controller
const collectFee = asyncHandler(async (req, res) => {
  try {
    const studentId = req.params.id;
    const { 
      input, 
      paymentMethod = "Cash", 
      fineAmount = 0, 
      discount = 0, 
      remarks = "",
      returnInvoice = true // Add this flag to control if invoice should be returned
    } = req.body;
    
    if (!input) {
      throw new ApiError(400, "Month/Type is required");
    }

    const student = await Student.findById(studentId);
    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    if (!student.fees || !student.fees[input]) {
      throw new ApiError(400, `Fee for ${input} not found`);
    }

    const feeAmount = student.fees[input].amount || 0;

    const totalAmount = feeAmount - discount + parseInt(fineAmount);
    const amountPaid = totalAmount; // assuming full payment

    const updateField = `fees.${input}`;
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      {
        $set: {
          [updateField]: {
            amount: feeAmount,
            isPaid: true,
            paidDate: new Date(),
            paymentMethod: paymentMethod,
            discount: discount,
            fine: parseInt(fineAmount),
            amountPaid: amountPaid,
            // balance: 0, // Assuming full payment
            remarks: remarks
          }
        },
        // will be used as history saved later if needed as per requirements
        // $push: {
        //   paymentHistory: {
        //     month: input,
        //     date: new Date(),
        //     amount: feeAmount,
        //     discount: discount,
        //     fine: parseInt(fineAmount),
        //     totalPaid: amountPaid,
        //     paymentMethod: paymentMethod,
        //     remarks: remarks
        //   }
        // }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedStudent) {
      throw new ApiError(400, "Unable to collect fee");
    }

    const responseData = {
      success: true,
      message: `Fee for ${input} collected successfully`,
      data: {
        student: {
          id: updatedStudent._id,
          fullName: updatedStudent.fullName,
          registerNo: updatedStudent.registerNo,
          class: updatedStudent.typeOfClass
        },
        paymentDetails: {
          month: input,
          amount: feeAmount,
          discount: discount,
          fine: parseInt(fineAmount),
          totalPaid: amountPaid,
          // paymentMethod: paymentMethod,
          balance: 0,
          date: new Date().toISOString(),
          remarks: remarks
        }
      }
    };

    // if invoice is requested, generate and attach it
    if (returnInvoice) {
      // generate invoice PDF
      const invoiceResult = await invoiceService.generateInvoicePDF(
        {
          fullName: updatedStudent.fullName,
          registerNo: updatedStudent.registerNo,
          typeOfClass: updatedStudent.typeOfClass,
          stream: updatedStudent.stream,
          section: updatedStudent.section,
          fatherName: updatedStudent.gurdianName,
          address: updatedStudent.address,
          phoneNumber: updatedStudent.phoneNumber
        },
        {
          month: input,
          feeAmount: feeAmount,
          discount: discount,
          fine: parseInt(fineAmount),
          totalPaid: amountPaid,
          paymentMethod: paymentMethod,
          remarks: remarks
        },
        {
          address: "Vill - kankuria, Po- Miapur, P.s - Raghunathganj, Dist- Murshidabad, Pin No - 742235",
          whatsapp: "8514868658 , 7908573548",
          email: "saralpath2013@gmail.com",
          invoiceNumber: `INV${Date.now().toString().slice(-6)}`,
          academicYear: "2025-2026"
        }
      );

      // no need as of to convert buffer to json fomrat base64
      responseData.data.invoice = {
        // base64: invoiceResult.buffer.toString('base64'),
        // fileName: invoiceResult.fileName,
        mimeType: 'application/pdf',
        msg:"fee collection successful"
      };
    }

    return res.status(200).json(responseData);

  } catch (error) {
    console.error("Error collecting fee:", error);
    throw new ApiError(500, error.message || "Internal server error");
  }
});


const downloadInvoice = asyncHandler(async (req, res) => {
  try {
    const { studentId, month } = req.params;
    
    const student = await Student.findById(studentId);
    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    if (!student.fees || !student.fees[month] || !student.fees[month].isPaid) {
      throw new ApiError(400, `No paid fee record found for ${month}`);
    }

    const feeDetails = student.fees[month];
    
    const invoiceResult = await invoiceService.generateInvoicePDF(
      {
        fullName: student.fullName,
        registerNo: student.registerNo,
        typeOfClass: student.typeOfClass,
        stream: student.stream,
        section: student.section,
        fatherName: student.gurdianName,
        address: student.address,
        phoneNumber: student.phoneNumber
      },
      {
        month: month,
        feeAmount: feeDetails.amount || 0,
        discount: feeDetails.discount || 0,
        fine: feeDetails.fine || 0,
        totalPaid: feeDetails.amountPaid || 0,
        paymentMethod: feeDetails.paymentMethod || "Cash",
        remarks: feeDetails.remarks || ""
      },
      {
        address: "Vill - kankuria, Po- Miapur, P.s - Raghunathganj, Dist- Murshidabad, Pin No - 742235",
        whatsapp: "8514868658 , 7908573548",
        email: "saralpath2013@gmail.com",
        invoiceNumber: `INV${Date.now().toString().slice(-6)}`,
        academicYear: "2025-2026"
      }
    );

    // direct streaming to browser with file handling
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${invoiceResult.fileName}"`);
    res.send(invoiceResult.buffer);

  } catch (error) {
    console.error("Error generating invoice:", error);
    throw new ApiError(500, error.message || "Internal server error");
  }
});

const previewInvoice = asyncHandler(async (req, res) => {
  try {
    const { studentId, month } = req.params;
    const { feeAmount = 0, discount = 0, fine = 0, paymentMethod = "Cash" } = req.query;
    
    const student = await Student.findById(studentId);
    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    const totalPaid = feeAmount - discount + parseInt(fine);
    
    const htmlContent = invoiceService.generateInvoiceHTML(
      {
        fullName: student.fullName,
        registerNo: student.registerNo,
        typeOfClass: student.typeOfClass,
        stream: student.stream,
        section: student.section,
        fatherName: student.fatherName,
        address: student.address,
        phoneNumber: student.phoneNumber
      },
      {
        month: month,
        feeAmount: parseFloat(feeAmount),
        discount: parseFloat(discount),
        fine: parseInt(fine),
        totalPaid: totalPaid,
        paymentMethod: paymentMethod,
        remarks: ""
      },
      {
        address: "Vill - kankuria, Po- Miapur, P.s - Raghunathganj, Dist- Murshidabad, Pin No - 742235",
        whatsapp: "8514868658 , 7908573548",
        email: "saralpath2013@gmail.com",
        invoiceNumber: `INV${Date.now().toString().slice(-6)}`,
        academicYear: "2025-2026"
      }
    );

    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);

  } catch (error) {
    console.error("Error previewing invoice:", error);
    throw new ApiError(500, error.message || "Internal server error");
  }
});

 export { downloadInvoice, previewInvoice };

export { registerStudent, collectFee };
