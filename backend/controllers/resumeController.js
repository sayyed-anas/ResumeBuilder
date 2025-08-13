import Resume from "../models/resumeModel.js";
import path from "path";
import fs from "fs";

export const createResume = async (req, res) => {
  try {
    const { title } = req.body;

    // Default Template
    const defaultResumeData = {
      profileInfo: {
        profileImg: null,
        previewUrl: "",
        fullName: "",
        designation: "",
        summary: "",
      },
      contactInfo: {
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        website: "",
      },
      workExperience: [
        {
          company: "",
          role: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
      education: [
        {
          degree: "",
          institution: "",
          startDate: "",
          endDate: "",
        },
      ],
      skills: [
        {
          name: "",
          progress: 0,
        },
      ],
      projects: [
        {
          title: "",
          description: "",
          github: "",
          liveDemo: "",
        },
      ],
      certifications: [
        {
          title: "",
          issuer: "",
          year: "",
        },
      ],
      languages: [
        {
          name: "",
          progress: "",
        },
      ],
      interests: [""],
    };

    const newResume = await Resume.create({
      userId: req.user._id,
      title,
      ...defaultResumeData,
      ...req.body,
    });

    res.status(201).json(newResume);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create resume", error: error.message });
  }
};

// GET ALL RESUME OF USER
export const getUserResumes = async (req, res) => {
  try {
    const resume = await Resume.find({ userId: req.user._id }).sort({
      updatedAt: -1,
    });
    res.json(resume);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get resumes", error: error.message });
  }
};

// Get a Particular Resume By Id
export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.json(resume);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get resume", error: error.message });
  }
};

// update Resume
export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!resume) {
      return res
        .status(404)
        .json({ message: "Resume not found or not authorized" });
    }

    // Merge updated resume
    Object.assign(resume, req.body);

    // Saving Updated Resume
    const savedResume = resume.save();
    res.json(savedResume);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update resume", error: error.message });
  }
};

// Delete Resume
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!resume) {
      return res
        .status(404)
        .json({ message: "Resume not found or not authorized" });
    }

    // Create a uploads folder and store the resume there
    const uploadFolder = path.join(process.cwd(), "uploads");

    // Delete thumbnail Fuction
    if (resume.thumbnailLink) {
      const oldThumbnail = path.join(
        uploadFolder,
        path.basename(resume.thumbnailLink)
      );
      if (fs.existsSync(oldThumbnail)) {
        fs.unlinkSync(oldThumbnail);
      }
    }

    if (resume.profileInfo?.profilePreviewUrl) {
      const oldProfile = path.json(
        uploadFolder,
        path.basename(resume.profileInfo.profilePreviewUrl)
      );
      if (fs.existsSync(oldProfile)) {
        fs.unlinkSync(oldProfile);
      }
    }

    // Delete Resume Doc
    const deleted = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Resume not found or not authorized" });
    }

    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete resume", error: error.message });
  }
};
