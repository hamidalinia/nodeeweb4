import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {fetchForumPostList, fetchForumTags, fetchForumTopic} from '@/functions';
import {Button, Checkbox, CircularProgress, FormControlLabel, Grid, Typography} from '@mui/material';
import {useTranslation} from "react-i18next";
import InfiniteScroll from 'react-infinite-scroller';
import ForumPostCard from '#c/components/Home/ForumPostCard'; // Correct import for the ForumPostCard component
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; // Question mark icon
import NotificationsIcon from '@mui/icons-material/Notifications'; // Badge icon
import GppGoodIcon from '@mui/icons-material/GppGood';
const ForumPostList = () => {
  const {t} = useTranslation();  // i18n translation hook
  const [forumPosts, setForumPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forumTopics, setForumTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagsByTopic, setTagsByTopic] = useState({});
  const [loadingMoreItems, setLoadingMoreItems] = useState(false); // Handle loading more items
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0); // Track the total count of posts
  const [showTopicFilters, setShowTopicFilters] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(true); // Loader for topics
  const [loadingTags, setLoadingTags] = useState(false); // Loader for tags
  const [initialLoad, setInitialLoad] = useState(true); // Initial load flag

  const {forumTopic} = useParams();
  const navigate = useNavigate();

  // Fetch forum topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topicsData = await fetchForumTopic();
        setForumTopics(topicsData);
      } catch (err) {
        setError('Failed to load forum topics');
      } finally {
        setLoadingTopics(false); // Turn off topic loader
      }
    };
    fetchTopics();
  }, []);

  // Fetch tags for selected topics
  useEffect(() => {
    const fetchTags = async (topicId) => {
      setLoadingTags(true); // Start loading tags
      try {
        const tagsData = await fetchForumTags(topicId);
        setTagsByTopic((prevTags) => ({
          ...prevTags,
          [topicId]: tagsData,
        }));
      } catch (err) {
        console.error('Failed to load tags', err);
      } finally {
        setLoadingTags(false); // Turn off tag loader
      }
    };

    // Fetch tags for each selected topic
    if (selectedTopics.length > 0) {
      selectedTopics.forEach((topicId) => fetchTags(topicId));
    }
  }, [selectedTopics]);

  // Fetch forum posts based on selected filters and pagination
  const fetchPosts = async () => {
    setLoading(true); // Start loading posts
    try {
      const response = await fetchForumPostList({
        forumTopic: selectedTopics,
        forumTags: selectedTags,
        page,
      });

      // Get the items (posts) and the count (total posts available)
      const {items, count} = response;

      if (items.length > 0) {
        setForumPosts((prevPosts) => [...prevPosts, ...items]);
        setTotalCount(count); // Set the total count of posts
      }

      // Determine if we have more posts to load
      const totalFetched = forumPosts.length + items.length;
      if (totalFetched >= count) {
        setHasMore(false); // No more posts available
      } else {
        setHasMore(true); // More posts available
      }

    } catch (err) {
      setError('Failed to load forum posts');
    } finally {
      setLoading(false); // Turn off post loader
      setLoadingMoreItems(false); // Stop loading state for more posts
      setInitialLoad(false); // Mark initial load as complete
    }
  };

  // Fetch posts when page or filters change
  useEffect(() => {
    if (page === 1) {
      setForumPosts([]); // Reset forum posts when page is reset (e.g., new filters applied)
    }

    if (hasMore && !loadingMoreItems) {
      fetchPosts();
    }
  }, [page, selectedTopics, selectedTags, hasMore]); // Depend on page, selectedTopics, selectedTags, hasMore

  const handleTopicChange = (event) => {
    const topicId = event.target.value;
    setSelectedTopics((prevSelected) =>
      prevSelected.includes(topicId)
        ? prevSelected.filter((id) => id !== topicId) // If topic is already selected, unselect it
        : [...prevSelected, topicId] // Otherwise, select the topic
    );
  };

  const handleTagChange = (event) => {
    const tagId = event.target.value;
    setSelectedTags((prevSelected) =>
      prevSelected.includes(tagId)
        ? prevSelected.filter((id) => id !== tagId) // If tag is already selected, unselect it
        : [...prevSelected, tagId] // Otherwise, select the tag
    );
  };

  // Handle scroll and fetch more posts
  const loadMorePosts = () => {
    if (!loadingMoreItems && hasMore) {
      setLoadingMoreItems(true);
      setPage((prevPage) => prevPage + 1); // Trigger page change to load more posts
    }
  };

  return (
    <Grid container spacing={2}>
      <div className={'d-flex forum-list-filter-bar'}>
        {/*<div >*/}
          <Button
            variant="outlined"
            color="primary"
            className={'filter-by-topic-r'}
            onClick={() => setShowTopicFilters((prevState) => !prevState)}
          >
            <AutoAwesomeMotionIcon/>
            {t('filterByTopic')}
          </Button>
        {/*</div>*/}
        <div className={'d-flex'} style={{justifyContent:'left'}}>
          <Button
            variant="outlined"
            color="primary"
            className={'filter-by-topic'}
            onClick={() => setShowTopicFilters((prevState) => !prevState)}
          >
            <HelpOutlineIcon />

          </Button>
          <Button
            variant="outlined"
            color="primary"
            className={'filter-by-topic'}
            onClick={() => setShowTopicFilters((prevState) => !prevState)}
          >
            <GppGoodIcon />

          </Button>
        </div>
      </div>
      <Grid item xs={12}>

        {showTopicFilters && (
          loadingTopics ? (
            <Grid container justifyContent="center">
              <CircularProgress/>
            </Grid>
          ) : (
            <div style={{marginTop: '10px'}}>
              {forumTopics.map((topic) => (
                <FormControlLabel
                  key={topic._id}
                  control={
                    <Checkbox
                      checked={selectedTopics.includes(topic._id)} // Check if the topic is selected
                      onChange={handleTopicChange} // Use onChange to toggle selection
                      value={topic._id}
                    />
                  }
                  label={topic.name?.fa}
                />
              ))}
            </div>
          )
        )}

        {/* Forum Tag Filters (Only show tags when a topic is selected) */}
        {selectedTopics.length > 0 && !loadingTags && selectedTopics.map((topicId) => {
          const tags = tagsByTopic[topicId];
          return tags && tags.length > 0 && (
            <div key={topicId} style={{marginTop: '20px'}}>
              <Typography
                variant="h6">{t('tagsForTopic')} {forumTopics.find((t) => t._id === topicId)?.name.fa}</Typography>
              {tags.map((tag) => (
                <FormControlLabel
                  key={tag._id}
                  control={
                    <Checkbox
                      checked={selectedTags.includes(tag._id)} // Check if the tag is selected
                      onChange={handleTagChange} // Use onChange to toggle selection
                      value={tag._id}
                    />
                  }
                  label={tag.name?.fa}
                />
              ))}
            </div>
          );
        })}
      </Grid>

      {/* InfiniteScroll Component */}
      <InfiniteScroll
        pageStart={0} // Start from page 0, as per your example
        initialLoad={initialLoad} // Only load more if not in initial load phase
        loadMore={loadMorePosts} // Trigger loading more posts
        hasMore={hasMore} // Set whether there are more posts
        loader={<Grid item xs={12} style={{textAlign: 'center'}} key={0}><CircularProgress/></Grid>}
        useWindow={false}
        offset={0} // Optional: Set the offset for infinite scroll
        className="row forum-post-list-wrapper" // Use the correct class for layout
        element="div" // Element type (div) as per your example
      >
        {/* Forum Post List */}
        {loading ? (
          <Grid item xs={12} style={{textAlign: 'center'}}>
            <CircularProgress/>
          </Grid>
        ) : (
          forumPosts.length > 0 ? (
            forumPosts.map((post) => (
              <ForumPostCard key={post._id} post={post}/>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="h6">{t('noPostsAvailable')}</Typography>
            </Grid>
          )
        )}
      </InfiniteScroll>
    </Grid>
  );
};

export default ForumPostList;
