import * as Y from 'yup';

export const initialValues = {
  // step1
  mainCategory: null,

  // step2
  title: '',
  description: '',

  // step3
  images: [],
};

export const validationSchema = [
  null,
  Y.object({
    mainCategory: Y.mixed().required('دسته بندی الزامی است.'),
  }),
  Y.object({
    title: Y.string().required('عنوان الزامی است.'),
    description: Y.string().required('توضیحات الزامی است.'),
  }),
  Y.object().shape({}),
];
