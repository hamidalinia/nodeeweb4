import _ from 'lodash'

export default (props) => {
    // console.log("ZarehbinGateway",props);

    // _.forEach()
    if (props && props.entity)
        props.entity.map((item, i) => {
            // console.log('plugin item.name', item.name)
            if (item.name === 'product')
                if (item.routes)
                    item.routes.push({
                        'path': '/zarehbin/v1/list/',
                        'method': 'get',
                        'access': 'customer_all',
                        'controller': (req, res, next) => {
                            console.log("----- zarehbin -----");
                            let offset = 0;
                            if (req.params.offset) {
                                offset = parseInt(req.params.offset);
                            }
                            if (!req.params.limit) {
                                req.params.limit = 100;
                            }
                            if (!req.query.page) {
                                req.query.page = 1;
                            }
                            if (req.query.page) {
                                offset = (req.query.page - 1) * req.params.limit;
                            }
                            req.query.page = parseInt(req.query.page);
                            let searchf = {};
                            searchf["title.fa"] = {
                                $exists: true
                            };
                            let Product = req.mongoose.model('Product');
                            let Settings = req.mongoose.model('Settings');

                            // _id:'61d71cf4365a2313a161456c'
                            Settings.findOne({}, "tax taxAmount", function (err, setting) {
                                Product.countDocuments({}, function (err, count) {

                                    Product.find({}, "_id title price type salePrice in_stock combinations firstCategory secondCategory thirdCategory slug photos thumbnail excerpt", function (err, products) {
                                        // console.log('err', err)
                                        console.log('products', products)
                                        if (err || !products) {
                                            return res.json([]);
                                        }

                                        function arrayMin(t) {
                                            var arr = [];
                                            t.map((item) => (item != 0) ? arr.push(item) : false);
                                            if (arr && arr.length > 0)
                                                return arr.reduce(function (p, v) {
                                                    // console.log("p", p, "v", v);
                                                    return (p < v ? p : v);
                                                });
                                            else
                                                return false;
                                        }

                                        let modifedProducts = [];
                                        _.forEach(products, (c, cx) => {
                                            let price_array = [];
                                            let sale_array = [];
                                            let price_stock = [];
                                            let last_price = 0;
                                            let last_sale_price = 0;

                                            if (c.combinations && c.type == "variable") {
                                                _.forEach(c.combinations, (comb, cxt) => {
                                                    if (comb.price && comb.price != null && parseInt(comb.price) != 0) {
                                                        price_array.push(parseInt(comb.price));
                                                    } else {
                                                        price_array.push(0);

                                                    }
                                                    if (comb.salePrice && comb.salePrice != null && parseInt(comb.salePrice) != 0) {
                                                        sale_array.push(parseInt(comb.salePrice));

                                                    } else {
                                                        sale_array.push(0);
                                                    }
                                                    if (comb.in_stock && !comb.quantity) {
                                                        comb.in_stock = false;
                                                    }
                                                    price_stock.push(comb.in_stock);
                                                    //
                                                    // if (parseInt(comb.price) < parseInt(last_price))
                                                    //     last_price = parseInt(comb.price);
                                                });
                                            }
                                            if (c.type == "normal") {
                                                price_array = [];
                                                sale_array = [];
                                                price_stock = [];
                                                if (c.price && c.price != null)
                                                    price_array.push(c.price);
                                            }
                                            last_price = arrayMin(price_array);
                                            last_sale_price = arrayMin(sale_array);
                                            // console.log("last price", last_price, last_sale_price);

                                            if ((last_price !== false && last_sale_price !== false) && (last_price < last_sale_price)) {
                                                // console.log("we have got here");
                                                var cd = price_array.indexOf(last_price);
                                                if (sale_array[cd] && sale_array[cd] != 0)
                                                    last_sale_price = sale_array[cd];
                                                else
                                                    last_sale_price = false;
                                                // if(sale_array[cd] && (sale_array[cd]<last_sale_price)){
                                                //
                                                // }

                                            } else if ((last_price !== false && last_sale_price !== false) && (last_price > last_sale_price)) {
                                                // console.log("we have got there");

                                                // last_price = last_sale_price;
                                                // last_sale_price = tem;

                                                var cd = sale_array.indexOf(last_sale_price);
                                                if (price_array[cd] && price_array[cd] != 0)
                                                    last_price = price_array[cd];
                                                // else {
                                                // last_sale_price = false;
                                                var tem = last_price;

                                                last_price = last_sale_price;
                                                last_sale_price = tem;
                                                // }
                                            }

                                            //
                                            // if (last_sale_price) {
                                            //     var tem = last_price;
                                            //     last_price = last_sale_price;
                                            //     last_sale_price = tem;
                                            //
                                            // }
                                            if (c.type == "normal") {
                                                price_array = [];
                                                sale_array = [];
                                                price_stock = [];
                                                if (c.in_stock) {
                                                    price_stock.push(true);
                                                }
                                                if (c.price && c.price != null)
                                                    price_array.push(c.price);
                                            }
                                            // console.log("price_stock", price_stock);


                                            let slug = c.slug;
                                            let cat_inLink = "";
                                            if (c.firstCategory && c.firstCategory.slug)
                                                cat_inLink = c.firstCategory.slug;
                                            if (c.secondCategory && c.secondCategory.slug)
                                                cat_inLink = c.secondCategory.slug;
                                            if (c.thirdCategory && c.thirdCategory.slug)
                                                cat_inLink = c.thirdCategory.slug;
                                            // console.log('tax', setting)
                                            if (setting && (setting.tax && setting.taxAmount)) {
                                                if (last_price) {
                                                    let n = (parseInt(setting.taxAmount) * last_price) / 100
                                                    last_price = last_price + parseInt(n);
                                                }

                                                if (last_sale_price) {
                                                    let x = (parseInt(setting.taxAmount) * last_sale_price) / 100
                                                    last_sale_price = last_sale_price + parseInt(x);
                                                }
                                                // last_price
                                            }
                                            let ph = [];
                                            if (c.photos && c.photos[0])
                                                c.photos.forEach((it) => {
                                                    ph.push(process.env.BASE_URL + "/" +it);
                                                })
                                            let excerpt="";
                                            if(c.excerpt && c.excerpt.fa){
                                                excerpt=c.excerpt.fa;
                                            }
                                            modifedProducts.push({
                                                id: c._id,
                                                title: ((c.title && c.title.fa) ? c.title.fa : ""),

                                                // page_url: CONFIG.SHOP_URL + "p/" + c._id + "/" + encodeURIComponent(c.title.fa),
                                                // page_url: process.env.BASE_URL + "/product/" + c._id + "/" + c.slug,
                                                page_url: process.env.BASE_URL + "/product/" + c.slug,
                                                current_price: last_price,
                                                old_price: last_sale_price,
                                                availability: (price_stock.indexOf(true) >= 0 ? "instock" : "outofstock"),
                                                image_link: process.env.BASE_URL + "/" + c.thumbnail,
                                                image_links: ph,
                                                short_desc: excerpt
                                                // comb: price_array,
                                                // combSale: sale_array,
                                                // price_stock: price_stock,

                                            });
                                        });
                                        return res.json({
                                            "count": count,
                                            // "offset": offset,
                                            // "page": req.query.page,
                                            "total_pages_count": parseInt(count / req.params.limit)+1,
                                            "products": modifedProducts
                                        });


                                    }).skip(offset).sort({
                                        in_stock: -1,
                                        updatedAt: -1,
                                        createdAt: -1
                                        // "combinations.in_stock": -1,
                                    }).limit(parseInt(req.params.limit)).lean();
                                })
                            })

                        }
                    })
            // }

        });
    return props;
}
