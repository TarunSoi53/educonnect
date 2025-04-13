import Topic from '../../models/Subject/TopicModel.js';
import Subject from '../../models/Subject/SubjectModel.js';
import { generateQuizForTopic } from '../../services/quizGenerationService.js';

// Get all topics for a subject
export const getTopics = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const topics = await Topic.find({ subject: subjectId })
      .sort({ createdAt: -1 })
      .populate('teacher', 'name');
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new topic
export const createTopic = async (req, res) => {
  try {
    const { name, description, subjectId } = req.body;
    const teacherId = req.user._id;

    // Verify if the teacher is assigned to this subject
    const subject = await Subject.findOne({
      _id: subjectId,
      teacher: teacherId
    });

    if (!subject) {
      return res.status(403).json({ message: 'You are not assigned to this subject' });
    }

    const topic = new Topic({
      name,
      description,
      subject: subjectId,
      teacher: teacherId
    });

    const savedTopic = await topic.save();

    // Generate quiz for the topic
    try {
      const quizId = await generateQuizForTopic(name, savedTopic._id,teacherId, subjectId,req.user);
      topic.quizId = quizId;
      await topic.save();
    } catch (error) {
      console.error('Error generating quiz:', error);
      // Don't fail the request if quiz generation fails
    }

    res.status(201).json(savedTopic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a topic
export const updateTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { name, description } = req.body;
    const teacherId = req.user._id;

    const topic = await Topic.findOneAndUpdate(
      { _id: topicId, teacher: teacherId },
      { name, description },
      { new: true }
    );

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found or unauthorized' });
    }

    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a topic
export const deleteTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const teacherId = req.user._id;

    const topic = await Topic.findOneAndDelete({
      _id: topicId,
      teacher: teacherId
    });

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found or unauthorized' });
    }

    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 