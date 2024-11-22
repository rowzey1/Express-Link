const multer = require("multer");
const path = require("path");
const ObjectId = require("mongodb").ObjectId;

//Config for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); //uploaded image aresaved to this path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// normal routes ===============================================================

module.exports = function (app, passport, db) {
  // show the home page (will also have our login links)
  app.get("/", function (req, res) {
    res.render("index.ejs");
  });

  // PROFILE SECTION =========================
  app.get("/profile", isLoggedIn, function (req, res) {
    db.collection("messages")
      .find()
      .sort({ createdAt: -1 })
      .toArray()
      .then((messages) => {
        console.log(`Found ${messages.length} messages`);
        res.render("profile.ejs", {
          user: req.user,
          messages: messages,
        });
      })
      .catch((err) => {
        console.error("Error fetching messages:", err);
        res.status(500).render("error.ejs", {
          message: "Error loading messages",
        });
      });
  });

  // LOGOUT ==============================
  app.get("/logout", function (req, res) {
    req.logout(() => {
      console.log("User has logged out!");
    });
    res.redirect("/");
  });

  // message board routes ===============================================================
  //Post Mesages
  app.post("/messages", (req, res) => {
    db.collection("messages")
      .insertOne({
        name: req.body.name,
        msg: req.body.msg,
        thumbUp: 0,
        thumbDown: 0,
      })
      .then((result) => {
        console.log("Message saved");
        res.redirect("/profile");
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error saving message");
      });
  });
  //Post images
  app.post("/createPost", upload.single("image"), (req, res) => {
    const post = {
      username: req.user.local.username,
      msg: req.body.msg,
      thumbUp: 0,
      thumbDown: 0,
      createdAt: new Date(),
      replies: [],
    };

    if (req.file) {
      post.image = req.file.filename;
    }

    db.collection("messages")
      .insertOne(post)
      .then((result) => {
        console.log("Post created");
        res.redirect("/profile");
      })
      .catch((err) => {
        console.error("Error creating post:", err);
        res.status(500).send("Error creating post");
      });
  });

  app.post("/reply", (req, res) => {
    console.log("Reply request created:", req.body);
    const messageId = ObjectId(req.body.messageId);
    const reply = {
      _id: new ObjectId(),
      username: req.user.local.username,
      msg: req.body.reply,
      createdAt: new Date(),
      thumbUp: 0,
      thumbDown: 0,
    };

    db.collection("messages")
      .findOneAndUpdate(
        { _id: messageId },
        {
          $push: {
            replies: reply,
          },
        },
        {
          returnDocument: "after",
        }
      )
      .then((result) => {
        console.log("Reply added:", result);
        res.json({ success: true, reply: reply });
      })
      .catch((err) => {
        console.error("Error adding reply:", err);
        res.status(500).json({ success: false, error: err.message });
      });
  });

  // Update the PUT route to like post
  app.put("/messages", (req, res) => {
    console.log("Received update request:", req.body);
    const messageId = ObjectId(req.body.messageId);
    const action = req.body.action;

    let update = {};
    if (action === "thumbUp") {
      update = { $inc: { thumbUp: 1 } };
    } else if (action === "thumbDown") {
      update = { $inc: { thumbDown: 1 } };
    }

    console.log("Update:", update);

    db.collection("messages")
      .findOneAndUpdate({ _id: messageId }, update, {
        returnDocument: "after",
        upsert: false,
      })
      .then((result) => {
        console.log("Updated document:", result);
        res.json({ success: true, result: result });
      })
      .catch((err) => {
        console.error("Error updating document:", err);
        res.status(500).json({ success: false, error: err.message });
      });
  });

  //delete message
  app.delete("/messages", (req, res) => {
    console.log("Delete request received:", req.body);
    const messageId = ObjectId(req.body.messageId);

    db.collection("messages")
      .deleteOne({ _id: messageId })
      .then((result) => {
        console.log("Message deleted");
        res.json({ success: true });
      })
      .catch((err) => {
        console.error("Error deleting message:", err);
        res.status(500).json({ success: false, error: err.message });
      });
  });

  // thumbs up or down reply
  app.put("/replyVote", (req, res) => {
    const messageId = ObjectId(req.body.messageId);
    const replyId = ObjectId(req.body.replyId);
    const action = req.body.action;

    console.log("Processing reply vote:", { messageId, replyId, action });

    // Create the update query
    const updateQuery = {
      $inc: {
        [`replies.$.${action}`]: 1,
      },
    };

    db.collection("messages")
      .findOneAndUpdate(
        {
          _id: messageId,
          "replies._id": replyId,
        },
        updateQuery,
        {
          returnDocument: "after",
        }
      )
      .then((result) => {
        console.log("Vote result:", result);
        if (!result.value) {
          return res
            .status(404)
            .json({ success: false, error: "Reply not found" });
        }
        res.json({
          success: true,
          result: result.value,
          message: "Vote recorded successfully",
        });
      })
      .catch((err) => {
        console.error("Error updating reply vote:", err);
        res.status(500).json({ success: false, error: err.message });
      });
  });

  // Delete a reply
  app.delete("/deleteReply", (req, res) => {
    const messageId = ObjectId(req.body.messageId);
    const replyId = ObjectId(req.body.replyId);

    db.collection("messages")
      .findOneAndUpdate(
        { _id: messageId },
        {
          $pull: {
            replies: {
              _id: replyId,
            },
          },
        },
        { returnDocument: "after" }
      )
      .then((result) => {
        if (!result.value) {
          return res
            .status(404)
            .json({ success: false, error: "Message or reply not found" });
        }
        console.log("Reply deleted");
        res.json({ success: true });
      })
      .catch((err) => {
        console.error("Error deleting reply:", err);
        res.status(500).json({ success: false, error: err.message });
      });
  });

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get("/login", function (req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  // process the login form
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // SIGNUP =================================
  // show the signup form
  app.get("/signup", function (req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  // process the signup form
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get("/unlink/local", isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.local.username = undefined;
    user.save(function (err) {
      res.redirect("/profile");
    });
  });
};

// check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}
