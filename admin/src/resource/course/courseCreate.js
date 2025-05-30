import {Create} from "react-admin";
import Form from "./courseForm";
// import {useCreateController} from "react-admin";

const create = (props) => {
    // const createControllerProps = useCreateController();
    return (
        <Create {...props}>
            <Form>


            </Form>
        </Create>
    );
}

export default create;
