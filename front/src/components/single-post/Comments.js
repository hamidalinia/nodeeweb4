import React from 'react';
import {Card, CardBody, CardFooter, CardHeader, Col, Row} from 'shards-react';
import store from '#c/functions/store';
import {dateFormat} from '#c/functions/utils';
import CreateForm from '#c/components/components-overview/CreateForm';
import {withTranslation} from 'react-i18next';
import CustomModal from '#c/components/Modal';

import {
  getComments,
  getTheChaparPrice,
  getTheSettings,
  goToProduct,
  savePost,
  sendAnswer,
  sendComment,
} from '#c/functions/index';
import {toast} from 'react-toastify';
import FaceIcon from '@mui/icons-material/Face';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TextsmsIcon from '@mui/icons-material/Textsms';
import StarPurple500Icon from '@mui/icons-material/StarPurple500';


import StarIcon from '@mui/icons-material/Star';

const ReturnRate = (props) => {
  let emptyStar = [0, 1, 2, 3, 4]
  let {rate} = props;
  rate = parseInt(rate);
  return emptyStar.map((item) => {
    if (rate > item)
      return <StarIcon className={"filled-star"}/>
    else return <StarPurple500Icon/>
  })

}

class Comments extends React.Component {

  constructor(props) {
    super(props);

    const {t, id} = props;
    console.log('id', id);
    this.state = {
      comment: '',
      commentId: '',
      showAllAnswers: {},
      lan: store.getState().store.lan || 'fa',
      token: store.getState().store.user.token || '',
      user: store.getState().store.user || {},
      id: null,
      product_id: id,
      isAnswerBox: false,
      comments: [],
      modals: false,
      commentForm: {
        add: {
          data: {
            Text: '',
            Answer: '',
            Rate: 0,
          },
          fields: [
            // {
            //   type: 'selectOption',
            //   label: t('Rate'),
            //   size: {
            //     sm: 6,
            //     lg: 6,
            //   },
            //   readValue: 'no',
            //   returnEverything: true,
            //   onChange: (text) => {

            //     console.log('text', text);
            //     this.state.commentForm.add.data['Rate'] = text.name;
            //     this.state.commentForm.add.data['Rate'] = text.no;
            //   },
            //   selectOptionText: t('choose rate...'),
            //   className: 'rtl',
            //   placeholder: t('Rate'),
            //   child: [],
            //   children: [
            //     { name: '1', no: 1 },
            //     { name: '2', no: 2 },
            //     { name: '3', no: 3 },
            //     { name: '4', no: 4 },
            //     { name: '5', no: 5 },
            //   ],
            //   value: '',
            // },
            {
              type: 'textarea',
              label: t('Comment'),

              size: {
                sm: 12,
                lg: 12,
              },
              onChange: (text) => {
                this.state.commentForm.add.data['Text'] = text;
              },
              className: 'rtl',
              placeholder: t('Your comment...'),
              child: [],
              id: 'comment-box',
              value: '',
            },
            {
              type: 'empty',
              size: {
                sm: 12,
                lg: 12,
              },
              className: 'height50',
              placeholder: '',
              child: [],
            },
          ],
          answer: [
            {
              type: 'textarea',
              label: t('Answer'),

              size: {
                sm: 12,
                lg: 12,
              },
              onChange: (text) => {
                this.state.commentForm.add.data['Answer'] = text;
              },
              className: 'rtl',
              placeholder: t('Your comment...'),
              child: [],
              id: 'comment-box',
              value: '',
            },
            {
              type: 'empty',
              size: {
                sm: 12,
                lg: 12,
              },
              className: 'height50',
              placeholder: '',
              child: [],
            },
          ],
          rating: [
            {
              type: 'rating',
              label: t('Rate'),
              size: {
                sm: 6,
                lg: 6,
              },
              readValue: 'no',
              returnEverything: true,
              onChange: (text) => {

                console.log('rating value', text);
                this.state.commentForm.add.data['Rate'] = text;
                this.state.commentForm.add.data['Rate'] = text;

              },
              selectOptionText: t('choose rate...'),
              className: 'rtl',
              placeholder: t('Rate'),
              child: [],
              value: '',
            }
          ],
          buttons: [
            {
              type: 'small',
              header: [],
              body: ['title', 'text'],
              url: '/comment/',
              name: t('Send Comment'),
              className: 'ml-auto  btn btn-accent ',
              parentClass: 'pd-0',
              loader: true,
              size: {
                xs: 6,
                sm: 6,
                md: 6,
                lg: 6,
              },
              onClick: async (e) => {
                let ref = this;
                let {Rate, Text} = this.state.commentForm.add.data;
                let {lan} = this.state;

                if (!Rate) {
                  toast(t('Rate please!'), {
                    type: 'error',
                  });
                  return;
                }
                if (!Text) {
                  toast(t('Enter your comment please!'), {
                    type: 'error',
                  });
                  return;
                }
                let obj = {
                  rate: Rate,
                  text: {},
                };
                obj.text[lan] = Text;
                sendComment(id, obj).then((response) => {
                  this.setState((prevState) => ({
                    commentForm: {
                      ...prevState.commentForm,
                      add: {
                        ...prevState.commentForm.add,
                        data: {
                          ...prevState.commentForm.add.data,
                          Text: "",
                        },
                      },
                    },
                  }));
                  // let len=
                  if (response) {
                    this.updateComments(id);
                    // this.setState({
                    //   address: response.customer.address,
                    //   modals: false
                    //
                    // });
                    // this.getSettings();
                  }
                });
              },
            },
          ],
          answerButtons: [
            {
              type: 'small',
              header: [],
              body: ['title', 'text'],
              url: '/comment/',
              name: t('Send Answer'),
              className: 'ml-auto  btn btn-accent ',
              parentClass: 'pd-0',
              loader: true,
              size: {
                xs: 6,
                sm: 6,
                md: 6,
                lg: 6,
              },
              onClick: async (e) => {
                let ref = this;
                let {Answer} = this.state.commentForm.add.data;
                let {lan, commentId} = this.state;
                if (!Answer) {
                  toast(t('Enter your comment please!'), {
                    type: 'error',
                  });
                  return;
                }
                let obj = {
                  text: {},
                  commentId: commentId
                };
                obj.text[lan] = Answer;
                sendAnswer(id, obj).then((response) => {
                  this.setState((prevState) => ({
                    commentForm: {
                      ...prevState.commentForm,
                      add: {
                        ...prevState.commentForm.add,
                        data: {
                          ...prevState.commentForm.add.data,
                          Answer: "",
                        },
                      },
                    },
                  }));
                  this.setState({
                    modals: false,
                  });
                  // let len=
                  if (response) {
                    this.updateComments(id);
                    // this.setState({
                    //   address: response.customer.address,
                    //   modals: false
                    //
                    // });
                    // this.getSettings();
                  }
                })
                  .catch((err) => {
                    console.log(err)
                    this.setState(prevState => ({
                      commentForm: {
                        ...prevState.commentForm,
                        add: {
                          ...prevState.commentForm.add,
                          data: {
                            ...prevState.commentForm.add.data,
                            Anwer: '', // Update the Text property
                          },
                        },
                      },
                    }));
                  });
              },
            },
          ],
        },
      },
    };
    // updateComments=(id);
    // this.getSettings();
    // onSetAddress(this.state.address[this.state.hover]);
  }

  onCloseModal = () => {
    console.log('onCloseModal')
    this.setState({modals: false})
  }
  updateComments = (id) => {

    getComments(id).then((res) => {
      console.log("rssses", res.comment)
      this.setState({comments: res.comment, id: id})
    })
  };

  // Toggle the visibility of answers for a specific comment index
  toggleAnswers = (index) => {
    this.setState((prevState) => ({
      showAllAnswers: {
        ...prevState.showAllAnswers,
        [index]: !prevState.showAllAnswers[index], // Toggle visibility based on index
      },
    }));
  };

  handleAnswer = (e, commentText, comId) => {
    this.setState({modals: true})
    e.preventDefault()
    console.log('handle Answer', commentText)
    console.log('comment id to Answer', comId)
    this.setState({comment: commentText, commentId: comId})
  }

  componentDidUpdate(props) {
    console.log('componentDidUpdate', props);
    let {id} = props;
    if (id != this.state.id) this.updateComments(id);
  }

  componentDidMount(props) {
    console.log('componentDidMount');
    if (this.state.product_id)
      this.updateComments(this.state.product_id);
  }

  render() {
    const {t, _id} = this.props;
    let {commentForm, comments, lan, modals, comment, showAllAnswers} = this.state;

    return [
      <Card className="mb-3 pd-1">
        <CardHeader className={'pd-1'}>
          <div className="kjhghjk">
            <div
              className="d-inline-block item-icon-wrapper ytrerty"
              dangerouslySetInnerHTML={{__html: t('Comments')}}
            />

          </div>
        </CardHeader>
        <CardBody className={'p-3'}>

              <CustomModal
                onClose={() => {
                  this.onCloseModal();
                }}
                open={modals}
                className={'width50vw sdfghyjuikol kiuytgfhjuyt'}
                title={t('Reply to this comment')}>
                <CreateForm
                  texts={comment || ''}
                  buttons={commentForm.add.answerButtons}
                  fields={commentForm.add.answer}
                />
              </CustomModal>
              <CreateForm
                rating={commentForm.add.rating}
                buttons={commentForm.add.buttons}
                fields={commentForm.add.fields}
              />

        </CardBody>
      </Card>,
      <>
        {comments?.map((com, i) => (
          <Card className="mb-3 p-3" key={i}>
            <CardHeader className={'p-0'}>
              <Row>
                <Col lg={6} md={6} sm={6} xs={6} className={'text-right'}>
                  <FaceIcon className={'comment-meta-icon-user'}/>
                  <span className={'ml-2 mr-2 comment-meta-text-user'}>
                    {com.customer_data.firstName}
                  </span>
                </Col>
                <Col lg={6} md={6} sm={6} xs={6} className={'text-left'}>
                  <div className={'ml-2 mr-2'}>
                    <span className={'comment-meta-rate-stars'}><ReturnRate rate={com.rate}/></span>
                  </div>
                  <div className={'comment-meta'}>
                    <AccessTimeIcon className={'comment-meta-icon'}/>
                    <span className={'comment-meta-date'}>
                      {dateFormat(com.createdAt)}
                    </span>
                  </div>
                </Col>
              </Row>
              <hr/>
            </CardHeader>
            <CardBody className={'pd-1'}>
              <Row>
                <Col lg="12" className={'p-2'}>
                  <TextsmsIcon className={'text-sms-icon'}/>
                  <span className={'text-sms-icon-message'}>{com.text[lan]}</span>
                </Col>
                {com?.child?.length > 0 && (
                  <Row>
                    {/* Show only one answer by default, or all if showAllAnswers is true */}
                    {com.child.slice(0, showAllAnswers[i] ? com.child.length : 1).map((ch, id) => (
                      <React.Fragment key={id}>
                        <Col lg="12" className="py-2">
                          <div style={{fontSize: '12px'}}>
                            {t("Answer")}: {ch.text ? ch.text[lan] : ''}
                          </div>
                          <div style={{fontSize: '11px', color: 'gray'}}>
                            {ch.customer_data ? `${ch.customer_data.firstName || ''}` : ''}
                          </div>
                        </Col>
                        <hr/>
                      </React.Fragment>
                    ))}
                  </Row>
                )}
                {com?.child?.length > 0 && (
                  <Col lg="12" className={'px-4  pb-2'}>
                    <a
                      style={{color: 'rgb(90, 97, 105)', cursor: 'pointer'}}
                      onClick={() => this.toggleAnswers(i)} className="mt-2">
                      {showAllAnswers[i] ? t('Less Answers') : t('More Answers')}
                    </a>
                  </Col>
                )}
                {/*<Col lg="12" className={'px-4'}>*/}
                  {/*<a*/}
                    {/*onClick={(e) => this.handleAnswer(e, com.text[lan], com._id)}*/}
                    {/*style={{color: 'rgb(90, 97, 105, .7)', cursor: 'pointer'}}*/}
                  {/*>*/}
                    {/*{com?.child?.length > 0 ? t('Send new Answer') : t('Send Answer')}*/}
                  {/*</a>*/}
                {/*</Col>*/}
              </Row>
            </CardBody>
          </Card>
        ))}
      </>
    ];
  }
}

export default withTranslation()(Comments);
