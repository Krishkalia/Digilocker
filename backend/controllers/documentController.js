const { UserDocument, Document } = require('../models/Document');

// Get all documents issued to the logged-in user
const getMyDocuments = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all UserDocument mappings for this user and populate the Document details
    const userDocs = await UserDocument.find({ user: userId })
      .populate({
        path: 'document',
        populate: {
          path: 'documentType',
          select: 'typeName'
        }
      });

    // In a production app, the cloudStorageUrl wouldn't be directly accessible, 
    // or we'd map it here to generate short-lived signed URLs.
    
    res.json(userDocs);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Server error fetching documents' });
  }
};

module.exports = {
  getMyDocuments
};
