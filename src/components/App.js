import React from "react";
import {
  PreviewDataDelete,
  AnswerInput,
  StoryInput,
  Header,
  Chip,
  ChipInput,
  OptionSection,
  CorrectOptions,
  QuestionInput,
} from "./OtherComp";
import { Typography, Button, Row, Col, Checkbox } from "antd";
import { PlusOutlined, SafetyOutlined, DownloadOutlined, CloseCircleFilled } from '@ant-design/icons'
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import initialState from "../initialState";
import { generate, removeElAtIndex, shuffle, getReplaceRegex } from '../utility/main'

// const { Button, Typography, Row, Col } = antd;
const { Title } = Typography;

const HEADING = {
  story: "Clinical Vignette/Scenario",
  variables: "Question Stem variable entries",
  question: "Lead-in/Question",
  Categories: "Categories",
  Correct: "Correct Options",
  options: "Other Options",
  optionSection: "Option Category Section",
  previewButton: "Generate Items",
  generateButton: "Download TeX File",
};

class App extends React.PureComponent {

 

  chipInputRef = {};
  categoriesInputRef = React.createRef();
  answerInputRef = {};
  questionInputRef = [];
  storyInputRef = [];
  correctOptionRef = [];
  state = initialState;

  componentDidMount() {
    this.onStoryInputSubmit();
    this.setState({ 
        chiptagbtn: false,
      });
  }
  onStoryInputChange = (index, newVal) => {
    const { story } = this.state;
    const newStory = story.slice();
    newStory[index] = newVal;
    this.setState({
      story: newStory,
    });
    this.resetData();
  };
  onStoryInputAdd = () => {
    const { story } = this.state;
    // console.log("new story", story);
    this.setState(
      {
        story: story.concat(""),
      },
      () => {
        const { story } = this.state;
        this.storyInputRef[story.length - 1].focus();
      }
    );
    this.resetData();
  };
  onStoryInputSaveRef = (index, ref) => {
    this.storyInputRef[index] = ref;
  };
  onStoryRemove = (index) => {
    const { story } = this.state;
    this.setState({
      story: removeElAtIndex(story, index),
    });
    // console.log(story, "story remove");
    this.storyInputRef = removeElAtIndex(this.storyInputRef, index);
    this.resetData();
  };
  onStoryInputSubmit = () => {
    const { story, fields } = this.state;
    const newFields = {};
    story.map((itemstory, i) => {
      let item =
        (itemstory || "[]").trim().match(/\([a-z0-9_-]+\)/gi) || [];
      item &&
        item
          .map((el) => el.slice(1, el.length - 1))
          .forEach((el) => {
            newFields[el] = fields[el] || [];
          });
    });
    // }
    console.log("onstorysubmit", fields, newFields);
    this.setState({
      fields: newFields,
      // storyTag: newStoryTag,
      chiptagbtn: true,
    });
    // this.resetData();
  };
  onChipCategoriesInputChange = (e) => {
    const { categoriesFields, questionCategoryValue, answers } = this.state;
    const initQuestionCategory = categoriesFields[0] || e.target.value;
    if (e.key === "Enter") {
      this.setState({
        categoriesFields: [...categoriesFields, e.target.value],
        questionCategoryValue: questionCategoryValue.length
          ? [...questionCategoryValue]
          : [initQuestionCategory],
        answers: {...answers, [e.target.value]: [{}] },
      });
      e.target.value = "";
    }

    this.resetData();
  };
  onCategoriesChipRemove = (i) => {
    const categoriesFields = this.state.categoriesFields;

    this.setState({
      categoriesFields: categoriesFields.filter((_, el) => el !== i),
    });
  };
  onChipInputSaveRef = (field, ref) => {
    this.chipInputRef[field] = ref;
  };
  onChipInputToggleVisb = (field, visible) => {
    const { inputVisible } = this.state;
    this.setState(
      {
        inputVisible: {
          ...inputVisible,
          [field]: visible,
        },
      },
      () => this.chipInputRef[field].focus()
    );
    this.resetData();
  };
  onChipInputChange = (field, newVal) => {
    const { inputValue } = this.state;
    this.setState({
      inputValue: {
        ...inputValue,
        [field]: newVal,
      },
    });
    this.resetData();
  };
  onChipInputSubmit = (field) => {
    const { inputValue, inputVisible, fields } = this.state;
    let newFields = fields[field];
    if (
      inputValue[field] &&
      fields[field].indexOf(inputValue[field]) === -1
    ) {
      newFields = fields[field].concat((inputValue[field] || "").trim());
    }
    this.setState({
      fields: {
        ...fields,
        [field]: newFields,
      },

      inputValue: {
        ...inputValue,
        [field]: "",
      },
      inputVisible: {
        ...inputVisible,
        ...(inputValue[field] ? {} : { [field]: false }),
      },
    });
    this.resetData();
  };
  onChipRemove = (field, tag) => {
    const { fields } = this.state;
    this.setState({
      fields: {
        ...fields,
        [field]: fields[field].filter((el) => el !== tag),
      },
    });
    this.resetData();
  };
  onQuestionInputChange = (index, newVal) => {
    const { question } = this.state;
    const newQuestion = question.slice();
    newQuestion[index] = newVal;
    this.setState({
      question: newQuestion,
    });
    this.resetData();
  };
  onCorrectOptionSaveRef = (index, ref) => {
    this.correctOptionRef[index] = ref;
  };
  onCorrectOptionInputChange = (category, newTitle) => {
    const { correctOptions } = this.state;
    this.setState({
      correctOptions: { ...correctOptions, [category]: newTitle },
    });
  };
  onQuestionInputAdd = () => {
    const { question, questionCategoryValue, categoriesFields } =
      this.state;
    this.setState(
      {
        question: question.concat(""),
        questionCategoryValue: [
          ...questionCategoryValue,
          categoriesFields[0],
        ],
      },
      () => {
        const { question } = this.state;
        this.questionInputRef[question.length - 1].focus();
      }
    );
    this.resetData();
  };
  onQuestionSubmitForm = () => {
    const { questionSubmitForm, questionCategoryValue } = this.state;
  };
  questionCategoryValueChangefun = (index, val) => {
    const { questionCategoryValue: questionCategories } = this.state;
    questionCategories[index] = val;
    this.setState({
      questionCategoryValue: questionCategories,
    });
  };
  questionTagsValueChangefun = (index, val) => {
    this.setState({
      questionTagsValue: [val],
    });
  };
  onQuestionInputSaveRef = (index, ref) => {
    this.questionInputRef[index] = ref;
  };
  onQuestionRemove = (index) => {
    const { question } = this.state;
    console.log(index, "question remove");
    this.setState({
      // question: question.splice( index),
      question: removeElAtIndex(question, index),
    });
    // console.log(question, "question remove");
    this.questionInputRef = removeElAtIndex(this.questionInputRef, index);
    this.resetData();
  };
  onAnswerInputSaveRef = (index, ref) => {
    this.answerInputRef[index] = ref;
  };


  allPossibleVariablesCases(arr)  {
    if (arr.length == 1) {
      return arr[0];
    } else {
      var result = [];
      var allCasesOfRest = this.allPossibleVariablesCases(arr.slice(1)); // recur with the rest of array
      for (var i = 0; i < allCasesOfRest.length; i++) {
        for (var j = 0; j < arr[0].length; j++) {
          result.push(arr[0][j] + "," +allCasesOfRest[i]);
        }
      }
      return result;
    }
  }

  getAllStories(allCases,story,fields)
  {
      const allStories = [];
      const variables = Object.keys(fields)
      for(let i=0;i<allCases.length;i++)
      {
          let s = story;
          const myArray = allCases[i].split(",");
          for (let j=0;j<myArray.length;j++){
                s = s.replace("("+variables[j]+")", myArray[j].toLowerCase());
          }
        allStories.push(s);
      }
      return allStories;
  }
  
  onAnswersSubmit = () => {
    console.log("Hereeeeee", this.state);

    ////Waqas
    const variablesArray = [];
    let totalQuestions = 0;
    for (let i = 0; i < Object.keys(this.state.fields).length; i++) {
      if(totalQuestions===0)
        totalQuestions++;
      totalQuestions = totalQuestions * this.state.fields[Object.keys(this.state.fields)[i]].length;
         // this.state.fields.
    }

 
    for (let i = 0; i < Object.keys(this.state.fields).length; i++) {
      variablesArray.push( this.state.fields[Object.keys(this.state.fields)[i]]);
    }
  
    totalQuestions = totalQuestions * this.state.story.length * this.state.question.length;
   // console.log("totalQuestions",totalQuestions);
   // console.log("variables",variablesArray);
    
    let allVaraiblesCases = []
    allVaraiblesCases =   this.allPossibleVariablesCases(variablesArray);
    
    console.log("allVaraiblesCases",allVaraiblesCases);
        
    let allStories = [];
    for (let i = 0; i < Object.keys(this.state.story).length; i++) {
      let story = this.state.story[Object.keys(this.state.story)[i]]
      const arr = this.getAllStories(allVaraiblesCases,story,this.state.fields);
      Array.prototype.push.apply(allStories, arr);    
      allStories = allStories.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
        })

    }



    //console.log(allStories)

    //This will have objects of story along with its question and option
    const items = [];
    var ans= [];

    for (let i=0;i<allStories.length;i++) {
      for(let j=0;j<this.state.question.length; j++){
        for (let k=0;k<Object.keys(this.state.answers).length;k++){
            if(Object.keys(this.state.answers)[k]===this.state.questionCategoryValue[j])
            {
              
                let obj=this.state.answers[Object.keys(this.state.answers)[k]];
                for(let l=0;l<obj.length;l++){
                   if((allStories[i].includes("female")))
                  {
                    if(obj[l].gender.toLowerCase()==="female")
                    {
                      ans.push(obj[l])
                    }
                  }
                  else if((allStories[i].includes("male")))
                  {
                    if(obj[l].gender.toLowerCase()==="male")
                    {
                      ans.push(obj[l])
                    }
                  }
                 
                 
                }
               
                // console.log(obj[0].title);
            }
        }
      //  let option =  
        let item = {story:allStories[i],
           question:this.state.question[j],
            category:this.state.categoriesFields[j], options:ans};
        items.push(item)
        ans = []
      }
    }


    console.log(items);


    ///Waqas
    const { answers, selectedFeatures } = this.state;
    const newAnswers = {...answers};
    var answers1 = {};
    answers1["data"] = newAnswers;
    answers1["features"] = [...selectedFeatures];
    console.log(JSON.stringify(answers1));

    const options = {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(answers1),
    };

    fetch("https://flask-api-heroku2.herokuapp.com/post_options", options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong ...");
        }
      })
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  };
  onAnswersLoad = (category, index, newVal, key) => {
    const { answers } = this.state;
    const newAnswers = {...answers};
    newAnswers[category][index][key] = newVal;
    this.setState({
      answers: newAnswers,
    });
  };
  onAnswersInputChange = (category, index, e) => {
    const { answers } = this.state;
    const newAnswers = { ...answers };
    const { name, value } = e.target;
    console.log(name, value);
    newAnswers[category][index] = { ...newAnswers?.[category][index], [name]: value };
    this.setState({
      answers: newAnswers,
    });
    if (e.key === "Enter" && index === answers.length - 1) {
      this.onAnswersInputAdd();
    }
    this.resetData();
  };
  onAnswersInputAdd = (category) => {
    const { answers } = this.state;
    this.answerInputRef[category] = [];
    this.setState(
      {
        answers: {...answers, [category]: [...answers?.[category], {}]},
      });
    this.resetData();
  };
  onAnswerRemove = (category, index) => {
    const { answers } = this.state;
    console.log('splice:',);
    answers?.[category]?.splice(index, 1);
    this.setState({
      answers: { ...answers },
    });
    // this.resetData();
  };
  resetData = () => {
    this.setState({
      data: [],
      answersData: [],
      isGenerated: false,
    });
  };
  onChipTagBtn = () => {
    // console.log(this.state.fields, "chip btn state");

    this.state.fields &&
      this.setState({
        tagfields: this.state.fields,
        // storyTag: newStoryTag,
        // chiptagbtn: false,
      });
  };
  onSelectFeature = (fieldName, value) => {
    console.log(fieldName, value);
    let arr = [...this.state.selectedFeatures];
    if (value) {
      return this.setState({
        selectedFeatures: [...this.state.selectedFeatures, fieldName],
      });
    } else {
      arr = arr.filter((e) => e !== fieldName);
      return this.setState({
        selectedFeatures: [...arr],
      });
    }
  };
  generateAndRender = () => {
    this.onAnswersSubmit();
    const {
      fields,
      answers,
      story,
      question,
      questionCategoryValue,
      selectedFeatures,
      correctOptions,
      MCQs,
    } = this.state;
    const newFields = {};
    Object.keys(fields)
      .filter((el) => fields[el].length)
      .forEach((el) => {
        newFields[el] = fields[el];
      });
    let data = generate(newFields).map((el, index) => ({
      ...el,
      id: index,
      category: questionCategoryValue[index],
    }));

    let mydata = [];
    story.map((ss, storyIndex) =>
      question.map(async (questionEl, questionIndex) => {
        const newData = {};
        var storyTags = ss.trim().match(/\([a-z0-9_-]+\)/gi);
        storyTags
          ?.map((el) => el.slice(1, el.length - 1))
          .forEach((el) => {
            newData[el] = fields[el] || [];
          });
        mydata = [
          ...mydata,
          ...generate(newData).map((el, index) => ({
            ...el,
            category: questionCategoryValue[questionIndex],
          })),
        ];
        console.log("question Category Value : ", questionCategoryValue);
        console.log("mydata : ", mydata);
      })
    );
    let posted_data = {};
    posted_data["questions"] = [...mydata];
    posted_data["features"] = [...selectedFeatures];
    console.log("posted data", JSON.stringify(posted_data));
    const fetchOptions = async (args) => {
      const options = {
        method: "post",
        headers: {
          Accept: "application/json, text/plain, /",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(posted_data),
      };

      const res = await fetch(
        "https://flask-api-heroku2.herokuapp.com/get_options",
        options
      );
      const body = await res.json();
      body["options"] = body["options"].map((option, index) => {
        const category = posted_data["questions"][index]?.category;
        return [...option, correctOptions[category] + "*"];
      });
      let data = answers.map(({ title }) => title);
      let titles = body["options"].map((title) => shuffle(title));
      console.log("body", body["options"], titles, data);
      this.setState({
        MCQs: mydata,
        data,
        answersData: titles,
        isGenerated: true,
      });
      return body;
    };
    const res_obj1 = fetchOptions();
  };
  generateLatexAndDownload = () => {
    const {
      data,
      story,
      question,
      answersData,
      fields,
      correctAnswer,
      MCQs,
    } = this.state;
    const texStr = generateLatex({
      fields,
      story,
      question,
      data,
      answersData,
      MCQs,
    });
    downloadFile(texStr);
  };

  render() {
    const {
      data,
      mydata,
      answersData,
      story,
      // storyTag,
      question,
      answers,
      fields,
      isGenerated,
      tagfields,
      categoriesFields,
      questionTagsValue,
      questionCategoryValue,
      correctOptions,
      // correctAnswer,
      categoriesInputValue,
      categoriesInputVisible,
      inputVisible,
      inputValue,
      selectedFeatures,
      genderSelect,
    } = this.state;
    let answersIndex = 0;
    console.log(answers, categoriesFields);
    return (
      <main className="app">
        <Header name="MCQ Automatic Item Generator v.2 (AIG2)." />

        <section className="first">
          <div className="mb-7">
            <Title level={3} className="mb-3">
              {HEADING.story}:
            </Title>

            {story.map((el, index) => (
              <StoryInput
                value={el}
                index={index}
                key={index}
                onSaveRef={this.onStoryInputSaveRef}
                onRemove={this.onStoryRemove}
                onInputChange={this.onStoryInputChange}
                onInputSubmit={this.onStoryInputSubmit}
              />
            ))}
            <Button
              type="dashed"
              onClick={this.onStoryInputAdd}
              style={{ width: "40%" }}
              icon={<PlusOutlined />}
            >
              Add Story
            </Button>
          </div>

          <div className="mb-7">
            <Title level={3} className="mb-3">
              {HEADING.variables}:
            </Title>
            {Object.keys(fields).map((field, index) => {
              return (
                <Row key={index} align="middle" className="mb-3">
                  {/* <Col span={1}>
                    <Checkbox
                      onChange={(event) =>
                        this.onSelectFeature(field, event.target.checked)
                      }
                      name="selected_feature"
                    />
                  </Col> */}
                  <Col>
                    <b className="pr-2">{field}:</b>
                  </Col>
                  <Col flex="1">
                    {fields[field].map((tag) => (
                      <Chip
                        key={tag}
                        field={field}
                        item={tag}
                        onRemove={this.onChipRemove}
                      />
                    ))}
                    <ChipInput
                      visible={inputVisible[field]}
                      value={inputValue[field]}
                      field={field}
                      onSaveRef={this.onChipInputSaveRef}
                      onToggleVisb={this.onChipInputToggleVisb}
                      onInputChange={this.onChipInputChange}
                      onInputSubmit={this.onChipInputSubmit}
                    />
                  </Col>
                </Row>
              );
            })}
          </div>
          <div className="mb-7">
            <Title level={3} className="mb-3">
              {HEADING.Categories}:
            </Title>
            <Row align="middle" className="mb-3">
              <Col>
                <b className="pr-2">Categories:</b>
              </Col>
              <Col flex="1">
                <div>
                  {
                    // Object.keys(categoriesFields).map(
                    categoriesFields.map((categoriesfield, index) => {
                      return (
                        <span key={index} className="ant-tag">
                          {categoriesfield}
                          <CloseCircleFilled
                            className="anticon anticon-close ant-tag-close-icon"
                            onClick={() =>
                              this.onCategoriesChipRemove(index)
                            }
                          />
                        </span>
                      );
                    })
                  }
                  <span className="inputcategories">
                    <input
                      type="text"
                      placeholder="+ Add New"
                      ref={this.categoriesInputRef}
                      onKeyUp={this.onChipCategoriesInputChange}
                    />
                  </span>
                </div>
              </Col>
            </Row>
          </div>

          <div className="mb-7">
            <Title level={3} className="mb-3">
              {HEADING.question}:
            </Title>
            <form>
              {question.map((el, index) => (
                <QuestionInput
                  value={el}
                  index={index}
                  key={index}
                  questionTagsValue={questionTagsValue}
                  tagsValueChange={this.questionTagsValueChangefun}
                  questionCategoryValue={questionCategoryValue?.[index]}
                  categoryValueChange={
                    this.questionCategoryValueChangefun
                  }
                  categoriesFields={categoriesFields}
                  tagfields={tagfields}
                  onSaveRef={this.onQuestionInputSaveRef}
                  onRemove={this.onQuestionRemove}
                  onInputChange={this.onQuestionInputChange}
                  onInputSubmit={this.onQuestionInputAdd}
                />
              ))}
              <Button
                type="dashed"
                onClick={this.onQuestionInputAdd}
                style={{ width: "40%" }}
                icon={<PlusOutlined />}
              >
                Add Question
              </Button>
            </form>
          </div>

          <div className="mb-7">
            <Title level={3} className="mb-3">
              {HEADING.Correct}:
            </Title>
            <form>
              {categoriesFields.map((category, index) => (
                <div className="mb-7">
                  <Title level={3} className="mb-3">
                    {`${HEADING.optionSection} (${category})`}:
                  </Title>
                  {answers?.[category]?.map((el, index) => {
                    return (
                      <OptionSection
                        value={el}
                        key={index}
                        category={category}
                        index={index}
                        categoriesFields={categoriesFields}
                        resetData={this.resetData}
                        onSaveRef={this.onAnswerInputSaveRef}
                        onRemove={this.onAnswerRemove}
                        onInputChange={this.onAnswersInputChange}
                        onInputSubmit={this.onAnswerInputSubmit}
                        onLoad={this.onAnswersLoad}
                        selectedFeatures={selectedFeatures}
                        genderSelect={genderSelect}
                      />
                    );
                  })}
                  <Button
                    type="dashed"
                    onClick={() => this.onAnswersInputAdd(category)}
                    style={{ width: "40%" }}
                    icon={<PlusOutlined />}
                  >
                    Add option
                  </Button>
                </div>
              ))}
            </form>
          </div>
        </section>

        {data.length > 0 && (
          <section>
            <Title level={3} className="mb-3">
              Quesions Preview ({answersData?.length} Questions)
            </Title>
            {
              // forEach((story) => {
              // story.map((sitem, idx) => {

              story.map((ss, storyIndex) =>
                question.map((questionEl, questionIndex) => {
                  const newData = {};
                  var storyTags = ss.trim().match(/\([a-z0-9_-]+\)/gi);
                  storyTags
                    ?.map((el) => el.slice(1, el.length - 1))
                    .forEach((el) => {
                      newData[el] = fields[el] || [];
                    });
                  const mydata = generate(newData).map((el, index) => ({
                    ...el,
                    id: index,
                  }));
                  // console.log("My data", mydata);
                  return mydata.map((dataEl, dataIndex) => {
                    var bb = ss;
                    var filedsArr = Object.keys(fields);
                    filedsArr.forEach((field) => {
                      bb = bb.replace(
                        getReplaceRegex(field),
                        `<span class="ant-typography ant-typography-danger">${dataEl[field]}</span>`
                      );
                    });
                    answersIndex++;
                    return (
                      <ul className="ul" key={dataIndex}>
                        <TransitionGroup
                          component={null}
                          appear={true}
                          in={true}
                          mountOnEnter={true}
                          unmountOnExit={true}
                        >
                          <CSSTransition
                            key={storyIndex}
                            timeout={500}
                            classNames="exampe"
                          >
                            <li>
                              <Title
                                key={storyIndex}
                                level={4}
                                className="mb-4"
                              >
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: bb,
                                  }}
                                ></span>
                              </Title>

                              <Title
                                key={questionIndex}
                                level={4}
                                className="mb-4"
                              >
                                {questionEl}
                              </Title>
                              <ul className="ul-2">
                                {answersData[answersIndex - 1].map(
                                  (el, answerIndex) => {
                                    return (
                                      <li key={answerIndex}>
                                        <Title
                                          level={4}
                                          // className={
                                          //   correctAnswer === el
                                          //     ? "ant-typography ant-typography-danger"
                                          //     : ""
                                          // }
                                        >
                                          {String.fromCharCode(
                                            "a".charCodeAt(0) +
                                              answerIndex
                                          )}
                                          . {el}
                                        </Title>
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            </li>
                          </CSSTransition>
                        </TransitionGroup>
                      </ul>
                    );
                  });
                })
              )
            }
          </section>
        )}

        <div className="button-wrapper">
          {isGenerated ? (
            <Button
              size="large"
              icon={<DownloadOutlined />}
              onClick={this.generateLatexAndDownload}
            >
              {HEADING.generateButton} ({answersData?.length} Questions)
            </Button>
          ) : (
            <Button
              size="large"
              disabled={isGenerated} //TODO
              icon={<SafetyOutlined />}
              onClick={this.generateAndRender}
            >
              {HEADING.previewButton}
            </Button>
          )}
        </div>
      </main>
    );
  }
}

export default App;
