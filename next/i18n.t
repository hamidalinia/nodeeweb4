db.getCollection("templates").insert({
	"title" : "footer",
	"type" : "footer",
	"maxWidth" : "100%",
	"data" : [ ],
	"elements" : [
		{
			"id" : "component_WbjZ4",
			"label" : "Navigation bar",
			"type" : "navigation",
			"addable" : true,
			"settings" : {
				"style" : {
					"backgroundColor" : "#193a6f"
				},
				"content" : {
					"colCount" : NumberInt(1),
					"type" : "simple",
					"classes" : "responsive-menu showInMobile"
				},
				"responsive" : {
					"showInMobile" : true
				}
			},
			"children" : [
				{
					"id" : "component_DH95q",
					"label" : "Navigation item",
					"type" : "navigationitem",
					"addable" : true,
					"settings" : {
						"style" : {
							"lineHeight" : "30px",
							"color" : "#193a6f"
						},
						"content" : {
							"borderRadious" : "0",
							"text" : "لوازم آرایشی",
							"link" : "/products/cosmetics"
						}
					},
					"children" : [
						{
							"id" : "cp_1Od1C",
							"label" : "Navigation item",
							"type" : "navigationitem",
							"addable" : true,
							"settings" : {
								"style" : {
									"lineHeight" : "2"
								},
								"content" : {
									"borderRadious" : "0",
									"text" : "آرایش صورت",
									"link" : "/products/face-makeup"
								}
							},
							"children" : [
								{
									"id" : "cp_Dom9q",
									"label" : "Navigation item",
									"type" : "navigationitem",
									"addable" : true,
									"settings" : {
										"style" : {
											"lineHeight" : "1"
										},
										"content" : {
											"text" : "کرم پودر",
											"link" : "/products/foundation",
											"borderRadious" : "0"
										}
									}
								},
								{
									"id" : "cp_kfVrA",
									"label" : "Navigation item",
									"type" : "navigationitem",
									"addable" : true,
									"settings" : {
										"style" : {
											"lineHeight" : "1"
										},
										"content" : {
											"text" : "کانسیلر",
											"link" : "/products/concealer",
											"borderRadious" : "0"
										}
									}
								}
							]
						},
						{
							"id" : "cp_cIkbo",
							"label" : "Navigation item",
							"type" : "navigationitem",
							"addable" : true,
							"settings" : {
								"style" : {
									"lineHeight" : "1"
								},
								"content" : {
									"text" : "آرایش لب",
									"link" : "/products/lip-makeup\t",
									"borderRadious" : "0"
								}
							}
						},
						{
							"id" : "cp_xqwQ6",
							"label" : "Navigation item",
							"type" : "navigationitem",
							"addable" : true,
							"settings" : {
								"style" : {
									"lineHeight" : "2"
								},
								"content" : {
									"text" : "آرایش چشم",
									"borderRadious" : "0",
									"link" : "/products/eye-makeup"
								}
							},
							"children" : [
								{
									"id" : "cp_SHgZB",
									"label" : "Navigation item",
									"type" : "navigationitem",
									"addable" : true,
									"settings" : {
										"style" : {
											"lineHeight" : "1"
										},
										"content" : {
											"borderRadious" : "0",
											"text" : "خط چشم",
											"link" : "https://asakala.shop/products/eyeliner"
										}
									}
								}
							]
						},
						{
							"id" : "cp_GKmXn",
							"label" : "Navigation item",
							"type" : "navigationitem",
							"addable" : true,
							"settings" : {
								"style" : {
									"lineHeight" : "1"
								},
								"content" : {
									"link" : "https://asakala.shop/products/eyebrow-makeup",
									"borderRadious" : "0",
									"text" : "آرایش ابرو"
								}
							},
							"children" : [
								{
									"id" : "cp_tjhxX",
									"label" : "Navigation item",
									"type" : "navigationitem",
									"addable" : true,
									"settings" : {
										"style" : {
											"lineHeight" : "1"
										},
										"content" : {
											"text" : "ژل ابرو",
											"link" : "https://asakala.shop/products/eyebrow-gel",
											"borderRadious" : "0"
										}
									}
								}
							]
						}
					]
				},
				{
					"id" : "cp_WIFzv",
					"label" : "Navigation item",
					"type" : "navigationitem",
					"addable" : true,
					"settings" : {
						"style" : {
							"lineHeight" : "30px"
						},
						"content" : {
							"text" : "لوازم شخصی برقی",
							"link" : "/products/electrical-appliances",
							"borderRadious" : "0"
						}
					},
					"children" : [
						{
							"id" : "cp_qf5eK",
							"label" : "Navigation item",
							"type" : "navigationitem",
							"addable" : true,
							"settings" : {
								"style" : {
									"lineHeight" : "1"
								},
								"content" : {
									"text" : "لوازم برقی حالت دهنده مو",
									"link" : "/products/electric-hair-styling-equipment",
									"borderRadious" : "0"
								}
							},
							"children" : [
								{
									"id" : "cp_uU4PX",
									"label" : "Navigation item",
									"type" : "navigationitem",
									"addable" : true,
									"settings" : {
										"style" : {
											"lineHeight" : "1"
										},
										"content" : {
											"text" : "فر کننده و بابلیس",
											"link" : "/products/hair-curler",
											"borderRadious" : "0"
										}
									}
								},
								{
									"id" : "cp_NlPgP",
									"label" : "Navigation item",
									"type" : "navigationitem",
									"addable" : true,
									"settings" : {
										"style" : {
											"lineHeight" : "1"
										},
										"content" : {
											"text" : "سشوار",
											"link" : "https://asakala.shop/products/hair-dryer",
											"borderRadious" : "0"
										}
									}
								}
							]
						},
						{
							"id" : "cp_K8Y2h",
							"label" : "Navigation item",
							"type" : "navigationitem",
							"addable" : true,
							"settings" : {
								"style" : {
									"lineHeight" : "1"
								},
								"content" : {
									"text" : "لوازم برقی اصلاح صورت و بدن",
									"link" : "/products/electrical-appliances-for-face-and-body-correction\t",
									"borderRadious" : "0"
								}
							}
						}
					]
				},
				{
					"id" : "cp_2bDr9",
					"label" : "Navigation item",
					"type" : "navigationitem",
					"addable" : true,
					"settings" : {
						"style" : {
							"lineHeight" : "1"
						},
						"content" : {
							"text" : "بهداشت شخصی",
							"link" : "/products/personal-hygiene",
							"borderRadious" : "0"
						}
					},
					"children" : [
						{
							"id" : "cp_4YYZd",
							"label" : "Navigation item",
							"type" : "navigationitem",
							"addable" : true,
							"settings" : {
								"style" : {
									"lineHeight" : "30px"
								},
								"content" : {
									"text" : "مام زیربغل",
									"link" : "/products/armpit",
									"borderRadious" : "0"
								}
							}
						},
						{
							"id" : "cp_MI4NK",
							"label" : "Navigation item",
							"type" : "navigationitem",
							"addable" : true,
							"settings" : {
								"style" : {
									"lineHeight" : "30px"
								},
								"content" : {
									"text" : "اسپری بدن",
									"link" : "/products/spray",
									"borderRadious" : "0"
								}
							}
						}
					]
				},
				{
					"id" : "cp_91hij",
					"label" : "Navigation item",
					"type" : "navigationitem",
					"addable" : true,
					"settings" : {
						"style" : {
							"lineHeight" : "30px"
						},
						"content" : {
							"text" : "عطر",
							"link" : "/products/perfume",
							"borderRadious" : "0"
						}
					}
				},
				{
					"id" : "component_TNvD0",
					"label" : "Navigation item",
					"type" : "navigationitem",
					"addable" : true,
					"settings" : {
						"style" : {
							"lineHeight" : "30px",
							"color" : "#193a6f"
						},
						"content" : {
							"link" : "/products/skin-care",
							"borderRadious" : "0",
							"text" : "مراقبت از پوست"
						}
					},
					"children" : [
						{
							"id" : "cp_CltOv",
							"label" : "Navigation item",
							"type" : "navigationitem",
							"addable" : true,
							"settings" : {
								"style" : {
									"lineHeight" : "1"
								},
								"content" : {
									"text" : "دور چشم",
									"link" : "/products/eye-cream",
									"borderRadious" : "0"
								},
								"responsive" : {
									"showInDesktop" : true,
									"showInMobile" : true
								}
							}
						},
						{
							"id" : "cp_6uRPu",
							"label" : "Navigation item",
							"type" : "navigationitem",
							"addable" : true,
							"settings" : {
								"style" : {
									"lineHeight" : "1"
								},
								"content" : {
									"text" : "کرم ضد آفتاب",
									"link" : "https://asakala.shop/products/sunscream",
									"borderRadious" : "0"
								}
							}
						},
						{
							"id" : "cp_uLwJG",
							"label" : "Navigation item",
							"type" : "navigationitem",
							"addable" : true,
							"settings" : {
								"style" : {
									"lineHeight" : "1"
								},
								"content" : {
									"text" : "ضدلک و روشن کننده",
									"link" : "https://asakala.shop/products/anti-spot-brightening",
									"borderRadious" : "0"
								}
							}
						}
					]
				},
				{
					"id" : "cp_PXcni",
					"label" : "Navigation item",
					"type" : "navigationitem",
					"addable" : true,
					"settings" : {
						"style" : {
							"lineHeight" : "1"
						},
						"content" : {
							"text" : "مراقبت و زیبایی مو",
							"link" : "/products/hair-care",
							"borderRadious" : "0"
						}
					}
				},
				{
					"id" : "cp_jon7N",
					"label" : "Navigation item",
					"type" : "navigationitem",
					"addable" : true,
					"settings" : {
						"style" : {
							"lineHeight" : "30px"
						},
						"content" : {
							"text" : "تماس با ما",
							"link" : "/contact-us",
							"borderRadious" : "0"
						}
					}
				},
				{
					"id" : "component_hKqcF",
					"label" : "Navigation item",
					"type" : "navigationitem",
					"addable" : true,
					"settings" : {
						"style" : {
							"lineHeight" : "30px",
							"color" : "#193a6f"
						},
						"content" : {
							"borderRadious" : "0",
							"link" : "/about-us",
							"text" : "درباره ما"
						}
					}
				},
				{
					"label" : "ThemeMode",
					"type" : "thememode",
					"addable" : false,
					"settings" : {
						
					},
					"children" : [ ],
					"id" : "cp_neP2c"
				}
			]
		},
		{
			"id" : "component_ngq96",
			"label" : "Row",
			"type" : "row",
			"addable" : true,
			"settings" : {
				"style" : {
					"margin" : "0px auto",
					"padding" : "10px 0 30px",
					"maxWidth" : "1200px",
					"border" : "",
					"gap" : "0"
				},
				"content" : {
					"classess" : "",
					"classes" : "flex-wrap"
				}
			},
			"children" : [
				{
					"id" : "component_01ZkH",
					"label" : "Col",
					"type" : "col",
					"addable" : true,
					"settings" : {
						"style" : {
							"padding" : "",
							"display" : "flex",
							"flexDirection" : "column",
							"margin" : "",
							"border" : ""
						},
						"content" : {
							"classes" : "w-full sm:w-1/2 md:w-1/4 p-[10px] md:p-0  md:flex-1"
						}
					},
					"children" : [
						{
							"id" : "component_0_1_0",
							"label" : "Text",
							"type" : "text",
							"addable" : false,
							"settings" : {
								"style" : {
									"fontSize" : "20px",
									"lineHeight" : "60px",
									"fontWeight" : "bold",
									"margin" : "23px 0px 0px 0px",
									"textAlign" : "right",
									"color" : "#794c9f"
								},
								"content" : {
									"text" : "محصولات"
								}
							}
						},
						{
							"id" : "cp_ljoxS",
							"label" : "Text",
							"type" : "text",
							"addable" : false,
							"settings" : {
								"style" : {
									"fontSize" : "16px",
									"lineHeight" : "30px",
									"fontWeight" : "normal",
									"margin" : "10px 0 5px 0",
									"color" : "#1e1e1e"
								},
								"content" : {
									"text" : "محصولات آرایشی",
									"tag" : "p",
									"link" : "/products/cosmetics"
								}
							}
						},
						{
							"id" : "cp_OgHQJ",
							"label" : "Text",
							"type" : "text",
							"addable" : false,
							"settings" : {
								"style" : {
									"fontSize" : "16px",
									"lineHeight" : "30px",
									"fontWeight" : "normal",
									"margin" : "5px 0",
									"color" : "#1e1e1e"
								},
								"content" : {
									"tag" : "p",
									"text" : "رژ لب",
									"link" : "https://asakala.shop/products/lipstick"
								}
							}
						},
						{
							"id" : "cp_M8Y4x",
							"label" : "Text",
							"type" : "text",
							"addable" : false,
							"settings" : {
								"style" : {
									"fontSize" : "16px",
									"lineHeight" : "30px",
									"fontWeight" : "normal",
									"margin" : "5px 0",
									"color" : "#1e1e1e"
								},
								"content" : {
									"text" : "خط چشم",
									"tag" : "products/eyeliner",
									"link" : "https://asakala.shop/products/eyeliner"
								}
							}
						},
						{
							"id" : "cp_S4MSe",
							"label" : "Text",
							"type" : "text",
							"addable" : false,
							"settings" : {
								"style" : {
									"fontSize" : "16px",
									"lineHeight" : "30px",
									"fontWeight" : "normal",
									"margin" : "5px 0",
									"color" : "#1e1e1e"
								},
								"content" : {
									"text" : "مراقبت از پوست",
									"tag" : "p",
									"link" : "/products/skin-care"
								}
							}
						},
						{
							"id" : "cp_mfS87",
							"label" : "Text",
							"type" : "text",
							"addable" : false,
							"settings" : {
								"style" : {
									"fontSize" : "16px",
									"lineHeight" : "30px",
									"fontWeight" : "normal",
									"margin" : "5px 0",
									"color" : "#1e1e1e"
								},
								"content" : {
									"tag" : "p",
									"text" : "مراقبت از مو",
									"link" : "/products/hair-care"
								}
							}
						}
					]
				},
				{
					"id" : "component_ZihVR",
					"label" : "Col",
					"type" : "col",
					"addable" : true,
					"settings" : {
						"style" : {
							"display" : "flex",
							"flexDirection" : "column",
							"textAlign" : "right",
							"margin" : "",
							"padding" : "",
							"border" : ""
						},
						"content" : {
							"classes" : "w-full sm:w-1/2 md:w-1/4 p-[10px] md:p-0 md:flex-1"
						}
					},
					"children" : [
						{
							"id" : "cp_CvHo6",
							"label" : "Text",
							"type" : "text",
							"addable" : false,
							"settings" : {
								"style" : {
									"fontSize" : "20px",
									"lineHeight" : "60px",
									"margin" : "23px 0px 0px",
									"color" : "#794c9f",
									"fontWeight" : "bold"
								},
								"content" : {
									"tag" : "p",
									"text" : "دسترسی سریع"
								}
							}
						},
						{
							"id" : "cp_HY1hD",
							"label" : "Text",
							"type" : "text",
							"addable" : false,
							"settings" : {
								"style" : {
									"fontSize" : "16px",
									"lineHeight" : "30px",
									"fontWeight" : "normal",
									"margin" : "10px 0 5px 0",
									"color" : "#1e1e1e"
								},
								"content" : {
									"text" : "درباره ما",
									"tag" : "p",
									"link" : "/about-us"
								}
							}
						},
						{
							"id" : "cp_UGfJe",
							"label" : "Text",
							"type" : "text",
							"addable" : false,
							"settings" : {
								"style" : {
									"fontSize" : "16px",
									"lineHeight" : "30px",
									"fontWeight" : "normal",
									"margin" : "5px 0",
									"color" : "#1e1e1e"
								},
								"content" : {
									"text" : "پیگیری سفارش",
									"tag" : "p",
									"link" : "/order-tracking"
								}
							}
						},
						{
							"id" : "cp_eXmkG",
							"label" : "Text",
							"type" : "text",
							"addable" : false,
							"settings" : {
								"style" : {
									"fontSize" : "16px",
									"lineHeight" : "30px",
									"fontWeight" : "normal",
									"margin" : "5px 0",
									"color" : "#1e1e1e"
								},
								"content" : {
									"text" : "تماس با ما",
									"tag" : "p",
									"link" : "/contact-us"
								}
							}
						}
					]
				},
				{
					"id" : "component_01ZkD",
					"label" : "Col",
					"type" : "col",
					"addable" : true,
					"settings" : {
						"style" : {
							"padding" : "",
							"margin" : "",
							"border" : ""
						},
						"content" : {
							"classess" : "",
							"classes" : "w-full sm:w-1/2 md:w-1/4 p-[10px] md:p-0 md:flex-1"
						}
					},
					"children" : [
						{
							"id" : "component_0_2_0",
							"label" : "Text",
							"type" : "text",
							"addable" : false,
							"settings" : {
								"style" : {
									"fontSize" : "20px",
									"lineHeight" : "60px",
									"margin" : "23px 0px 0px 0px",
									"color" : "#794c9f",
									"fontWeight" : "bold"
								},
								"content" : {
									"text" : "راه های ارتباطی"
								}
							}
						},
						{
							"id" : "component_0_2_1",
							"label" : "Text",
							"type" : "text",
							"addable" : false,
							"settings" : {
								"style" : {
									"fontSize" : "16px",
									"lineHeight" : "1",
									"fontWeight" : "bold",
									"margin" : "10px 0 5px 0",
									"color" : "#000"
								},
								"content" : {
									"text" : "آدرس مجموعه:",
									"iconFont" : "LocationOn",
									"iconPosition" : "right"
								}
							}
						},
						{
							"id" : "component_0_2_2",
							"label" : "Text",
							"type" : "text",
							"addable" : false,
							"settings" : {
								"style" : {
									"fontSize" : "15px",
									"fontWeight" : "normal",
									"margin" : "0",
									"padding" : "5px 0",
									"color" : "#1e1e1e"
								},
								"content" : {
									"iconPosition" : "top",
									"text" : "تهران، اشرفی اصفهانی، مرکز خرید تیراژه، طبقه دوم، پلاک ۴۴"
								}
							}
						},
						{
							"id" : "component_0_2_3",
							"label" : "Text",
							"type" : "text",
							"addable" : false,
							"settings" : {
								"style" : {
									"fontSize" : "16px",
									"lineHeight" : "1",
									"margin" : "5px 0",
									"color" : "#000",
									"fontWeight" : "normal"
								},
								"content" : {
									"text" : "شماره تلفن ثابت",
									"iconFont" : "LocalPhone",
									"iconPosition" : "top"
								}
							}
						},
						{
							"id" : "component_0_2_4",
							"label" : "Text",
							"type" : "text",
							"addable" : false,
							"settings" : {
								"style" : {
									"fontSize" : "14px",
									"lineHeight" : "30px",
									"fontWeight" : "normal",
									"color" : "#1e1e1e"
								},
								"content" : {
									"text" : "02144491555",
									"iconPosition" : "top",
									"link" : "tel:+982144491555"
								}
							}
						},
						{
							"id" : "cp_RKH8C",
							"label" : "Text",
							"type" : "text",
							"addable" : false,
							"settings" : {
								"style" : {
									"fontSize" : "16px",
									"lineHeight" : "1",
									"margin" : "5px 0",
									"color" : "#000",
									"fontWeight" : "normal"
								},
								"content" : {
									"text" : "شماره تلفن همراه",
									"tag" : "p",
									"iconFont" : "LocalPhone"
								}
							}
						},
						{
							"id" : "cp_aR1br",
							"label" : "Text",
							"type" : "text",
							"addable" : false,
							"settings" : {
								"style" : {
									"fontSize" : "14px",
									"lineHeight" : "30px",
									"fontWeight" : "normal",
									"color" : "#1e1e1e"
								},
								"content" : {
									"text" : " ۰۹۱۲۲۱۰۶۷۸۹",
									"tag" : "p",
									"link" : "tel:+989122106789"
								}
							}
						},
						{
							"id" : "component_0_2_5",
							"label" : "Text",
							"type" : "text",
							"addable" : false,
							"settings" : {
								"style" : {
									"fontSize" : "16px",
									"lineHeight" : "1",
									"margin" : "5px 0 5px 0",
									"color" : "#000",
									"fontWeight" : "normal"
								},
								"content" : {
									"iconFont" : "AccessTime",
									"iconPosition" : "top",
									"text" : "پشتیبانی 24 ساعته"
								}
							}
						}
					]
				},
				{
					"id" : "cp_veV2e",
					"label" : "Col",
					"type" : "col",
					"addable" : true,
					"settings" : {
						"content" : {
							"classes" : "w-full sm:w-1/2 md:w-1/4 p-[10px] md:p-0 md:flex-1"
						},
						"style" : {
							"margin" : "",
							"padding" : "",
							"border" : ""
						}
					},
					"children" : [
						{
							"id" : "cp_uT42k",
							"label" : "Text",
							"type" : "text",
							"addable" : false,
							"settings" : {
								"style" : {
									"fontSize" : "20px",
									"lineHeight" : "60px",
									"margin" : "23px 0px 0px 0px",
									"textAlign" : "center",
									"color" : "#794c9f",
									"fontWeight" : "bold"
								},
								"content" : {
									"text" : "همراه ما باشید!\n",
									"tag" : "p"
								}
							}
						},
						{
							"id" : "cp_FwyJI",
							"label" : "Row",
							"type" : "row",
							"addable" : true,
							"settings" : {
								"style" : {
									"margin" : "30px 0 ",
									"padding" : "",
									"border" : "",
									"justifyContent" : "center"
								}
							},
							"children" : [
								{
									"id" : "cp_0VrGg",
									"label" : "Col",
									"type" : "col",
									"addable" : true,
									"settings" : {
										"style" : {
											"textAlign" : "left"
										},
										"content" : {
											"classes" : "col-md-6 col-6"
										}
									},
									"children" : [
										{
											"id" : "cp_5E6GO",
											"label" : "Image",
											"type" : "image",
											"addable" : false,
											"settings" : {
												"style" : {
													"maxWidth" : "50px",
													"textAlign" : "left"
												},
												"content" : {
													"src" : "customer/2024-10-3-13-22-41icons8-instagram-100(2).png",
													"link" : "https://www.instagram.com/asakalashop"
												}
											}
										}
									]
								},
								{
									"id" : "cp_Xb1jn",
									"label" : "Col",
									"type" : "col",
									"addable" : true,
									"settings" : {
										"content" : {
											"classes" : "col-md-6 col-6"
										}
									},
									"children" : [
										{
											"id" : "cp_hkmgV",
											"label" : "Image",
											"type" : "image",
											"addable" : false,
											"settings" : {
												"style" : {
													"maxWidth" : "50px"
												},
												"content" : {
													"src" : "customer/2024-10-3-13-23-45icons8-telegram-100(3).png",
													"link" : "https://t.me/asa_kal_a"
												}
											}
										}
									]
								}
							]
						},
						{
							"id" : "cp_whSiU",
							"label" : "Row",
							"type" : "row",
							"addable" : true,
							"children" : [
								{
									"id" : "cp_SANEd",
									"label" : "Text",
									"type" : "text",
									"addable" : false,
									"settings" : {
										"style" : {
											"fontSize" : "13px",
											"lineHeight" : "1",
											"fontWeight" : "normal",
											"padding" : "0"
										},
										"content" : {
											"text" : "<a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=543326&Code=RyKjEExzImzzvR2gCoGzGooGObpPh048'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=543326&Code=RyKjEExzImzzvR2gCoGzGooGObpPh048' alt='' style='cursor:pointer' code='RyKjEExzImzzvR2gCoGzGooGObpPh048'></a>",
											"tag" : "p",
											"classes" : "col-6"
										}
									}
								},
								{
									"id" : "cp_AzNFt",
									"label" : "Col",
									"type" : "col",
									"addable" : true,
									"settings" : {
										"style" : {
											"padding" : "0"
										},
										"content" : {
											"classes" : "col-6"
										}
									}
								}
							]
						}
					]
				}
			]
		},
		{
			"id" : "component_jSYAw",
			"label" : "Col",
			"type" : "col",
			"addable" : true,
			"settings" : {
				"style" : {
					"width" : "167px",
					"display" : "none",
					"backgroundColor" : "#fff",
					"left" : "110px",
					"bottom" : "60px"
				},
				"content" : {
					"classes" : "contactPopUp"
				}
			},
			"children" : [
				{
					"id" : "component_kbgJf",
					"label" : "Button",
					"type" : "button",
					"addable" : false,
					"settings" : {
						"style" : {
							"float" : "left",
							"fontSize" : "13px",
							"lineHeight" : "1",
							"fontWeight" : "normal",
							"border" : "2px solid #193a6f",
							"margin" : "0 0 10px 0",
							"padding" : "5px",
							"backgroundColor" : "#fef3f0",
							"color" : "#193a6f",
							"direction" : "ltr"
						},
						"content" : {
							"text" : "@asakalashop",
							"action" : "https://www.instagram.com/asakalashop",
							"iconFont" : "Instagram",
							"iconPosition" : "top",
							"target" : "_blank"
						}
					}
				},
				{
					"id" : "component_gd4f2",
					"label" : "Button",
					"type" : "button",
					"addable" : false,
					"settings" : {
						"style" : {
							"float" : "left",
							"fontSize" : "13px",
							"lineHeight" : "1",
							"fontWeight" : "normal",
							"border" : "2px solid #193a6f",
							"margin" : "0 0 10px 0",
							"padding" : "5px",
							"backgroundColor" : "#fef3f0",
							"color" : "#193a6f",
							"direction" : "ltr"
						},
						"content" : {
							"text" : "@asakalashop",
							"action" : "https://t.me/asakalashop",
							"iconFont" : "Telegram",
							"iconPosition" : "top",
							"target" : "_blank"
						}
					}
				},
				{
					"id" : "component_vrVDr",
					"label" : "Button",
					"type" : "button",
					"addable" : false,
					"settings" : {
						"style" : {
							"float" : "left",
							"fontSize" : "13px",
							"lineHeight" : "1",
							"fontWeight" : "normal",
							"border" : "2px solid #193a6f",
							"margin" : "0 0 10px 0",
							"padding" : "5px",
							"backgroundColor" : "#fef3f0",
							"color" : "#193a6f",
							"direction" : "ltr"
						},
						"content" : {
							"text" : "09122106789",
							"action" : "tel:+989122106789",
							"iconFont" : "LocalPhone",
							"iconPosition" : "top",
							"target" : "_blank"
						}
					}
				}
			]
		},
		{
			"id" : "cp_Z8HEs",
			"label" : "Line",
			"type" : "hr",
			"addable" : false,
			"settings" : {
				"style" : {
					"width" : "100%",
					"height" : "100%",
					"color" : "black",
					"border" : "1px solid black"
				},
				"content" : {
					"type" : "solid"
				}
			}
		},
		{
			"id" : "cp_6Sqc5",
			"label" : "Col",
			"type" : "col",
			"addable" : true,
			"settings" : {
				"style" : {
					"padding" : "10px 0 10px 0",
					"textAlign" : "center",
					"margin" : "0"
				}
			},
			"children" : [
				{
					"id" : "cp_mslJS",
					"label" : "Text",
					"type" : "text",
					"addable" : false,
					"settings" : {
						"style" : {
							"fontSize" : "15px",
							"lineHeight" : "1",
							"color" : "black",
							"fontWeight" : "bold"
						},
						"content" : {
							"tag" : "p",
							"text" : "<a target=\"_blank\" href=\"https://idehweb.ir/%D8%B7%D8%B1%D8%A7%D8%AD%DB%8C-%D8%B3%D8%A7%DB%8C%D8%AA-%D8%AF%D8%B1-%D8%A7%DB%8C%D8%AF%D9%87-%D9%88%D8%A8/\" style=\"color:#2d33d8;\">طراحی سایت</a> توسط ایده وب"
						}
					}
				}
			]
		}
	],
	"createdAt" : ISODate("2022-10-22T15:19:46.061+03:30"),
	"updatedAt" : ISODate("2025-06-07T02:52:57.896+04:30"),
	"__v" : NumberInt(0)
})