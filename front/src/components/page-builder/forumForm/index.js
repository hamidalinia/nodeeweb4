import React, { useState, useEffect } from "react";
import { Grid, MenuItem, Select, InputLabel, FormControl, Button, Typography, TextareaAutosize, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { fetchForumTopic, fetchForumTags, submitPostToForum } from "@/functions";
import { useTranslation } from "react-i18next";
import { UploadFile as UploadIcon, Code as CodeIcon, Close as CloseIcon } from "@mui/icons-material";
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'; // Correct import for syntax highlighter
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { toast } from 'react-toastify';  // Importing toast

const ForumForm = () => {
  const { t } = useTranslation();

  const [forumTopic, setForumTopic] = useState("");
  const [forumTags, setForumTags] = useState([]);
  const [forumTag, setForumTag] = useState([]);  // Changed to an array for multiple tags
  const [postContent, setPostContent] = useState("");
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [isCode, setIsCode] = useState(false);
  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(""); // Track selected language for code

  const [openLanguageDialog, setOpenLanguageDialog] = useState(false); // Dialog visibility for language selection

  // Fetch forum topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topicsData = await fetchForumTopic();
        setTopics(topicsData);
      } catch (error) {
        console.error(t("errorFetchingTopics"), error);
      }
    };

    fetchTopics();
  }, [t]);

  // Fetch forum tags based on selected topic
  useEffect(() => {
    const fetchTags = async () => {
      if (!forumTopic) return;

      setLoading(true);
      try {
        const tagsData = await fetchForumTags(forumTopic);
        setForumTags(tagsData);
      } catch (error) {
        console.error(t("errorFetchingTags"), error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [forumTopic, t]);

  // Handle form submission
  const handlePostSubmit = async () => {
    if (!forumTopic || !postContent) {
      toast.error(t("fillAllFields"));  // Using toast for error message
      return;
    }

    setLoading(true);
    try {
      await submitPostToForum({ forumTopic, forumTag, text: postContent, image, code });
      toast.success(t("postSubmitted"));  // Using toast for success message
      setPostContent("");
      setImage(null);
      setCode("");
      setForumTag([]);  // Clear tags after submission
    } catch (error) {
      console.error(t("errorSubmittingPost"), error);
      toast.error(t("failedSubmitPost"));  // Using toast for error message
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);  // Set the file directly, not base64
    }
  };

  const handleCodeButtonClick = () => {
    setOpenLanguageDialog(true);
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setOpenLanguageDialog(false);
    setIsCode(true); // Enable code input when a language is selected
  };

  const handleClearCode = () => {
    setCode("");  // Clear the code input
    setIsCode(false);  // Cancel the code input mode
    setSelectedLanguage("");  // Reset the selected language
  };

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center" direction="rtl" padding={'10px'} className={'ask-question'}>
      <Grid item xs={12} sm={8} md={6}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: "right" }}>
          {t("submitNewPost")}
        </Typography>

        {/* Forum Topic Select */}
        <FormControl fullWidth>
          <InputLabel id="forum-topic-label">{t("forumTopic")}</InputLabel>
          <Select
            labelId="forum-topic-label"
            value={forumTopic}
            onChange={(e) => setForumTopic(e.target.value)}
            label={t("forumTopic")}
            fullWidth
          >
            {topics.map((topic) => (
              <MenuItem key={topic._id} value={topic._id} style={{direction:'rtl'}}>
                {topic.name.fa}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Post Content Textarea */}
        <TextareaAutosize
          placeholder={t("writeYourQuestion")}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "16px",
            fontSize: "16px",
            minHeight: "100px",
            borderRadius: "4px",
            borderColor: "#ccc",
          }}
          minRows={4}
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          dir="rtl"
        />

        {/* Code Input Area */}
        {isCode && selectedLanguage && (
          <div style={{ position: "relative", marginTop: "16px" }}>
            <TextareaAutosize
              placeholder={t("writeYourCode")}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "16px",
                minHeight: "100px",
                borderRadius: "4px",
                borderColor: "#ccc",
              }}
              minRows={4}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              dir="ltr"
            />
            {/* Close button */}
            <IconButton
              style={{ position: "absolute", top: "10px", right: "10px" }}
              onClick={handleClearCode}
            >
              <CloseIcon />
            </IconButton>
          </div>
        )}

        {/* Image and Code Buttons Section (Side by Side) */}
        <Grid container spacing={2} style={{ marginTop: "16px" }}>
          {/* Upload Image Button */}
          <Grid item xs={6}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => document.getElementById("image-upload").click()}
              fullWidth
              startIcon={<UploadIcon />}
            >
              {t("uploadImage")}
            </Button>
            <input
              type="file"
              id="image-upload"
              style={{ display: "none" }}
              onChange={handleImageUpload}
              accept="image/*"
            />
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                style={{ marginTop: "16px", maxWidth: "100%" }}
              />
            )}
          </Grid>

          {/* Add Code Button */}
          {!isCode && !selectedLanguage && (
            <Grid item xs={6}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCodeButtonClick}
                fullWidth
                startIcon={<CodeIcon />}
              >
                {t("addCode")}
              </Button>
            </Grid>
          )}
        </Grid>

        {/* Forum Tag Select */}
        <FormControl fullWidth style={{ marginTop: "16px" }}>
          <InputLabel id="forum-tag-label">{t("forumTag")}</InputLabel>
          <Select
            labelId="forum-tag-label"
            value={forumTag}
            onChange={(e) => setForumTag(e.target.value)}
            label={t("forumTag")}
            fullWidth
            multiple  // Allow multiple tags to be selected
            disabled={loading || forumTags.length === 0}
          >
            {forumTags.map((tag) => (
              <MenuItem key={tag._id} value={tag._id} style={{direction:'rtl'}}>
                {tag?.name?.fa}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handlePostSubmit}
          style={{ marginTop: "16px" }}
          disabled={loading}
        >
          {loading ? t("submitting") : t("submitPost")}
        </Button>

        {/* Language Selection Dialog */}
        <Dialog className={'rtl'} open={openLanguageDialog} onClose={() => setOpenLanguageDialog(false)}>
          <DialogTitle className={'rtl'}>{t("selectLanguage")}</DialogTitle>
          <DialogContent>
            {["python", "javascript", "html", "css", "cpp", "csharp", "java", "go", "other"].map((lang) => (
              <Button key={lang} onClick={() => handleLanguageSelect(lang)} fullWidth>
                {t(`${lang}`)}
              </Button>
            ))}
          </DialogContent>
          <DialogActions className={'ltr'} style={{justifyContent:'flex-start'}}>
            <Button onClick={() => setOpenLanguageDialog(false)} color="primary">
              {t("cancel")}
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
      <div style={{height:'200px',width:'1px'}}></div>
    </Grid>
  );
};

export default ForumForm;
