import React, { useCallback, useState } from "react";
import {
  DatePicker,
  Input,
  Button,
  Row,
  Col,
  Space,
  Form,
  Popover,
  Checkbox,
  Collapse,
  Select,
} from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { sources } from "../Newsenum";
import { saveFilter } from "../../slices/newsReducer";

const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const FilterComponent = () => {
  const { filters } = useSelector((state) => state.news);
  const [appliedFilter, setAppliedFilter] = useState({
    keyword: "",
    dateRange: [null, null],
    categories: filters.categories || [],
    sources: filters.sources || [],
    authors: filters.authors || [],
  });
  const dispatch = useDispatch();
   console.log("Hi i am here");
  const handleSearch = useCallback(() => {
    dispatch(saveFilter(appliedFilter));
    localStorage.setItem("preferences", JSON.stringify(appliedFilter));
  }, [appliedFilter, dispatch]);

  const handleChange = (key, value) => {
    setAppliedFilter(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setAppliedFilter({
      keyword: "",
      dateRange: [null, null],
      categories: [],
      sources: [],
      authors: [],
    });
    handleSearch();
  };

  return (
    <div>
      <Row gutter={16} align="middle" justify="space-between">
        <Col>
          <Row gutter={16} align="middle">
            <Col>
              <Input
                placeholder="Search by keyword"
                value={appliedFilter.keyword}
                onChange={(e) => handleChange("keyword", e.target.value)}
              />
            </Col>
            <Col>
              <Popover
                content={
                  <Form layout="vertical" style={{ width: "300px" }}>
                    <Collapse accordion>
                      <Panel header="Category" key="1">
                        <Checkbox.Group
                          options={[
                            { label: "Technology", value: "technology" },
                            { label: "Business", value: "business" },
                            { label: "Sports", value: "sports" },
                            { label: "Health", value: "health" },
                            { label: "Entertainment", value: "entertainment" },
                          ]}
                          value={appliedFilter.categories}
                          onChange={(values) => handleChange("categories", values)}
                        />
                      </Panel>
                      <Panel header="Sources" key="2">
                        <Checkbox.Group
                          options={sources?.map(source => ({
                            label: source.name,
                            value: source.id,
                          }))}
                          value={appliedFilter.sources}
                          onChange={(values) => handleChange("sources", values)}
                        />
                      </Panel>
                    </Collapse>
                    <Form.Item style={{ padding: "10px" }}>
                      <Space>
                        <Button type="primary" onClick={handleSearch}>Apply</Button>
                        <Button onClick={handleReset}>Reset</Button>
                      </Space>
                    </Form.Item>
                  </Form>
                }
                title="Filters"
                trigger="click"
                placement="bottomRight"
              >
                <Button icon={<FilterOutlined />} />
              </Popover>
            </Col>
          </Row>
        </Col>
        <Col>
          <RangePicker
            format="YYYY-MM-DD"
            onChange={(dates) => {
              handleChange("dateRange", dates);
              dispatch(saveFilter({ ...filters, dateRange: dates }));
            }}
            value={
              appliedFilter.dateRange.length === 2
                ? appliedFilter.dateRange
                : []
            }
          />
        </Col>
      </Row>
    </div>
  );
};


export default FilterComponent;
