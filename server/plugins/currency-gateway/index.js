// import _ from 'lodash'
// Tip! Initialize this property in your payment service constructor method!
// import PasargadApi from '@pepco/nodejs-rest-sdk';
// import fs from "fs"
import axios from "axios";
import * as cheerio from 'cheerio';
import fs from "fs";

let json = {}
export {json};
export default (props) => {
    function getTimeDifference(a, b) {
        return Math.abs(b - a) / 36e5;
    }

    function update_prices(req, res, next, x = false) {
        console.log('update_prices====>')
// URL of the page we want to scrape
        const url = "https://idehweb.com/currency";

// Async function which scrapes the data
        async function scrapeTheData() {
            try {
                // Fetch HTML of the page we want to scrape
                const {data} = await axios.get(url);
                // Load HTML we fetched in the previous line
                console.log('scrapeTheData===>', data)
                // Logs countries array to the console
                console.dir(data);
                // Write countries array in countries.json file
                fs.writeFile("./public_media/customer/rates.json", JSON.stringify(data, null, 2), (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log("Successfully written data to file");
                    if (x)
                        res.json({
                            success: true
                        })
                });
            } catch (err) {
                console.error(err);

            }
        }

// Invoke the above function
        scrapeTheData();
    }

    console.log('run currency')

    // _.forEach()
    if (props && props.entity)
        props.entity.map((item, i) => {
            if (item.name === 'settings') {
                console.log('settings.........................................')
                if (item.routes) {

                    item.routes.push({
                        "path": "/update-exchange-rate/",
                        "method": "post",
                        "access": "customer_all",
                        "controller": (req, res, next) => {

                            update_prices(req, res, next, true)
                        }

                    })
                    item.routes.push({
                        "path": "/get-exchange-rate/",
                        "method": "get",
                        "access": "customer_all",
                        "controller": (req, res, next) => {

                            async function scrapeData() {
                                try {

                                    fs.readFile("./public_media/customer/rates.json", 'utf8', (err, data) => {
                                        if (err) {
                                            update_prices(req, res, next)

                                            console.error(err);
                                            return;
                                        }
                                        fs.stat("./public_media/customer/rates.json", function (err, stats) {
                                            var mtime = stats.mtime;
                                            console.log('mtime', mtime);
                                            const difference = getTimeDifference(mtime, new Date());
                                            console.log(difference);
                                            if (difference > 1) {
                                                update_prices(req, res, next)

                                            }
                                            console.log("Successfully read data from file");
                                            res.send(data)
                                        });

                                    });
                                } catch (err) {
                                    console.error(err);

                                }
                            }

// Invoke the above function
                            scrapeData();
                        }

                    })

                }
            }

        })
    return props;
}
