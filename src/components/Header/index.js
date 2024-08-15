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
} from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { sources } from "../Newsenum";
import { saveFilter } from "../../slices/newsReducer";
import '../NewsFeed.css';

const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { Search } = Input;

const FilterComponent = () => {
  const { filters } = useSelector((state) => state.news);
  const [appliedFilter, setAppliedFilter] = useState({
    keyword: filters.keyword || "",
    dateRange: [null, null],
    categories: filters.categories || [],
    sources: filters.sources || [],
    authors: filters.authors || [],
  });
  const [visible, setVisible] = useState(false);
  const iconColor =
    appliedFilter.categories.length > 0 || appliedFilter.sources.length > 0
      ? "#1890ff"
      : "inherit";
  const dispatch = useDispatch();
  console.log("Hi i am here");
  const handleFilter = useCallback(() => {
    dispatch(saveFilter(appliedFilter));
    localStorage.setItem("preferences", JSON.stringify(appliedFilter));
    setVisible(false);
  }, [appliedFilter, dispatch]);
  const handleSearch = (val) => {
    setAppliedFilter((prev) => ({ ...prev, keyword: val }));
    dispatch(saveFilter({ ...appliedFilter, keyword: val }));
  };
  const handleChange = (key, value) => {
    setAppliedFilter((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setAppliedFilter({
      keyword: filters.keyword,
      dateRange: [null, null],
      categories: [],
      sources: [],
      authors: [],
    });
    handleFilter();
    setVisible(false);
  };

  return (
    <div>
      <Row gutter={16} align="middle" justify="space-between">
        <Col>
          <Row gutter={16} align="middle">
            <Col>
              <Search
                placeholder="input search text"
                onSearch={handleSearch}
                enterButton="Search"
                value={appliedFilter.keyword}
              />
            </Col>
            <Col>
              <Popover
                onOpenChange={(open) => setVisible(open)}
                open={visible}
                content={
                  <Form layout="vertical" style={{ width: "300px" }}>
                    <Collapse accordion>
                      <Panel
                        header="Category"
                        key="1"

                      >
                        <Checkbox.Group
                          options={[
                            { label: "Technology", value: "technology" },
                            { label: "Business", value: "business" },
                            { label: "Sports", value: "sports" },
                            { label: "Health", value: "health" },
                            {
                              label: "Entertainment",
                              value: "entertainment",
                            },
                          ]}
                          value={appliedFilter.categories}
                          onChange={(values) =>
                            handleChange("categories", values)
                          }
                        />
                      </Panel>
                      <Panel
                        header="Sources"
                        key="2"
                        style={{
                          color:
                            appliedFilter.sources.length > 0
                              ? "#1890ff"
                              : "inherit",
                        }}
                      >
                        <Checkbox.Group
                          options={sources?.map((source) => ({
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
                        <Button type="primary" onClick={handleFilter}>
                          Apply
                        </Button>
                        <Button onClick={handleReset}>Reset</Button>
                      </Space>
                    </Form.Item>
                  </Form>
                }
                title="Filters"
                placement="bottomRight"
              >
                <Button
                  icon={<FilterOutlined style={{ color: iconColor }} />}
                  onClick={() => setVisible(true)}
                />
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
