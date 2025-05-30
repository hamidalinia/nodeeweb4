import {
    BulkDeleteButton,
    Create,
    Datagrid,
    DeleteButton,
    Edit,
    EditButton,
    Filter,
    FunctionField,
    NumberInput,
    Pagination,
    ReferenceField,
    ReferenceInput,
    ResourceContextProvider,
    SearchInput,
    SelectInput,
    Show,
    ShowButton,
    SimpleShowLayout,
    TextField,
    TextInput,
    useResourceContext, useTranslate,useGetList,ListContextProvider,useList,useGetOne
} from 'react-admin';
import { Card, CardContent, CardHeader } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Block } from 'notiflix/build/notiflix-block-aio';
import React, {Fragment,useState,useEffect} from 'react';
import {useParams} from 'react-router';
import {CategoryRounded as Icon, LibraryAdd} from '@mui/icons-material';
import {CustomResetViewsButton, List, SimpleForm} from '@/components';
import useStyles from '@/styles';
import {Val} from '@/Utils';
import API, {BASE_URL} from '@/functions/API';
import {Chip} from '@mui/material';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
export const ChangesForm = (props) => {
    const [pro,setPro] = useState('')
    const [progress,setProgress] = useState(0)
    const [success,setSuccess] = useState(false)
    const { id } = useParams();
    const {data,selectedtest,onSuccess} = props;
    let newtestPrice = [];
    let failedtestPrice = [];
    const translate = useTranslate();
    const updatetest=async (i,test,prices)=>{
        Block.arrows('.pID-'+test._id);
        
         setTimeout(function() {
            setProgress(i)
            if(test.combinations){
                test.combinations.map((combinition,ic)=>{
                    if(combinition){
                        if(combinition.price){
                                if(prices.plusPercent){
                                let percentPlus = combinition.price + (1/100) * prices.plusPercent * combinition.price;
                                combinition.price = percentPlus;
                                }
                                if(prices.minusPercent){
                                    let percentMinim = combinition.price - (1/100) * prices.plusPercent * combinition.price;
                                    combinition.price = percentMinim;
                                }
                                if(prices.plusxp){
                                    combinition.price +=  prices.plusxp
                                }
                                if(prices.minusxp){
                                    combinition.price -=  prices.minusxp
                                }
                        }
                        if(combinition.salePrice){

                        }
                    }
                })
                
            }
            updateServer(test).then((data)=>{
                newtestPrice.push(data)
                setPro(test.title.fa)
                Block.remove('.pID-'+test._id);
            }).catch(()=>{
                failedtestPrice.push(test)
            })
            
        }, 1000 * i );
        setSuccess(true);
        onSuccess(true)
        console.log('failedtestPricefailedtestPrice',failedtestPrice);
        console.log('newtestPricenewtestPrice',newtestPrice);
        
    }
    const update = async (prices) =>{
        if(selectedtest.length !== 0){
            selectedtest.forEach(function (test, index) {
                updatetest(index,test,prices)
            });
        }else{
            if(data.length !== 0){
                data.forEach(function (test, index) {
                        updatetest(index,test,prices)
                });
            }
        }
    }
    const updateServer = async (test) =>{
        API.put("/test/" + test._id, JSON.stringify({ ...test }))
        .then(({ data = {} }) => {
          return data;
        })
        .catch((err) => {
          console.log("errerrerrerr", err);
        });
    }

    return (
        <SimpleForm onSubmit={update}>
            <NumberInput
                min={0}
                source="plusPercent"
                label={translate("resources.testCategory.addxpercent")}
            />
            <NumberInput
                min={0}
                source="minusPercent"
                label={translate("resources.testCategory.minusxpercent")}
            />
            <NumberInput
                min={0}
                source="plusxp"
                label={translate("resources.testCategory.addxprice")}
            />
            <NumberInput
                min={0}
                source="minusxp"
                label={translate("resources.testCategory.minusxprice")}
            />
            {
                success ? (
                    <div style={{width:'100%',color:'green'}}>
                        بروز رسانی با موفقیت انجام شد
                    </div>
                ):(
                        <>
                            <div style={{width:'100%'}}>
                                {progress > 0 && (
                                        <LinearProgress style={{height:'20px',backgroundColor:'#257d7a'}}  variant="determinate"  value={progress} />
                                    )}
                            </div>
                            <span style={{marginTop:'20px',fontSize:'20px'}}>
                                
                                {
                                pro && (
                                    <>
                                    
                                    {pro}
                                    </>
                                    
                                )
                                }</span>
                        </>
                )
            }



            
            
        </SimpleForm>
    );
};
export default React.memo(ChangesForm)