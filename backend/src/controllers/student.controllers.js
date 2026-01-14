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
  } else {
    classDefined = classCurrent;
  }

  const respectiveSub = subjects[classDefined];
  console.log(respectiveSub);

  const assignedSubjects = await Promise.all(
    respectiveSub.map(async (sub) => {
      const teacher = await Teacher.findOne({
        // subject:sub,
        subject: { $in: [sub] },
        // classAssigned: {$in:[classCurrent]}
      });

      return {
        subjectName: sub,
        maxMarks: 100,
        obtainedMarks: 0,
        teacher: teacher ? teacher._id : null,
        isSubmitted: false,
      };
    })
  );

  const termsArray = [1, 2, 3].map((term) => ({
    term,
    subjects: assignedSubjects.map((s) => ({
      ...s,
      obtainedMarks: 0,
      isSubmitted: false,
    })),
  }));

  const wholeMarksheet = await Marksheet.create({
    student: studnet._id,
    terms: termsArray,
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

const collectFee = asyncHandler(async (req, res) => {
  const studnetId = req.params.id;
  const { input } = req.body;
  const updateField = `fees.${input}.isPaid`;
  const student = await Student.findByIdAndUpdate(
    studnetId,
    {
      $set: {
        [updateField]: true,
      },
    },
    {
      new: true,
    }
  );

  if (!student) throw new ApiError(400, "unable to collect fee");
  return res
    .status(200)
    .json(new ApiResponse(200, student, `updated ${input} fees successfully`));
});

export { registerStudent, collectFee };
