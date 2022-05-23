import React, { useEffect } from 'react';
import { Tag, Input, Row, Col, Typography, Checkbox, Select } from 'antd';
import { PlusOutlined, CloseCircleFilled } from '@ant-design/icons'

const { TextArea } = Input;
const { Title } = Typography;
const Header = ({ name }) => (
    <header className="text-center">
      <Title>{name}</Title>
      <p>
        Dr. Issam Francis © {new Date().getFullYear()} All Rights Reserved
      </p>
    </header>
  );

  const Chip = ({ item, field, onRemove }) => {
    const handleClose = () => {
      onRemove(field, item);
    };
    return (
      <Tag closable={true} onClose={handleClose}>
        <span>{item}</span>
      </Tag>
    );
  };
  const ChipInput = ({
    visible,
    value,
    field,
    onSaveRef,
    onToggleVisb,
    onInputChange,
    onInputSubmit,
  }) => {
    const saveRef = (ref) => {
      onSaveRef(field, ref);
    };
    const showInput = () => {
      onToggleVisb(field, true);
    };
    const inputChange = (e) => {
      onInputChange(field, e.target.value);
    };
    const inputSubmit = () => {
      onInputSubmit(field);
    };
    return visible ? (
      <Input
        ref={saveRef}
        type="text"
        size="small"
        className="tag-input"
        value={value}
        onChange={inputChange}
        onBlur={inputSubmit}
        onPressEnter={inputSubmit}
      />
    ) : (
      <Tag className="site-tag-plus" onClick={showInput}>
        <PlusOutlined /> Add New
      </Tag>
    );
  };
  const StoryInput = ({
    value,
    index,
    onRemove,
    onInputChange,
    onInputSubmit,
    onSaveRef,
  }) => {
    const saveRef = (ref) => {
      onSaveRef(index, ref);
    };
    const handleClose = () => {
      onRemove(index);
    };
    const inputChange = (e) => {
      onInputChange(index, e.target.value);
    };
    const inputSubmit = () => {
      onInputSubmit(index);
    };
    return (
      <Row className="mb-2">
        <Col flex="1">
          <TextArea
            ref={saveRef}
            onChange={inputChange}
            onPressEnter={inputSubmit}
            placeholder={`eg. A (age) year old (gender) presents with (clinical) is admitted to hospital. Story ${
              index + 1
            }`}
            autoSize={{ minRows: 2, maxRows: 3 }}
            value={value}
          />
        </Col>

        <Col>
          <CloseCircleFilled
            className="dynamic-delete-button"
            onClick={handleClose}
          />
        </Col>
      </Row>
    );
  };
  const QuestionInput = ({
    value,
    index,
    onRemove,
    onInputChange,
    onInputSubmit,
    onSaveRef,
    categoriesFields,
    tagfields,
    categoryValueChange,
    tagsValueChange,
    questionTagsValue,
    questionCategoryValue,
  }) => {
    console.log("questionCategoryValue", questionCategoryValue);
    const saveRef = (ref) => {
      onSaveRef(index, ref);
    };
    const handleClose = () => {
      onRemove(index);
    };
    const inputChange = (e) => {
      onInputChange(index, e.target.value);
    };
    const inputSubmit = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onInputSubmit(index);
      }
    };

    let categoriesChange = (e) => {
      console.log("categoryValueChange", categoryValueChange);
      categoryValueChange(index, e.target.value);
    };
    let questionTagsValueChange = (e) => {
      tagsValueChange(index, e.target.value);
    };

    return (
      <Row gutter={8} className="mb-2">
        <Col flex="2">
          <label>Question</label>
          <TextArea
            ref={saveRef}
            onChange={inputChange}
            onKeyPress={inputSubmit}
            placeholder={`eg. What is the most likely diagnosis in this case? Question ${
              index + 1
            }`}
            autoSize={{ minRows: 1, maxRows: 10 }}
            value={value}
          />
        </Col>

        <Col flex="1">
          <label>Categories</label>
          <select onChange={categoriesChange} className="categoryOptions">
            {categoriesFields.map((item, i) => {
              // console.log(item ,"categories item")
              return (
                <option key={i} value={item}>
                  {item}
                </option>
              );
            })}
          </select>
        </Col>

        <Col>
          <CloseCircleFilled
            className="dynamic-delete-button"
            onClick={handleClose}
          />
        </Col>
      </Row>
    );
  };

  const CorrectOptions = ({
    value,
    index,
    category,
    onInputChange,
    onSaveRef,
  }) => {
    const saveRef = (ref) => {
      onSaveRef(index, ref);
    };
    const inputChange = (e) => {
      onInputChange(category, e.target.value);
    };

    return (
      <Row gutter={8} className="mb-2">
        <Col flex="2">
          <label>Title</label>
          <TextArea
            ref={saveRef}
            onChange={inputChange}
            onPressEnter={inputChange}
            placeholder={`Correct Option ${index + 1}`}
            autoSize={{ minRows: 1, maxRows: 10 }}
            value={value}
          />
        </Col>

        <Col flex="1">
          <Row>
            <label>Category</label>
          </Row>
          <Input type="text" value={category} />
        </Col>
      </Row>
    );
  };

  const AnswerInput = ({
    value,
    index,
    onRemove,
    categoriesFields,
    onSaveRef,
    onInputChange,
    tagfields,
    onLoad,
    selectedFeatures,
  }) => {
    const saveRef = (ref) => {
      onSaveRef(index, ref);
    };
    const handleClose = () => {
      onRemove(index);
    };
    const inputChange = (e) => {
      e.preventDefault();
      onInputChange(index, e);
    };

    useEffect(() => {
      if (!value?.category) {
        onLoad(index, categoriesFields[0], "category");
      }
      Object.entries(tagfields).map((tagname, i) => {
        if (!value?.[tagname[0]]) {
          onLoad(index, tagname[1][0], tagname[0]);
        }
      });
    }, [categoriesFields, tagfields]);

    return (
      <Row gutter={8} className="mb-2">
        <Col flex="2">
          <label>Option</label>
          <TextArea
            ref={saveRef}
            autoSize={{ minRows: 1, maxRows: 6 }}
            value={value?.title}
            name="title"
            placeholder={`Option ${index + 1}`}
            onChange={inputChange}
            onPressEnter={inputChange}
          />
        </Col>

        {tagfields &&
          Object.entries(tagfields).map((tagname, i) => {
            if (selectedFeatures.includes(tagname)) {
              console.log("tag detected", tagname);
            }
            console.log("tag detected", tagname);
            return (
              <Col flex="1" key={i} className="mx-3 ">
                <Row>
                  <label>{tagname[0]}</label>
                </Row>
                <select
                  id="cars"
                  className="categoryOptions"
                  name={tagname[0]}
                  onChange={inputChange}
                >
                  {tagname[1].map((tagnames, i) => {
                    return <option value={tagnames}>{tagnames}</option>;
                  })}
                </select>
              </Col>
            );
          })}
        <Col flex="1">
          <label>Categories</label>
          <select
            id="cars"
            className="categoryOptions"
            name="category"
            onChange={inputChange}
          >
            {categoriesFields.map((item, i) => {
              return (
                <option key={i} value={item}>
                  {item}
                </option>
              );
            })}
          </select>
        </Col>

        <CloseCircleFilled
          className="dynamic-delete-button"
          onClick={handleClose}
        />
      </Row>
    );
  };
  const OptionSection = ({
    value,
    index,
    category,
    onRemove,
    categoriesFields,
    onSaveRef,
    onInputChange,
    onLoad,
    selectedFeatures,
    genderSelect,
  }) => {
    const saveRef = (ref) => {
      onSaveRef(index, ref);
    };
    const handleClose = () => {
      onRemove(category, index);
    };
    const inputChange = (e) => {
      e.preventDefault();
      onInputChange(category, index, e);
    };

    const radioButtonHandler = (e) => {
        
    };

    useEffect(() => {
      if (!value?.category) {
        onLoad(category, index, '', "title");
        onLoad(category, index, genderSelect[0], "gender");
        onLoad(category, index, false, "isCorrect");
      }
    }, [categoriesFields]);
    return (
      <Row gutter={8} className="mb-2">
        <Col flex="2">
          <label>Option</label>
          <TextArea
            ref={saveRef}
            autoSize={{ minRows: 1, maxRows: 6 }}
            value={value?.title}
            name="title"
            placeholder={`Option ${index + 1}`}
            onChange={inputChange}
            onPressEnter={inputChange}
          />
        </Col>

        <Col flex="1">
          <label>Gender</label>
          <select
            className="categoryOptions"
            name="gender"
            onChange={inputChange}
          >
            {genderSelect.map((item, i) => {
              return (
                <option key={i} value={item}>
                  {item}
                </option>
              );
            })}
          </select>
        </Col>

        <CloseCircleFilled
          className="dynamic-delete-button"
          onClick={handleClose}
        />
      </Row>
    );
  };
  const PreviewDataDelete = ({ index, onRemove }) => {
    const handleClose = () => {
      onRemove(index);
    };
    return (
      <div className="top-right-delete-button">
        <CloseCircleFilled
          className="dynamic-delete-button"
          onClick={handleClose}
        />
      </div>
    );
  };

export {
  PreviewDataDelete,
  AnswerInput,
  OptionSection,
  StoryInput,
  Header,
  Chip,
  ChipInput,
  CorrectOptions,
  QuestionInput,
};