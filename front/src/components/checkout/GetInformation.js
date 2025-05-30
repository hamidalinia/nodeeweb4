import React from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Row,
} from 'shards-react';
import { Link } from 'react-router-dom';

import store from '#c/functions/store';
// import State from "#c/data/state";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CreateForm from '#c/components/components-overview/CreateForm';
import { withTranslation } from 'react-i18next';
import {
  buy,
  changeAddressArr,
  createOrder,
  getTheChaparPrice,
  getTheSettings,
  goToProduct,
  savePost,
  updateAddress,
  updateCard,
} from '#c/functions/index';
import { toast } from 'react-toastify';

class GetInformation extends React.Component {
  constructor(props) {
    super(props);
    const { t } = props;
    this.state = {
      lan: store.getState().store.lan || 'fa',
      card: store.getState().store.card || [],
      themeData: store.getState().store.themeData,
      guestMode: store.getState().store.themeData?.guestMode,
      token: store.getState().store.user.token || '',
      user: store.getState().store.user || {},
      checkOutPhoneNumber: {
        add: {
          data: {
            firstName: store.getState().store.firstName || '',
            lastName: store.getState().store.lastName || '',
            internationalCode: store.getState().store.internationalCode || '',
            email: store.getState().store.email || '',
            phoneNumber: store.getState().store.user.phoneNumber || '',
            SecondPhoneNumber: '',
          },
          fields: [
            {
              type: 'tel',
              label: t('Phone number'),

              size: {
                sm: 12,
                lg: 6,
              },
              onChange: (text) => {
                this.state.checkOutPhoneNumber.add.data['phoneNumber'] = text;
                this.state.user.phoneNumber = text;
                let user = text;

                savePost(user);
              },
              className: 'ltr ltr-tel',
              placeholder: '0912*******',
              child: [],
              disabled: (this.state?.guestMode && !this.state?.token) ,
              value: store.getState().store.user.phoneNumber || '',
            },
            {
              type: 'input',
              label: t('Second Phone number'),

              size: {
                sm: 12,
                lg: 6,
              },
              onChange: (text) => {
                this.state.checkOutPhoneNumber.add.data['SecondPhoneNumber'] =
                  text;
              },
              className: 'ltr ltr-tel',
              placeholder: t('Additional phone number'),
              child: [],
              value: store.getState().store.user.SecondPhoneNumber || '',
            },
            {
              type: 'input',
              label: t('First name'),

              size: {
                sm: 12,
                lg: 6,
              },
              onChange: (text) => {
                this.state.checkOutPhoneNumber.add.data['firstName'] = text;
                // console.log('text',text)
                this.state.user.firstName = text;
                let user = text;

                savePost(user);
              },
              className: 'rtl',
              placeholder: t('First name'),
              child: [],
              disabled: false,
              value: store.getState().store.user.firstName || '',
            },
            {
              type: 'input',
              label: t('Last name'),

              size: {
                sm: 12,
                lg: 6,
              },
              onChange: (text) => {
                this.state.checkOutPhoneNumber.add.data['lastName'] = text;
                let user = (this.state.user.lastName = text);
                savePost(user);
              },
              className: 'rtl',
              placeholder: t('Last name'),
              child: [],
              disabled: false,
              value: store.getState().store.user.lastName || '',
            },
            {
              type: 'input',
              label: t('International Code'),

              size: {
                sm: 12,
                lg: 6,
              },
              onChange: (text) => {
                this.state.checkOutPhoneNumber.add.data['internationalCode'] =
                  text;
                let user = (this.state.user.internationalCode = text);
                savePost(user);
              },
              className: 'ltr ltr-tel',
              placeholder: '00xxxxxxxx',
              child: [],
              disabled: false,
              value: store.getState().store.user.internationalCode || '',
            },
            {
              type: 'input',
              label: t('Email'),

              size: {
                sm: 12,
                lg: 6,
              },
              onChange: (text) => {
                this.state.checkOutPhoneNumber.add.data['email'] = text;
                let user = (this.state.user.email = text);
                savePost(user);
              },
              className: 'ltr ltr-tel',
              placeholder: 'mail@gmail.com',
              child: [],
              disabled: false,
              value: store.getState().store.user.email || '',
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
          buttons: [],
        },
      },
    };
    // this.getSettings();
  }

  render() {
    const { t, _id, onNext, card } = this.props;
    // let sum = 0;
    let { checkOutPhoneNumber } = this.state;

    return (
      <Card className="mb-3 pd-1">
        <CardHeader className={'pd-1 border-bottom'}>
          <div className="kjhghjk">
            <div
              className="d-inline-block item-icon-wrapper ytrerty"
              dangerouslySetInnerHTML={{ __html: t('Contact number') }}
            />
            <div className='d-flex'>
              <span style={{fontSize: '13px'}}>{`${t('if you have an account already, you can login')}:  `}</span>
              <Link style={{fontSize: '13px'}} to={'/login'}>{t('please login')}</Link>
            </div>
          </div>
        </CardHeader>
        <CardBody className={'pd-1 pt-5'}>
          <Col lg="12">
            <Row>
              <CreateForm
                buttons={[]}
                fields={checkOutPhoneNumber.add.fields}
              />
            </Row>
          </Col>
        </CardBody>
        <CardFooter className={'pd-1'}>
          <ButtonGroup size="md left">
            <Button
              className={'go-to-checkout-part-address'}
              left={'true'}
              onClick={() => {
                this.state.card = store.getState().store.card;
                console.log(' this.state.card', this.state.card);
                if (
                  !this.state.card ||
                  (this.state.card && !this.state.card[0])
                ) {
                  toast(t('you have nothing in your cart!'), {
                    type: 'error',
                  });
                  return;
                } else {
                  if(this.state.guestMode && !this.state.token){
                    console.log(' information fields must to be fill')
                  }
                  onNext();
                }
              }}>
              {t('next')}
              <ChevronLeftIcon />
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
    );
  }
}

export default withTranslation()(GetInformation);
