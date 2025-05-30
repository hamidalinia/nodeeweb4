import React, {useEffect, useState} from 'react';
import {Container, Row} from 'shards-react';
import {useParams} from 'react-router-dom';
import {withTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

import Loading from '#c/components/Loading';
import ForumPostCard from '#c/components/Home/ForumPostCard';
import {getForumPost, isClient} from '#c/functions/index';
import store from '#c/functions/store';
import { Button } from 'shards-react';
import {useNavigate} from "react-router-dom";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
const ForumPost = (props) => {
  const {t} = props;

  const params = useParams();
  const {_id: postId} = params;

  const [state, setState] = useState(null); // To store the post data
  const [lan, setLan] = useState(store.getState().store.lan || 'fa'); // Language state

  const product = useSelector((state) => state.store.product || []);
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getForumPost(postId);
        setState(post);
        if (isClient) window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  if (!state) {
    return <Loading/>;
  }

  return (
    <Container className="main-content-container p-0 pb-4 bg-white forum-post-single">
      <div className=" forum-post-single-wrapper-top-bar">
        <Button
          className="top-bar-back-button"
          onClick={goBack}>
          <ArrowForwardIosIcon/>
          <span>
            {(state?.forumTopic[0]?.name?.fa)}

        </span>
        </Button>
      </div>
        <div className=" forum-post-single-wrapper">
          <ForumPostCard key={state._id} single={true} post={state}/>
        </div>
    </Container>
  );
};

export default withTranslation()(ForumPost);
