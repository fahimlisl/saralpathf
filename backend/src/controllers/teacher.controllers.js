import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Teacher } from "../models/teacher.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { options } from "../utils/options.js";
import { Student } from "../models/student.models.js";
import { Marksheet } from "../models/marksheet.models.js";
import { generateAccessAndRefreshToken } from "../utils/generateAccessAndRefreshToken.js";

const registerTeacher = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phoneNumber,
    subject,
    password,
    // , classAssigned
  } = req.body;

  if (
    [
      fullName,
      email,
      phoneNumber,
      subject,
      password,
      // classAssigned
    ].some((f) => !f && f !== 0)
  ) {
    throw new ApiError(401, "all fields are required");
  }

  const ifTeacher = await Teacher.findOne({
    $or: [{ email }, { phoneNumber }],
  });

  if (ifTeacher) {
    throw new ApiError(400, "teacher already exists");
  }

  const teacher = await Teacher.create({
    fullName,
    email,
    phoneNumber,
    subject,
    password,
    // classAssigned,
  });

  if (!teacher) {
    throw new ApiError(
      500,
      "internal server error ,not able to create the teacher"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, teacher, "teacher creted successfully"));
});

const loginTeacher = asyncHandler(async (req, res) => {
  const { phoneNumber, email, password } = req.body;

  if (!phoneNumber && !email) {
    throw new ApiError(400, "phone number or email required");
  }

  if (!password) {
    throw new ApiError(400, "password must required");
  }

  const loggingTeacher = await Teacher.findOne({
    $or: [{ email }, { phoneNumber }],
  });

  if (!loggingTeacher) {
    throw new ApiError(400, "invalid credentials");
  }

  const checkPassword = await loggingTeacher.isPasswordCorrect(password);

  if (!checkPassword) {
    throw new ApiError(401, "pasword is wrong");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    loggingTeacher._id,
    Teacher
  );

  const loggedInTeacher = await Teacher.findById(loggingTeacher._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { loginUser: loggedInTeacher, accessToken, refreshToken },
        "teacher logged in successfully"
      )
    );
});

const logOutTeacher = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    throw new ApiError(
      400,
      "userId wasn't able to found , unauthroized access"
    );
  }

  const user = await Teacher.findById(userId);

  if (!user) {
    throw new ApiError(400, "tacher doesn't exist");
  }

  await Teacher.findByIdAndUpdate(
    userId,
    {
      $unset: {
        refreshToken: "",
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "user logged out successfully"));
});


const assignMarksToStudent = asyncHandler(async (req, res) => {
  const teacherId = req.user._id;         
  const subjectId = req.params.id;        
  const { term, obtainedMarks } = req.body;

  if (!term || obtainedMarks === undefined) {
    throw new ApiError(400, "term and obtainedMarks are required");
  }

  const marksheet = await Marksheet.findOne({
    "terms.subjects._id": subjectId,
  });

  if (!marksheet) {
    throw new ApiError(404, "Marksheet not found");
  }

  const termObj = marksheet.terms.find(t => t.term === Number(term));

  if (!termObj) {
    throw new ApiError(404, "Term not found");
  }

  const subjectObj = termObj.subjects.find(
    s => String(s._id) === String(subjectId)
  );
  if (!subjectObj) {
    throw new ApiError(404, "Subject not found");
  }

  if (String(subjectObj.teacher) !== String(teacherId)) {
    throw new ApiError(403, "You are not allowed to update this subject");
  }

  subjectObj.obtainedMarks = obtainedMarks;
  subjectObj.isSubmitted = true;
  subjectObj.percentage = Number(
    ((obtainedMarks / subjectObj.maxMarks) * 100).toFixed(2)
  );
  await marksheet.save();

  return res.status(200).json(
    new ApiResponse(200, marksheet, "Marks updated successfully")
  );
});


const fetchAssignedStudents = asyncHandler(async (req, res) => {
  const teacherId = req.user._id;

  const teacher = await Teacher.findById(teacherId);
  if (!teacher) {
    throw new ApiError(401, "Unauthorized access");
  }

  const students = await Student.find()
    .populate({
      path: "marksheet",
      match: {
        "terms.subjects.teacher": teacherId
      }
    })
    // .select("fullName section marksheet");

  // remove students whose marksheet didn't match
  const filteredStudents = students.filter(s => s.marksheet);

  const result = filteredStudents.map(student => {
    const ms = student.marksheet;
    const filteredTerms = ms.terms
      .map(term => {
        const teacherSubjects = term.subjects.filter(
          sub => String(sub.teacher) === String(teacherId)
        );

        if (teacherSubjects.length === 0) return null;

        return {
          term: term.term,
          subjects: teacherSubjects
        };
      })
      .filter(Boolean); 

    return {
      _id: student._id,
      fullName: student.fullName,
      section: student.section,
      classCurrent: student.classCurrent, 
      typeOfClass: student.typeOfClass,
      marksheet: {
        _id: ms._id,
        terms: filteredTerms
      }
    };
  });

  return res.status(200).json(
    new ApiResponse(200, result, "Assigned students fetched successfully")
  );
});

const countTeacher = asyncHandler(async(req,res) =>{
  const count = await Teacher.countDocuments();
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      count,
      "no of teachers counted successfully"
    )
  )
});

const fetchAllTeacher = asyncHandler(async(req,res) =>{
  const teachers = await Teacher.find({}).select("-refreshToken")
  if(teachers === 0){
    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "till now no teahcers are added yet"
      )
    )
  }

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      teachers,
      "teahcers fetched successfully"
    )
  )
})
// as of now leeting edit teacher later will change things
const editTeacher = asyncHandler(async(req,res) => {
  const {fullName,
    email,
    phoneNumber,
    subject,
    password,} = req.body;
    const teacherId = req.params.id;
  const teacher = await Teacher.findById(teacherId);
  const updateTeacher = await Teacher.findByIdAndUpdate(teacher._id,
    {
      $set:{
        email:email || teacher.email,
        phoneNumber:phoneNumber || teacher.phoneNumber,
        subject:subject || teacher.subject,
        password:password || teacher.password
      }
    },
    {
      new:true
    }
  )
  
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      updateTeacher,
      "teacher been updated successfully"
    )
  )
})

const fetchParticularTeacher = asyncHandler(async(req,res) => {
  const teacherId = req.params.id;
  const teacher = await Teacher.findById(teacherId).select(-refreshToken)
  if(!teacher) throw new ApiError(400,"teahcer related to this id wasn't able to found")
  return res
.status(200)
.json(
  new ApiResponse(
    200,
    teacher,
    "successfully fetched teaher"
  )
)
})


export {
  registerTeacher,
  loginTeacher,
  logOutTeacher,
  assignMarksToStudent,
  fetchAssignedStudents,
  countTeacher,
  fetchAllTeacher,
  editTeacher,
  fetchParticularTeacher
};
