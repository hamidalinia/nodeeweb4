import React from 'react';
import {
    Create,
    SimpleForm,
    TextInput,
    DateTimeInput,
    NumberInput,
    SelectInput,
    ReferenceInput,
    BooleanInput,
    ArrayInput,
    SimpleFormIterator,
    ReferenceArrayInput,
    SelectArrayInput
} from 'react-admin';
import { useTranslate } from 'react-admin';

const Game = ({children, ...props}) => {
    const {record} = props;

    const translate = useTranslate();

    return (

            <SimpleForm>
                {children}

                {/* Game Title */}
                <TextInput
                    source="title"
                    label={translate("resources.game.title")}
                    fullWidth
                />

                {/* Description */}
                <TextInput
                    source="description"
                    label={translate("resources.game.description")}
                    fullWidth
                    multiline
                />

                {/* Start Time */}
                <DateTimeInput
                    source="startTime"
                    label={translate("resources.game.startTime")}
                />

                {/* End Time */}
                <DateTimeInput
                    source="endTime"
                    label={translate("resources.game.endTime")}
                />

                {/* Limit Time */}
                <NumberInput
                    source="limitTime"
                    label={translate("resources.game.limitTime")}
                />

                {/* Status */}
                <SelectInput
                    source="status"
                    label={translate("resources.game.status")}
                    choices={[
                        { id: 'pending', name: translate("resources.game.status.pending") },
                        { id: 'running', name: translate("resources.game.status.running") },
                        { id: 'ended', name: translate("resources.game.status.ended") },
                    ]}
                />

                {/* Min Participants */}
                <NumberInput
                    source="minParticipants"
                    label={translate("resources.game.minParticipants")}
                />

                {/* Max Participants */}
                <NumberInput
                    source="maxParticipants"
                    label={translate("resources.game.maxParticipants")}
                />

                {/* Random Questions */}
                <BooleanInput
                    source="randomQuestions"
                    label={translate("resources.game.randomQuestions")}
                />

                {/* Levels */}
                <ArrayInput source="levels" label={translate("resources.game.levels")}>
                    <SimpleFormIterator>
                        <NumberInput
                            source="levelNumber"
                            label={translate("resources.game.levels.levelNumber")}
                        />
                        <NumberInput
                            source="numberOfQuestions"
                            label={translate("resources.game.levels.numberOfQuestions")}
                        />
                        <SelectInput
                            source="difficulty"
                            label={translate("resources.game.levels.difficulty")}
                            choices={[
                                { id: 'easy', name: translate("resources.game.levels.difficulty.easy") },
                                { id: 'medium', name: translate("resources.game.levels.difficulty.medium") },
                                { id: 'hard', name: translate("resources.game.levels.difficulty.hard") },
                            ]}
                        />
                    </SimpleFormIterator>
                </ArrayInput>

                {/* Questions */}
                {/*<ReferenceArrayInput*/}
                    {/*source="questions"*/}
                    {/*label={translate("resources.game.questions")}*/}
                    {/*reference="question"*/}
                    {/*allowEmpty*/}
                {/*>*/}
                    {/*<SelectArrayInput optionText="title" />*/}
                {/*</ReferenceArrayInput>*/}


                {/*<ReferenceInput*/}
                    {/*source="questionCategory"*/}
                    {/*label={translate("resources.game.questions")}*/}
                    {/*reference="questionCategory"*/}
                    {/*allowEmpty*/}
                    {/*// filter={{}} // Optional: Add any other filters you might need*/}
                    {/*// perPage={1000} // Specify the number of records to fetch per page*/}
                    {/*// sort={{ field: 'name', order: 'ASC' }} // Optional: Adjust sorting order*/}
                {/*>*/}
                    {/*<SelectArrayInput*/}
                        {/*optionText="name.fa"*/}
                        {/*optionValue="_id"*/}
                        {/*parse={value => value ? value : []}  // Ensures the value is always an array*/}
                    {/*/>*/}
                {/*</ReferenceInput>*/}
                <ReferenceArrayInput
                    source="questionCategory" // Field name in your data
                    label={translate("resources.game.questions")}
                    reference="questionCategory" // Reference to the 'questionCategory' resource
                    allowEmpty
                >
                    <SelectArrayInput optionText="name.fa" optionValue="_id" />
                </ReferenceArrayInput>
            </SimpleForm>

    );
};

export default Game;
