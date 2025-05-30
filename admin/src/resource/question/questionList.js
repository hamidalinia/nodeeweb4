import React, { useState, useEffect } from "react";
import {
    Datagrid,
    DeleteButton,
    EditButton,
    Filter,
    SingleFieldList,
    FunctionField,
    ReferenceArrayField,
    Pagination,
    ChipField,
    SearchInput,
    TextField,
    TextInput,
    useTranslate,
    DateInput,
    DateField,
    List,
    TopToolbar,
    CreateButton,
    ExportButton,
    Button
} from "react-admin";

import API, { BASE_URL } from "@/functions/API";
import { dateFormat } from "@/functions";
import { CatRefField, EditOptions, FileChips, ShowDescription, showFiles, ShowLink, ShowOptions, ShowPictures, SimpleForm, ReactAdminJalaliDateInput, SimpleImageField, UploaderField } from "@/components";
import { Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, FormControl, InputLabel, CircularProgress, Typography } from "@mui/material";
import jsonExport from "jsonexport/dist";
import moment from "jalali-moment";
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

const PostPagination = props => <Pagination rowsPerPageOptions={[10, 25, 50, 100]} {...props} />;

const postRowStyle = (record, index) => {
    return ({
        backgroundColor: "#ee811d"
    });
};

const exporter = posts => {
    let allpros = [];
    const postsForExport = posts.map((post, i) => {
        const { backlinks, author, ...postForExport } = post;
        postForExport._id = post._id;
        allpros.push({
            _id: post._id,
            title: post.title,
            slug: post._id,
            createdAt: (post.createdAt),
            updatedAt: (post.updatedAt),
            status: (post.status),
            active: (post.active),
            view: (post.view),
        });
    });
    jsonExport(allpros, {
        headers: ["_id", "title", "slug", "date", "createdAt", "updatedAt", "status", "active", "view"]
    }, (err, csv) => {
        const BOM = "\uFEFF";
        downloadCSV(`${BOM} ${csv}`, "questions");
    });
};

const PostFilter = (props) => {
    const translate = useTranslate();
    return (
        <Filter {...props}>
            <SearchInput source="Search" placeholder={translate("resources.question.search")} alwaysOn/>
            <SearchInput source="category" placeholder={translate("resources.question.category")} alwaysOn/>

            <ReactAdminJalaliDateInput
                fullWidth
                source="createdAt" label={translate("resources.order.date_gte")}
                questionat={questionValue => moment.from(questionValue, "fa", "jYYYY/jMM/jDD").questionat("YYYY-MM-DD")}
                parse={inputValue => moment.from(inputValue, "fa", "jYYYY/jMM/jDD").questionat("YYYY-MM-DD")}
            />
            <TextInput
                fullWidth
                source="createdAt" label={translate("resources.order.date_gte")}
            />
            <ReactAdminJalaliDateInput
                fullWidth
                source="updatedAt" label={translate("resources.order.date_lte")}
                questionat={questionValue => moment.from(questionValue, "fa", "jYYYY/jMM/jDD").questionat("YYYY-MM-DD")}
                parse={inputValue => moment.from(inputValue, "fa", "jYYYY/jMM/jDD").questionat("YYYY-MM-DD")}
            />
            <TextInput
                fullWidth
                source="updatedAt" label={translate("resources.order.date_lte")}
            />
        </Filter>
    );
};

// ListActions Component
const ListActions = ({ setOpen, open }) => {
    const t = useTranslate();

    return (
        <TopToolbar>
            <CreateButton/>
            {/*<ExportButton maxResults={3000}/>*/}
            {/* Custom Action Button to open the Category Selection Modal */}
            <Button
                onClick={() => setOpen(true)}
                size="small"
                variant="contained"
                color="primary"
            >
                {t("resources.question.add_question")}
            </Button>
        </TopToolbar>
    );
};

const QuestionList = (props) => {
    const translate = useTranslate();
    const [open, setOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Fetch question categories (replace with actual API call if necessary)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await API.get(`/questionCategory/0/100`);
                if (response?.data) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleModalClose = () => {
        setOpen(false);
    };

    const handleCreateQuestion = async () => {
        setLoading(true);  // Show loader
        try {
            // Send request to backend
            const response = await API.post("/question/createSampleQuestions", JSON.stringify({ categoryId: selectedCategory }));
            if (response?.data?.success) {
                setSuccessMessage("Question created successfully!");  // Set success message
                setTimeout(() => {
                    handleModalClose(); // Close the modal after a delay
                    setSuccessMessage(""); // Reset success message
                }, 2000);
            }
        } catch (error) {
            console.error("Error creating question:", error);
        } finally {
            setLoading(false);  // Hide loader after request completion
        }
    };

    return (
        <List
            {...props}
            filters={<PostFilter />}
            pagination={<PostPagination />}
            exporter={exporter}
            actions={<ListActions setOpen={setOpen} open={open} />}
        >
            <Datagrid optimized>
                <TextField source={"title." + translate('lan')} label={translate("resources.question.title")}/>
                <ReferenceArrayField reference="questionCategory" source="questionCategory" label={translate("resources.question.questionCategory")}>
                    <SingleFieldList linkType={false}>
                        <ChipField source={`name.fa`} size="small" />
                    </SingleFieldList>
                </ReferenceArrayField>
                <TextField source="score" label={translate("resources.question.score")}/>
                <FunctionField label={translate("resources.question.status")}
                               render={record => (record?.status ? translate(`resources.question.${record.status}`) : '')}/>
                <FunctionField label={translate("resources.question.date")}
                               render={record => (
                                   <div className='theDate'>
                                       <div>
                                           {translate("resources.question.createdAt") + ": " + `${dateFormat(record.createdAt)}`}
                                       </div>
                                       <div>
                                           {translate("resources.question.updatedAt") + ": " + `${dateFormat(record.updatedAt)}`}
                                       </div>
                                   </div>
                               )}/>

                <FunctionField label={translate("resources.question.actions")}
                               render={record => (
                                   <div>
                                       <div>
                                           <EditButton/>
                                       </div>
                                       <div>
                                           <DeleteButton/>
                                       </div>
                                   </div>
                               )}/>
            </Datagrid>

            {/* Category Selection Modal */}
            <Dialog open={open} onClose={handleModalClose}>
                <DialogTitle>{translate("resources.question.select_category")}</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth>
                        <InputLabel>{translate("resources.question.category")}</InputLabel>
                        <Select
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            label={translate("resources.question.category")}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category?._id} value={category?._id}>
                                    {category?.name?.fa}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {loading && <CircularProgress size={24} />}
                    {successMessage && <Typography color="primary">{successMessage}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalClose} color="primary">
                        {translate("resources.question.cancel")}
                    </Button>
                    <Button onClick={handleCreateQuestion} color="primary" disabled={loading}>
                        {translate("resources.question.create_question")}
                    </Button>
                </DialogActions>
            </Dialog>
        </List>
    );
};

export default QuestionList;
