import React, { useEffect, useState } from 'react';
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
import LoadingComponent from '#c/components/components-overview/LoadingComponent';
import { useSelector } from 'react-redux';
import store from '#c/functions/store';
import { useTranslation, withTranslation } from 'react-i18next';
import {
  buy,
  changeAddressArr,
  createOrder,
  getTheChaparPrice,
  getTheSettings,
  goToProduct,
  savePost,
  updateAddress,
  updatetStatus,
  updateCard,
} from '#c/functions/index';
import City from '#c/data/city.json';
// import State from "#c/data/state";
let supportedcity = [
  'اميريه-تهران',
  'تهران',
  'منطقه 11 پستي تهران',
  'منطقه 13 پستي تهران',
  'منطقه 14 پستي تهران',
  'منطقه 15 پستي تهران',
  'منطقه 16 پستي تهران',
  'تجريش',
];

function setCity(s) {
  console.log('setCity', s);
  let tttt = [];
  City.forEach((item) => {
    if (item.state_no == s) {
      tttt.push(item);
    }
  });
  console.log('set city children:', tttt);
  return tttt;
}

function GetDelivery(props) {
  const themeData = store.getState().store.themeData
  const unitMass = themeData.unitMass
  console.log('props', props);
  const { addressChoosed } = props;
  const { t } = useTranslation();
  console.log('addressChoosed', addressChoosed);
  let [renTimes, setRenTimes] = useState([]);
  let [address, setAddress] = useState(addressChoosed);
  let [card, setCard] = useState(store.getState().store.card || []);
  let [settings, setSettings] = useState(false);
  let [modals, setModals] = useState(false);
  let [loading, setLoading] = useState(false);
  let [loading2, setLoading2] = useState(false);
  let [deliveryPrice, setDeliveryPrice] = useState(0);
  let [sum, setSum] = useState(0);
  let [weightHover, setWeightHover] = useState('');
  let [total, setTotal] = useState(0);
  let [totalweight, setTotalweight] = useState(0);
  let [hoverD, setHoverD] = useState(0);
  let [hoverBool, setHoverBool] = useState(false);
  useEffect(() => {
    getSettings();
    getWeightDelivery();
  }, []);
  useEffect(() => {
    console.log(totalweight)
  }, [totalweight]);
  // }


  const countDelivery = (sum, renTimes, hoverD = 0, totalWeight) => {
    console.log('countDelivery...', sum, renTimes, hoverD, totalWeight);

    // let {address, hover} = state;
    // let {t} = this.props;
    return new Promise(function (resolve, reject) {
      let varprice = 0;
      let countWeight = 0;

      let setting = renTimes[hoverD];
      console.log('countDelivery', sum);
      console.log('setting', setting);
      console.log('hoverD', hoverD);
      console.log('address', address);
      console.log('totalWeight: ', totalWeight);
      console.log('setting.static price :', setting.staticPrice)
      console.log('setting perkiloPrice price :', setting.perKiloPrice)
      if (setting.withFormula && setting.withFormula == 'is'){
        let staticPrice = setting?.staticPrice
        let perkiloPrice = setting?.perKiloPrice
        if(unitMass == "gram"){
          console.log('unit mass is gram')
          totalWeight = totalWeight / 1000
          console.log('total weight for gram', totalWeight)
          if(totalWeight  > 1){
            countWeight = totalWeight - 1;
            varprice = Number(staticPrice)
            console.log(' var price step 1', varprice)
            varprice  +=   Number(countWeight) * Number(perkiloPrice)
            console.log(' var price step 2', varprice)
          } else if(totalWeight > 0 && totalWeight <= 1){
            console.log('totalweight less 1')
            varprice += totalWeight * staticPrice
          }

        }else{
          console.log('unit mass is kilo gram')

          if(totalWeight  > 1){
            countWeight = totalWeight - 1;
            console.log('countWeight', Number(countWeight))
            console.log('perkiloprice', Number(perkiloPrice))
            console.log(Number(countWeight) * Number(perkiloPrice))
            varprice = Number(staticPrice)
            console.log(' var price step 1', varprice)
            varprice  +=   Number(countWeight) * Number(perkiloPrice)
            console.log(' var price step 2', varprice)
          } else if(totalWeight > 0 && (totalWeight <= 1) ){
            varprice += totalWeight * staticPrice
          }
        }

        }else {

      if (setting && setting.condition) {
        console.log('hi condition', Number(setting.condition))

        if (Number(setting.condition) > sum) {
          console.log('condition more than sum')
          if (setting.priceLessThanCondition){
            if (setting.priceLessThanCondition == '0') {
              varprice = 0;
            } else {
              varprice = setting.priceLessThanCondition;
            }
          }
        }
        if (Number(setting.condition) < sum) {
          console.log('condition less than sum')
          if (setting.priceMoreThanCondition)
            if (setting.priceMoreThanCondition == '0') {
              varprice = 0;
            } else {
              varprice = setting.priceMoreThanCondition;
            }
        }

      }
    }
    console.log('deliveryy price : ', varprice)
    let total = Number(sum) + Number(varprice);
    console.log('TOTAL price : ', total)

    resolve({ deliveryPrice: varprice, total: total });
    });
  };
  const countDeliveryWidthWeight = (sum, totalWeight, staticPrice, perkiloPrice) => {
    console.log('sum in countDeliveryWidthWeight', sum, totalWeight)
    return new Promise(function (resolve, reject) {
      let varprice = 0;
      let countWeight = 0;
      let total = 0
      if(totalWeight  > 1){
        countWeight = totalWeight - 1;
        varprice += staticPrice
        varprice  += countWeight * perkiloPrice  
      } else if(totalWeight > 0 && totalWeight < 1){
        varprice += totalWeight * staticPrice
      }
      console.log("varprice ", varprice)
      total = sum + varprice
      console.log("total ", total)

      resolve({deliveryPrice : varprice, total: total})
    });
  };

  const getSettings = () => {

    let ref = this;
    // console.log('getSettings...');

    // let {hoverD, address} = state;
    getTheSettings().then((res) => {
      console.log('after get settings...', res);
      if (!res || (res && !res.length)) {
        props.onNext();
      } else {
        setSettings(res);
        // setState({
        //   settings: res
        // });
        console.log(res, hoverD, address);
        calculateAddress(res, hoverD, address)
          .then((obj) => {
            console.log('after calculateAddress...', obj);
            setRenTimes(obj);
            setLoading(true);
            // setState({
            //   renTimes: obj,
            //   loading: true
            // });
            // this.chooseDelivery({
            //   deliveryPrice: obj.deliveryPrice,
            //   total: obj.total,
            //   sum: obj.sum,
            //   hoverD: 0
            // }).then(res=>{
            //   this.setState({
            //     settings: res,
            //     loading: true,
            //     // deliveryPrice: obj.deliveryPrice,
            //     // total: obj.total,
            //     renTimes: obj.renTimes,
            //     // sum: sum
            //   });
            // });

            // });

            // });
          })
          .catch((e) => console.log('e', e));
      }
    });
  };
  const getWeightDelivery = () =>{
      updatetStatus('checkout').then((e) => {
        setTotalweight(e.totalWeight)
      });
    console.log("hihi")
  }

  const countSum = (card) => {
    console.log('countSum...', card);
    return new Promise(function (resolve, reject) {
      let ttt = 0;
      let totalWeight = 0
      if (card && card.length > 0)
        card.forEach((item, idx2) => {
          if (item.salePrice) {
            ttt += item.salePrice * item.count;
          } else if (item.price && !item.salePrice) {
            ttt += item.price * item.count;
          }
          if (item.weight) {
            console.log( ' item has weight')
            totalWeight += item.weight * item.count
          }
        });
      resolve({sum: ttt, totalWeight: totalWeight});
    });
  };
  const countTotalWeight = (card) => {
    console.log('countTotalWeight...');
    return new Promise(function (resolve, reject) {
      let sum = 0;
      let ttWeight = 0;
      if (card && card.length > 0)
        card.forEach((item, idx2) => {
          if (item.salePrice) {
            sum += item.salePrice * item.count;
          } else if (item.price && !item.salePrice) {
            sum += item.price * item.count;
          }
          if (item.weight) {
            ttWeight += item.weight * item.count;
          }
        });
      resolve({totalWeight: ttWeight, sum: sum});
    });
  };

  const chooseDelivery = (obj) => {
    let { onChooseDelivery } = props;

    return new Promise(function (resolve, reject) {
      onChooseDelivery(obj);
      resolve(obj);
    });
  };

  const hoverThisD = (ad, renTimes) => {
    setHoverBool(true);
    console.log('hoverThisD...', renTimes);
    // let {card} = state;
    console.log('renTimes', renTimes);
    // return
    // if(renTimes.withFormula == 'is'){
    //   countTotalWeight(card).then((objj) => {
    //     console.log('totalWeight in hoverWeightDelivery func', objj.totalWeight);
    //     countDeliveryWidthWeight(objj.sum ,objj.totalWeight).then((obj) => {
    //       setDeliveryPrice(obj.deliveryPrice);
    //       setTotal(obj.total);
    //       setSum(objj.sum);
    //       setLoading2(true);
    //       console.log("obj.deliveryPrice: ", obj.deliveryPrice)
    //       console.log("obj.total: ", obj.total)
    //       console.log("obj.sum: ", objj.sum)
    //       chooseDelivery({
    //         setting: renTimes[ad],
    //         deliveryPrice: obj.deliveryPrice,
    //         total: obj.total,
    //         sum: objj.sum,
    //       });
    //     });
    //   });
    // } else {
    const tw = totalweight
    console.log("tw", tw)
      countSum(card).then((obj) => {
        console.log('sum', obj.sum);
        console.log('total weight count sum', obj.totalWeight);
        countDelivery(obj?.sum, renTimes, ad, obj.totalWeight).then((objj) => {
          setDeliveryPrice(objj.deliveryPrice);
          setTotal(objj.total);
          setSum(obj.sum);
          setHoverD(ad);
          setWeightHover('');
          setLoading2(true);
          // setState({
          //   hoverD: ad,
          //   loading2: true
          // });

          chooseDelivery({
            setting: renTimes[ad],
            deliveryPrice: objj.deliveryPrice,
            total: objj.total,
            sum: obj.sum,
            hoverD: ad,
          });
        });
      });
    // }
  };
  const hoverWeightDelivery = () => {
    setWeightHover('hover')
    setHoverBool(false)
    console.log('hoverWeightDelivery...');
    countTotalWeight(card).then((objj) => {
      console.log('totalWeight in hoverWeightDelivery func', objj.totalWeight);
      countDeliveryWidthWeight(objj.sum ,objj.totalWeight).then((obj) => {
        setDeliveryPrice(obj.deliveryPrice);
        setTotal(obj.total);
        setSum(objj.sum);
        setLoading2(true);
        console.log("obj.deliveryPrice: ", obj.deliveryPrice)
        console.log("obj.total: ", obj.total)
        console.log("obj.sum: ", objj.sum)
        chooseDelivery({
          deliveryPrice: obj.deliveryPrice,
          total: obj.total,
          sum: objj.sum,
        });
      });
    });
  };
  const calculateAddress = (settings, hoverD = hoverD, address = address) => {
    console.log('calculateAddress...', settings, hoverD, address);
    // let ref=this;
    // let {hoverD, hoverD, address} = this.state;

    let renTimes = [],
      ref = this;

    return new Promise(function (resolve, reject) {
      if (!address) return reject({});
      if (settings && settings.length > 0) {
        settings.forEach((adr, ad) => {
          if (adr.is === 'is') {
            if (
              address.State == adr.city &&
              supportedcity.indexOf(address.City) > -1
            ) {
              console.log('add...');

              renTimes.push(adr);
            }
          } else if (adr.is === 'isnt') {
            console.log('is not here...');

            if (address && address.State && address.State != adr.city) {
              console.log('add 0 ...');

              renTimes.push(adr);
            } else if (
              address &&
              address.State &&
              address.State == adr.city &&
              !(supportedcity.indexOf(address.City) > -1)
            ) {
              console.log('add 1 ...');

              // console.log('we are here');
              renTimes.push(adr);
            }
          } else {
            renTimes.push(adr);
          }
        });
        console.log('renTimes...', renTimes);
        hoverThisD(0, renTimes);

        resolve(renTimes);
      }
    });
  };

  // render() {
  const { _id, onNext, onPrev } = props;
  // let sum = 0;
  // let {renTimes, loading, hoverD, loading2, deliveryPrice, total, sum} = state;
  const loader = (
    <div className="loadNotFound loader ">
      {t('loading...')}
      <LoadingComponent />
    </div>
  );
  const loader2 = (
    <div className="loadNotFound loader ">
      <LoadingComponent />
    </div>
  );
  return (
    <Card className="mb-3 pd-1">
      <CardHeader className={'pd-1'}>
        <div className="kjhghjk">
          <div
            className="d-inline-block item-icon-wrapper ytrerty"
            dangerouslySetInnerHTML={{ __html: t('Delivery Schedule') }}
          />
        </div>
      </CardHeader>
      <CardBody className={'pd-1'}>
        <Col lg="12">
          {loading && (
            <Row>
              {renTimes &&
                renTimes.length > 0 &&
                renTimes.map((adr, ad) => {
                  let hoverS = '';
                  if (ad === hoverD && hoverBool) {
                    hoverS = 'hover';
                  }
                  return (
                    <Col
                      className={'mb-3'}
                      key={ad}
                      md={12}
                      lg={12}
                      sm={12}
                      onClick={() => {
                        hoverThisD(ad, renTimes);
                      }}>
                      <div className={'radio-button ' + hoverS}></div>
                      <div className={'theadds uytghui87 ' + hoverS}>
                        <div className={'ttl'}>{adr.title}</div>
                        <div className={'desc'}>{adr.description}</div>
                      </div>
                    </Col>
                  );
                })}
                    {/* <Col
                      className={'mb-3'}
                      md={12}
                      lg={12}
                      sm={12}
                      onClick={() => {
                        hoverWeightDelivery();
                      }}>
                      <div className={`radio-button ${weightHover}`}></div>
                      <div className={`theadds uytghui87 ${weightHover}`}>
                        <div className={'ttl'}>{''}</div>
                        <div className={'desc'}>{'پرداخت توسط پست. یک کیلوی اول ۸۰ هزار تومان، به ازای هر کیلو اضافه ۲۰ هزار تومان.'}</div>
                      </div>
                    </Col>   */}
            </Row>
          )}
          {!loading && <Row>{loader}</Row>}
        </Col>
      </CardBody>
      <CardFooter className={'pd-1'}>
        <ButtonGroup size="md left">
          {!loading2 && <Row>{loader2}</Row>}
          {loading2 && [
            <Button
              key={'xo0'}
              className={'back-to-checkout-part-address'}
              left={'true'}
              onClick={onPrev}>
              <i className="material-icons">{'chevron_right'}</i>
              {t('prev')}
            </Button>,
            <Button
              key={'xo1'}
              className={'go-to-checkout-part-last'}
              left={'true'}
              onClick={onNext}>
              {t('next')}
              <i className="material-icons">{'chevron_left'}</i>
            </Button>,
          ]}
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
  // }
}

export default withTranslation()(GetDelivery);
