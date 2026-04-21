const Event = require("../models/Event");
const User = require("../models/User");

// Helper function to compress base64 image
const compressImage = (base64String, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      
      // Remove data URL prefix
      const base64Data = compressedBase64.split(',')[1];
      resolve(base64Data);
    };
    
    img.onerror = () => {
      // If compression fails, return original
      resolve(base64String);
    };
    
    img.src = `data:image/png;base64,${base64String}`;
  });
};

// Helper function to create thumbnail
const createThumbnail = (base64String, size = 200) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = size;
      canvas.height = size;
      
      // Calculate aspect ratio
      const aspectRatio = img.width / img.height;
      let drawWidth = size;
      let drawHeight = size;
      
      if (aspectRatio > 1) {
        drawHeight = size / aspectRatio;
      } else {
        drawWidth = size * aspectRatio;
      }
      
      const x = (size - drawWidth) / 2;
      const y = (size - drawHeight) / 2;
      
      ctx.drawImage(img, x, y, drawWidth, drawHeight);
      const thumbnailBase64 = canvas.toDataURL('image/jpeg', 0.8);
      
      const base64Data = thumbnailBase64.split(',')[1];
      resolve(base64Data);
    };
    
    img.onerror = () => {
      resolve(null);
    };
    
    img.src = `data:image/png;base64,${base64String}`;
  });
};

exports.createEvent = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "Organizer") {
      return res.status(403).json({ message: "Only organizers can create events" });
    }

    let imageBase64 = null;
    let thumbnailBase64 = null;
    
    if (req.file) {
      const fs = require('fs');
      const imageBuffer = fs.readFileSync(req.file.path);
      imageBase64 = imageBuffer.toString('base64');
      
      // Create compressed version and thumbnail
      try {
        const compressedImage = await compressImage(imageBase64);
        const thumbnail = await createThumbnail(imageBase64);
        
        imageBase64 = compressedImage;
        thumbnailBase64 = thumbnail;
      } catch (error) {
        console.error('Image compression failed:', error);
        // Use original if compression fails
      }
      
      fs.unlinkSync(req.file.path); // Clean up the temp file
    }

    const event = new Event({
      title: req.body.title,
      location: req.body.location,
      price: req.body.price,
      category: req.body.category,
      description: req.body.description,
      availableTickets: req.body.availableTickets,
      totalTickets: req.body.totalTickets,
      organizerId: req.user.userId,
      image: imageBase64,
      thumbnail: thumbnailBase64, // Add thumbnail field
      date: req.body.date || new Date(),
      status: 'pending'
    });

    await event.save();
    res.status(201).json({
      ...event._doc,
      tickets: {
        available: event.availableTickets,
        total: event.totalTickets
      },
      image: event.image ? `data:image/png;base64,${event.image}` : null,
      thumbnail: event.thumbnail ? `data:image/jpeg;base64,${event.thumbnail}` : null
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Modify getApprovedEvents and getAllEvents to transform the data structure
exports.getApprovedEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'approved' });
    const transformedEvents = events.map(event => ({
      ...event._doc,
      organizerId: event.organizerId,
      tickets: {
        available: event.availableTickets,
        total: event.totalTickets
      },
      image: event.image ? `data:image/png;base64,${event.image}` : null,
      thumbnail: event.thumbnail ? `data:image/jpeg;base64,${event.thumbnail}` : null
    }));
    res.json(transformedEvents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'Admin') {
      return res.status(403).json({ error: 'Access denied: Admins only' });
    }

    const events = await Event.find();

    const transformedEvents = events.map(event => ({
      ...event._doc,
      tickets: {
        available: event.availableTickets,
        total: event.totalTickets
      },
      image: event.image ? `data:image/png;base64,${event.image}` : null,
      thumbnail: event.thumbnail ? `data:image/jpeg;base64,${event.thumbnail}` : null
    }));

    res.json(transformedEvents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    // Populate organizerId to get the user object
    const event = await Event.findById(req.params.id).populate('organizerId');
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json({
      ...event._doc,
      organizerId: event.organizerId && event.organizerId._id ? event.organizerId._id : event.organizerId,
      organizerName: event.organizerId && event.organizerId.name ? event.organizerId.name : 'Organizer',
      organizerProfilePic: event.organizerId && event.organizerId.profilePicture
        ? `data:image/jpeg;base64,${event.organizerId.profilePicture}`
        : null,
      tickets: {
        available: event.availableTickets,
        total: event.totalTickets
      },
      image: event.image ? `data:image/png;base64,${event.image}` : null,
      thumbnail: event.thumbnail ? `data:image/jpeg;base64,${event.thumbnail}` : null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if user is authorized to update this event
    if (req.user.role !== "Admin" && event.organizerId.toString() !== req.user.userId) {
      return res.status(403).json({ error: "You are not authorized to update this event" });
    }

    // Handle image upload if present
    if (req.file) {
      const fs = require('fs');
      const imageBuffer = fs.readFileSync(req.file.path);
      const imageBase64 = imageBuffer.toString('base64');
      
      // Create compressed version and thumbnail
      try {
        const compressedImage = await compressImage(imageBase64);
        const thumbnail = await createThumbnail(imageBase64);
        
        req.body.image = compressedImage;
        req.body.thumbnail = thumbnail;
      } catch (error) {
        console.error('Image compression failed:', error);
        req.body.image = imageBase64;
      }
      
      fs.unlinkSync(req.file.path);
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      ...updatedEvent._doc,
      tickets: {
        available: updatedEvent.availableTickets,
        total: updatedEvent.totalTickets
      },
      image: updatedEvent.image ? `data:image/png;base64,${updatedEvent.image}` : null,
      thumbnail: updatedEvent.thumbnail ? `data:image/jpeg;base64,${updatedEvent.thumbnail}` : null
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete event (only organizers can delete their events)
// controllers/eventController.js

// controllers/eventController.js
exports.deleteEvent = async (req, res) => {
  try {
    // 🔐 Confirm user is authenticated and has a valid role
    if (!req.user || !req.user.userId || !["Organizer", "Admin"].includes(req.user.role)) {
      console.log("User not authorized or not logged in:", req.user);
      return res.status(403).json({ error: "You are not authorized to delete events." });
    }

    // 🔍 Find the event by ID
    const event = await Event.findById(req.params.id);
    if (!event) {
      console.log("Event not found with ID:", req.params.id);
      return res.status(404).json({ error: "Event not found" });
    }

    // 👮 Check Organizer access (only if not Admin)
    const isOrganizer = event.organizerId.toString() === req.user.userId.toString();
    if (req.user.role === "Organizer" && !isOrganizer) {
      console.log("Access denied: Organizer ID mismatch. Event:", event.organizerId.toString(), "User:", req.user.userId.toString());
      return res.status(403).json({ error: "You are not authorized to delete this event" });
    }

    // 🗑 Delete the event
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Server error while deleting event." });
  }
};

// Change event status (only admins can approve/reject)
exports.changeEventStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Admins can update the status
    event.status = status;
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get only approved future events
exports.getFutureEvents = async (req, res) => {
  try {
    const now = new Date();
    const { limit = 10, skip = 0, useThumbnails = 'true' } = req.query; // Add thumbnail option
    
    // Use lean() for better performance and select only needed fields
    const events = await Event.find({ 
      status: 'approved', 
      date: { $gte: now } 
    })
    .populate('organizerId', 'name profilePicture') // Only populate needed fields
    .select('title date location category image thumbnail organizerId availableTickets totalTickets price') // Include thumbnail
    .sort({ date: 1 }) // Sort by date ascending
    .limit(parseInt(limit))
    .skip(parseInt(skip))
    .lean(); // Convert to plain JavaScript objects for better performance

    const transformedEvents = events.map(event => {
      // Use thumbnails for better performance if available
      let imageData = null;
      if (useThumbnails === 'true' && event.thumbnail) {
        imageData = `data:image/jpeg;base64,${event.thumbnail}`;
      } else if (event.image) {
        imageData = `data:image/png;base64,${event.image}`;
      }

      return {
        _id: event._id,
        title: event.title,
        date: event.date,
        location: event.location,
        category: event.category,
        image: imageData,
        organizerId: event.organizerId?._id || event.organizerId,
        organizerName: event.organizerId?.name || 'Organizer',
        organizerProfilePic: event.organizerId?.profilePicture 
          ? `data:image/jpeg;base64,${event.organizerId.profilePicture}`
          : null,
        availableTickets: event.availableTickets,
        totalTickets: event.totalTickets,
        price: event.price
      };
    });

    res.json(transformedEvents);
  } catch (err) {
    console.error('Error fetching future events:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get Organizer Profile Picture by ID
exports.getOrganizerProfilePic = async (req, res) => {
  try {
    const { organizerId } = req.params;
    if (!organizerId) {
      return res.status(400).json({ error: 'Organizer ID is required' });
    }
    const user = await User.findById(organizerId).select('profilePicture');
    if (!user || !user.profilePicture) {
      return res.json({ profilePic: null });
    }
    res.json({ profilePic: `data:image/jpeg;base64,${user.profilePicture}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};