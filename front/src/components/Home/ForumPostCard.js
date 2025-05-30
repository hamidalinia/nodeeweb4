import React, {useState} from 'react';
import {Button, Card, CardContent, Chip, Grid, IconButton, Modal, TextareaAutosize} from '@mui/material';
import {Link, useNavigate} from 'react-router-dom';
import {dateFormat} from '#c/functions/utils';
import {MainUrl,submitPostReplyToForum} from '@/functions';
import {useTranslation} from 'react-i18next'; // Importing useTranslation
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import {likeForumPost} from '#c/functions/index';
import CloseIcon from '@mui/icons-material/Close';
import {toast} from "react-toastify";
import ReportIcon from '@mui/icons-material/Report';
import ReplyIcon from '@mui/icons-material/Reply';
const ForumPostCard = ({post, single,childReply}) => {
  const {t} = useTranslation();  // Using the translation hook
  const navigate = useNavigate();
  const [customerLiked, setCustomerLiked] = useState(post?.customerLiked);
  const [likeCount, setLikeCount] = useState(post?.likeCount);
  const [answerModal, setAnswerModal] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [openMoreMenu, setOpenMoreMenu] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);

  const handleCloseModal = () => {
    setAnswerModal(false);
  };
  const handleReplySubmit = async (postId, replyId) => {
    setLoading(true);
    try {
      // Prepare reply data to be submitted
      const replyData = { text: postContent, postId };

      // If it's a nested reply, include replyId
      if (replyId) {
        replyData.replyId = replyId;
      }

      // Submit the reply
      await submitPostReplyToForum(replyData);
      toast.success(t("postSubmitted"));  // Success message for the reply submission
      setPostContent("");  // Clear the content of the reply input field
    } catch (error) {
      console.error(t("errorSubmittingPost"), error);
      toast.error(t("failedSubmitPost"));  // Error message for submission failure
    } finally {
      setLoading(false);
    }
  };

  const handleLikeClick = async () => {
    // If the post is already liked, we want to unlike it
    if (customerLiked) {
      // Optimistically update UI to show that the post is unliked
      setCustomerLiked(false);
      setLikeCount(likeCount - 1);

      // Send the request in the background to unlike
      try {
        await likeForumPost(post._id, false); // assuming 'false' means unliking the post
      } catch (err) {
        console.error("Error unliking the post:", err);

        // If the request fails, revert the changes (likeCount and customerLiked)
        setCustomerLiked(true); // Keep the post liked
        setLikeCount(likeCount); // Revert like count
      }
    } else {
      // If the post is not liked, we want to like it
      setCustomerLiked(true);
      setLikeCount(likeCount + 1);

      // Send the request in the background to like the post
      try {
        await likeForumPost(post._id, true); // assuming 'true' means liking the post
      } catch (err) {
        console.error("Error liking the post:", err);

        // If the request fails, revert the changes
        setCustomerLiked(false);
        setLikeCount(likeCount); // revert back to the previous like count
      }
    }
  };
  // return JSON.stringify(post)
  return (
    <><Grid item xs={12} sm={6} md={4} key={post._id} className={'forum-post-card-wrapper '+(childReply ? 'child-reply' : '')}>
      <Card className={'forum-post-card'}>
        <CardContent className={'forum-post-card-content'}>
          <div className={'d-flex forum-post-card-bar'}>
            <div className={'d-flex'}>
              {/* Post Date */}
              <div className={'forum-post-profile-image'}>
                {(post?.customer?.photos && post?.customer?.photos?.url && post?.customer?._id) &&
                <Link to={'/user/' + post?.customer?._id}><img src={MainUrl + '/' + post.customer.photos?.url}/></Link>}
                {!post?.customer?.photos && <AccountCircleIcon/>}

              </div>
              <div className={'forum-post-metas'}>
                <div className={'forum-post-card-customer'}>
                  {post?.customer?.firstName}{post?.customer?.lastName}
                </div>
                <div className={'forum-post-card-date'}>
                  {dateFormat(post.createdAt, 'YYYY/MM/DD HH:mm')}
                </div>
              </div>
            </div>
            <div className={'forum-post-card-more-wrapper'}>
              <Button className={'forum-post-card-report-button'} onClick={(e)=>setOpenMoreMenu(!openMoreMenu)}>
                <MoreVertIcon/>
              </Button>
              {openMoreMenu && <div className={'forum-post-more-option'}>
                <Button onClick={(e)=>setOpenReportModal(!openReportModal)} className={'forum-post-more-option-item'}><ReportIcon/>{t('report')}</Button>
              </div>}
            </div>
          </div>

          <div style={{marginTop: '10px'}}>
            {/* Post Topic */}
            {post?.forumTopic && post?.forumTopic?.length > 0 && (
              <Chip
                className={'forum-post-card-chips'}
                label={post?.forumTopic[0]?.name?.fa}
              />
            )}

            {/* Tags as Chips */}
            {post?.forumTag?.map((tag) => (
              <Chip
                key={tag._id}
                className={'forum-post-card-chips'}

                label={tag.name.fa}
              />
            ))}
          </div>

          {/* Post Text */}
          <div className={'forum-post-card-text'}>
            {post.text.length > 50 ? `${post.text.substring(0, 50)}...` : post.text}
          </div>

          {/* Media (Images in the text) */}
          {post.media && post.media.length > 0 && (
            <Grid container spacing={1} style={{marginTop: '10px'}}>
              {post.media.map((mediaItem) => (
                <Grid item xs={12} key={mediaItem._id}>
                  <img
                    src={MainUrl + '/' + mediaItem.url}
                    alt={mediaItem.name}
                    style={{width: '100%', borderRadius: '8px'}}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          <div className={'d-flex forum-post-bottom-bar'}>
            <div className={'d-flex'}>
              <Button
                className={'forum-post-icons'}
                onClick={handleLikeClick}
              >
                {!customerLiked && (
                  <>
                    <ThumbUpOffAltIcon/>
                    <span>{likeCount}</span>
                  </>
                )}
                {customerLiked && (
                  <>
                    <ThumbUpIcon/>
                    <span>{likeCount}</span>
                  </>
                )}
              </Button>
              {!childReply && <Button
                className={'forum-post-icons'}
                onClick={() => {
                  if (!single) navigate(`/forum-post/${post._id}`)

                }}
              >
                <ChatBubbleOutlineIcon/><span>{post?.replyCount}</span>
              </Button>}
              {childReply && <Button
                className={'forum-post-icons'}
                onClick={() => {
                  if (!single) navigate(`/forum-post/${post._id}`)

                }}
              >
                <ReplyIcon/><span>{post?.replyCount}</span>
              </Button>}
              {!childReply &&<span
                className={'forum-post-icons'}
              >
                <RemoveRedEyeIcon/><span>{post?.views}</span>
              </span>}
            </div>
            {!childReply && <Button
              variant="contained"
              color="primary"
              className={'forum-post-read-more'}

              onClick={() => {
                if (!single) navigate(`/forum-post/${post._id}#add`)
                if (single) {
                  setAnswerModal(true)
                }
              }}
            >
              {single && t('answer')}
              {!single && t('readMore')}
              <ArrowBackIosNewIcon/>
            </Button>}
          </div>
        </CardContent>
      </Card>
      <Modal open={answerModal} onClose={handleCloseModal} className={'answer-modal'}>
        <div className={'answer-modal-inside'}
             style={{padding: '20px', margin: 'auto', backgroundColor: 'white'}}>
          <div className={'answer-modal-inside-top-bar'}>
            <IconButton onClick={handleCloseModal}
                        style={{position: 'absolute', top: '10px', right: '10px', zIndex: '9999'}}>
              <CloseIcon/>
            </IconButton>
          </div>
          <div className={'answer-modal-inside-content'}>

          {/* Post Content Textarea */}
          <TextareaAutosize
            placeholder={t("answer text")}
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
          </div>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={(e)=>handleReplySubmit(post._id)}
            style={{ marginTop: "16px" }}
            disabled={loading}
          >
            {loading ? t("submitting") : t("submitPost")}
          </Button>
        </div>
      </Modal>
    </Grid>
      {/*{JSON.stringify(post?.reply)}*/}
      {(post?.reply && post?.reply[0]) && post?.reply?.map((reply)=>{
        // return JSON.stringify(reply)
        return <ForumPostCard key={reply._id} single={false} childReply={true} post={reply}/>
      })}
      </>
  );
};

export default ForumPostCard;
