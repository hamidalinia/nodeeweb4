import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Card, CardBody, CardTitle, Progress } from 'shards-react';
import { getMyWorkspaces,MainUrl,setStyles } from '@/functions';
import { Link } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CircularProgress from '@mui/material/CircularProgress';

const Workspace = (props) => {
  let {  t,element = {}} = props;
  let { settings = {} } = element;
  let { general = {} } = settings;
  let { fields = {} } = general;
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]); // State to store fetched workspaces
  const [loading, setLoading] = useState(true); // Loading state
  // const [error, setError] = useState(null); // Error state

  // Extract button-related fields
  const {
    classes = '',
    showInMobile = false,
    text = t('Back'),
  } = fields;
  const style = setStyles(fields);

  // Fetch user's workspaces on component mount
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await getMyWorkspaces(); // Fetch workspaces
        if (response.success) {
          setWorkspaces(response.data); // Store in state
        }
        // else {
        //   setError(t('Error fetching workspaces'));
        // }
      } catch (err) {
        console.error('Error fetching workspaces:', err);
        // setError(t('Error fetching workspaces'));
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  const goBack = () => navigate(-1); // Navigate back

  // Calculate the progress of the workspace based on seasons and lessons
  const calculateProgress = (workspace) => {
    console.log("calculateProgress",workspace)
    if (!workspace.workspace || !workspace.workspace.season) {
      return 0; // Return 0 progress if the necessary properties don't exist
    }

    let totalLessons = 0;
    let completedLessons = 0;

    // Correctly access the 'season' property within the 'workspace' object
    workspace.workspace.season.forEach((season) => {
      totalLessons += season.lessons.length;
      completedLessons += season.lessons.filter((lesson) => lesson.score !== "").length;
    });

    if (totalLessons === 0) return 0; // Avoid division by zero
    return (completedLessons / totalLessons) * 100;
  };


// return JSON.stringify(fields)
  return (
    <div className="my-workspaces-container" style={style}>

      {/* Loading State */}
      {loading && <div className={'loading-my-workspace'}><CircularProgress thickness={2}
                                                                         size={40}/></div>}

      {/* Error State */}
      {/*{!loading && error && <p className="text-danger">{error}</p>}*/}

      {/* Workspaces List */}
      {!loading && workspaces?.length > 0 ? (
        <>
          {workspaces.map((workspaceData) => {
            const workspace = workspaceData.workspace; // Access the workspace object

            return (
              <div key={workspace._id} className={'my-workspace-item'}>

                <div className={'my-workspace-item-box'}>
                  <div className={'my-workspace-item-box-image'}>
                    {/* Workspace Icon */}
                    {workspace.icon && (
                      <img
                        src={MainUrl + '/' + workspace.icon[0]} // Assuming only one icon per workspace
                        alt="Workspace Icon"
                        width="100%"
                        height="auto"
                      />
                    )}
                  </div>
                  <div className={'my-workspace-item-box-title'}>
                    {/* Workspace Title */}
                    <div className={'my-workspace-item-box-header'}>{workspace.title.fa}</div>
                    <div>{workspace.workspaceLength}</div>

                    {/* Progress Bar */}

                  </div>
                </div>
                <div className={'my-workspace-item-box-footer'}>
                  <div className={'my-workspace-progress-wrapper'}>
                    <Progress
                      value={calculateProgress(workspace)} // Workspace progress
                      color="success"
                      className="mb-2"
                    >
                    </Progress>
                    <div className={'percent-box'}>                    {Math.round(calculateProgress(workspace))}%
                    </div>
                  </div>

                  {/* Continue Workspace Link */}
                  <Link className={'btn btn-primary'} to={`/workspace/${workspace._id}`}><span>{t('Continue Workspace')}</span><ArrowBackIosNewIcon/>
                  </Link>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        !loading && <p className={'error-my-workspace'}>{t('You have not participated in any workspaces yet.')}</p>
      )}
    </div>
  );
};

export default withTranslation()(Workspace);
