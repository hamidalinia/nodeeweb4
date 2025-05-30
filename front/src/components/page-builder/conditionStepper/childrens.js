import Show from '#c/components/page-builder/Render';

const ConditionStepChildren = (props) => {
  const { nestedElements, returnStep } = props;
  return (
    <div>
      {nestedElements &&
        nestedElements.map((element, index) => {
          return (
            <Show
              key={index}
              element={element}
              condition={true}
              handleStep={returnStep}
            />
          );
        })}
    </div>
  );
};
export default ConditionStepChildren;
